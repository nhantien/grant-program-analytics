from boto3 import client
import os
import time

# parameters for connecting to athena
ATHENA = client('athena')
    
def execute_query(query_string):
    response = ATHENA.start_query_execution(
        QueryString = query_string,
        QueryExecutionContext = {
            "Database": os.environ.get("DB")
        },
        ResultConfiguration= {
            'OutputLocation': os.environ.get("OUTPUT_LOCATION"),
        }
    )
    executionId = response["QueryExecutionId"]
    
    status = None
    
    while status == 'QUEUED' or status == 'RUNNING' or status is None:
        status = ATHENA.get_query_execution(QueryExecutionId = executionId)['QueryExecution']['Status']['State']
        if status == 'FAILED' or status == 'CANCELLED':
            raise Exception('Athena query failed or was cancelled')
        time.sleep(1)
    
    query_results = ATHENA.get_query_results(QueryExecutionId = executionId)
    rows = query_results["ResultSet"]["Rows"]
    
    return rows
    
def lambda_handler(event, context):
    
    # get method name
    method = event["method"]
    
    # set query_string based on the method name
    
    if method == "loadFaculty":
        return loadFaculty()
    elif method == "loadFocusArea":
        return loadFocusArea()
    else:
        return None

    
def loadFaculty():
    query_string = f"SELECT * FROM {os.environ.get("FACULTY_OPTION")}"
    rows = execute_query(query_string)
    
    res = []
    for row in rows[1:]:
        data = row["Data"]
        jsonItem = {
            "faculty_name": data[0]["VarCharValue"],
            "faculty_code": data[1]["VarCharValue"]
        }
        res.append(jsonItem)
    
    return res
    
def loadFocusArea():
    query_string = f"SELECT * FROM {os.environ.get("FOCUS_AREA_OPTION")}"
    rows = execute_query(query_string)
    
    res = []
    for row in rows[1:]:
        data = row["Data"]
        jsonItem = {
            "label": data[0]["VarCharValue"],
            "value": data[1]["VarCharValue"]
        }
        res.append(jsonItem)
    
    return res