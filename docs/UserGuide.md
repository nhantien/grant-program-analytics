### Before Continuing with this User Guide, please make sure you have deployed the application.

[Deployment Guide](./DeploymentGuide.md)

Once you have deployed the solution, the following user guide will help you navigate the functions available.

| Index    | Description |
| -------- | ------- |
| [Uploading Data](#uploading-data)  | How to upload data |
| [Updating Data](#updating-data)  | How to modify the data schema |
| [Home](#home)  | Walkthrough of the Home page |
| [Staging Website](#staging)  | Navigation to the Staging website |
| [Individual Summary](#individual-summary) | Walkthrough of the Individual Summary page|
| [Snapshot](#snapshot) | Walkthrough of the Snapshot page |

## Uploading Data
Please refer to the [Uploading Data Guide](./UploadData.md)

## Updating Data
Please refer to the [Modifying Data Guide](./ModifyData.md)

## Home
This page displays a table of TLEF funded proposals with information including: 

- Funding Year - the funding year of the proposal
- Project Type - there are five types of TLEF projects: Large TLEF, Small TLEF, Flexible Learning projects, Interdisciplinary Team-Teaching Grant projects, and Universal Design for Learning projects
- Principal Investigator -  the lead in charge of the particular proposal
- Faculty - the faculty targeted by the project
- Title - title of the funded proposal
- Project Year - current duration of the project
- Amount - amount of funding received
- Status - active or completed 
- Report - project report, if it exists
- Poster - project poster, if it exists

  <img width="1192" alt="image" src="https://github.com/UBC-CIC/tlef-analytics/assets/113638422/64710d10-a01c-4e90-a0b1-8a9987fa9f90">

At the top of the page, users are able to search proposals by their title or principal investigator. The projects are also filterable by funding year, project type, faculty/college/unit, and focus area. Applied filters are displayed below the filter and search area. 

The Generate Program Summary button will take users to the [Snapshot](#snapshot) page. 

## Staging
The staging website provides a controlled environment for reviewing changes to the data before they are made public.

To navigate to staging, add `staging` to the end of the URL. For example:
`https://main.d1kbeedktpnze5.amplifyapp.com/` to `https://main.d1kbeedktpnze5.amplifyapp.com/staging`

This will direct you to the login page, where authorized users can sign in with their credentials.
<img width="517" alt="image" src="https://github.com/UBC-CIC/tlef-analytics/assets/113638422/a908a4a7-287f-4347-82dd-429d32934eb2">

Within the staging website, data that is currently in the `/staging` bucket in AWS S3 will be displayed. There are two additional features: confirming the new data changes, which will publish data to the main page, and logging out from the staging view. 

<img width="1174" alt="image" src="https://github.com/UBC-CIC/tlef-analytics/assets/113638422/37816ccf-3169-47f0-9cc3-e48128e66b41">

## Individual Summary 
The individual summary page displays further data on each TLEF funded proposal. It can be accessed by clicking on title of the proposal you're interested in within the data table on the home page. 

The page provides an overview of the selected project. It includes details such as the project's status, the faculty/college/unit involved, and its duration. The summary outlines the project's objectives and overarching information. 
Project reports can be viewed by clicking Link to Report, opening up the report as a PDF in a new window. 

<img width="1146" alt="image" src="https://github.com/UBC-CIC/tlef-analytics/assets/113638422/d9607c6b-e3b8-4039-8f8c-8300d1ae1288">

For each year of the project, there are details about the primary investigator(s), project types, funded amounts, focus areas, team members involved, and potentially the reach or impact of the projects. 

<img width="1159" alt="image" src="https://github.com/UBC-CIC/tlef-analytics/assets/113638422/f13db8dc-0725-4bf0-a042-33874b3ef08f">

If the project has posters, they are displayed under the project details for each year. If there are multiple years with posters, you can view each one by clicking on the forward and back buttons. 

<img width="1137" alt="image" src="https://github.com/UBC-CIC/tlef-analytics/assets/113638422/4b480401-74c8-4284-bc9e-7eaa26f91e5a">

Similar projects and project outcomes are displayed at the bottom. 

<img width="1080" alt="image" src="https://github.com/UBC-CIC/tlef-analytics/assets/113638422/f45c9149-ee0d-4c58-8297-e514c96d9709">
<img width="1053" alt="image" src="https://github.com/UBC-CIC/tlef-analytics/assets/113638422/25d4f1e0-01b7-414e-bf13-d27b45f476cf">

## Snapshot
The Snapshot page generates a program summary and gives statistics and visualizations of the data.
  
Users can filter by a single funding year or a range of funding years, project type, faculty/college/unit, and focus area (refer to [home](#home) for further details on the data schema).
Filters applied to the data are preserved when navigating between the Snapshot and Home pages. 

<img width="1154" alt="image" src="https://github.com/UBC-CIC/tlef-analytics/assets/113638422/a6d82725-fadd-4699-9a53-0a91c2735430">

Information displayed includes:
- Success Rate - amount of projects that received funding during selected TLEF rounds
  
  <img width="1159" alt="image" src="https://github.com/UBC-CIC/tlef-analytics/assets/113638422/fbcbf0c7-c986-4306-a25c-7b1b0a0c80ee">

- Number of Grants and Projects - the number of grants and projects funded during selected TLEF rounds
  
  <img width="1053" alt="image" src="https://github.com/UBC-CIC/tlef-analytics/assets/113638422/79a9ecad-be32-4edc-838b-adfdf9c2e863">
  
- Funding Awarded - bar chart view of funding amounts for selected projects
  
    <img width="1181" alt="image" src="https://github.com/UBC-CIC/tlef-analytics/assets/113638422/87fe9737-55e3-4a5d-99e9-c840243ab7e0">

  Users can hover over the bars or click on them in mobile to view specific data per faculty/college/unit.
  
  <img width="1176" alt="Screenshot 2024-04-16 at 1 24 11 PM" src="https://github.com/UBC-CIC/tlef-analytics/assets/113638422/4b2c01e4-8939-498e-ba81-b07a242a13e8">

- Student Reach - bar chart view of student reach for selected projects

  <img width="1180" alt="image" src="https://github.com/UBC-CIC/tlef-analytics/assets/113638422/dd4fd661-e63b-4900-81d6-d14d22a1c0f8">

  Users can hover over the bars or click on them in mobile to view specific data per faculty/college/unit.

  <img width="812" alt="Screenshot 2024-04-17 at 10 39 50 AM" src="https://github.com/UBC-CIC/tlef-analytics/assets/113638422/a060d372-a11a-4b76-b818-4f98b1795369">
  
- Faculty and Student Engagement - additional information about student and faculty engagement
  
  <img width="1171" alt="image" src="https://github.com/UBC-CIC/tlef-analytics/assets/113638422/71178ec7-aeeb-4cc6-ab38-8ebc7a997e68">



*Please note that if there are no existing projects that apply to the filters the user chose, a message will be displayed instead. 

<img width="1148" alt="image" src="https://github.com/UBC-CIC/tlef-analytics/assets/113638422/41312d7a-f53a-4c1a-bffb-77c6191b4992">

