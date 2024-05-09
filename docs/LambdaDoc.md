## Lambda Function Documentation 

Note: Every resolver includes a lambda_handler and execute_query function. These functions will not included in each table to avoid redundancy.

### tlef-resolver-options
| Function         | Description                                                                                                                                           |
|------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------|
| loadFaculty      | Retrieves faculties                         |
| loadFocusArea    | Retrieves focus areas                                 |

### tlef-analytics-success-rate-resolver
| Function             | Description                                                                                                                                   |
|----------------------|-----------------------------------------------------------------------------------------------------------------------------------------------|
| generate_filtered_query | Constructs the SQL clause based on the filters.                                                                                     |                                 |
| countDeclinedProjects | Retrieves the count of declined projects from 'unsuccessful_projects' table |

### tlef-analytics-projects-and-grants-resolver
| Function             | Description                                                                                                                                   |
|----------------------|-----------------------------------------------------------------------------------------------------------------------------------------------|
| generate_filtered_query | Constructs the SQL clause based on the filters.                                                                                     |                                 |
| countProjectsAndGrants | Returns number of Large and Small projects and grants | 

### tlef-analytics-summary-resolver
| Function                 | Description                                                                                                                                   |
|--------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------|
| retrieve_report          | Retrieves report                                             |
| retrieve_poster          | Retrieves poster                                                    |
| getIndividualSummaryInfo| Retrieves summary information for a specific project             |
| getTeamMembersByGrantId  | Retrieves team members for a specific project from the 'FACULTY_ENGAGEMENT' table               |
| getStudentReachByGrantId| Retrieves student reach information for a specific project from the 'STUDENT_REACH' table                      |
| getSimilarProjects      | Retrieves information about similar projects from the 'SIMILAR_PROJECTS' and 'PROJECT_DETAILS' tables              |
| getProjectOutcome       | Retrieves project outcomes for a specific project from the 'PROJECT_OUTCOMES' table                           |

### tlef-analytics-homepage-resolver 
| Function            | Description                                                                                                                              |
|---------------------|------------------------------------------------------------------------------------------------------------------------------------------|
| retrieve_images     | Retrieves a list of images from the specified S3 bucket.                                                                      |
| generate_filtered_query | Constructs SQL clause based on the provided filters.                                                                                 |
| getFilteredProposals| Retrieves filtered proposals|

### tlef-resolver-summary
| Function                     | Description                                                                                                                                       |
|------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------|
| getIndividualSummaryInfo    | Retrieves individual summary information  |
| getTeamMembersByGrantId     | Retrieves team members associated by Grant ID                                                                    |
| getStudentReachByGrantId    | Retrieves student reach information for a project identified by the grant ID.                                                                      |
| getSimilarProjects          | Retrieves similar projects                                                                                     |


### tlef-analytics-faculty-engagement-resolver
| Function                     | Description                                                                                                                                       |
|------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------|
| countFacultyMembersByStream   | Returns # faculty members per Large and Small |
| getUniquestudent    |       Returns # unique students for select year                                                       |

### tlef-analytics-student-reach-resolver
| Function                     | Description                                                                                                                                       |
|------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------|
| countTotalReachByFaculty   | Returns total reach by faculty per Large and Small |
| getStudentReachInfo    | Retrieves student reach data (faculty, course, section)                                                                   |

