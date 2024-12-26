from boto3 import client
import os

# parameters for connecting to athena
ATHENA = client('athena')

def generate_filtered_query(filters):
    str = ""
    for key, values in filters.items():
        
        if key == 'search_text' and len(values) > 0:
            str += " AND ("
            for value in values:
                str += f"""
                    LOWER(p.title) LIKE '%{value.lower()}%' OR 
                    LOWER(p.pi_name) LIKE '%{value.lower()}%' OR 
                    LOWER(p.summary) LIKE '%{value.lower()}%' OR 
                """
                # LOWER(p.project_outcome) LIKE '%{value.lower()}%' OR 
            str = str[:str.rindex("OR ")] + ")"
        
        elif key in 'funding_year' and len(values) > 0:
            str += " AND s.%s IN (%s)" % (key, ",".join(values))
        elif key in 'project_type' and len(values) > 0:
            str += " AND s.%s IN ('%s')" % (key, "','".join(values))
        elif key == 'focus_area' and len(values) > 0:
            str += " AND ("
            for value in values:
                str += "f.%s = true OR " % (value)
            str = str[:str.rindex("OR ")] + ")"
            
        elif len(values) > 0:
            str += " AND p.%s IN ('%s')" % (key, "','".join(values))
    
    return str
    
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
    
    if method == "countTotalReachByFaculty":
        return countTotalReachByFaculty(event["filter"], server)
    elif method == "getStudentReachInfo":
        return getStudentReachInfo(event["filter"], server)
    else:
        return None

def countTotalReachByFaculty(filters, server):
    query_string = f"""
        SELECT s.project_type, s.project_faculty, SUM(s.reach) 
        FROM {os.environ.get('STUDENT_REACH')} s
        LEFT JOIN {os.environ.get('PROJECT_DETAILS')} p ON p.grant_id = s.grant_id
        LEFT JOIN {os.environ.get('FOCUS_AREA')} f ON p.grant_id = f.grant_id
        WHERE 1 = 1"""
    query_string += generate_filtered_query(filters) + " GROUP BY s.project_type, s.project_faculty"
    print(query_string)
    rows = execute_query(query_string, server)
    
    result = {
        "Large": [],
        "Small": []
    }
    
    for row in rows[1:]:
        data = row["Data"]
        if data[0] and data[1]:
            type = data[0]["VarCharValue"]
            faculty = data[1]["VarCharValue"]
            reach = int(data[2]["VarCharValue"])
            jsonItem = {}
            jsonItem["project_faculty"] = faculty
            jsonItem["reach"] = reach
            result[type].append(jsonItem)
    
    return result

def getStudentReachInfo(filters, server):
    query_string = f"""
        SELECT 
            COUNT (DISTINCT(s.project_faculty)), 
            COUNT (DISTINCT(s.course_name)), 
            COUNT (DISTINCT(s.course_name, s.section))
        FROM {os.environ.get('STUDENT_REACH')} s
        LEFT JOIN {os.environ.get('PROJECT_DETAILS')} p on p.grant_id = s.grant_id
        LEFT JOIN {os.environ.get('FOCUS_AREA')} f ON p.grant_id = f.grant_id
        WHERE 1 = 1"""
    query_string += generate_filtered_query(filters)
    rows = execute_query(query_string, server)
    
    data = rows[1]["Data"]
    result = {
        "faculty": int(data[0]["VarCharValue"]),
        "course": int(data[1]["VarCharValue"]),
        "section": int(data[2]["VarCharValue"])
    }
    
    return result