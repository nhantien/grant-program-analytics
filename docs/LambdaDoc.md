## Lambda Function Documentation 

Note: Every resolver includes a lambda_handler and execute_query function. These functions will not included in each table to avoid redundancy.

### tlef-resolver-homepage
| Function              | Description                                                                                                                                                        |
|-----------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| retrieve_reports      | Retrieves a list of reports from the 'tlef-test-reports' S3 bucket                                                                    |
| retrieve_posters      | (Currently not implemented) Intended to retrieve a list of posters from the same S3 bucket                                                       |
| generate_filtered_query | Constructs the SQL clause based on the filters                                                                                                       |                                                |
| getFilteredProposals | Retrieves filtered proposals from the database             |

### tlef-resolver-options
| Function         | Description                                                                                                                                           |
|------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------|
| loadFaculty      | Retrieves faculties                         |
| loadFocusArea    | Retrieves focus areas                                 |

### tlef-resolver-success-rate
| Function             | Description                                                                                                                                   |
|----------------------|-----------------------------------------------------------------------------------------------------------------------------------------------|
| generate_filtered_query | Constructs the SQL clause based on the filters.                                                                                     |                                 |
| countDeclinedProjects | Retrieves the count of declined projects from 'unsuccessful_projects' table |

### tlef-resolver-projects-and-grants
| Function             | Description                                                                                                                                   |
|----------------------|-----------------------------------------------------------------------------------------------------------------------------------------------|
| generate_filtered_query | Constructs the SQL clause based on the filters.                                                                                     |                                 |
| countProjectsAndGratns | Returns number of Large and Small projects and grants | 

### tlef-analytics-summary-resolver

