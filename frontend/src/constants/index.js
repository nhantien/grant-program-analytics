class Project {
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

    constructor(fundingYear, type, investigator, faculty, title, projectYear, amount, status) {
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
    };
};

const YEARS = [
    "2023/24", "2022/23", "2021/22", "2020/21", "2019/20", "2018/19", "2017/18", "2016/17", "2015/16", "2014/15", "2013/14",
    "2012/13", "2011/12", "2010/11", "2009/10", "2008/09", "2007/08", "2006/07", "2005/06", "2004/05", "2003/04", "2002/03",
    "2001/02", "2000/01", "1999/2000"
];

const PROJECT_TYPE = [
    "Large TLEF", "Small TLEF"
];

const FACULTY = [
    "Applied Science", "Arts", "Dentistry", "Education", "First Nations House of Learning", "Forestry", "Graduate Studies", 
    "Land & Food Systems", "Allard School of Law", "Medicine", "Pharmaceutical Sciences", "Sauder School of Business", "Science",
    "UBC Health", "UBC Library", "Vantage College", "VP Academic", "VP Students", "Other..."
];

export {Project,YEARS, PROJECT_TYPE, FACULTY}