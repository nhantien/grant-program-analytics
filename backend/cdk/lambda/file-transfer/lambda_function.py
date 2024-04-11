import json
import os
import boto3

s3_client = boto3.client('s3')

def lambda_handler(event, context):
    # TODO implement
    
    bucket_name = str(os.environ.get("S3_BUCKET_NAME"))
    source_prefix = 'staging/'
    destination_prefix = 'production/'

    # List objects in the source folder
    response = s3_client.list_objects_v2(
        Bucket=bucket_name,
        Prefix=source_prefix
    )

    # Copy each object to the destination folder
    for obj in response.get('Contents', []):
        source_key = obj['Key']
        destination_key = source_key.replace(source_prefix, destination_prefix)
        
        # Copy object
        s3_client.copy_object(
            CopySource={'Bucket': bucket_name, 'Key': source_key},
            Bucket=bucket_name,
            Key=destination_key
        )

    return {
        'status': 'SUCCESS',
        'message': 'file transfer succeeded.'
    }
