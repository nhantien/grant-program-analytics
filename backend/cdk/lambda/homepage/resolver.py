from boto3 import client, resource
import os
import json

# parameters for connecting to athena
ATHENA = client('athena')
S3 = client('s3')
S3_resource = resource('s3')

type_Proposal_attr = (
	"co_applicants",
	"funding_amount",
	"funding_year",
	"grant_id",
	"pi_name",
	"pi_unit",
	"poster",
	"project_faculty",
	"project_id",
	"project_outcomes",
	"project_status",
	"project_type",
	"project_year",
	"report",
	"title"
)

def lambda_handler(event, context):
    
    # get method name
    method = event["method"]
    
    # set query_string based on the method name
    
    if method == "getFilteredProposals":
        return getFilteredProposals(event["filter"], event["server"])
    else:
        return None

def retrieve_images():
    
    bucket = S3_resource.Bucket(str(os.environ.get("IMAGE_BUCKET_NAME")))

    ans = []
    for obj in bucket.objects.all():
        ans.append(obj.key)
    
    return ans

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
            'OutputLocation': str(os.environ.get("OUTPUT_LOCATION")),
        }
    )
    executionId = response["QueryExecutionId"]
    
    status = None
    
    while status == 'QUEUED' or status == 'RUNNING' or status is None:
        query_info = ATHENA.get_query_execution(QueryExecutionId = executionId)['QueryExecution']
        status = query_info['Status']['State']
        if status == 'FAILED' or status == 'CANCELLED':
            error_msg = query_info["Status"]["StateChangeReason"]
            raise Exception(f'Athena query {status}. Reason: {error_msg}')
    
    query_results = ATHENA.get_query_results(QueryExecutionId = executionId)
    rows = query_results["ResultSet"]["Rows"]
    
    while query_results.get("NextToken"):
        query_results = ATHENA.get_query_results(QueryExecutionId = executionId, NextToken=query_results["NextToken"])
        rows += query_results["ResultSet"]["Rows"]
    
    return rows

def getFilteredProposals(filters, server):
    query_string = f"""
        SELECT p.*, o.* FROM {os.environ.get('PROJECT_DETAILS')} p 
        LEFT JOIN {os.environ.get('FOCUS_AREA')} f ON p.grant_id = f.grant_id
        LEFT JOIN (
            SELECT DISTINCT project_id, project_outcomes, project_status from {os.environ.get('PROJECT_OUTCOMES')}
        ) AS o ON p.project_id = o.project_id WHERE 1 = 1      
    """
    query_string += generate_filtered_query(filters)
    rows = execute_query(query_string, server)
    headers = rows[0]["Data"]
    images = retrieve_images()
    
    results = []
    for row in rows[1:]:
        data = row["Data"] # a tuple/row
        jsonItem = {}
        for i in range (len(data)): # iterate through the fields of a tuple
            header = headers[i]["VarCharValue"] # get the field name
            if header not in type_Proposal_attr: # we want to retain only attributes/fields defined in graphQL type Proposal
                continue
            if len(data[i]) > 0 and header == "project_id":
                file_name = f'report/{data[i]["VarCharValue"]}-Report.pdf'
                if file_name in images:
                    jsonItem["report"] = f"https://{os.environ.get('CLOUDFRONT_DOMAIN_NAME')}/{file_name}"
                else:
                    jsonItem["report"] = ""
            
            if len(data[i]) > 0 and header == "grant_id":
                file_name = f'poster/{data[i]["VarCharValue"]}-Poster.png'
                if file_name in images:
                    jsonItem["poster"] = f"https://{os.environ.get('CLOUDFRONT_DOMAIN_NAME')}/{file_name}"
                else:
                    jsonItem["poster"] = ""
            
            if len(data[i]) > 0 and header == "generated_grant_id" and jsonItem["grant_id"] == "":
                jsonItem["grant_id"] = data[i]["VarCharValue"]
            if len(data[i]) > 0:
                jsonItem[header] = data[i]["VarCharValue"]
            else:
                print(f'{header} is null')
                jsonItem[header] = ""

        results.append(jsonItem)
    
    return results
    