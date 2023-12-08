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

const PROJECTS_PER_PAGE = [10, 20, 30, 40, 50];

export {Project,YEARS, PROJECT_TYPE, FACULTY, PROJECTS_PER_PAGE}