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
    
    if method == "countTotalReachByFaculty":
        return countTotalReachByFaculty(event["filter"])
    elif method == "getStudentReachInfo":
        return getStudentReachInfo(event["filter"])
    else:
        return None

def countTotalReachByFaculty(filters):
    query_string = f"""
        SELECT p.project_type, p.project_faculty, SUM(p.reach) 
        FROM {os.environ.get("STUDENT_REACH")} p
        LEFT JOIN {os.environ.get("FOCUS_AREA")} f ON p.grant_id = f.grant_id
        WHERE 1 = 1"""
    query_string += generate_filtered_query(filters) + " GROUP BY p.project_type, p.project_faculty"
    print(query_string)
    rows = execute_query(query_string)
    
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

def getStudentReachInfo(filters):
    query_string = f"""
        SELECT 
            COUNT (DISTINCT(p.project_faculty)), 
            COUNT (DISTINCT(p.course_name)), 
            COUNT (p.section) 
        FROM {os.environ.get("STUDENT_REACH")} p
        LEFT JOIN {os.environ.get("FOCUS_AREA")} f ON p.grant_id = f.grant_id
        WHERE 1 = 1"""
    query_string += generate_filtered_query(filters)
    rows = execute_query(query_string)
    
    data = rows[1]["Data"]
    result = {
        "faculty": int(data[0]["VarCharValue"]),
        "course": int(data[1]["VarCharValue"]),
        "section": int(data[2]["VarCharValue"])
    }
    
    return result