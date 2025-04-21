import json
import os
import boto3
import requests
from requests_aws4auth import AWS4Auth

# AWS Setup for OpenSearch
region = os.environ.get('AWS_REGION', 'us-east-1')
service = 'es'
credentials = boto3.Session().get_credentials()
awsauth = AWS4Auth(
    credentials.access_key,
    credentials.secret_key,
    region,
    service,
    session_token=credentials.token
)

# Gemini REST API
GEMINI_API_KEY = os.environ["GEMINI_API_KEY"]
GEMINI_API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={GEMINI_API_KEY}"

DEFAULT_COORDINATES = {"lat": 38.8936, "lon": -77.0725}

def lambda_handler(event, context):
    print("🔍 Incoming event:\n", json.dumps(event))

    if event.get("requestContext", {}).get("http", {}).get("method") == "OPTIONS":
        return {
            "statusCode": 200,
            "headers": cors_headers(),
            "body": json.dumps("Preflight OK")
        }

    try:
        host = os.environ["OS_HOST"]
        index = "housing-listings-new"
        body = json.loads(event.get("body", "{}"))

        min_price = body.get("min_price", 1000)
        max_price = body.get("max_price", 3000)
        amenities = body.get("amenities", [])
        proximity = body.get("proximity_landmark", "")
        location_city = body.get("location", "")

        query = {
            "query": {
                "bool": {
                    "must": [
                        {"match": {"location.address.postal_code": proximity}}
                    ],
                    "should": [
                        {"match": {"location.address.city": location_city}},
                        {"range": {"list_price": {"lte": max_price}}},
                        {"term": {"description.beds": body.get("bedrooms", "")}},
                        {"terms": {"tags.keyword": amenities}},
                        {"match": {"description.text": proximity}}
                    ],
                    "minimum_should_match": 1
                }
            }
        }

        url = f"https://{host}/{index}/_search"
        headers = {"Content-Type": "application/json"}
        response = requests.post(url, auth=awsauth, json=query, headers=headers)
        if response.status_code != 200:
            return error_response(response.status_code, response.text)

        result = response.json()
        listings = [hit["_source"] for hit in result.get("hits", {}).get("hits", [])]

        # Score with Gemini
        for listing in listings:
            prompt = build_gemini_prompt(listing, min_price, max_price, amenities, proximity)
            gemini_res = requests.post(GEMINI_API_URL, json=prompt)
            try:
                if gemini_res.status_code == 200:
                    content = gemini_res.json()
                    score_text = content["candidates"][0]["content"]["parts"][0]["text"]
                    score = int(''.join(filter(str.isdigit, score_text)))
                    listing["ai_score"] = score
                else:
                    listing["ai_score"] = "N/A"
            except Exception as e:
                print("⚠️ Error parsing Gemini response:", str(e))
                listing["ai_score"] = "N/A"

        return {
            "statusCode": 200,
            "headers": cors_headers(),
            "body": json.dumps(listings)
        }

    except Exception as e:
        print("❌ Exception:", str(e))
        return error_response(500, str(e))


def build_gemini_prompt(listing, min_price, max_price, amenities, proximity):
    coordinates = listing.get("location", {}).get("address", {}).get("coordinate", DEFAULT_COORDINATES)
    return {
        "contents": [{
            "parts": [{
                "text": (
                    f"Score this rental listing for a student from 0 to 100.\n"
                    f"Scoring Criteria:\n"
                    f"- Highest score if rent is close to ${min_price}.\n"
                    f"- Deduct points as rent increases toward ${max_price}.\n"
                    f"- More matching amenities ({', '.join(amenities)}) = higher score.\n"
                    f"- Location closer to {proximity} (target landmark or postal code) is better.\n"
                    f"Latitude: {coordinates.get('lat')}, Longitude: {coordinates.get('lon')}\n"
                    f"Return only a number (0–100).\n\n"
                    f"Listing:\n{json.dumps(listing, indent=2)}"
                )
            }]
        }]
    }


def cors_headers():
    return {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        "Content-Type": "application/json"
    }


def error_response(status, message):
    return {
        "statusCode": status,
        "headers": cors_headers(),
        "body": json.dumps({"error": message})
    }
