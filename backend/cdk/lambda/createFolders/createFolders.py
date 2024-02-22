import os
import boto3

BUCKET_NAME = os.environ["BUCKET_NAME"]

s3 = boto3.client("s3")

def lambda_handler(event, context):

    # CREATE A FOLDER STRUCTURE FOR THE AMPLIFY S3 STORAGE with a public/ top level folder

    s3.put_object(Bucket=BUCKET_NAME, Key="raw-data/")
    s3.put_object(Bucket=BUCKET_NAME, Key="staging-data/")
    s3.put_object(Bucket=BUCKET_NAME, Key="production-data/")
    
    print("Trigger Function scripts finished execution successfully!")