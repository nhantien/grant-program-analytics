import * as glue from '@aws-cdk/aws-glue-alpha';

const PROJECT_DETAILS_SCHEMA = [
    {
        name: 'funding_year',
        type: glue.Schema.BIG_INT
    },
    {
        name: 'project_type',
        type: glue.Schema.STRING
    },
    {
        name: 'old_grant_id',
        type: glue.Schema.STRING
    },
    {
        name: 'project_id',
        type: glue.Schema.STRING
    },
    {
        name: 'project_faculty',
        type: glue.Schema.STRING
    },
    {
        name: 'pi_name',
        type: glue.Schema.STRING
    },
    {
        name: 'pi_unit',
        type: glue.Schema.STRING
    },
    {
        name: 'funding_amount',
        type: glue.Schema.DOUBLE
    },
    {
        name: 'title',
        type: glue.Schema.STRING
    },
    {
        name: 'summary',
        type: glue.Schema.STRING
    },
    {
        name: 'co_applicants',
        type: glue.Schema.STRING
    },
    {
        name: 'grant_id',
        type: glue.Schema.STRING
    },
    {
        name: 'project_year',
        type: glue.Schema.BIG_INT
    },
    {
        name: 'project_status',
        type: glue.Schema.STRING
    }
];

const FACULTY_ENGAGEMENT_SCHEMA = [
    {
        name: 'funding_year',
        type: glue.Schema.BIG_INT
    },
    {
        name: 'project_type',
        type: glue.Schema.STRING
    },
    {
        name: 'project_id',
        type: glue.Schema.STRING
    },
    {
        name: 'grant_id',
        type: glue.Schema.STRING
    },
    {
        name: 'project_faculty',
        type: glue.Schema.STRING
    },
    {
        name: 'member_name',
        type: glue.Schema.STRING
    },
    {
        name: 'member_title',
        type: glue.Schema.STRING
    },
    {
        name: 'member_stream',
        type: glue.Schema.STRING
    },
    {
        name: 'member_campus',
        type: glue.Schema.STRING
    },
    {
        name: 'member_faculty',
        type: glue.Schema.STRING
    },
    {
        name: 'member_unit',
        type: glue.Schema.STRING
    },
    {
        name: 'member_other',
        type: glue.Schema.STRING
    }
];

const STUDENT_REACH_SCHEMA = [
    {
        name: 'funding_year',
        type: glue.Schema.BIG_INT
    },
    {
        name: 'project_type',
        type: glue.Schema.STRING
    },
    {
        name: 'project_id',
        type: glue.Schema.STRING
    },
    {
        name: 'grant_id',
        type: glue.Schema.STRING
    },
    {
        name: 'project_faculty',
        type: glue.Schema.STRING
    },
    {
        name: 'course_type',
        type: glue.Schema.STRING
    },
    {
        name: 'session',
        type: glue.Schema.STRING
    },
    {
        name: 'term',
        type: glue.Schema.STRING
    },
    {
        name: 'course_faculty',
        type: glue.Schema.STRING
    },
    {
        name: 'course_name',
        type: glue.Schema.STRING
    },
    {
        name: 'section',
        type: glue.Schema.STRING
    },
    {
        name: 'credits',
        type: glue.Schema.DOUBLE
    },
    {
        name: 'reach',
        type: glue.Schema.BIG_INT
    },
    {
        name: 'fte',
        type: glue.Schema.DOUBLE
    }
];

const FOCUS_AREA_SCHEMA = [
    {
        name: 'funding_year',
        type: glue.Schema.BIG_INT
    },
    {
        name: 'project_type',
        type: glue.Schema.STRING
    },
    {
        name: 'grant_id',
        type: glue.Schema.STRING
    },
    {
        name: 'title',
        type: glue.Schema.STRING
    },
    {
        name: 'pi_name',
        type: glue.Schema.STRING
    },
    {
        name: 'project_faculty',
        type: glue.Schema.STRING
    },
    {
        name: 'funding_amount',
        type: glue.Schema.STRING
    },
    {
        name: 'funding_status',
        type: glue.Schema.STRING
    },
    {
        name: 'project_id',
        type: glue.Schema.STRING
    },
    {
        name: 'resource_development',
        type: glue.Schema.BOOLEAN
    },
    {
        name: 'infrastructure_development',
        type: glue.Schema.BOOLEAN
    },
    {
        name: 'student_engagement',
        type: glue.Schema.BOOLEAN
    },
    {
        name: 'innovative_assessments',
        type: glue.Schema.BOOLEAN
    },
    {
        name: 'teaching_roles_and_training',
        type: glue.Schema.BOOLEAN
    },
    {
        name: 'curriculum',
        type: glue.Schema.BOOLEAN
    },
    {
        name: 'student_experience',
        type: glue.Schema.BOOLEAN
    },
    {
        name: 'work_integrated_learning',
        type: glue.Schema.BOOLEAN
    },
    {
        name: 'indigenous_focused_curricula',
        type: glue.Schema.BOOLEAN
    },
    {
        name: 'diversity_and_inclusion',
        type: glue.Schema.BOOLEAN
    },
    {
        name: 'open_educational_resources',
        type: glue.Schema.BOOLEAN
    }
];

const CO_CURRICULAR_REACH_SCHEMA = [
    {
        name: 'funding_year',
        type: glue.Schema.BIG_INT
    },
    {
        name: 'grant_id',
        type: glue.Schema.STRING
    },
    {
        name: 'estimated_reach',
        type: glue.Schema.STRING
    },
    {
        name: 'description',
        type: glue.Schema.STRING
    }
];

const UNIQUE_STUDENT_SCHEMA = [
    {
        name: 'funding_year',
        type: glue.Schema.BIG_INT
    },
    {
        name: 'unique_student',
        type: glue.Schema.DOUBLE
    },
    {
        name: 'funding_amount',
        type: glue.Schema.DOUBLE
    }
];

const FACULTY_OPTIONS_SCHEMA = [
    {
        name: 'faculty_name',
        type: glue.Schema.STRING
    },
    {
        name: 'faculty_code',
        type: glue.Schema.STRING
    }
];

const FOCUS_AREA_OPTIONS_SCHEMA = [
    {
        name: 'label',
        type: glue.Schema.STRING
    },
    {
        name: 'value',
        type: glue.Schema.STRING
    }
];

const UNSUCCESSFUL_PROJECTS_SCHEMA = [
    {
        name: 'funding_year',
        type: glue.Schema.BIG_INT
    },
    {
        name: 'project_type',
        type: glue.Schema.STRING
    },
    {
        name: 'grant_id',
        type: glue.Schema.STRING
    },
    {
        name: 'title',
        type: glue.Schema.STRING
    },
    {
        name: 'project_faculty',
        type: glue.Schema.STRING
    },
    {
        name: 'pi_name',
        type: glue.Schema.STRING
    },
    {
        name: 'project_department',
        type: glue.Schema.STRING
    }
];

const SIMILAR_PROJECTS_SCHEMA = [
    {
        name: 'project_key',
        type: glue.Schema.STRING
    },
    {
        name: 'similar_projects',
        type: glue.Schema.STRING
    }
];

const PROJECT_OUTCOMES_SCHEMA = [
    {
        name: 'project_id',
        type: glue.Schema.STRING
    },
    {
        name: 'project_outcomes',
        type: glue.Schema.STRING
    }
];

export {
    PROJECT_DETAILS_SCHEMA,
    FACULTY_ENGAGEMENT_SCHEMA,
    STUDENT_REACH_SCHEMA,
    FOCUS_AREA_SCHEMA,
    CO_CURRICULAR_REACH_SCHEMA,
    UNIQUE_STUDENT_SCHEMA,
    FACULTY_OPTIONS_SCHEMA,
    FOCUS_AREA_OPTIONS_SCHEMA,
    UNSUCCESSFUL_PROJECTS_SCHEMA,
    SIMILAR_PROJECTS_SCHEMA,
    PROJECT_OUTCOMES_SCHEMA
}