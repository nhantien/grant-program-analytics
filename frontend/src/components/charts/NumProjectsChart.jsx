// react
import React from 'react';
// css style
import styles from "./charts.module.css";

function NumProjectsChart({ projects }) {

    // returns true if any large or small project/grant has data (not 0) 
    const hasData = Object.values(projects).some(item => Object.values(item).some(value => value !== 0))

    if (!hasData) {
        return <div> No summaries matching this criteria. </div>;
    }
    return (
        <React.Fragment>
            <div className={styles['section']}> 
            <div className={styles['circle']}>
                <div className={styles["np-circle"]}>
                            <p>{projects.project.Small}</p>
                        </div>
                        <p className={styles["circletitle"]}>SMALL PROJECTS FUNDED</p>
            </div>
            <div className={styles['circle']}>
                <div className={styles["np-circle"]}>
                        <p>{projects.project.Large}</p>
                    </div>
                    <p className={styles["circletitle"]}>LARGE PROJECTS FUNDED</p>
            </div>
            <div className={styles['circle']}>
                <div className={styles["np-circle2"]}>
                            <p>{projects.grant.Small}</p>
                    </div>
                    <p className={styles["circletitle"]}>SMALL GRANTS AWARDED </p>
            </div>
            <div className={styles['circle']}>
                <div className={styles["np-circle2"]}>
                        <p>{projects.grant.Large}</p>
                    </div>  
                    <p className={styles["circletitle"]}>LARGE GRANTS AWARDED</p>
                </div>
            </div>
        </React.Fragment>
    );
};

export default NumProjectsChart;