// react
import React, { useContext } from 'react';
// mui
import { BarChart } from "@mui/icons-material";
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import GroupsIcon from '@mui/icons-material/Groups';
import SchoolIcon from '@mui/icons-material/School';
// css style
import styles from "./charts.module.css";
// context
import { FiltersContext } from '../../App';


function FacultyEngagementChart({projects, amount, studentEngagement}) {

    const { appliedFilters } = useContext(FiltersContext);

    let isDataComplete = true;

    // convert funding_year value from string to int
    // e.g. "2022/2023" -> 2022
    const convertYear = (year) => {
        return parseInt(year);
    }

    // no faculty engagement data prior to 2017: flag if the current filters contain projects before 2017
    // displays warning message
    const years = appliedFilters["funding_year"];
    years.map((year) => {
        const yearInt = convertYear(year);
        if (yearInt < 2017) {
            isDataComplete = false;
        }
    });

    const formattedAmount = (amount) => {
        return parseInt(amount).toLocaleString("en-CA");
    };
    
    const project_type = appliedFilters.project_type;
    const filterLarge = (project_type.includes("Large") && !project_type.includes('Small'))
    const filterSmall = (project_type.includes("Small") && !project_type.includes('Large'))

    // returns true if any Large or Small project has data (not 0) 
    const hasData = Object.values(projects).some(item => Object.values(item).some(value => value !== 0))

    if (!hasData) {
        return <div> No summaries matching this criteria. 
            <p className={styles.warning}>Please note, this particular TLEF metric is not available prior to the 2017/18 academic year.</p>
        </div>;
    }

    function calculateBasedOnFilter(arr, key) {
        if (filterLarge) {
            return arr.filter((obj) => obj.project_type.toLowerCase().includes('large')).reduce((total, obj) => total + obj[key], 0)
        } else if  (filterSmall) {
            return arr.filter((obj) => obj.project_type.toLowerCase().includes('small')).reduce((total, obj) => total + obj[key], 0)
        } else {
            return arr.reduce((total, obj) => total + obj[key], 0)
        }
    }

    // it can calculate the result depends on if the filter is for large or small, or both.
    const student_funding_amt = calculateBasedOnFilter(studentEngagement, 'student_funding')
    const student_positions_count = calculateBasedOnFilter(studentEngagement, 'student_positions')

    return (
        <React.Fragment>

            <div className={styles["fe-chart"]}>
                <div className={styles.fe}>
                {!filterLarge && (
                    <div className={styles["fe-box"]}>
                        <p className={styles["fe-title"]}>SMALL GRANTS</p>
                        <div className={styles["fe-category"]}>
                            <BarChart 
                                sx={{ color: "#119FD5", fontSize: "3.25rem" }}
                            />
                           <span> {projects.Small.Research} Research Faculty</span> 
                        </div>
                        <div className={styles["fe-category"]}>
                            <HistoryEduIcon 
                                sx={{ color: "#119FD5", fontSize: "3.25rem" }}
                            />
                             <span>{projects.Small.Teaching} Educational Leadership Faculty</span> 
                        </div>
                        <div className={styles["fe-category"]}>
                            <GroupsIcon 
                                sx={{ color: "#119FD5", fontSize: "3.25rem" }}
                            />
                             <span>{projects.Small.Admin} Staff</span> 
                        </div>
                        <div className={styles["fe-category"]}>
                            <SchoolIcon 
                                sx={{ color: "#119FD5", fontSize: "3.25rem" }}
                            />
                             <span>{projects.Small.Student} Students</span> 
                        </div>
                    </div>
                )}
                 {!filterSmall && (
                    <div className={styles["fe-box"]}>
                        <p className={styles["fe-title"]}>LARGE GRANTS</p>
                        <div className={styles["fe-category"]}>
                            <BarChart 
                                sx={{ color: "#119FD5", fontSize: "3.25rem" }}
                            />
                           <span>{projects.Large.Research} Research Faculty</span>
                        </div>
                        <div className={styles["fe-category"]}>
                            <HistoryEduIcon 
                                sx={{ color: "#119FD5", fontSize: "3.25rem" }}
                            />
                            <span>{projects.Large.Teaching} Educational Leadership Faculty </span>
                        </div>
                        <div className={styles["fe-category"]}>
                            <GroupsIcon 
                                sx={{ color: "#119FD5", fontSize: "3.25rem" }}
                            />
                            <span>{projects.Large.Admin} Staff</span> 
                        </div>
                        <div className={styles["fe-category"]}>
                            <SchoolIcon 
                                sx={{ color: "#119FD5", fontSize: "3.25rem" }}
                            />
                             <span>{projects.Large.Student} Students</span>
                        </div>
                        </div>
                          )}
                    </div>
                </div>
                <div className={styles.space}></div>
                <div className={styles.description}>
                    
                <p>The TLEF actively engages with teaching and research faculty across the university as well as support staff who provide consultation and development support throughout the life of TLEF projects.</p>
                {isDataComplete && appliedFilters && appliedFilters["funding_year"].length === 1  
                 && (appliedFilters.project_faculty).length === 0 &&
                 (appliedFilters.project_type).length === 0 &&
                 (appliedFilters.focus_area).length === 0 &&
                 (appliedFilters.search_text).length === 0 &&
                <p>
                    Approximately <b>${formattedAmount(student_funding_amt)}</b> in 
                    TLEF-awarded funding will employ over <b>{student_positions_count}</b> UBC students 
                    to support the development, implementation and evaluation of TLEF projects.
                </p>
            }
            <p className={styles.warning}>Please note, this particular TLEF metric is not available prior to the 2017/18 academic year.</p>
            </div>
           
        </React.Fragment>
    );
};

export default FacultyEngagementChart;