from boto3 import client
import os
import operator

# parameters for connecting to athena
ATHENA = client('athena')
S3 = client('s3')

def retrieve_report(project_id):
    try:
        S3.head_object(Bucket=str(os.environ.get("IMAGE_BUCKET_NAME")), Key=f'report/{project_id}-Report.pdf')
        return f'https://{os.environ.get("CLOUDFRONT_DOMAIN_NAME")}/report/{project_id}-Report.pdf'
    except:
        return ""

def retrieve_poster(grant_id):
    try:
        S3.head_object(Bucket=str(os.environ.get("IMAGE_BUCKET_NAME")), Key=f'poster/{grant_id}-Poster.png')
        return f'https://{os.environ.get("CLOUDFRONT_DOMAIN_NAME")}/poster/{grant_id}-Poster.png'
    except:
        return ""
    
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
    if method == "getIndividualSummaryInfo":
        return getIndividualSummaryInfo(event["grantId"], server)
    elif method == "getTeamMembersByGrantId":
        return getTeamMembersByGrantId(event["grantId"], server)
    elif method == "getStudentReachByGrantId":
        return getStudentReachByGrantId(event["grantId"], server)
    elif method == "getSimilarProjects":
        return getSimilarProjects(event["grantId"], server)
    elif method == "getProjectOutcome":
        return getProjectOutcome(event["grantId"], server)
    else:
        return None

def getIndividualSummaryInfo(grant_id, server):
    query_string = f'''SELECT 
        p.grant_id, p.project_id, p.funding_year, p.project_type, p.project_faculty, p.pi_name, p.funding_amount, p.title, 
        p.summary, p.project_year, o.project_status, 
        c.description,
        f.resource_development, f.infrastructure_development, f.student_engagement, f.innovative_assessments, 
        f.teaching_roles_and_training, f.curriculum, f.student_experience, f.work_integrated_learning, 
        f.indigenous_focused_curricula, f.diversity_and_inclusion, f.open_educational_resources 
    FROM {os.environ.get('PROJECT_DETAILS')} p
    LEFT JOIN {os.environ.get("PROJECT_OUTCOMES")} o ON p.project_id = o.project_id
    LEFT JOIN {os.environ.get('CO_CURRICULAR_REACH')} c ON p.grant_id = c.grant_id 
    LEFT JOIN {os.environ.get('FOCUS_AREA')} f ON p.grant_id = f.grant_id 
    WHERE p.project_id = (
        SELECT project_id FROM {os.environ.get('PROJECT_DETAILS')} 
        WHERE grant_id = '{grant_id}' OR generated_grant_id = '{grant_id}')
        OR p.grant_id = '{grant_id}'
        OR p.generated_grant_id = '{grant_id}'
    '''
    
    rows = execute_query(query_string, server)
    headers = rows[0]["Data"]
    
    
    res = []
    for row in rows[1:]:
        data = row["Data"]
        jsonItem = {}
        focus_areas = []
        for i in range(len(data)):
            header = headers[i]["VarCharValue"]
            data_dict = data[i]
            
            # get reports
            if len(data_dict) > 0 and header == "project_id":
                project_id = data_dict["VarCharValue"]
                jsonItem["report"] = retrieve_report(project_id)
            elif len(data_dict) > 0 and header == "grant_id":
                new_grant_id = data_dict["VarCharValue"]
                jsonItem["poster"] = retrieve_poster(new_grant_id)
            elif len(data_dict) > 0:
                value = data_dict["VarCharValue"]
                if value == "true":
                    focus_areas.append(header)
                else:
                    jsonItem[header] = value
            elif header == "description" or header == "project_outcome":
                jsonItem[header] = "" # might need to change this to display description or project_outcome?
        
        jsonItem["focus_areas"] = focus_areas
        res.append(jsonItem)
    
    return sorted(res, key=operator.itemgetter("funding_year"))
    
def getTeamMembersByGrantId(grant_id, server):
    query_string = f'''SELECT
        grant_id, member_name, member_title, member_faculty, member_unit
    FROM {os.environ.get('FACULTY_ENGAGEMENT')}
    WHERE project_id = (
        SELECT DISTINCT(project_id) FROM {os.environ.get('FACULTY_ENGAGEMENT')}
        WHERE grant_id = '{grant_id}'
    )
    '''
    
    rows = execute_query(query_string, server)
    
    res = {}
    
    header = rows[0]["Data"]
    
    for row in rows[1:]:
        data = row["Data"]
        id = data[0]["VarCharValue"]
        
        jsonItem = {
            "member_name": "",
            "member_title": "",
            "member_faculty": "",
            "member_unit": ""
        }
        
        for i in range(1, len(data)):
            if len(data[i]) > 0:
                jsonItem[header[i]["VarCharValue"]] = data[i]["VarCharValue"]
        
        if id in res:
            res[id].append(jsonItem)
        else:
            res[id] = [jsonItem]
            
    formatted = []
    
    for key, value in res.items():
        formatted.append({
            "grant_id": key,
            "members": value
        })
    
    return sorted(formatted, key=operator.itemgetter("grant_id"))

def getStudentReachByGrantId(grant_id, server):
    query_string = f'''SELECT
        grant_id, course_name, section, reach
    FROM {os.environ.get('STUDENT_REACH')}
    WHERE project_id = (
        SELECT DISTINCT(project_id)
        FROM {os.environ.get('STUDENT_REACH')}
        WHERE grant_id = '{grant_id}'
    )
    '''
    
    rows = execute_query(query_string, server)
    
    res = {}
    
    header = rows[0]["Data"]
    
    for row in rows[1:]:
        data = row["Data"]
        id = data[0]["VarCharValue"]
        
        jsonItem = {
            "course_name": "",
            "section": "",
            "reach": 0
        }
        
        for i in range(1, len(data)):
            if len(data[i]) > 0:
                column_name = header[i]["VarCharValue"]
                value = data[i]["VarCharValue"]
                jsonItem[column_name] = int(value) if column_name == "reach" else value
        
        if id in res:
            res[id].append(jsonItem)
        else:
            res[id] = [jsonItem]
        
    formatted = []
    for key, value in res.items():
        formatted.append({
            "grant_id": key,
            "reach": value
        })
    
    return sorted(formatted, key=operator.itemgetter("grant_id"))
    
def getSimilarProjects(grant_id, server):
    first_query_string = f'''SELECT similar_projects
    FROM {os.environ.get('SIMILAR_PROJECTS')}
    WHERE project_key = (
        SELECT project_id FROM {os.environ.get('PROJECT_DETAILS')}
        WHERE grant_id = '{grant_id}'
    ) 
    OR project_key = '{grant_id}'
    '''
    
    project_ids = execute_query(first_query_string, server)
    
    if len(project_ids) <= 1:
        return []
    
    project_ids = project_ids[1]["Data"][0]["VarCharValue"].split(", ")
    
    second_query_string = f'''SELECT 
        project_id, grant_id, title, project_type, pi_name, project_faculty, funding_year
    FROM {os.environ.get('PROJECT_DETAILS')}
    WHERE project_id IN (
        '{project_ids[0]}', '{project_ids[1]}', '{project_ids[2]}'
    )
    '''
    
    similar_projects = execute_query(second_query_string, server)
    headers = similar_projects[0]["Data"]
    res = {}
    
    for proj in similar_projects[1:]:
        id = proj["Data"][0]["VarCharValue"]
        
        if id in res:
            continue
        
        jsonItem = {}
        for i in range(1, len(proj["Data"])):
            jsonItem[headers[i]["VarCharValue"]] = proj["Data"][i]["VarCharValue"]
        
        res[id] = jsonItem
    
    
    return list(res.values())
    
def getProjectOutcome(grant_id, server):
    query_string = f'''SELECT project_outcomes
    FROM {os.environ.get('PROJECT_OUTCOMES')}
    WHERE project_id = (
        SELECT project_id FROM {os.environ.get('PROJECT_DETAILS')} 
        WHERE grant_id = '{grant_id}'
    )
    '''
    
    print(query_string)
    
    rows = execute_query(query_string, server)
    
    if len(rows) > 1:
        return rows[1]["Data"][0]["VarCharValue"]
    else:
        return ""