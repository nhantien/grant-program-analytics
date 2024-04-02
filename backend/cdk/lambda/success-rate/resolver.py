from boto3 import client
import os
import time

# parameters for connecting to athena
ATHENA = client('athena')

def generate_filtered_query(filters):
    str = ""
    for key, values in filters.items():
        
        if key == 'search_text' and len(values) > 0:
            str += " AND ("
            for value in values:
                str += f"p.pi_name LIKE '%{value}%' OR "
                # str += f"TITLE LIKE '%{value}%' OR pi_name LIKE '%{value}%' OR "
            str = str[:str.rindex("OR ")] + ")"
        
        elif key == 'funding_year' and len(values) > 0:
            str += " AND p.%s IN (%s)" % (key, ",".join(values))
            
        elif key == 'focus_area' and len(values) > 0:
            for value in values:
                str += " AND f.%s = true" % (value)
            
        elif len(values) > 0:
            str += " AND p.%s IN ('%s')" % (key, "','".join(values))
    
    return str
    
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
    if method == "countDeclinedProjects":
        return countDeclinedProjects(event["filter"])
    else:
        return None
    
def countDeclinedProjects(filters):
    query_string = f"""SELECT p.project_type, COUNT (p.grant_id) 
        FROM {os.environ.get("UNSUCCESSFUL_PROJECTS")} p 
        LEFT JOIN {os.environ.get("FOCUS_AREA")} f ON p.grant_id = f.grant_id
        WHERE 1 = 1"""
    query_string += generate_filtered_query(filters) + " GROUP BY p.project_type"
    rows = execute_query(query_string)
    
    jsonItem = {
        "Large": 0,
        "Small": 0
    }
    for row in rows[1:]:
        data = row["Data"]
        if data[0] and data[1]:
            type = data[0]["VarCharValue"]
            count = int(data[1]["VarCharValue"])
            jsonItem[type] = count
    
    return jsonItem
    