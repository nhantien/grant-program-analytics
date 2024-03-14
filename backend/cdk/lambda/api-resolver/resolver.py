from boto3 import client
import time
import os

# parameters for connecting to athena
ATHENA = client('athena')

def generate_filtered_query(filters):
    str = ""
    for key, values in filters.items():
        
        if key == 'search_text' and len(values) > 0:
            str += " AND ("
            for value in values:
                str += f"pi_name LIKE '%{value}%' OR "
                # str += f"TITLE LIKE '%{value}%' OR pi_name LIKE '%{value}%' OR "
            str = str[:str.rindex("OR ")] + ")"
            
        elif len(values) > 0:
            str += " AND %s IN ('%s')" % (key, "','".join(values))
    
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
    if method == "getFilteredProjects":
        return getFilteredProjects(event["filter"])
    elif method == "countDeclinedProjects":
        return countDeclinedProjects(event["filter"])
    elif method == "countFacultyMembersByStream":
        return countFacultyMembersByStream(event["filter"])
    elif method == "countTotalReachByFaculty":
        return countTotalReachByFaculty(event["filter"])
    elif method == "getStudentReachInfo":
        return getStudentReachInfo(event["filter"])
    elif method == "getCoCurricularReachById":
        return getCoCurricularReachById(event["grantId"])
    elif method == "countProjectsAndGrants":
        return countProjectsAndGrants(event["filter"])
    else:
        return None

def getFilteredProjects(filters):
    query_string = "SELECT * FROM raw WHERE 1 = 1" + generate_filtered_query(filters)
    print(query_string)
    rows = execute_query(query_string)
    headers = rows[0]["Data"]
    
    results = []
    for row in rows[1:]:
        data = row["Data"]
        jsonItem = {}
        for i in range (len(data)):
            jsonItem[headers[i]["VarCharValue"]] = data[i]["VarCharValue"]
        results.append(jsonItem)
    
    return results
    
def countDeclinedProjects(filters):
    query_string = "SELECT project_type, COUNT (grant_id) FROM focus_area WHERE funding_status = 'Not Funded'"
    query_string += generate_filtered_query(filters) + " GROUP BY project_type"
    print(query_string)
    rows = execute_query(query_string)
    
    jsonItem = {}
    for row in rows[1:]:
        data = row["Data"]
        if data[0] and data[1]:
            type = data[0]["VarCharValue"]
            count = int(data[1]["VarCharValue"])
            jsonItem[type] = count
    
    return jsonItem

def countFacultyMembersByStream(filters):
    query_string = "SELECT project_type, member_stream, COUNT (member_stream) FROM faculty_engagement WHERE 1 = 1"
    query_string += generate_filtered_query(filters) + " GROUP BY project_type, member_stream"
    rows = execute_query(query_string)
    
    jsonItem = {
        "Large": {
            "Admin": 0,
            "Student": 0,
            "External": 0,
            "PDF": 0,
            "Research": 0,
            "Teaching": 0
        },
        "Small": {
            "Admin": 0,
            "Student": 0,
            "External": 0,
            "PDF": 0,
            "Research": 0,
            "Teaching": 0
        }
    }
    for row in rows[1:]:
        data = row["Data"]
        if data[0] and data[1]:
            type = data[0]["VarCharValue"]
            stream = data[1]["VarCharValue"]
            count = int(data[2]["VarCharValue"])
            jsonItem[type][stream] = count
    
    return jsonItem

def countTotalReachByFaculty(filters):
    query_string = "SELECT project_type, project_faculty, SUM(reach) FROM student_reach WHERE 1 = 1"
    query_string += generate_filtered_query(filters) + " GROUP BY project_type, project_faculty"
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
    query_string = "SELECT COUNT (DISTINCT(project_faculty)), COUNT (DISTINCT(course_name)), COUNT (section) FROM student_reach WHERE 1 = 1"
    query_string += generate_filtered_query(filters)
    rows = execute_query(query_string)
    
    data = rows[1]["Data"]
    result = {
        "faculty": int(data[0]["VarCharValue"]),
        "course": int(data[1]["VarCharValue"]),
        "section": int(data[2]["VarCharValue"])
    }
    
    return result

def getCoCurricularReachById(grant_id):
    query_string = f"SELECT * FROM co_curricular_reach WHERE grant_id = '{grant_id}'"
    rows = execute_query(query_string)
    
    keys = rows[0]["Data"]
    values = rows[1]["Data"]
    
    jsonItem = {}
    
    for i in range(len(keys)):
        key = keys[i]["VarCharValue"]
        value = values[i]["VarCharValue"]
        jsonItem[key] = value
        
    return jsonItem
    
def countProjectsAndGrants(filters):
    query_string = "SELECT project_type, COUNT (DISTINCT(grant_id)), COUNT (DISTINCT(project_id)) FROM raw WHERE 1 = 1"
    query_string += generate_filtered_query(filters) + "GROUP BY project_type"
    print(query_string)
    rows = execute_query(query_string)
    
    large = rows[1]["Data"]
    small = rows[2]["Data"]
    
    jsonItem = {
        "grant": {
            "Large": int(large[1]["VarCharValue"]),
            "Small": int(small[1]["VarCharValue"])
        },
        "project": {
            "Large": int(large[2]["VarCharValue"]),
            "Small": int(small[2]["VarCharValue"])
        }
    }
    
    return jsonItem
