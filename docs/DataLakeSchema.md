# Data Lake Schema
## Introduction
This document contains information about how each dataset should be named and stored in our S3 bucket.

## Datasets
All datasets (i.e. Excel files) should be stored in a bucket whose name starts with `databasestack-tlefanalytics`. 

### `raw/` folder

| Data Type | Location | Naming Convention | Example |
| --------- | -------- | ----------------- | ------- |
| Focus Area | `raw/focus_area/` | `focus_area_{year}.xlsx` | `focus_area_2024.xlsx`|
| Faculty Options | `raw/options/faculties/` | `options_faculty.xlsx` | `options_faculty.xlsx` |
| Focus Area Options | `raw/options/focus_area` | `options_focus_area.xlsx` | `options_focus_area.xlsx` |
| Student Reach | `raw/student_reach/` | `student_reach_{year}.xlsx` | `student_reach_2024.xlsx` |
| Unique Student | `raw/unique_student/` | `unique_student_{year}.xlsx` | `unique_student_2024.xlsx` |
| Unsuccessful Projects | `raw/unsuccessful_projects/` | `unsuccessful_projects_{year}.xlsx` | `unsuccessful_projects_2024.xlsx` |
| Faculty Engagement | `raw/faculty_engagement/` | `faculty_engagement_{year}.xlsx` | `faculty_engagement_2024.xlsx` |
| Project Details | `raw/project_details` | `project_details_{year}.xlsx` | `project_details_2024.xlsx` |
| Survey Monkey Data | `raw/survey_monkey` | `survey_monkey_{year}.xlsx` | `survey_monkey_2024.xlsx` |
| Co Curricular Reach | `raw/co_curricular_reach` | `co_curricular_reach_{year}.xlsx` |`co_curricular_reach_2024.xlsx` |

### `staging/` and `production/` folder

Files in these directories are stored in parquet format.\
**DO NOT edit/remove files from these directories, or upload files directly to them.**

| Data Type | Location | Naming Convention | Example |
| --------- | -------- | ----------------- | ------- |
| Focus Area | `/focus_area/` | `focus_area_{year}.parquet` | `focus_area_2024.parquet`|
| Faculty Options | `options/faculties/` | `options_faculty.parquet` | `options_faculty.parquet` |
| Focus Area Options | `options/focus_area` | `options_focus_area.parquet` | `options_focus_area.parquet` |
| Student Reach | `student_reach/` | `student_reach_{year}.parquet` | `student_reach_2024.parquet` |
| Unique Student | `unique_student/` | `unique_student_{year}.parquet` | `unique_student_2024.parquet` |
| Unsuccessful Projects | `unsuccessful_projects/` | `unsuccessful_projects_{year}.parquet` | `unsuccessful_projects_2024.parquet` |
| Faculty Engagement | `faculty_engagement/` | `faculty_engagement_{year}.parquet` | `faculty_engagement_2024.parquet` |
| Project Details | `project_details` | `project_details_{year}.xlsx` | `project_details_2024.parquet` |
| Co Curricular Reach | `co_curricular_reach` | `co_curricular_reach_{year}.parquet` |`co_curricular_reach_2024.parquet` |
| Similar Projects | `similar_projects/` | `similar_projects.parquet` | `similar_projects.parquet` |

## Images
Images (posters and reports) will be stored in the bucket whose name starts with `databasestack-tlefanalyticsimage`.

| Data Type | Location | Naming Convention | Example |
| --------- | -------- | ----------------- | ------- |
| Poster | `poster/` | `<grant id>-Poster.png` | `2030-TLEF-SP1-SCI-Evans-Poster.png` |
| Report | `report/` |`<project id>-Report.png` | `2030-SP-SCI-001.png` |
