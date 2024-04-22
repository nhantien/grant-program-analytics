import boto3
from io import BytesIO
import pandas as pd
import numpy as np
import pickle
import os
import sys
from scipy.spatial.distance import cdist

# Glue parameters
from awsglue.utils import getResolvedOptions
args = getResolvedOptions(sys.argv, ["BUCKET_NAME", "EMBEDDINGS_BUCKET", "PROJECT_DETAILS_WITH_NEW_GRANT_IDS_S3URI"])

BUCKET_NAME = args["BUCKET_NAME"]
EMBEDDINGS_BUCKET = args["EMBEDDINGS_BUCKET"]
PROJECT_DETAILS_WITH_NEW_GRANT_IDS_S3URI = args["PROJECT_DETAILS_WITH_NEW_GRANT_IDS_S3URI"]

def createDir(path):
    os.makedirs(path, exist_ok=True) # using os.markdirs to also create intermediate directories
    return os.path.join(os.getcwd(), path)

model_custom_path = createDir("cache/torch/sentence_transformers")
os.environ['TRANSFORMERS_CACHE'] = model_custom_path

from sentence_transformers import SentenceTransformer, util

def return_df(bucket, data_key): 
    
    if "s3://" in data_key: # a full s3 URI is passed
        data_location = data_key
    else:
        data_location = 's3://{}/{}'.format(bucket, data_key)

    if ".parquet" in data_key:
        df =  pd.read_parquet(data_location)
    elif ".xlsx" in data_key:
        df = pd.read_excel(data_location)
    elif ".csv" in data_key:
        df = pd.read_csv(data_location)
        
    return df

project_details_df = return_df(
    bucket = BUCKET_NAME,
    data_key = PROJECT_DETAILS_WITH_NEW_GRANT_IDS_S3URI
)

def find_all_summaries(model='all-mpnet-base-v2'):
    
    embedding_model = SentenceTransformer('all-mpnet-base-v2', cache_folder=model_custom_path)
    
    for i in range(len(list(project_details_df.project_id))):
        
        this_project_id = project_details_df.project_id[i]
        if this_project_id != this_project_id: # i.e., project_id is NaN
            this_project_id = project_details_df.generated_grant_id[i] # use the automatically generated grant ID instead
            
        # Find all rows where the corresponding 'project_id' column values are equal to this_project_id
        this_relevant_df = project_details_df.loc[project_details_df.project_id == this_project_id]
        this_project_context = ""
        this_project_context_embedding = None
        
        if this_relevant_df.empty:
            # Whatever we have right now is the only occurrence
            this_title = project_details_df.title[i]
            this_summary = project_details_df.summary[i]
        
            if not this_title != this_title and not this_summary != this_summary: # i.e., both title and summary are not NaN

                this_title_summary = this_title + '. ' + this_summary + ' ' # concatenate title and summary into 1 string
                # create embeddings with the concatenated string
                this_title_summary_embedding = embedding_model.encode(this_title_summary, convert_to_tensor=True)

                this_project_context = this_title_summary
                this_project_context_embedding = this_title_summary_embedding
            
        else:
            # Determine the necessary context required to capture information about this project by examining all existing titles and summaries
            this_project_context, this_project_context_embedding = generate_context_embeddings(this_relevant_df, embedding_model)
        
        store_context_and_embeddings(
            this_project_context, 
            this_project_context_embedding,
            bucket = EMBEDDINGS_BUCKET,
            data_key = this_project_id,
            embedding_model=embedding_model
        )
        
def check_and_update_embeddings(bucket, data_key, current_context, current_embeddings, embedding_model, threshold=0.96):
    """
    Check if embeddings exist, compare them, and update if similarity is above threshold.
    """
    s3_client = boto3.client('s3')
    context_key = f'{data_key}.pkl'
    embeddings_key = f'{data_key}_embeddings.pkl'

    try:
        # Check if the context and embeddings files exist
        context_object = s3_client.get_object(Bucket=bucket, Key=context_key)
        embeddings_object = s3_client.get_object(Bucket=bucket, Key=embeddings_key)
        
        # Load existing context and embeddings
        existing_context = pickle.loads(context_object['Body'].read())
        existing_embeddings = pickle.loads(embeddings_object['Body'].read())

        # Compare embeddings using cosine similarity
        similarity = util.pytorch_cos_sim(current_embeddings, existing_embeddings)

        if similarity < threshold:
            # Update context and embeddings if similarity is low
            updated_context = existing_context + " " + current_context
            updated_embeddings = embedding_model.encode(updated_context, convert_to_tensor=True) # Update embeddings by running the embedding_model on the new context that combined existing and current contexts
            updated_embeddings = pickle.dumps(updated_embeddings)
            # Save updated context and embeddings
            s3_client.put_object(Bucket=bucket, Key=context_key, Body=pickle.dumps(updated_context))
            print(f"Stored in S3: Data_key = {context_key}. Stored embeddings shape = {updated_embeddings.shape}")
            s3_client.put_object(Bucket=bucket, Key=embeddings_key, Body=updated_embeddings)
            return True
        else:
            print(f"Skipping the update embeddings stage for {context_key}.")
            return True
        
    except s3_client.exceptions.NoSuchKey:
        # If the files do not exist, proceed with the original saving process
        return False

def store_context_and_embeddings(project_context, project_context_embedding, bucket, data_key, embedding_model):
    if project_context_embedding is not None:  # If it is not empty
        if not check_and_update_embeddings(
            bucket=bucket, data_key=data_key, current_context=project_context, 
            current_embeddings=project_context_embedding, embedding_model=embedding_model
        ):
            # If embeddings under this name (data_key) do not exist already (also, if they do, then they that situation has already been address with the check_and_update_embeddings function)
            s3_client = boto3.client('s3')
            context_bytes = pickle.dumps(project_context)
            embeddings_bytes = pickle.dumps(project_context_embedding)

            context_key = f'{data_key}.pkl'
            embeddings_key = f'{data_key}_embeddings.pkl'
            
            s3_client.put_object(Bucket=bucket, Key=context_key, Body=context_bytes)
            print(f"Stored in S3: Data_key = {context_key}. Stored embeddings shape = {project_context_embedding.shape}")
            s3_client.put_object(Bucket=bucket, Key=embeddings_key, Body=embeddings_bytes)

def generate_context_embeddings(relevant_df, embedding_model):
    
    context = ""
    context_embedding = None
    
    # iterate through each rows of the "relevant" df
    for index, row in relevant_df.iterrows():
        if context_embedding is None:
            current_context_embedding = embedding_model.encode(context, convert_to_tensor=True)
        else:
            current_context_embedding = context_embedding
        
        this_title = row.title
        this_summary = row.summary
        
        if not this_title != this_title and not this_summary != this_summary: # i.e., both title and summary are not NaN
            
            this_title_summary = this_title + '. ' + this_summary + ' '
            this_title_summary_embedding = embedding_model.encode(this_title_summary, convert_to_tensor=True)
            
            if util.cos_sim(current_context_embedding, this_title_summary_embedding)[0] < 0.96: # The new title+summary has some differences
                context += this_title_summary
                context_embedding = embedding_model.encode(context, convert_to_tensor=True)
                
    return context, context_embedding
    
def generate_embeddings_database(bucket_name):
    # Initialize a boto3 client
    s3 = boto3.client('s3')
    
    # Create a reusable Paginator
    paginator = s3.get_paginator('list_objects_v2')
    
    # Create a PageIterator from the Paginator
    page_iterator = paginator.paginate(Bucket=bucket_name)
    
    embeddings_database = {}
    
    for page in page_iterator:
        for obj in page['Contents']:
            key = obj['Key']
            if 'embeddings' in key:
                # Get the object from S3
                response = s3.get_object(Bucket=bucket_name, Key=key)
                body = response['Body'].read()
                
                # Deserialize the embeddings
                this_embedding = pickle.loads(body)
                
                embeddings_database[key] = this_embedding
                
    return embeddings_database

def generate_similar_projects_database(bucket_name, embeddings_database, top_k=10):
    # Initialize a boto3 client
    s3 = boto3.client('s3')
    
    # Create a reusable Paginator
    paginator = s3.get_paginator('list_objects_v2')
    
    # Create a PageIterator from the Paginator
    page_iterator = paginator.paginate(Bucket=bucket_name)
    
    similar_projects_database = {}
    
    for page in page_iterator:
        for obj in page['Contents']:
            key = obj['Key']
            if 'embeddings' in key:
                # Get the object from S3
                s3_response = s3.get_object(Bucket=bucket_name, Key=key)
                body = s3_response['Body'].read()
                
                # Deserialize the embeddings
                this_embedding = pickle.loads(body)
                
                # Convert embeddings_database values into a list for comparison
                database_embeddings_list = list(embeddings_database.values())
                database_keys_list = list(embeddings_database.keys())
                
                # embeddings_database is a dict with file names as keys and embeddings as values
                embeddings_matrix = np.stack(database_embeddings_list)
                this_embedding_matrix = this_embedding.numpy().reshape(1,-1)
                
                # Calculate cosine similarities (using 1 - cosine distance)
                similarities = 1 - cdist(this_embedding_matrix, embeddings_matrix, 'cosine')
                sorted_indices = np.argsort(similarities[0])[::-1]  # Sorting indices in descending order
                
                # Store top k similar projects
                similar_projects_database[key.replace("_embeddings.pkl", "")] = [database_keys_list[i].replace("_embeddings.pkl", "") for i in sorted_indices[1:top_k+1]]
    
    return similar_projects_database
    
def save_similar_projects_database(similar_projects_database, save_path):
    # Convert the similar projects database to a DataFrame for easy Excel writing
    df = pd.DataFrame(list(similar_projects_database.items()), columns=['project_key', 'similar_projects'])
    
    # Convert the list of similar projects into a string for better Excel visualization
    df['similar_projects'] = df['similar_projects'].apply(lambda x: ', '.join(x))
    
    # Save this df as a parquet file
    df.to_parquet(save_path)

def main():
    find_all_summaries()
    embeddings_database = generate_embeddings_database(EMBEDDINGS_BUCKET)
    similar_projects_database = generate_similar_projects_database(EMBEDDINGS_BUCKET, embeddings_database)
    
    save_similar_projects_database(
        similar_projects_database=similar_projects_database, 
        save_path=f"s3://{BUCKET_NAME}/staging/similar_projects/similar_projects.parquet"
        )
    
if __name__ == "__main__":
    main()