import json
import pandas as pd
import boto3
import io
import os

def lambda_handler(event, context):
    
    obj_key = event['Records'][0]['s3']['object']['key']
    names = obj_key.split('/')
    
    stage = names[0]
    newStage = "staging" if stage == "raw" else "production"
    folder = names[1]
    file_name = names[2].replace(".xlsx", "")

    dst_key = f"{newStage}/{folder}/{file_name}.parquet"
    
    if (folder == "project_details" or folder == "survey_monkey"):
        print('project_details uploaded: skip')
        return
    
    print(f'{stage}/{folder} -> {newStage}/{folder}')
    
    s3 = boto3.client('s3')
    
    src = s3.get_object(Bucket=os.environ.get("S3_BUCKET_NAME"), Key=obj_key)
    excel_data = src['Body'].read()
    
    df = pd.read_excel(io.BytesIO(excel_data))

    # Convert DataFrame to Parquet format
    parquet_data = io.BytesIO()
    df.to_parquet(parquet_data, engine='pyarrow')

    # Upload Parquet data to destination bucket
    s3.put_object(Body=parquet_data.getvalue(), Bucket=str(os.environ.get("S3_BUCKET_NAME")), Key=dst_key)
    
    # TODO implement
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }
