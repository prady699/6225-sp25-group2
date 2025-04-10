import json
import requests
import os
from azure.cosmos import CosmosClient

# Cosmos DB Configuration
COSMOS_ENDPOINT = "https://rentallistingsdb.documents.azure.com:443/"
COSMOS_KEY = "yfsmsPdXYics2sPYPyF7Z5OGdO3EPkOJfOyYu69xT5IzKIOkesHD24ZdrSP31pNuepSmj6n9B156ACDbph9mEg=="
DATABASE_NAME = "rentallistingsdb"
CONTAINER_NAME = "Listings"

# Initialize Cosmos DB Client
client = CosmosClient(COSMOS_ENDPOINT, COSMOS_KEY)
database = client.get_database_client(DATABASE_NAME)
container = database.get_container_client(CONTAINER_NAME)

# API Configuration
url = "https://us-real-estate-listings.p.rapidapi.com/for-rent"
locations = ["Washington, DC", "Arlington, VA", "Alexandria, VA", "Fairfax, VA", "Rockville, MD", "Silver Spring, MD","Ashburn, VA","Gaithersburg, MD","McLean,VA","Herndon, VA","Falls Church, VA","Reston, VA","Vienna, VA"]
limit = 50
days_on = 7
api_key = "ef1e881e04mshce4a6482fdecaeap19f413jsn4ecb8e3bb226"

headers = {
    "x-rapidapi-key": api_key,
    "x-rapidapi-host": "us-real-estate-listings.p.rapidapi.com"
}

def lambda_handler(event, context):
    total_listings = 0

    for location in locations:
        offset = 0
        try:
            querystring = {
                "location": location,
                "offset": str(offset),
                "limit": str(limit),
                "days_on": str(days_on)
            }

            response = requests.get(url, headers=headers, params=querystring)
            
            # Handle potential errors
            if response.status_code != 200:
                print(f"Error fetching listings for {location}: Status code {response.status_code}")
                continue
                
            # Get the JSON response
            response_data = response.json()
            
            # Check if we have listings in the response
            if "listings" in response_data and response_data["listings"]:
                listings = response_data["listings"]
                print(f"Found {len(listings)} listings for {location}")
                
                for listing in listings:
                    # Ensure each listing has a unique ID
                    if "property_id" in listing:
                        listing["id"] = listing["property_id"]
                    elif "listing_id" in listing:
                        listing["id"] = listing["listing_id"]
                    else:
                        import uuid
                        listing["id"] = str(uuid.uuid4())
                    
                    # Add metadata
                    listing["search_location"] = location
                    
                    # Store in Cosmos DB
                    container.upsert_item(listing)
                    total_listings += 1
            else:
                print(f"No listings found for {location}")
            
        except Exception as e:
            print(f"Error processing {location}: {str(e)}")
            continue

    print(f"Total listings fetched and stored: {total_listings}")
    return {
        'statusCode': 200,
        'body': json.dumps(f"Total Listings Fetched and Stored: {total_listings}")
    }