#!/usr/bin/env python

import warnings
warnings.simplefilter(action='ignore', category=FutureWarning)

import sys
import io
import boto3
from botocore.exceptions import ClientError
import pandas as pd
import numpy as np
import re
import datetime
from fuzzywuzzy import fuzz
import collections

# Glue parameters
from awsglue.utils import getResolvedOptions
args = getResolvedOptions(
    sys.argv, ["BUCKET_NAME", "RAW_DATA_S3URI", "INSTITUTION_DATA_S3URI"])
BUCKET_NAME = args["BUCKET_NAME"]
RAW_DATA_S3URI = args["RAW_DATA_S3URI"]
INSTITUTION_DATA_S3URI = args["INSTITUTION_DATA_S3URI"]

comprehend = boto3.client('comprehend', region_name='ca-central-1')


def return_df(bucket, data_key):

    data_location = 's3://{}/{}'.format(bucket, data_key)
    if data_location[-3:] == 'csv':
        df = pd.read_csv(data_location)
    else:
        df = pd.read_excel(data_location)
    
    delete_columns = []
    
    if '"Small TLEF Project Proposal" completion status' in list(df.columns):
        delete_columns.append('"Small TLEF Project Proposal" completion status')
    if '"Small TLEF Project Proposal" completion date/time' in list(df.columns):
        delete_columns.append('"Small TLEF Project Proposal" completion date/time')
    
    df = df.drop(columns=delete_columns, axis=1)
    
    if 'Project Title (200 characters max.)' in list(df.columns):
        df.dropna(subset=['Project Title (200 characters max.)'], inplace=True)
    return df
    
def write_df_to_bucket(df, bucket, key, ind=False):
    
    """
    Upload a file to s3

    Arguments:
        df: the pandas DataFrame
        bucket: the destination bucket name
        key: the key of the file to be written as on the bucket
    """
    
    # create a buffer to write csv data to
    csv_buffer = io.StringIO()
    df.to_csv(csv_buffer, index=ind)

    s3_bucket_clean = boto3.resource('s3')
    try:
        response = s3_bucket_clean.Object(bucket, key).put(Body=csv_buffer.getvalue())
    except ClientError as e:
        print(f"Error uploading file '{file_path}' to S3: {e}")

        
def process_s3uri(uri):
    
    """
    Extract the key of a file from it's full URI
    
    Arguments:
        uri: str, the uri
    Returns:
        tuple of str: the fullKey, the rootFolder, the fileName
    """
    fullKey = uri.split(f"s3://{BUCKET_NAME}/")[1]
    split = uri.split("/")
    fileName = split[-1]
    rootFolder = split[3]
    
    # get the in between part of the file key if exists
    # Split the path string into segments using '/'
    segments = fullKey.split('/')
    begin_index = segments.index(rootFolder)
    end_index = -1
    # Extract the substring between "begin" and "end"
    inbetween = '/'.join(segments[begin_index + 1:end_index])
    inbetween = inbetween + "/" if inbetween != "" else ""
        
    return rootFolder+"/", inbetween, fileName, fullKey

def empty_to_zero(df):
    return df.fillna(0)

def change_na_to_zero_or_no(df, column_name):
    
    df[column_name] = df[column_name].apply(
        lambda x: re.sub(
            r'^(No(t\sapplicable\.?|ne\.?)|n(o(t\sapplicable\.?|ne\.?)|/a\.?)|N(/[Aa]|[Aa])\.?)$', '0', str(x)
        ))
    
    df[column_name] = df[column_name].apply(
        lambda x: re.sub(
            r'.*[Nn]o.*', '0', str(x)
        ))
    
    return df

def course_info_formatting(s):
    parts = []
    current_part = ''

    # Iterate over each character in the input string.
    for char in s:
        if char.isdigit():
            # If the current part is not empty and the last character of the current part is not a digit:
            if current_part and not current_part[-1].isdigit():
                parts.append(current_part)  # Add the current part to the parts list.
                current_part = char  # Start a new current part with the current character.
            else:
                current_part += char  # If the last character of the current part is a digit, append the current character to the current part.
        else:  # If the current character is not a digit (i.e., it's a letter or other character):
            # If the current part is not empty and the last character of the current part is a digit:
            if current_part and current_part[-1].isdigit():
                parts.append(current_part)  # Add the current part to the parts list.
                current_part = char  # Start a new current part with the current character.
            else:
                current_part += char  # If the last character of the current part is not a digit, append the current character to the current part.

    # After finishing the loop, if there is any remaining part that hasn't been added to the parts list:
    if current_part:
        parts.append(current_part)  # Add the final part to the parts list.
    
    return ' '.join(parts)

def course_info_mapping(df, column_list):
    # Compile a regular expression pattern to match course codes (e.g., "CS101") and optional suffixes (e.g., "A/B/C").
    course_info_pattern = re.compile(r'([A-Z]+\d+)([A-Z/]*)')
    
    # Iterate over each column name provided in column_list.
    for column_name in column_list:
        new_column_values = []  # Initialize a list to store the new, cleaned values for the current column.
        
        # Iterate over each value in the current column by its index.
        for value_idx in range(len(list(df[column_name]))):
            
            mentioned_course = 0
            this_course_info = ''.join(str(df[column_name].iloc[value_idx]).upper().split())  # Extract and clean the current value from the column, making it uppercase and removing spaces.
            course_info = re.findall(course_info_pattern, this_course_info)  # Use the compiled regex to find all matches of the course code pattern in the cleaned string.
            
            # If at least one course code is found in the string:
            if course_info:
                course_code = course_info[0][0]  # Extract the base course code from the first match.
                suffix = course_info[0][1].strip('/')  # Extract and clean the suffix from the first match, removing any trailing slashes.
                
                # If a suffix exists after cleaning:
                if suffix:
                    # If the suffix contains slashes, indicating multiple course codes are mentioned:
                    if '/' in suffix: 
                        all_course_codes = []  # Initialize a list to hold all formatted course codes.
                        detailed_codes = suffix.split('/')  # Split the suffix at slashes to get individual codes.
                        for d_code in detailed_codes:  # Iterate over each individual code from the suffix.
                            this_course_code = course_code + d_code  # Append the individual code to the base course code.
                            all_course_codes.append(course_info_formatting(this_course_code))  # Format and add the full course code to the list.
                        new_column_values.append(all_course_codes)  # Add the list of formatted course codes to the new column values.
                        continue  # Skip to the next value in the column, as processing for this value is complete.
                    
                    else:
                        # If there's a suffix without slashes, append it directly to the base course code.
                        course_code += suffix  
                
                # Format the complete course code (with or without suffix).
                course_code = course_info_formatting(course_code)
                new_column_values.append([course_code])  # Add the formatted course code to the new column values as a list containing a single element.
                
            else:
                # If no course code is found, append 0 to the new column values.
                new_column_values.append(0)

        df['cleaned_'+column_name] = new_column_values
    
    return df

def fill_in_years(mentioned_years):
    mentioned_years = [int(year) for year in mentioned_years]
    
    min_year = min(mentioned_years)
    max_year = max(mentioned_years)
    
    elapsed_years = list(set([str(i) for i in range(min_year, max_year + 1)]))
    return elapsed_years
    
def check_string_for_20(s):

    # Check if '2020' is a standalone year in the string
    if '2020' in s:
        return s.replace('20', ''), True

    # Find all occurrences of '20' in the string
    index = 0
    while index < len(s):
        index = s.find('20', index)
        if index == -1:
            break

        # Check if '20' is part of a 21st century year e.g., "2023", "2024-2025"
        if (index > 0 and s[index - 1].isdigit() and s[index + 2:index + 4].isdigit()):
            # Move past this occurrence
            index += 2
            continue

        # Check if '20' is after a '-' or standalone e.g., "20" or "2019-20" AND there is nothing after "20" or it's not a number
        if (index == 0 or s[index - 1] == '-') and (index + 2 >= len(s) or not s[index + 2].isdigit()):
            return s.replace('20', ''), True

        # Move to the next character to continue the search
        index += 1

    # If none of the conditions are met, return False
    return s.replace('20', ''), False

def remove_except_numbers_dash_and_onward_no_space(s):
    result = ""
    i = 0

    # Iterate over each character in the string
    while i < len(s):
        if s[i].isdigit() or s[i] == '-' or s[i] == '/' or s[i] == '&':
            result += s[i]
        elif s[i:i+6].lower() == 'onward':
            result += 'onward'
            i += 5  # Skip the length of 'onward' minus one
        elif s[i:i+4].lower() == 'and':
            result += 'and'
            i += 3  # Skip the length of 'and' minus one 
        i += 1

    return result

def remove_numeric_after_slash(s):
    result = ""
    i = 0
    while i < len(s):
        # If the current character is '/' and the next character is a digit
        if s[i] == '/' and i + 1 < len(s) and s[i + 1].isdigit():
            # Skip the '/' and the following numeric characters
            i += 1
            while i < len(s) and s[i].isdigit():
                i += 1
        else:
            # Add the current character to the result and move to the next character
            result += s[i]
            i += 1
    return result

def process_colon(s):
    # Only extracting year data if the input was '2024-05-01 00:00:00'
    if ':' in s:
        return s[:4]
    else:
        return s

def term_mapping(df, column_list):
    terms = ['sep', 'jan', 'may', 'jul']
    for column_name in column_list:
        
        for value_idx in range(len(list(df[column_name]))):
            mentioned_terms = []
            
            for term in terms:
                if term in str(df[column_name].iloc[value_idx]).lower():
                    mentioned_terms.append(term)

            if mentioned_terms:
                df[column_name].iloc[value_idx] = ','.join(mentioned_terms)
            else:
                df[column_name].iloc[value_idx] = 0
            
    return df

def year_mapping(df, column_list, year_start=0, upto_future_year=5):
    today = datetime.date.today()
    this_year = int(str(today.year)[-2:]) + upto_future_year # Up to 'upto_future_year' years into the future
    years = [str(j) if j>=10 else '0'+str(j) for j in range(year_start, this_year)]
    
    for column_name in column_list:
        new_column_values = []
        
        for value_idx in range(len(list(df[column_name]))):
            
            mentioned_years = []
            
            this_year_data = str(df[column_name].iloc[value_idx])
            if this_year_data == '20245/2025': # Exception
                new_column_values.append(0)
                continue
            this_year_data = process_colon(this_year_data)
            this_year_data = remove_except_numbers_dash_and_onward_no_space(this_year_data)
            this_year_data = remove_numeric_after_slash(this_year_data)
            this_year_data, is_2020 = check_string_for_20(this_year_data)
            
            if is_2020:
                mentioned_years.append('2020')

            for year in years:
                if str(year) in this_year_data:
                    mentioned_years.append('20'+str(year))
                
                    if "onward" in this_year_data:
                        today = datetime.date.today()
                        this_year = int(str(today.year)[-2:])
                        for elapsed_year in range(int(year)+1, this_year):
                            mentioned_years.append('20'+str(year))

            if mentioned_years:
                mentioned_years = list(set(mentioned_years))
                
                if '-' in this_year_data:
                    mentioned_years = fill_in_years(mentioned_years)
                mentioned_years.sort()
                new_column_values.append(mentioned_years)

            else:
                new_column_values.append(0)
                
        df['cleaned_'+column_name] = new_column_values
            
    return df

def get_faculty(input_text):
    
    faculty_list = [
    "Faculty of Applied Science",
    "Faculty of Arts",
    "Faculty of Dentistry",
    "Faculty of Education",
    "First Nations House of Learning",
    "Faculty of Forestry",
    "Faculty of Graduate & Postdoctoral Studies",
    "Faculty of Graduate and Postdoctoral Studies",
    "Faculty of Land & Food Systems",
    "Faculty of Land and Food Systems",
    "Allard School of Law",
    "Faculty of Medicine",
    "Faculty of Pharmaceutical Sciences",
    "Sauder School of Business",
    "Faculty of Science",
    "UBC Health",
    "UBC Library",
    "Vantage College",
    "VP Academic",
    "VP Students"
        ]
    
    mentioned_faculties = {}
    sorted_mentioned_faculties = []
    
    for faculty in faculty_list:
        this_mentioned = []
        start = 0
        while True:
            index = input_text.lower().find(faculty.lower(), start)
            if index == -1:
                break
            this_mentioned.append(index)
            start = index+1
            
        if this_mentioned:
            for idx in this_mentioned:
                mentioned_faculties[idx] = faculty
                
    ordered_faculties = collections.OrderedDict(sorted(mentioned_faculties.items()))
    return ordered_faculties

def ner_mapping(df, column, bucket, data_key, faculty_code_dict):
    
    df_institution_data = return_df(
        bucket=bucket,
        data_key=data_key
    )
    
    full_name_list = list(df_institution_data['PREFERRED_FULL_NAME'])
    department_list = list(df_institution_data['PRIMARY_DEPARTMENT_AFFILIATION'])
    faculty_list = list(df_institution_data['PRIMARY_FACULTY_AFFILIATION'])
    rank_list = list(df_institution_data['PRIMARY_ACADEMIC_RANK'])
    emails_list = list(df_institution_data['EMAIL_ADDRESS'])
    campus_list = list(df_institution_data['PRIMARY_CAMPUS_LOCATION'])
    
    source_data = df[column]
    destination_data = []
    
    for this_free_text_idx in range(len(source_data)):
        this_free_text = source_data.iloc[this_free_text_idx]
        if isinstance(this_free_text, str):
            associated_entities = retrieve_member_info(this_free_text)
            cleaned_associated_entities = add_institution_info(
                associated_entities,
                full_name_list,
                department_list,
                faculty_list,
                rank_list,
                emails_list,
                campus_list,
                faculty_code_dict
            )
            destination_data.append(cleaned_associated_entities)
        else:
            destination_data.append(this_free_text)
    df['cleaned_Team Members'] = destination_data
    return df

def retrieve_member_info(input_text):
    detected_entities = comprehend.detect_entities(Text=input_text, LanguageCode='en')['Entities']
    mentioned_faculties = get_faculty(input_text)
    faculties_idx = list(mentioned_faculties.keys())
    
    names_dict = {}
    names = []
    remaining_names = []
    
    emails = []
    emails_idx = []
    remaining_emails = []
    
    for entity in detected_entities:
        if entity['Type'] == 'PERSON':
            if ' ' in entity['Text'] and not ('President' in entity['Text'] or 'Dean' in entity['Text']):
                names_dict[entity['BeginOffset']] = entity['Text']
            
        elif entity['Type'] == 'OTHER':
            if '@' in entity['Text']:
                emails.append(entity['Text'])
                emails_idx.append(entity['BeginOffset'])
    
    names = list(names_dict.values())
    remaining_names = names.copy()
    remaining_emails = emails.copy()
    
    associated_entities = {}
    
    if len(names) == len(emails):
        for i in range(len(names)):
            associated_entities[names[i]] = {}
            associated_entities[names[i]]['Team Member Email'] = emails[i]
            remaining_names = []
            remaining_emails = []
            
    elif len(emails) < len(names):
        for i in range(len(emails)):
            remove_name = ""
            remove_email = ""
            
            this_fuzz_seq = {}
            this_fuzz_seq[0] = "blank" 
            for name in names:
                this_fuzz_ratio = fuzz.ratio(emails[i].split('@')[0].lower(), name.lower())
                if this_fuzz_ratio > list(this_fuzz_seq.keys())[0]:
                    del this_fuzz_seq[list(this_fuzz_seq.keys())[0]]
                    this_fuzz_seq[int(fuzz.ratio(emails[i].split('@')[0].lower(), name.lower()))] = name
                    
            associated_entities[this_fuzz_seq[list(this_fuzz_seq.keys())[0]]] = {} 
            associated_entities[this_fuzz_seq[list(this_fuzz_seq.keys())[0]]]['Team Member Email'] = emails[i]
            remove_name = str(this_fuzz_seq[list(this_fuzz_seq.keys())[0]])
            remove_email = emails[i]
            
            if remove_name in remaining_names:
                remaining_names.remove(remove_name)
            
            if remove_email in remaining_emails:
                remaining_emails.remove(remove_email)

        if remaining_names:
            for r_name in remaining_names:
                associated_entities[r_name] = {}
                associated_entities[r_name]['Team Member Email'] = ""
                
    elif len(names) < len(emails):
        for i in range(len(names)):
            remove_name = ""
            remove_email = ""
            
            this_fuzz_seq = {}
            this_fuzz_seq[0] = "blank" 
            for email in emails:
                this_fuzz_ratio = fuzz.ratio(email.split('@')[0].lower(), names[i].lower())
                if this_fuzz_ratio > list(this_fuzz_seq.keys())[0]:
                    del this_fuzz_seq[list(this_fuzz_seq.keys())[0]]
                    this_fuzz_seq[
                        int(fuzz.ratio(email.split('@')[0].lower(), names[i].lower()))] = names[i]
                    
            associated_entities[this_fuzz_seq[list(this_fuzz_seq.keys())[0]]] = {}
            associated_entities[this_fuzz_seq[list(this_fuzz_seq.keys())[0]]]['Team Member Email'] = email
            remove_name = str(this_fuzz_seq[list(this_fuzz_seq.keys())[0]])
            remove_email = email
            
            if remove_name in remaining_names:
                remaining_names.remove(remove_name)
            
            if remove_email in remaining_emails:
                remaining_emails.remove(remove_email)
    
    # Finally, update the faculty info
    for n_idx in names_dict.keys():
        higher_f_idx = [f_idx for f_idx in faculties_idx if f_idx > n_idx]
        if higher_f_idx:
            this_key = names_dict[n_idx]
            associated_entities[this_key]['Team Member Faculty'] = mentioned_faculties[min(higher_f_idx)]
            
    return associated_entities

def add_institution_info(
    associated_entities, 
    full_name_list, 
    department_list, 
    faculty_list, 
    rank_list, 
    emails_list, 
    campus_list,
    faculty_code_dict
):
    
    cleaned_associated_entities = {}
    
    for extracted_full_name in associated_entities.keys():
        
        selected_name = ""
        selected_rank = ""
        selected_department = ""
        selected_campus = ""
        selected_faculty = None
        
        match_score = 0
        for i in range(len(full_name_list)):
            this_fuzz_ratio = fuzz.ratio(extracted_full_name.lower(), full_name_list[i].lower())
            if this_fuzz_ratio > 50 and this_fuzz_ratio > match_score:
                if 'Team Member Email' in list(associated_entities[extracted_full_name].keys()):
                    if associated_entities[extracted_full_name]['Team Member Email'].split('@')[0].lower() == str(emails_list[i]).split('@')[0].lower():
                        
                        selected_name = full_name_list[i]
                        selected_rank = rank_list[i]
                        selected_department = department_list[i]
                        
                        if 'UBC Vancouver' in campus_list[i]:
                            selected_campus = "UBCV"
                        elif 'UBC Okanagan' in campus_list[i]:
                            selected_campus = "UBCO"
                        else:
                            selected_campus = "External"
                
                        if not 'Faculty' in list(associated_entities[extracted_full_name].keys()):
                            selected_faculty = faculty_list[i]
        
        if not selected_name == "":
            cleaned_associated_entities[selected_name] = {}
            cleaned_associated_entities[selected_name] = associated_entities[extracted_full_name]
            cleaned_associated_entities[selected_name]['Team Member Department'] = selected_department
            cleaned_associated_entities[selected_name]['Team Member Title'] = selected_rank
            cleaned_associated_entities[selected_name]['Campus'] = selected_campus
            
            if selected_faculty:
                if selected_faculty in list(faculty_code_dict.keys()):
                    cleaned_associated_entities[selected_name]['Team Member Faculty'] = faculty_code_dict[selected_faculty]
                else:
                     cleaned_associated_entities[selected_name]['Team Member Faculty'] = 'NA'
            
        else:
            cleaned_associated_entities[extracted_full_name] = associated_entities[extracted_full_name]
            if 'Team Member Faculty' in list(cleaned_associated_entities[extracted_full_name].keys()):
                if cleaned_associated_entities[extracted_full_name]['Team Member Faculty'] in list(faculty_code_dict.keys()):
                    cleaned_associated_entities[extracted_full_name]['Team Member Faculty'] = faculty_code_dict[cleaned_associated_entities[extracted_full_name]['Team Member Faculty']]
    return cleaned_associated_entities

def assign_faculty_code(df, faculty_code_dict, col_name="Project Faculty"):
    new_project_faculty = []
    project_faculty = list(df[col_name])
    
    for proj_fac in project_faculty:
        if proj_fac in list(faculty_code_dict.keys()):
            new_project_faculty.append(faculty_code_dict[proj_fac])
        else:
            new_project_faculty.append(proj_fac)
            
    df[col_name] = new_project_faculty
    
    return df

def add_project_type_col(df):
    project_types = None
    
    if 'Application Title' in list(df.columns):
        application_titles = list(df['Application Title'])
        project_types = []
        project_types = ['Small' if 'SP' in application_titles[i] else 'Large' for i in range(len(application_titles))]
    
    if project_types:
        df['Project Type'] = project_types
        
    return df

def add_funding_year_col(df):
    funding_years = None
    
    if 'Application Title' in list(df.columns):
        application_titles = list(df['Application Title'])
        funding_years = []
        funding_years = [application_titles[i].split('-')[0] for i in range(len(application_titles))]
    
    if funding_years:
        df['Funding Year'] = funding_years
        
    return df

def remove_text_inside_brackets(text):
    # Regular expression to match text inside round brackets including the brackets
    pattern = r'\(.*?\)\s*'
    # Replace the matched text with an empty string
    cleaned_text = re.sub(pattern, '', text)
    return cleaned_text.strip()

def focus_areas_list_change(df):
    new_focus_areas = None
    if 'Project Focus Areas' in list(df.columns):
        new_focus_areas = []
        new_focus_areas = [remove_text_inside_brackets(
            focus_text).split(
            ',') for focus_text in list(
            df['Project Focus Areas']
        )]

    if new_focus_areas:
        df['Project Focus Areas'] = new_focus_areas
        
    return df

def rename_columns(df):
    new_col_names = {}
    
    new_col_names['Project Title (200 characters max.)'] = 'Project Title'
    new_col_names['What project year does this proposal pertain to?'] = 'Project Year'
    new_col_names['Principal Applicant | Principal Applicant’s name:'] = 'PI'
    new_col_names['Principal Applicant | Principal Applicant’s title(s) (e.g. Assistant Professor, Lecturer, Professor of Teaching, etc.):'] = 'PI Title'
    new_col_names['Principal Applicant | Principal Applicant’s primary (UBC) email address:'] = 'PI Email'
    new_col_names['Principal Applicant | Principal Applicant’s role:'] = 'PI Role'
    new_col_names['Principal Applicant | Principal Applicant’s Faculty, College, or administrative unit:'] = 'Project Faculty'
    new_col_names['Principal Applicant | Principal Applicant’s Department, School, or unit:'] = 'Department'
    new_col_names['Special Classroom or Facilities Requirements (150 words max.)'] = 'Special Classroom or Facilities Requirements'
    new_col_names['Co-Applicants &amp; Project Team Members (500 words max.)'] = 'Team Members'
    
    for col in list(df.columns):
        if 'Students Reached by the Project |  | Academic Year' in col:
            new_col_names[col] = col.replace('Students Reached by the Project |  | Academic Year', 'project_academic_year')
            
        if 'Students Reached by the Project |  | Course Code' in col:
            new_col_names[col] = col.replace('Students Reached by the Project |  | Course Code', 'project_course_code')
            
        if 'Students Reached by the Project |  | Term (Sep/Jan/May)' in col:
            new_col_names[col] = col.replace('Students Reached by the Project |  | Term (Sep/Jan/May)', 'project_term')
            
        if 'Students Reached by the Project |  | Term (Sep/Jan/May)' in col:
            new_col_names[col] = col.replace('Students Reached by the Project |  | Term (Sep/Jan/May)', 'project_term')
    
    df = df.rename(columns=new_col_names)
    
    return df

def generate_faculty_engagement_csv(df, ner_col_name='cleaned_Team Members'):
    
    funding_year = []
    project_type = []
    application_title = []
    project_faculty = []
    team_member_name = []
    team_member_title = []
    team_member_stream = []
    campus = []
    team_member_faculty = []
    team_member_department = []
    team_member_email = []
    
    
    for proj_idx in range(len(df)):
        this_member_info = df[ner_col_name].iloc[proj_idx]
        if not isinstance(this_member_info, int):
            for this_team_member_name in list(this_member_info.keys()):

                funding_year.append(df['Funding Year'].iloc[proj_idx])
                project_type.append(df['Project Type'].iloc[proj_idx])
                application_title.append(df['Application Title'].iloc[proj_idx])
                project_faculty.append(df['Project Faculty'].iloc[proj_idx])

                team_member_name.append(this_team_member_name)

                if 'Team Member Title' in list(this_member_info[this_team_member_name].keys()):
                    team_member_title.append(this_member_info[this_team_member_name]['Team Member Title'])
                else:
                    team_member_title.append(0)

                if 'Team Member Stream' in list(this_member_info[this_team_member_name].keys()):
                    team_member_stream.append(this_member_info[this_team_member_name]['Team Member Stream'])
                else:
                    team_member_stream.append(0)

                if 'Campus' in list(this_member_info[this_team_member_name].keys()):
                    campus.append(this_member_info[this_team_member_name]['Campus'])
                else:
                    campus.append(0)

                if 'Team Member Faculty' in list(this_member_info[this_team_member_name].keys()):
                    team_member_faculty.append(this_member_info[this_team_member_name]['Team Member Faculty'])
                else:
                    team_member_faculty.append(0)

                if 'Team Member Department' in list(this_member_info[this_team_member_name].keys()):
                    team_member_department.append(this_member_info[this_team_member_name]['Team Member Department'])
                else:
                    team_member_department.append(0)

                if 'Team Member Email' in list(this_member_info[this_team_member_name].keys()):
                    team_member_email.append(this_member_info[this_team_member_name]['Team Member Email'])
                else:
                    team_member_email.append(0)
                
    faculty_engagement_df = pd.DataFrame(
    {'Funding Year': funding_year,
     'Project Type': project_type,
     'Application Title': application_title,
     'Project Faculty': project_faculty,
     'Team Member Name': team_member_name,
     'Team Member Title': team_member_title,
     'Team Member Stream': team_member_stream,
     'Campus': campus,
     'Team Member Faculty': team_member_faculty,
     'Team Member Department': team_member_department,
     'Team Member Email': team_member_email
    })
    
    return faculty_engagement_df

def tlef_raw_data_preprocessing(bucket, raw_data_key, institution_data_key):
    
    faculty_code_dict = {
    "Faculty of Applied Science": "APSC",
    "Faculty of Arts": "ARTS",
    "Faculty of Dentistry": "DENT",
    "Faculty of Education": "EDUC",
    "First Nations House of Learning": "ARTS",
    "Faculty of Forestry": "FRST",
    "Faculty of Graduate & Postdoctoral Studies": "GRAD",
    "Faculty of Graduate and Postdoctoral Studies": "GRAD",
    "Faculty of Land & Food Systems": "LFS",
    "Faculty of Land and Food Systems": "LFS",
    "Allard School of Law": "LAW",
    "Faculty of Medicine": "MED",
    "Faculty of Pharmaceutical Sciences": "PHAR",
    "Sauder School of Business": "COMM",
    "Faculty of Science": "SCI",
    "UBC Health": "HLTH",
    "UBC Library": "LIBR",
    "Vantage College": "VANT",
    "VP Academic": "VPA",
    "VP Students": "VPS"
    }
    
    df = return_df(
        bucket=bucket,
        data_key=raw_data_key
    )
    
    print("1. Transforming empty values to 0...")
    df = empty_to_zero(df)
    
    print("\n\n2. Transforming irrelevant values to 0...")
    df = change_na_to_zero_or_no(df, 'Special Classroom or Facilities Requirements (150 words max.)')
    
    course_code_columns_list = [f'Students Reached by the Project |  | Course Code{f".{i}" if i > 0 else ""}' for i in range(10)]
    print("\n\n3. Mapping course codes...")
    df = course_info_mapping(df, course_code_columns_list)
    
    years_columns_list = [f'Students Reached by the Project |  | Academic Year{f".{i}" if i > 0 else ""}' for i in range(10)]
    print("\n\n4. Mapping years...")
    df = year_mapping(df, years_columns_list)
    
    terms_columns_list = [f'Students Reached by the Project |  | Term (Sep/Jan/May){f".{i}" if i > 0 else ""}' for i in range(10)]
    print("\n\n5. Mapping terms...")
    df = term_mapping(df, terms_columns_list)
    
    ner_column = 'Co-Applicants &amp; Project Team Members (500 words max.)'
    
    print("\n\n6. Extracting name-entity relationships...")
    df = ner_mapping(df, ner_column, bucket, institution_data_key, faculty_code_dict)
    
    print("\n\n7. Adding a 'Project Type' column that contains info on if the project was Large or Small...")
    df = add_project_type_col(df)
    
    print("\n\n8. Adding a 'Funding Year' column that contains info on what year did the project receive funding...")
    df = add_funding_year_col(df)
    
    print("\n\n9. Converted the Focus Areas column data into a list where each element is the focus area relevant to that project...")
    df = focus_areas_list_change(df)
    
    print("\n\n10. Rename columns...")
    df = rename_columns(df)
    
    print("\n\n11. Change full faculty name to its faculty code...")
    df = assign_faculty_code(df, faculty_code_dict, col_name="Project Faculty")
    
    print("\n\n11. Generate faculty engagement csv dataset...")
    faculty_engagement_df = generate_faculty_engagement_csv(df)
    
    print("Process completed!")
    
    return df, faculty_engagement_df

def main():
    
    _, rawInBW, _, rawDatKey = process_s3uri(RAW_DATA_S3URI)
    instDatKey = process_s3uri(INSTITUTION_DATA_S3URI)[3]
    
    try:
        clean_df, faculty_engagement_df = tlef_raw_data_preprocessing(
            bucket=BUCKET_NAME,
            raw_data_key = rawDatKey,
            institution_data_key = instDatKey
        )
        
        cleanSM_name = f'staging-data/{rawInBW}Clean_Survey_Monkey.csv'
        cleanFE_name = f'staging-data/{rawInBW}Faculty_Engagement.csv'
        write_df_to_bucket(clean_df, BUCKET_NAME, cleanSM_name)
        write_df_to_bucket(faculty_engagement_df, BUCKET_NAME, cleanFE_name)
        
        print("Data processing finished execution")
        print(f"The clean files are {cleanSM_name} and {cleanFE_name}")

    except Exception as e:
        # Handle any unexpected errors
        print(f"An error occurred: {e}")
        print("Script stop executing. No file will be written to S3")


if __name__ == "__main__":
    main()







