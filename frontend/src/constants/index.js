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

const BASE_URL = "https://n65lw6cwdghn4mrdgfkot3xiy40iwzcl.lambda-url.ca-central-1.on.aws/";

// const YEARS = [
//     "2024/2025", "2023/2024", "2022/2023", "2021/2022", "2020/2021", "2019/2020", "2018/2019", "2017/2018", "2016/2017", "2015/2016", "2014/2015", "2013/2014",
//     "2012/2013", "2011/2012", "2010/2011", "2009/2010", "2008/2009", "2007/2008", "2006/2007", "2005/2006", "2004/2005", "2003/2004", "2002/2003",
//     "2001/2002", "2000/2001", "1999/2000"
// ];

const YEARS = [
    {
        "label": "1999/2000",
        "value": "1999"
    },
    {
        "label": "2000/2001",
        "value": "2000"
    },
    {
        "label": "2001/2002",
        "value": "2001"
    },
    {
        "label": "2002/2003",
        "value": "2002"
    },
    {
        "label": "2003/2004",
        "value": "2003"
    },
    {
        "label": "2004/2005",
        "value": "2004"
    },
    {
        "label": "2005/2006",
        "value": "2005"
    },
    {
        "label": "2006/2007",
        "value": "2006"
    },
    {
        "label": "2007/2008",
        "value": "2007"
    },
    {
        "label": "2008/2009",
        "value": "2008"
    },
    {
        "label": "2009/2010",
        "value": "2009"
    },
    {
        "label": "2010/2011",
        "value": "2010"
    },
    {
        "label": "2011/2012",
        "value": "2011"
    },
    {
        "label": "2012/2013",
        "value": "2012"
    },
    {
        "label": "2013/2014",
        "value": "2013"
    },
    {
        "label": "2014/2015",
        "value": "2014"
    },
    {
        "label": "2015/2016",
        "value": "2015"
    },
    {
        "label": "2016/2017",
        "value": "2016"
    },
    {
        "label": "2017/2018",
        "value": "2017"
    },
    {
        "label": "2018/2019",
        "value": "2018"
    },
    {
        "label": "2019/2020",
        "value": "2019"
    },
    {
        "label": "2020/2021",
        "value": "2020"
    },
    {
        "label": "2021/2022",
        "value": "2021"
    },
    {
        "label": "2022/2023",
        "value": "2022"
    },
    {
        "label": "2023/2024",
        "value": "2023"
    },
    {
        "label": "2024/2025",
        "value": "2024"
    }
];

// const PROJECT_TYPE = [
//     "Large TLEF", "Small TLEF"
// ];

const PROJECT_TYPE = [
    {
        "label": "Large TLEF",
        "value": "Large"
    },
    {
        "label": "Small TLEF",
        "value": "Small"
    }
];

// const FACULTY = [
//     "Applied Science", "Arts", "Dentistry", "Education", "First Nations House of Learning", "Forestry", "Graduate Studies",
//     "Land & Food Systems", "Allard School of Law", "Medicine", "Pharmaceutical Sciences", "Sauder School of Business", "Science",
//     "UBC Health", "UBC Library", "Vantage College", "VP Academic", "VP Students", "Other"
// ];

const FACULTY = [
    {
        "label": "Applied Science",
        "value": "APSC"
    },
    {
        "label": "Arts",
        "value": "ARTS"
    },
    {
        "label": "Dentistry",
        "value": "DENT"
    },
    {
        "label": "Education",
        "value": "EDUC"
    },
    {
        "label": "First Nations House of Learning",
        "value": "ARTS"
    },
    {
        "label": "Forestry",
        "value": "FRST"
    },
    {
        "label": "Graduate & Postdoctoral Studies",
        "value": "GRAD"
    },
    {
        "label": "Land & Food Systems",
        "value": "LFS"
    },
    {
        "label": "Allard School of Law",
        "value": "LAW"
    },
    {
        "label": "Medicine",
        "value": "MED"
    },
    {
        "label": "Pharmaceutical Sciences",
        "value": "PHAR"
    },
    {
        "label": "Sauder School of Business",
        "value": "COMM"
    },
    {
        "label": "Science",
        "value": "SCI"
    },
    {
        "label": "UBC Health",
        "value": "HLTH"
    },
    {
        "label": "UBC Library",
        "value": "LIBR"
    },
    {
        "label": "Vantage Collage",
        "value": "VANT"
    },
    {
        "label": "VP Academic",
        "value": "VPA"
    },
    {
        "label": "VP Students",
        "value": "VPS"
    }
]

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
    "CPSC 100 000", "XXXX 200 000", "XXXX 300 000", "XXXX 000 000", "XXXX 000 000",
    "XXXX 000 000", "XXXX 000 000", "XXXX 000 000", "XXXX 000 000", "XXXX 000 000",
    "XXXX 000 000", "XXXX 000 000", "XXXX 000 000", "XXXX 000 000", "XXXX 000 000"
];

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

const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

const MARKS = [
    {
        value: 1999,
        label: "1999",
    },
    {
        value: 2023,
        label: "2023",
    }
]

const SAMPLE_PROJECT = new Project(-1, "2020/2021", "Small TLEF", "Jane Doe", "Applied Science", "Development of a guided self-directed study online German for Reading Knowledge course on the beginner level applicable in various hybrid instructional modes", 1, 12500, "Active\r");

const HOME_PAGE_QUERY = `query test {
    proposals (method: "all") {
        grant_id
        pi_name
        faculty
        title
        project_year
        amount
    }
}
`;

export { 
    Project, 
    BASE_URL, 
    YEARS, 
    PROJECT_TYPE, 
    FACULTY, 
    PROJECTS_PER_PAGE, 
    SAMPLE_TEAM_MEMBERS, 
    SAMPLE_STUDENT_REACH, 
    SAMPLE_SIMILAR_PROJECTS, 
    sleep, 
    SAMPLE_PROJECT,
    MARKS, 
    HOME_PAGE_QUERY,
}