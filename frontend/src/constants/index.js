class Project {
    id;
    funding_year;
    project_type;
    pi_name;
    project_faculty;
    title;
    project_year;
    funding_amount;
    status;
    report;
    poster;

    constructor(id, fundingYear, type, investigator, faculty, title, projectYear, amount, status, report, poster) {
        this.id = id;
        this.funding_year = fundingYear;
        this.project_type = type;
        this.pi_name = investigator;
        this.project_faculty = faculty;
        this.title = title;
        this.project_year = projectYear;
        this.funding_amount = amount;
        this.status = status;
        this.report = report;
        this.poster = poster;
    };
};

const PROJECT_TYPE = {
    "Large": "Large TLEF",
    "Small": "Small TLEF",
    "Flexible Learning": "Flexible Learning",
    "Interdisciplinary Team-Teaching Grant": "Interdisciplinary Team-Teaching Grant",
    "Universal Design for Learning": "Universal Design for Learning"
};

const PROJECTS_PER_PAGE = [10, 20, 30, 40, 50];

const CURRENT_YEAR = new Date().getFullYear();

const MARKS = [
    {
        value: 1999,
        label: "1999",
    },
    {
        value: CURRENT_YEAR,
        label: CURRENT_YEAR.toString(),
    }
]

export { 
    Project,
    PROJECT_TYPE,
    PROJECTS_PER_PAGE,
    CURRENT_YEAR,
    MARKS
}