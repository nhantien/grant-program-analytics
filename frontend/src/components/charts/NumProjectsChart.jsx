// react
import React from 'react';
// css style
import styles from "./charts.module.css";
// applied filters 
import { FiltersContext } from "../../App";
import { useContext } from "react";

function NumProjectsChart({ projects }) {

    const { appliedFilters } = useContext(FiltersContext);
    const project_type = appliedFilters.project_type;
    const filterLarge = (project_type.includes("Large") && !project_type.includes('Small'))
    const filterSmall = (project_type.includes("Small") && !project_type.includes('Large'))
    // returns true if any large or small project/grant has data (not 0) 
    const hasData = Object.values(projects).some(item => Object.values(item).some(value => value !== 0))
    const years  = appliedFilters.funding_year.length // if only 1 year then num grant = num projects
    if (!hasData) {
        return <div> No summaries matching this criteria. </div>;
    }
    return (
        <React.Fragment>
            <div className={styles['section']}> 
            {!filterLarge && (
            <div className={styles['circle']}>
                <div className={styles["np-circle"]}>
                            <p>{projects.project.Small}</p>
                        </div>
                        <p className={styles["circletitle"]}>SMALL PROJECTS FUNDED</p>
            </div>
            )}
            {!filterSmall && (
            <div className={styles['circle']}>
                <div className={styles["np-circle"]}>
                        <p>{projects.project.Large}</p>
                    </div>
                    <p className={styles["circletitle"]}>LARGE PROJECTS FUNDED</p>
            </div>
            )}
            { !filterLarge && (
            <div className={styles['circle']}>
                <div className={styles["np-circle2"]}>
                            <p>{years === 1 ? Math.min(projects.grant.Small, projects.project.Small) : projects.grant.Small}</p>
                    </div>
                    <p className={styles["circletitle"]}>SMALL GRANTS AWARDED </p>
            </div>
            )}
            { !filterSmall && (
            <div className={styles['circle']}>
                <div className={styles["np-circle2"]}>
                        <p>{years === 1 ? Math.min(projects.grant.Large, projects.project.Large) : projects.grant.Large}</p>
                    </div>  
                    <p className={styles["circletitle"]}>LARGE GRANTS AWARDED</p>
                </div>
            )}
            </div>
        </React.Fragment>
    );
};

export default NumProjectsChart;