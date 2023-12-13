class Project {
    id;
    fundingYear;
    type;
    investigator;
    faculty;
    title;
    projectYear;
    amount;
    status;
    report;
    poster;
    isSelected;

    constructor(id, fundingYear, type, investigator, faculty, title, projectYear, amount, status) {
        this.id = id;
        this.fundingYear = fundingYear;
        this.type = type;
        this.investigator = investigator;
        this.faculty = faculty;
        this.title = title;
        this.projectYear = projectYear;
        this.amount = amount;
        this.status = status;
        this.report = "#";
        this.poster = "#";
        this.isSelected = false;
    };
};

const YEARS = [
    "2023/2024", "2022/2023", "2021/2022", "2020/2021", "2019/2020", "2018/2019", "2017/2018", "2016/2017", "2015/2016", "2014/2015", "2013/2014",
    "2012/2013", "2011/2012", "2010/2011", "2009/2010", "2008/2009", "2007/2008", "2006/2007", "2005/2006", "2004/2005", "2003/2004", "2002/2003",
    "2001/2002", "2000/2001", "1999/2000"
];

const PROJECT_TYPE = [
    "Large TLEF", "Small TLEF"
];

const FACULTY = [
    "Applied Science", "Arts", "Dentistry", "Education", "First Nations House of Learning", "Forestry", "Graduate Studies", 
    "Land & Food Systems", "Allard School of Law", "Medicine", "Pharmaceutical Sciences", "Sauder School of Business", "Science",
    "UBC Health", "UBC Library", "Vantage College", "VP Academic", "VP Students", "Other..."
];

const SAMPLE_TEAM_MEMBERS = {  
    "Elmo, Davide.": "Associate Professor of Teaching, EOAS, Faculty of Science",
    "Allen, Susan.": "Professor, EOAS, Faculty of Science",
    "Austin, Phil.": "Associate Professor, EOAS, Faculty of Science",
    "Beckie, Roger.": "Professor, EOAS, Faculty of Science",
    "Bostock, Michael.": "Professor, EOAS, Faculty of Science",
    "Haber, Eldad.": "Professor, EOAS, Faculty of Science",
    "Jellinek, Mark.": "Professor, EOAS, Faculty of Science",
};

const SAMPLE_STUDENT_REACH = [
    "CPSC 100: Some Course Name", "XXXX 200: Some Course Name", "XXXX 300: Some Course Name", "XXXX 000: Some Course Name", "XXXX 000: Some Course Name",
    "XXXX 000: Some Course Name", "XXXX 000: Some Course Name", "ENVN 100: Some Course Name", "XXXX 200: Some Course Name", "XXXX 300: Some Course Name",
    "XXXX 000: Some Course Name", "XXXX 000: Some Course Name", "XXXX 000: Some Course Name", "XXXX 000: Some Course Name"
];

// const SAMPLE_SIMILAR_PROJECTS = {
//     "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Jane Doe. 2020.": "Resource sustainability, Community health; Course 2, Course 5, Course 6; Resource Development, Infrastructure Development; Davide Elmo, Anne...",
//     "Maecenas ac pretium nunc, non faucibus nisl. Benjamin Apple. 2018.": "Resource sustainability, Community health; Course 2, Course 5, Course 6; Resource Development, Infrastructure Development; Davide Elmo, Anne...",
//     "Integer quis mollis mi. Jim Doe. 2015.": "Resource sustainability, Community health; Course 2, Course 5, Course 6; Resource Development, Infrastructure Development; Davide Elmo, Anne...",
//     "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Jane Doe. 2021.": "Resource sustainability, Community health; Course 2, Course 5, Course 6; Resource Development, Infrastructure Development; Davide Elmo, Anne...",
// }

const SAMPLE_SIMILAR_PROJECTS = [
    new Project(100, "2020/2021", "Small TLEF", "Jane Doe", "Applied Science", "Lorem ipsum dolor sit amet, consectetur adipiscing elit", 1, 12500, "Active\r"),
    new Project(101, "2018/2019", "Small TLEF", "Benjamin Apple", "Applied Science", "Maecenas ac pretium nunc, non faucibus nisl", 1, 12500, "Active\r"),
    new Project(102, "2015/2016", "Small TLEF", "Jim Doe", "Applied Science", "Integer quis mollis mi", 1, 12500, "Active\r"),
    new Project(103, "2021/2022", "Small TLEF", "Jane Doe", "Applied Science", "Lorem ipsum dolor sit amet, consectetur adipiscing elit", 1, 12500, "Active\r"),
    new Project(103, "2021/2022", "Small TLEF", "Jane Doe", "Applied Science", "Lorem ipsum dolor sit amet, consectetur adipiscing elit", 1, 12500, "Active\r"),
    new Project(103, "2021/2022", "Small TLEF", "Jane Doe", "Applied Science", "Lorem ipsum dolor sit amet, consectetur adipiscing elit", 1, 12500, "Active\r"),
    new Project(103, "2021/2022", "Small TLEF", "Jane Doe", "Applied Science", "Lorem ipsum dolor sit amet, consectetur adipiscing elit", 1, 12500, "Active\r"),
    new Project(103, "2021/2022", "Small TLEF", "Jane Doe", "Applied Science", "Lorem ipsum dolor sit amet, consectetur adipiscing elit", 1, 12500, "Active\r"),
    new Project(103, "2021/2022", "Small TLEF", "Jane Doe", "Applied Science", "Lorem ipsum dolor sit amet, consectetur adipiscing elit", 1, 12500, "Active\r"),
    new Project(103, "2021/2022", "Small TLEF", "Jane Doe", "Applied Science", "Lorem ipsum dolor sit amet, consectetur adipiscing elit", 1, 12500, "Active\r"),
    new Project(103, "2021/2022", "Small TLEF", "Jane Doe", "Applied Science", "Lorem ipsum dolor sit amet, consectetur adipiscing elit", 1, 12500, "Active\r"),
]


const PROJECTS_PER_PAGE = [10, 20, 30, 40, 50];

export {Project,YEARS, PROJECT_TYPE, FACULTY, PROJECTS_PER_PAGE, SAMPLE_TEAM_MEMBERS, SAMPLE_STUDENT_REACH, SAMPLE_SIMILAR_PROJECTS}