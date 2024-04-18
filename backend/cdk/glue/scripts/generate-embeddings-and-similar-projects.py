from sentence_transformers import SentenceTransformer, util
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

def return_df(bucket, data_key): # TIEN
    
    if "s3://" in data_key: # TIEN a full s3 URI is passed
        data_location = data_key
    else:
        data_location = 's3://{}/{}'.format(bucket, data_key)

    if ".parquet" in data_key:
        df =  pd.read_parquet(data_location)
    else:
        df = pd.read_excel(data_location)
        
    return df

project_details_df = return_df(
    bucket = BUCKET_NAME, #previously 'clean-full-data',
    data_key = PROJECT_DETAILS_WITH_NEW_GRANT_IDS_S3URI # previously 'project_details_with_new_ids.xlsx'
)

def find_all_summaries(model='all-mpnet-base-v2'):
    
    embedding_model = SentenceTransformer('all-mpnet-base-v2', cache_folder = model_custom_path)
    
    for i in range(len(list(project_details_df.project_id))):
        
        this_project_id = project_details_df.project_id[i]
        if this_project_id != this_project_id: # i.e., project_id is NaN
            this_project_id = project_details_df.generated_grant_id[i] # use the automatically generated grant ID instead
            
        # Find all rows where either the corresponding 'project_id' column values are equal to this_project_id
        this_relevant_df = project_details_df.loc[project_details_df.project_id == this_project_id]
        this_project_context = ""
        this_project_context_embedding = None
        
        if this_relevant_df.empty:
            # Whatever we have right now is the only occurrence
            this_title = project_details_df.title[i] # TIEN project_title -> title
            this_summary = project_details_df.summary[i] # TIEN project_summary -> summary
        
            if not this_title != this_title and not this_summary != this_summary: # i.e., both title and summary are not NaN

                this_title_summary = this_title + '. ' + this_summary + ' ' # concatenate title and summary into 1 string
                # create embeddings witht the concat string
                this_title_summary_embedding = embedding_model.encode(this_title_summary, convert_to_tensor=True)

                this_project_context = this_title_summary
                this_project_context_embedding = this_title_summary_embedding
            
        else:
            # Generate one context for embedding
            this_project_context, this_project_context_embedding = generate_context_embeddings(this_relevant_df, embedding_model)
        
        store_context_and_embeddings(
            this_project_context, 
            this_project_context_embedding,
            bucket = EMBEDDINGS_BUCKET, #'tlef-project-summary-embeddings',
            data_key = this_project_id
        )
        
def check_and_update_embeddings(bucket, data_key, current_context, current_embeddings, threshold=0.96):
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

        if similarity > threshold:
            # Update context and embeddings if similarity is high
            updated_context = existing_context + " " + current_context
            updated_embeddings = pickle.dumps(current_embeddings)  # Assuming current_embeddings is the updated embeddings

            # Save updated context and embeddings
            s3_client.put_object(Bucket=bucket, Key=context_key, Body=pickle.dumps(updated_context))
            s3_client.put_object(Bucket=bucket, Key=embeddings_key, Body=updated_embeddings)
            return True
        
    except s3_client.exceptions.NoSuchKey:
        # If the files do not exist, proceed with the original saving process
        return False

    return False

def store_context_and_embeddings(project_context, project_context_embedding, bucket, data_key):
    if project_context_embedding is not None:  # If it is not NaN
        if not check_and_update_embeddings(bucket, data_key, project_context, project_context_embedding):
            # If the embeddings are not updated due to no existing files or low similarity, save them as new
            s3_client = boto3.client('s3')
            context_bytes = pickle.dumps(project_context)
            embeddings_bytes = pickle.dumps(project_context_embedding)

            context_key = f'{data_key}.pkl'
            embeddings_key = f'{data_key}_embeddings.pkl'
            
            s3_client.put_object(Bucket=bucket, Key=context_key, Body=context_bytes)
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
        
        this_title = row.title # TIEN project_title -> title
        this_summary = row.project_summary
        
        if not this_title != this_title and not this_summary != this_summary: # i.e., both title and summary are not NaN
            
            this_title_summary = this_title + '. ' + this_summary + ' '
            this_title_summary_embedding = embedding_model.encode(this_title_summary, convert_to_tensor=True)
            
            if util.cos_sim(current_context_embedding, this_title_summary_embedding)[0] < 0.96: # The new title+summary has some differences
                context += this_title_summary
                context_embedding = embedding_model.encode(context, convert_to_tensor=True)
                
    return context, context_embedding
    
find_all_summaries()


############## END OF GENERATING EMBEDDINGS PART

############## BEGIN OF COMPUTING SIMILARITY PART

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
                
                print(key)
                print(type(this_embedding))
                print(this_embedding)
                print("-----------")
                print(type(database_embeddings_list))
    
                # Assuming embeddings_database is a dict with file names as keys and embeddings as values
                embeddings_matrix = np.stack(database_embeddings_list)
                this_embedding_matrix = np.array([this_embedding])
                
                print("Here")

                # Calculate cosine similarities (using 1 - cosine distance)
                similarities = 1 - cdist(this_embedding_matrix, embeddings_matrix, 'cosine')
                sorted_indices = np.argsort(similarities[0])[::-1]  # Sorting indices in descending order
                
                print("Here2")

                # Store top k similar projects
                similar_projects_database[key.replace("_embeddings.pkl", "")] = [database_keys_list[i].replace("_embeddings.pkl", "") for i in sorted_indices[1:top_k+1]]
    
                print("End")

    return similar_projects_database

def save_similar_projects_database(similar_projects_database, bucket_name, file_name): # TIEN
    # Convert the similar projects database to a DataFrame for easy Excel writing
    df = pd.DataFrame(list(similar_projects_database.items()), columns=['project_key', 'similar_projects'])
    
    # Convert the list of similar projects into a string for better Excel visualization
    df['similar_projects'] = df['similar_projects'].apply(lambda x: ', '.join(x))
    
    df.to_parquet(f"s3://{bucket_name}/{file_name}")

    # # Create a BytesIO buffer to hold the Excel file in memory
    # excel_buffer = BytesIO()
    # # Write the DataFrame to an Excel file in the buffer
    # with pd.ExcelWriter(excel_buffer, engine='xlsxwriter') as writer:
    #     df.to_excel(writer, sheet_name='similar_projects', index=False)
    
    # # Go to the beginning of the BytesIO buffer
    # excel_buffer.seek(0)
    
    # # Initialize a boto3 client
    # s3_client = boto3.client('s3')
    # # Upload the Excel file from the buffer to the S3 bucket
    # s3_client.put_object(Bucket=bucket_name, Key=file_name, Body=excel_buffer.getvalue(), ContentType='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    
    # # Close the BytesIO buffer
    # excel_buffer.close()

def main():
    
    embeddings_database = generate_embeddings_database(EMBEDDINGS_BUCKET) #'tlef-project-summary-embeddings'
    
    similar_projects_database = generate_similar_projects_database(EMBEDDINGS_BUCKET, embeddings_database) #'tlef-project-summary-embeddings'
    
    save_similar_projects_database(similar_projects_database, BUCKET_NAME, "staging/similar_projects.parquet") # similar_projects.xlsx


if __name__ == "__main__":
    main()
