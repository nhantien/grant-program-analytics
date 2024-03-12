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


function FacultyEngagementChart({projects, amount}) {

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

    console.log(projects)

    //calculate total funding amount 
    const calculateTotalFunding = () => {
        const totalamount = amount.reduce((total, project) => total + amount.funding_amount, 0);
        return totalamount;
      };


    return (
        <React.Fragment>
            <div className={styles.description}>
                {!isDataComplete &&
                    <p className={styles.warning}>Please note, this particular TLEF metric is not available prior to the 2017/18 academic year.</p>
                }
                <p>The TLEF actively engages with teaching and research faculty across the university as well as support staff who provide consultation and development support throughout the life of TLEF projects.</p>
                {appliedFilters && appliedFilters["funding_year"].length > 0 
                 && (appliedFilters.project_faculty).length === 0 &&
                 (appliedFilters.project_type).length === 0 &&
                 (appliedFilters.focus_area).length === 0 &&
                 (appliedFilters.search_text).length === 0 &&
                <p>Approximately <b>$1.18mil</b> in TLEF-awarded funding will employ over <b>{projects.Small.Student + projects.Large.Student}</b> UBC students to support the development, implementation and evaluation of TLEF projects.</p>
            }
            </div>
            <div className={styles.space}></div>
            <div className={styles.chart}>
                <div className={styles.fe}>

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
                             <span>{projects.Small.Teaching} Teaching Faculty</span> 
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
                            <span>{projects.Large.Teaching} Teaching Faculty</span>
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
                    </div>
                </div>
        </React.Fragment>
    );
};

export default FacultyEngagementChart;