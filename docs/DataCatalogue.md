## TLEF Data Catalogue

### co-curricular-reach

| Column Name    | Description                                | Data Types |
|----------------|--------------------------------------------|------------|
| funding_year   | The year in which this grant is provided  | Bigint     |
| grant_id       | The unique identifier of the grant        | String     |
| estimated_reach| The estimated student reach                | String     |
| description    | A description of the project              | String     |

### faculty_engagement

| Column Name     | Description                                                  | Data Types |
|-----------------|--------------------------------------------------------------|------------|
| funding_year    | The year in which this grant is provided                    | Bigint     |
| project_type    | Whether it is a Small or Large TLEF project                 | String     |
| project_id      | The unique identifier for the project                       | String     |
| grant_id        | The unique identifier for the grant                         | String     |
| project_faculty | The faculty / college / unit this project belongs to        | String     |
| member_name     | The name of the team member                                  | String     |
| member_title    | The title of the team member                                 | String     |
| member_stream   | The category of the team member (Teaching, Research, Student)| String     |
| member_campus   | The affiliated campus of the team member                     | String     |
| member_faculty  | The faculty / college / unit of the team member              | String     |
| member_unit     | The unit of the team member                                  | String     |
| member_other    | Other information about the team members                     | String     |

### student_engagement

| Column Name     | Description                                                  | Data Types |
|-----------------|--------------------------------------------------------------|------------|
| funding_year    | The year in which this grant is provided                    | Bigint     |
| project_type    | Whether it is a Small or Large TLEF project                 | String     |
| grant_id        | The unique identifier for the grant                         | String     |
| project_id      | The unique identifier for the project                       | String     |
| project_faculty | The faculty / college / unit this project belongs to        | String     |
| student_positions | Number of student positions | Bigint |
| student_funding | The funding amount | Bigint |

### faculty_options

| Column Name   | Description                                | Data Types |
|---------------|--------------------------------------------|------------|
| faculty_name  | The name of the faculty / college / unit   | String     |
| faculty_code  | The faculty / college / unit's code        | String     |

### focus_area

| Column Name                  | Description                                               | Data Types |
|------------------------------|-----------------------------------------------------------|------------|
| funding_year                 | The year in which this grant is provided                  | Number     |
| project_type                 | Whether it is a Small or Large TLEF project              | String     |
| grant_id                     | The unique identifier for the grant                       | String     |
| title                        | The project's title                                       | String     |
| pi_name                      | The principal investigator's name                         | String     |
| project_faculty              | The faculty / college / unit this project belongs to      | String     |
| funding_amount               | The projects' funding amount                              | String     |
| funding_status               | The status of the project's funding                       | String     |
| project_id                   | The unique identifier for the project                     | String     |
| resource_development         | Whether or not Resource Development is a focus area       | Boolean    |
| infrastructure_development   | Whether or not Infrastructure Development is a focus area| Boolean    |
| student_development          | Whether or not Student Development is a focus area        | Boolean    |
| innovative_assessments       | Whether or not Innovative Assessments is a focus area     | Boolean    |
| teaching_roles_and_training | Whether or not Teaching Roles and Training is a focus area| Boolean    |
| curriculum                   | Whether or not Curriculum is a focus area                 | Boolean    |
| student_experience           | Whether or not Student Experience is a focus area         | Boolean    |
| work_integrated_learning     | Whether or not Work Integrated Learning is a focus area   | Boolean    |
| indigenous_focused_curricula | Whether or not Indigenous Focused Curricula is a focus area| Boolean  |
| diversity_and_inclusion      | Whether or not Diversity and Inclusion is a focus area    | Boolean    |
| open_educational_resources  | Whether or not Open Educational Resources is a focus area| Boolean    |

### focus_area_options

| Column Name | Description                        | Data Types |
|-------------|------------------------------------|------------|
| label       | The focus area's label             | String     |
| value       | The focus area's value             | String     |

### project_details

| Column Name         | Description                                                   | Data Types |
|---------------------|---------------------------------------------------------------|------------|
| funding_year        | The year in which this grant is provided                      | Bigint     |
| project_type        | Whether it is a Small or Large TLEF project                  | String     |
| grant_id            | The unique identifier of the grant                            | String     |
| project_id          | The unique identifier of the project                          | String     |
| project_faculty     | The faculty / college / unit this project belongs to           | String     |
| pi_name             | The name of the principal investigator                         | String     |
| pi_unit             | The principal investigator's unit (i.e., faculty)             | String     |
| funding_amount      | The project's funding amount for the year                     | Double     |
| title               | The project's title                                           | String     |
| summary             | A summary of the project                                      | String     |
| co_applicants       | The names of the co-applicants                                 | String     |
| generated_grant_id  | The cleaned, standardized unique identifier of the grant       | String     |
| project_year        | The project's ordinal year for this grant (1st, 2nd, etc.)    | Bigint     |

### project_outcomes

| Column Name    | Description                        | Data Types |
|----------------|------------------------------------|------------|
| project_id     | The unique identifier of the project | String   |
| project_outcomes | The outcomes of the project       | String     |
| project_status      | Whether the project is completed or active     | String     |

### similar_projects

| Column Name       | Description                                               |
|-------------------|-----------------------------------------------------------|
| project_key       | The project's key by which similarity is compared against|
| similar_projects  | A list of similar projects for the project                |

### student_reach

| Column Name    | Description                                           | Data Types |
|----------------|-------------------------------------------------------|------------|
| funding_year   | The year in which this grant is provided              | Bigint     |
| project_type   | Whether it is a Small or Large TLEF project          | String     |
| project_id     | The unique identifier of the project                  | String     |
| grant_id       | The unique identifier of the grant                    | String     |
| project_faculty| The faculty / college / unit this project belongs to  | String     |
| course_type    | The impacted course's type                            | String     |
| session        | The impacted course's session                         | String     |
| term           | The impacted course's term                            | String     |
| course_faculty | The impacted course's faculty                         | String     |
| course_name    | The impacted course's name                            | String     |
| section        | The impacted course's section                         | String     |
| credits        | The impacted course's credit worth                    | Double     |
| reach          | The amount of students affected by the course        | Bigint     |
| fte            | The full-time equivalency of the course               | Double     |

### unique_student

| Column Name    | Description                                           | Data Types |
|----------------|-------------------------------------------------------|------------|
| funding_year   | The year in which this grant is provided              | Bigint     |
| project_type   | Whether it is a Small or Large TLEF project          | String     |
| project_id     | The unique identifier of the project                  | String     |
| grant_id       | The unique identifier of the grant                    | String     |
| project_faculty| The faculty / college / unit this project belongs to  | String     |
| course_type    | The impacted course's type                            | String     |
| session        | The impacted course's session                         | String     |
| term           | The impacted course's term                            | String     |
| course_faculty | The impacted course's faculty                         | String     |
| course_name    | The impacted course's name                            | String     |
| section        | The impacted course's section                         | String     |
| credits        | The impacted course's credit worth                    | Double     |
| reach          | The amount of students affected by the course        | Bigint     |
| fte            | The full-time equivalency of the course               | Double     |

### unsuccessful_project

| Column Name        | Description                                            | Data Types |
|--------------------|--------------------------------------------------------|------------|
| funding_year       | The year in which this grant is provided               | Bigint     |
| project_type       | Whether it is a Small or Large TLEF project           | String     |
| grant_id           | The unique identifier of the grant                     | String     |
| title              | The project's title                                    | String     |
| project_faculty    | The faculty / college / unit this project belongs to   | String     |
| pi_name            | The name of the principal investigator                 | String     |
| project_department | The department this project belongs to                | String     |
