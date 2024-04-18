import pandas as pd
import boto3
import s3fs

import sys
import io
import boto3
from botocore.exceptions import ClientError

# Glue parameters
from awsglue.utils import getResolvedOptions
args = getResolvedOptions(sys.argv, ["BUCKET_NAME", "PROJECT_DETAILS_S3URI"])

BUCKET_NAME = args["BUCKET_NAME"]
PROJECT_DETAILS_S3URI = args["PROJECT_DETAILS_S3URI"]


def return_df(bucket, data_key):
    
    if "s3://" in data_key: # TIEN a full s3 URI is passed
        data_location = data_key
    else:
        data_location = 's3://{}/{}'.format(bucket, data_key)

    df = pd.read_excel(data_location)
        
    return df

project_details_df = return_df(
    bucket = BUCKET_NAME,
    data_key = PROJECT_DETAILS_S3URI
)

def store_df(df, bucket, data_key):

    data_location = 's3://{}/{}'.format(bucket, data_key)
    
    if '.parquet' in data_key:
        df.to_parquet(data_location, index=False)
    else:
        df.to_excel(data_location, index=False)

def assign_grant_ids(project_details_df):
    
    grant_ids = []
    
    for proj_idx in range(len(project_details_df)):
        
        this_proj_funding_year = project_details_df.funding_year.iloc[proj_idx]
        
        if ';' in project_details_df.project_faculty.iloc[proj_idx]: # There are multiple project faculties
            this_proj_faculty = ""
            
            faculty_list = project_details_df.project_faculty.iloc[proj_idx].split(';') # Add all faculties to the grant ID
            for this_faculty in faculty_list:
                this_proj_faculty += this_faculty.strip() + '-'
            
            this_proj_faculty = this_proj_faculty[:-1] # Remove the last '-'
            
        else:
            this_proj_faculty = project_details_df.project_faculty.iloc[proj_idx].strip()
        
        this_proj_type = ""
        
        existing_grant_id = project_details_df.grant_id.iloc[proj_idx]
        
        if not existing_grant_id != existing_grant_id: # Existing Grant ID is not NaN
            if len(existing_grant_id.split('-')) >= 5: # Existing Grant ID has 5 components or 6 in some cases ('2015-TLEF-LP1-ARTS-Giltrow-A' and '2015-TLEF-LP1-ARTS-Giltrow-B')

                if "SP" in existing_grant_id.split('-')[2] or "LP" in existing_grant_id.split('-')[2]:
                    this_proj_type = existing_grant_id.split('-')[2] # Extract project type from the existing Grant ID
                
                elif "FL" in existing_grant_id.split('-')[1]: # Convert it into an LP but restore the number, e.g., FL2 -> LP2
                    if existing_grant_id.split('-')[1][-1].isdigit(): # E.g., "FL2"
                        this_proj_type = "LP" + existing_grant_id.split('-')[1][-1]
                    
                    else:
                        this_proj_type = "LP"
                        
                elif "UDL" in existing_grant_id.split('-')[1]: # Convert it into an SP but restore the number, e.g., UDL2 -> SP2
                    if existing_grant_id.split('-')[1][-1].isdigit(): # E.g., "UDL2"
                        this_proj_type = "SP" + existing_grant_id.split('-')[1][-1]
                    
                    else:
                        this_proj_type = "SP"
                
                elif "ITTG" in existing_grant_id.split('-')[2]: # E.g., Grant ID = 2020-ITTG-ARTS-Mawani
                    this_proj_id = project_details_df.project_id.iloc[proj_idx] # Extract the corresponding Project ID, e.g., 2020-SP-ARTS-008
                    
                    if "SP" in this_proj_id.split('-')[1] or "LP" in this_proj_id.split('-')[1]:
                        this_proj_type = this_proj_id.split('-')[1] # Extract and store project type from the project ID
                        
        if this_proj_type == "":
            this_proj_type = "SP" if project_details_df.project_type.iloc[proj_idx] == "Small" else "LP"
        
        if ';' in project_details_df.pi_name.iloc[proj_idx]: # If there are multiple PIs
            this_proj_PI_surname = ""
            
            PI_list = project_details_df.pi_name.iloc[proj_idx].split(';')
            for PI_name in PI_list:
                this_PI_surname = PI_name.split(' ')[-1]
                this_proj_PI_surname += this_PI_surname.strip() + '-' # Add all PI surnames to the grant ID
                
            this_proj_PI_surname = this_proj_PI_surname[:-1] # Remove the last '-'
            
        else:
            this_proj_PI_surname = project_details_df.pi_name.iloc[proj_idx].split(' ')[-1].strip()

        this_proj_grant_id = str(this_proj_funding_year) + "-TLEF-" + this_proj_type + '-' + this_proj_faculty + '-' +  this_proj_PI_surname
        
        if this_proj_grant_id in grant_ids: # This PI has multiple TLEF projects in the same year
            existing_grant_id_idx = grant_ids.index(this_proj_grant_id)
            grant_ids[existing_grant_id_idx] = this_proj_grant_id + '-A'
            grant_ids.append(this_proj_grant_id + '-B')
            
        else:
            grant_ids.append(this_proj_grant_id)
    
    project_details_df["generated_grant_id"] = grant_ids
    return project_details_df

def convert_summary_to_strings(project_details_df):
    
    summary_list = []
    for proj_idx in range(len(project_details_df)):
        
        this_summary = project_details_df.summary.iloc[proj_idx]
        if this_summary != this_summary: # To check if the value is NaN, in which case this will be True
            summary_list.append("")
        else:
            summary_list.append(this_summary)
    
    project_details_df.summary = summary_list
    
    return project_details_df
    
    
    
current_year = project_details_df["funding_year"][0]
file_key = f"staging/project_details/project_details_with_new_ids_{current_year}.parquet"

store_df(
    df= convert_summary_to_strings(
        assign_grant_ids(
            project_details_df)),
    bucket = BUCKET_NAME,
    data_key = file_key
)
    

# start generate-embeddings-and-similar-projects Glue Job
arguments = {
    "--BUCKET_NAME": BUCKET_NAME,
    "--EMBEDDINGS_BUCKET": "tlef-project-summary-embeddings",
    "--PROJECT_DETAILS_WITH_NEW_GRANT_IDS_S3URI": f"s3://{BUCKET_NAME}/{file_key}",
    "--additional-python-modules": "sentence-transformers"
}
glue_client = boto3.client("glue")
glue_client.start_job_run(
    JobName="tlef-generate-embeddings-and-similar-projects",
    Arguments=arguments
)
