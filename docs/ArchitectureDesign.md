# Architecture Design
This document provides a more in-depth explanation of the system's architecture and operation.

## Table of Contents
- Architecture Design
    - Table Of Contents
- Introduction
- System Overview
    - Data Preparation
    - Data Retrieval
    - Data Consumption
- AWS Infrastructure
    - Architecture Diagram

# Introduction

# System Overview
## Data Preparation

## Data Retrieval
After datasets are cleaned and stored in the appropriate location, the solution uses Amazon Athena to perform data retrieval. Amazon Athena is an interactive query service that makes it easy to analyze data directly in Amazon S3 using standard SQL. Athena utilizes the table schemas defined in AWS Glue, and query directly from datasets stored in Amazon S3.

## Data Consumption
### Website hosted by AWS Amplify