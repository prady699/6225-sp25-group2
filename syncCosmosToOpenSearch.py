import json
import os
from azure.cosmos import CosmosClient
from opensearchpy import OpenSearch, RequestsHttpConnection
 
# Cosmos DB Configuration
COSMOS_ENDPOINT = os.environ["COSMOS_ENDPOINT"]
COSMOS_KEY = os.environ["COSMOS_KEY"]
DATABASE_NAME = os.environ["COSMOS_DB"]
CONTAINER_NAME = os.environ["COSMOS_CONTAINER"]
 
# OpenSearch Configuration
OS_HOST = os.environ["OS_HOST"]
OS_AUTH = (os.environ.get("OS_USER"), os.environ.get("OS_PASS")) if os.environ.get("OS_USER") else None
 
# Initialize clients
cosmos_client = CosmosClient(COSMOS_ENDPOINT, COSMOS_KEY)
container = cosmos_client.get_database_client(DATABASE_NAME).get_container_client(CONTAINER_NAME)
 
opensearch = OpenSearch(
    hosts=[{'host': OS_HOST, 'port': 443}],
    http_auth=OS_AUTH,
    use_ssl=True,
    verify_certs=True,
    connection_class=RequestsHttpConnection,
    timeout=60
)
 
def lambda_handler(event, context):
    try:
        items = list(container.read_all_items())
        count = 0
 
        for item in items:
            item_id = item.get("id") or str(item.get("_rid") or count)
            opensearch.index(index="housing-listings-new", body=item, id=item_id)
            count += 1
 
        return {
            "statusCode": 200,
            "body": json.dumps({"message": f"{count} listings indexed to OpenSearch"})
        }
 
    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }