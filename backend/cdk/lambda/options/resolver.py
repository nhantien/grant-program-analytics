from boto3 import client
import os

# parameters for connecting to athena
ATHENA = client('athena')
    
def execute_query(query_string, server):
    response = ATHENA.start_query_execution(
        QueryString = query_string,
        QueryExecutionContext = {
            "Database": str(os.environ.get("PROD_DB_NAME")) if server == "production" else str(os.environ.get("STAGING_DB_NAME"))
        },
        ResultConfiguration= {
            'OutputLocation': str(os.environ.get("OUTPUT_LOCATION")),
        }
    )
    executionId = response["QueryExecutionId"]
    
    status = None
    
    while status == 'QUEUED' or status == 'RUNNING' or status is None:
        status = ATHENA.get_query_execution(QueryExecutionId = executionId)['QueryExecution']['Status']['State']
        if status == 'FAILED' or status == 'CANCELLED':
            raise Exception('Athena query failed or was cancelled')
    
    query_results = ATHENA.get_query_results(QueryExecutionId = executionId)
    rows = query_results["ResultSet"]["Rows"]
    
    while query_results.get("NextToken"):
        query_results = ATHENA.get_query_results(QueryExecutionId = executionId, NextToken=query_results["NextToken"])
        rows += query_results["ResultSet"]["Rows"]
    
    return rows
    
def lambda_handler(event, context):
    
    # get method name
    method = event["method"]
    server = event["server"]
    
    # set query_string based on the method name
    
    if method == "loadFaculty":
        return loadFaculty(server)
    elif method == "loadFocusArea":
        return loadFocusArea(server)
    else:
        return None

    
def loadFaculty(server):
    query_string = f"SELECT * FROM {os.environ.get('FACULTY_OPTION')} ORDER BY faculty_name"
    rows = execute_query(query_string, server)
    
    res = []
    for row in rows[1:]:
        data = row["Data"]
        jsonItem = {
            "faculty_name": data[0]["VarCharValue"],
            "faculty_code": data[1]["VarCharValue"]
        }
        res.append(jsonItem)
    
    return res
    
def loadFocusArea(server):
    query_string = f"SELECT * FROM {os.environ.get('FOCUS_AREA_OPTION')} ORDER BY label"
    rows = execute_query(query_string, server)
    
    res = []
    for row in rows[1:]:
        data = row["Data"]
        jsonItem = {
            "label": data[0]["VarCharValue"],
            "value": data[1]["VarCharValue"]
        }
        res.append(jsonItem)
    
    return res