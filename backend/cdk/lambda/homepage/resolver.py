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
                str += f"LOWER(p.title) LIKE '%{value.lower()}%' OR LOWER(p.pi_name) LIKE '%{value.lower()}%' OR "
            str = str[:str.rindex("OR ")] + ")"
        
        elif key == 'funding_year' and len(values) > 0:
            str += " AND p.%s IN (%s)" % (key, ",".join(values))
            
        elif key == 'focus_area' and len(values) > 0:
            str += " AND ("
            for value in values:
                str += "f.%s = true OR " % (value)
            str = str[:str.rindex("OR ")] + ")"
            
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
    
    if method == "getFilteredProposals":
        return getFilteredProposals(event["filter"])
    else:
        return None

def getFilteredProposals(filters):
    query_string = f"""SELECT 
        p.* FROM {os.environ.get("PROJECT_DETAILS")} p 
        LEFT JOIN {os.environ.get("FOCUS_AREA")} f ON p.grant_id = f.grant_id 
        WHERE 1 = 1"""
    query_string += generate_filtered_query(filters)
    print(query_string)
    rows = execute_query(query_string)
    
    headers = rows[0]["Data"]
    
    results = []
    for row in rows[1:]:
        data = row["Data"]
        jsonItem = {}
        for i in range (len(data)):
            if len(data[i]) > 0:
                jsonItem[headers[i]["VarCharValue"]] = data[i]["VarCharValue"]
            else:
                print(f'{headers[i]["VarCharValue"]} is null')
                jsonItem[headers[i]["VarCharValue"]] = ""
            
        results.append(jsonItem)
    
    return results
    