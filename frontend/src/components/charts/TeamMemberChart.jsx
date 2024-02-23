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


function TeamMemberChart() {

    const { appliedFilters } = useContext(FiltersContext);

    let isDataComplete = true;

    const convertYear = (year) => {
        const yearStr = year.substring(0, year.indexOf("/"));
        return parseInt(yearStr);
    }

    const years = appliedFilters["funding_year"];
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
                <p>The TLEF actively engages with teaching and research faculty across the university as well as support staff who provide consultation and development support throughout the life of TLEF projects.</p>
                <p>Approximately <b>$1.18 million</b> in TLEF-awarded funding will employ over <b>160</b> UBC students to support the development, implementation and evaluation of TLEF projects.</p>
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