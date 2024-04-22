# Architecture Design
This document provides a more in-depth explanation of the system's architecture and operation.

## Table of Contents
- [Architecture](#architecture) 
- [Data Preparation(1-7)](#data-preparation1-7)
- [Previewing Staged Data(8-17)](#previewing-staged-data8-17)
- [Public User Visits the Web Application(18)](#public-user-visits-the-web-application18)

## Architecture
![Architecture Design](./images/architecture-diagram.jpg)

## Data Preparation(1-7)

1. Administrators upload files (datasets, posters, reports) to appropriate locations in Amazon S3.\
    For specific location in the storage to which each datasets are uploaded, refer to [our data lake schema]().
2. Datasets other than raw Survey Monkey data will be automatically converted from excel format to parquet format and be ready for consumption.
3. Converted datasets will be transferred to `/staging` folder, where all staged datasets are stored.
4. Survey Monkey Data will be taken by the first Glue job, and go through the cleaning process. As a result of this process, two new files `project_details` and `faculty_engagement` will be generated. For detailed explanation of this cleaning process, please refer to [this document]().
5. Generated files `project_details` and `faculty_engagement` will then be reviewed/edited by administrators. Once the reviewing process is finished, `faculty_engagement` file will be converted to parquet and transferred to `/staging` folder. `project_details`, on the other hand, requires additional operations. The file will be passed in to the second Glue job to generate new IDs in case some records in the dataset do not have them. After the process, a file named `project_details_with_new_ids` will be generated and stored in `/staging` folder in parquet format. For detailed explanation, please visit [this document]().
6. The product of the previous step will be reused in the third Glue job, where similarity scores between all projects will be computed and stored. At the end of the job, it generates `similar_projects` file, which maps all projects and their similar projects. For more information, please visit [this document]().
7. `similar_projects` file will then be stored in `/staging` folder.

## Previewing Staged Data(8-17)
The existence of `/staging` folder allows administrators to preview staged data and detect any errors before it's published.

8. Uploaded images will be accessed via AWS CloudFront. CloudFront accesses private resources (posters, reports) stored inside Amazon S3, and distributes them to the user.
9. Generated URL to the image will then be passed to the frontend, and displays the thumbnail of images and provides clickable links to the user. Users can view and download those images.
10. In order for administrators to preview staged data, they will need to access the endpoint `/staging`. For instance, if the web application's endpoint is `https://main.abcde12345.amplifyapp.com`, you will need to access `https://main.abcde12345.amplifyapp.com/staging` to access staged contents. 
11. The application prompts the administrator to login. This feature is implemented with Amazon Cognito user pool. Administrators can log in to the staging website using the username and password they created on Amazon Cognito console.
12. React website hosted on AWS Amplify makes API calls to retrieve data from the backend. AWS WAF controls HTTP traffic between the website and GraphQL API endpoint to protect backend resources from malicious activities. 
13. GraphQL API defined in AWS AppSync processes allowed requests. 
14. AppSync communicates with resolvers running on AWS Lambda to retrieve data.
15. AWS Lambda functions serve as GraphQl API resolvers. Using `boto3` Python library, it interacts with AWS Athena to query data from data files stored in S3.
16. AWS Athena is triggered by Lambda functions, and runs SQL queries to fetch data. The query results will then be sent back to AWS Lambda, and also be stored in `/result` folder in S3 storage.
17. One of the defined GraphQL queries triggers file transfer from `/staging` to `/production` to publish staged data into production environment. Only authenticated user (administrators) can invoke it. Lambda resolver that handles this specific queries use `boto3` to access S3, copy contents in `/staging` folder and transfer them to `/production`.

## Public User Visits the Web Application(18)
As a last step, public users (guest users) access web application to view data. This does not require any login step, and they can view/filter data and generate graphs to visualize it.