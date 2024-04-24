// react
import React from 'react';
// recharts
import { PieChart, Pie, Cell, Label, ResponsiveContainer } from 'recharts';
import { useState, useEffect, useContext } from "react";
// css style
import styles from "./charts.module.css";
import { Grid } from "@mui/material";
import { FiltersContext } from "../../App";

function SuccessRateChart({ projects, totalprojects, largeprojects, smallprojects }) {

    const largeprog = totalprojects.filter(proj => proj.project_type === 'Large');

    // checking if filter by Small or Large 
    const { appliedFilters } = useContext(FiltersContext);
    const project_type = appliedFilters.project_type;

    const filterLarge = (project_type.includes("Large") && !project_type.includes('Small'))
    const filterSmall = (project_type.includes("Small") && !project_type.includes('Large'))

    const small = [
        {
            "name": "Rejected Small TLEF Projects",
            "value": projects.Small,
            "label": Math.round(((projects.Small / 100) * 100)) + "%"
        },
        {
            "name": "Funded Small TLEF Projects",
            "value": smallprojects.length,
            // success rate: (numSuccessfulProjects / totalProjects) * 100
            "label": Math.round(((smallprojects.length / (smallprojects.length + projects.Small))) * 100) + "%"
        }
    ];

    const large = [
        {
            "name": "Rejected Large TLEF Projects",
            "value": projects.Large,
            "label": ((projects.Large / 100) * 100) + "%"
        },
        {
            "name": "Large TLEF Projects",
            "value": largeprojects.length,
            "label": Math.round(((largeprojects.length / (largeprojects.length + projects.Large))) * 100) + "%"
        }
    ];

    // returns true if any Large or Small project has data (not 0) 
    const hasData = Object.values(projects).some(value => value !== 0)

    if (!hasData) {
        return <div> No summaries matching this criteria. </div>;
    }
    return (
        <React.Fragment>
            <div className={styles.sr}>
                <Grid container spacing={1} justifyContent='flex-start'>
                    <Grid item xs={filterLarge ? 3 : 6}>
                        <div className={`${filterLarge ? styles['filter-hidden'] : ''}`}>
                            <ResponsiveContainer height={300} width='99%'>
                                {!filterLarge && <p className={styles["sr-title"]}>Small TLEF Innovation Projects</p>}
                                {!filterLarge && <p className={styles["sr-info"]}>Proposals: {smallprojects.length + projects.Small} | Funded: {smallprojects.length} </p>}
                                <PieChart>
                                    <Pie
                                        data={small}
                                        dataKey={"value"}
                                        nameKey={"name"}
                                        cx={"50%"}
                                        cy={"50%"}
                                        innerRadius={60}
                                        outerRadius={90}
                                        startAngle={-270}
                                        endAngle={90}
                                    >
                                        {small.map((entry, index) => {
                                            if (index === 0) {
                                                return <Cell key={`cell-${index}`} fill="#EEE" />
                                            }
                                            return <Cell key={`cell-${index}`} fill="#FB812D" />
                                        })}

                                        <Label
                                            value={small[1].label}
                                            position={"center"}
                                            style={{
                                                fontSize: "1.5rem",
                                                fontWeight: 600
                                            }}
                                        />
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </Grid>
                    <Grid item xs={filterSmall ? 3 : 6} container justifyContent='flex-end' >
                        <ResponsiveContainer height={300} width='99%'>
                            {!filterSmall && <p className={styles["sr-title"]}>Large TLEF Innovation Projects</p>}
                            {!filterSmall && <p className={styles["sr-info"]}>Proposals: {largeprojects.length + projects.Large} | Funded: {largeprojects.length} </p>}
                            <PieChart>
                                <Pie
                                    data={large}
                                    dataKey={"value"}
                                    nameKey={"name"}
                                    cx={"50%"}
                                    cy={"50%"}
                                    innerRadius={60}
                                    outerRadius={90}
                                    startAngle={-270}
                                    endAngle={90}
                                >
                                    {small.map((entry, index) => {
                                        if (index === 0) {
                                            return <Cell key={`cell-${index}`} fill="#EEE" />
                                        }
                                        return <Cell key={`cell-${index}`} fill="#2F5D7C" />
                                    })}

                                    <Label
                                        value={large[1].label}
                                        position={"center"}
                                        style={{
                                            fontSize: "1.5rem",
                                            fontWeight: 600
                                        }}
                                    />
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </Grid>
                </Grid>
            </div>
            <div className={styles.space}></div>
            <div className={styles['sr-description']}>
                <p><b>{totalprojects.length}</b> projects received funding during selected TLEF rounds.</p>
            </div>
        </React.Fragment>
    );
};

export default SuccessRateChart;