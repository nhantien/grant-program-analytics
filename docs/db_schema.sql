CREATE TABLE `co_curricular_reach` (
  `funding_year` bigint,
  `grant_id` string,
  `estimated_reach` string,
  `description` string
);

CREATE TABLE `faculty_engagement` (
  `funding_year` bigint,
  `project_type` string,
  `project_id` string,
  `grant_id` string,
  `project_faculty` string,
  `member_name` string,
  `member_title` string,
  `member_stream` string,
  `member_campus` string,
  `member_faculty` string,
  `member_unit` string,
  `member_other` string
);

CREATE TABLE `student_engagement` (
  `funding_year` bigint,
  `project_type` string,
  `grant_id` string,
  `project_id` string,
  `project_faculty` string,
  `student_positions` bigint,
  `student_funding` bigint
);

CREATE TABLE `focus_area` (
  `funding_year` bigint,
  `project_type` string,
  `grant_id` string,
  `title` string,
  `pi_name` string,
  `project_faculty` string,
  `funding_amount` string,
  `funding_status` string,
  `project_id` string,
  `resource_development` boolean,
  `infrastructure_development` boolean,
  `student_engagement` boolean,
  `innovative_assessments` boolean,
  `teaching_roles_and_training` boolean,
  `curriculum` boolean,
  `student_experience` boolean,
  `work_integrated_learning` boolean,
  `indigenous_focused_curricula` boolean,
  `diversity_and_inclusion` boolean,
  `open_educational_resources` boolean
);

CREATE TABLE `faculty_options` (
  `faculty_name` string,
  `faculty_code` string
);

CREATE TABLE `student_reach` (
  `funding_year` bigint,
  `project_type` string,
  `project_id` string,
  `grant_id` string,
  `project_faculty` string,
  `course_type` string,
  `session` string,
  `term` string,
  `course_faculty` string,
  `course_name` string,
  `section` string,
  `credits` double,
  `reach` bigint,
  `fte` double
);

CREATE TABLE `project_details` (
  `funding_year` integer,
  `project_type` string,
  `grant_id` string,
  `project_id` string,
  `project_faculty` string,
  `pi_name` string,
  `pi_unit` string,
  `funding_amount` double,
  `title` string,
  `summary` string,
  `co_applicants` string,
  `generated_grant_id` string,
  `project_year` bigint,
);

CREATE TABLE `unique_student` (
  `funding_year` bigint,
  `unique_student` double,
  `funding_amount` double
);

CREATE TABLE `unsuccessful_projects` (
  `funding_year` bigint,
  `project_type` string,
  `grant_id` string,
  `title` string,
  `project_faculty` string,
  `pi_name` string,
  `project_department` string
);

CREATE TABLE `project_outcomes` (
  `project_id` string,
  `project_outcomes` string
  `project_status` string
);

CREATE TABLE `similar_projects` (
  `project_key` string,
  `similar_projects` string
);

CREATE TABLE `focus_area_options` (
  `label` string,
  `value` string
);

ALTER TABLE `faculty_engagement` ADD FOREIGN KEY (`grant_id`) REFERENCES `project_details` (`grant_id`);

ALTER TABLE `student_engagement` ADD FOREIGN KEY (`grant_id`) REFERENCES `project_details` (`grant_id`);

ALTER TABLE `focus_area` ADD FOREIGN KEY (`grant_id`) REFERENCES `project_details` (`grant_id`);

ALTER TABLE `student_reach` ADD FOREIGN KEY (`grant_id`) REFERENCES `project_details` (`grant_id`);

ALTER TABLE `co_curricular_reach` ADD FOREIGN KEY (`grant_id`) REFERENCES `project_details` (`grant_id`);

ALTER TABLE `project_details` ADD FOREIGN KEY (`project_id`) REFERENCES `project_outcomes` (`project_id`);

ALTER TABLE `project_details` ADD FOREIGN KEY (`project_id`) REFERENCES `similar_projects` (`project_key`);
