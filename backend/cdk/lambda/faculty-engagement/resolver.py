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
                str += f"LOWER(p.pi_name) LIKE '%{value.lower()}%' OR "
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
    
def execute_query(query_string, server):
    response = ATHENA.start_query_execution(
        QueryString = query_string,
        QueryExecutionContext = {
            "Database": str(os.environ.get("PROD_DB_NAME")) if server == "production" else str(os.environ.get("STAGING_DB_NAME"))
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
    
    query_results = ATHENA.get_query_results(QueryExecutionId = executionId)
    rows = query_results["ResultSet"]["Rows"]
    
    return rows
    
def lambda_handler(event, context):
    
    # get method name
    method = event["method"]
    server = event["server"]
    
    # set query_string based on the method name
    if method == "countFacultyMembersByStream":
        return countFacultyMembersByStream(event["filter"], server)
    elif method == "getUniqueStudent":
        return getUniqueStudent(event["fundingYear"], server)
    else:
        return None

def countFacultyMembersByStream(filters, server):
    query_string = f"""SELECT 
        p.project_type, p.member_stream, COUNT (p.member_stream) 
        FROM {os.environ.get('FACULTY_ENGAGEMENT')} p
        LEFT JOIN {os.environ.get('FOCUS_AREA')} f ON p.grant_id = f.grant_id
        WHERE 1 = 1"""
    query_string += generate_filtered_query(filters) + " GROUP BY p.project_type, p.member_stream"
    print(query_string)
    rows = execute_query(query_string, server)
    
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

def getUniqueStudent(year, server):
    query_string = f"SELECT * FROM {os.environ.get('UNIQUE_STUDENT')} WHERE funding_year = {year}"
    rows = execute_query(query_string, server)
    
    jsonItem = {
        "funding_year": int(year),
        "unique_student": None,
        "funding_amount": None
    }
    
    if len(rows) < 2: 
        return jsonItem
    
    header = rows[0]["Data"]
    data = rows[1]["Data"]
    
    for i in range(len(header)):
        if len(data[i]) > 0:
            column_name = header[i]["VarCharValue"]
            value = data[i]["VarCharValue"]
            jsonItem[column_name] = int(value) if column_name == "funding_year" else float(value)
    
    return jsonItem