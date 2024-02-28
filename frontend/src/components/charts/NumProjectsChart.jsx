// react
import React from 'react';
// css style
import styles from "./charts.module.css";

function NumProjectsChart({ projects }) {

    return (
        <React.Fragment>
            <div className={styles['section']}> 
            <div className={styles['numchart']}>
            <div className={styles["fe-circle"]}>
                            <p>44</p>
                        </div>
                        <p className={styles["fe-title"]}>SMALL PROJECTS</p>
            <div className={styles["fe-circle"]}>
                        <p>44</p>
                    </div>
            <p className={styles["fe-title"]}>LARGE PROJECTS</p>
            </div>
            <div className={styles["numchart"]}>
            <div className={styles["fe-circle2"]}>
                            <p>44</p>
                        </div>
                        <p className={styles["fe-title"]}>SMALL GRANTS AWARDED </p>
            <div className={styles["fe-circle2"]}>
                        <p>44</p>
                    </div>  
            <p className={styles["fe-title"]}>LARGE GRANTS AWARDED</p>

            </div>
            </div>
        </React.Fragment>
    );
};

export default NumProjectsChart;