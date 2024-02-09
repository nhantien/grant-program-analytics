import React from 'react';
import styles from "./charts.module.css";
import { BarChart } from "@mui/icons-material";
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import GroupsIcon from '@mui/icons-material/Groups';
import SchoolIcon from '@mui/icons-material/School';

function TeamMemberChart({ projects, filters }) {

    let isDataComplete = true;

    const convertYear = (year) => {
        const yearStr = year.substring(0, year.indexOf("/"));
        return parseInt(yearStr);
    }

    const years = filters["FundingYear"];
    console.log(years);
    years.map((year) => {
        const yearInt = convertYear(year);
        console.log(yearInt);
        if (yearInt < 2017) {
            isDataComplete = false;
        }
    });

    return (
        <React.Fragment>
            <div className={styles.description}>
                {!isDataComplete &&
                    <p className={styles.warning}>Please note, this particular TLEF metric is not available prior to the 2017/18 academic year.</p>
                }
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </div>
            <div className={styles.space}></div>
            <div className={styles.chart}>
                <div className={styles.fe}>

                    <div className={styles["fe-box"]}>
                        <div className={styles["fe-circle"]}>
                            <p>44</p>
                        </div>
                        <p className={styles["fe-title"]}>SMALL GRANTS AWARDED</p>
                        <div className={styles["fe-category"]}>
                            <BarChart 
                                sx={{ color: "#119FD5", fontSize: "3.25rem" }}
                            />
                            <span>61 Research Faculty</span>
                        </div>
                        <div className={styles["fe-category"]}>
                            <HistoryEduIcon 
                                sx={{ color: "#119FD5", fontSize: "3.25rem" }}
                            />
                            <span>108 Teaching Faculty</span>
                        </div>
                        <div className={styles["fe-category"]}>
                            <GroupsIcon 
                                sx={{ color: "#119FD5", fontSize: "3.25rem" }}
                            />
                            <span>47 Staff</span>
                        </div>
                        <div className={styles["fe-category"]}>
                            <SchoolIcon 
                                sx={{ color: "#119FD5", fontSize: "3.25rem" }}
                            />
                            <span>33 Students</span>
                        </div>
                    </div>

                    <div className={styles["fe-box"]}>
                        <div className={styles["fe-circle"]}>
                            <p>10</p>
                        </div>
                        <p className={styles["fe-title"]}>LARGE GRANTS AWARDED</p>
                        <div className={styles["fe-category"]}>
                            <BarChart 
                                sx={{ color: "#119FD5", fontSize: "3.25rem" }}
                            />
                            <span>58 Research Faculty</span>
                        </div>
                        <div className={styles["fe-category"]}>
                            <HistoryEduIcon 
                                sx={{ color: "#119FD5", fontSize: "3.25rem" }}
                            />
                            <span>34 Teaching Faculty</span>
                        </div>
                        <div className={styles["fe-category"]}>
                            <GroupsIcon 
                                sx={{ color: "#119FD5", fontSize: "3.25rem" }}
                            />
                            <span>23 Staff</span>
                        </div>
                        <div className={styles["fe-category"]}>
                            <SchoolIcon 
                                sx={{ color: "#119FD5", fontSize: "3.25rem" }}
                            />
                            <span>12 Students</span>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default TeamMemberChart;