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
    console.log('FILTER RESULT', largeprog)

    // checking if filter by Small or Large 
    const { appliedFilters } = useContext(FiltersContext);
    const project_type = appliedFilters.project_type;
    console.log('project_type', project_type)

    const filterLarge = (project_type.includes("Large"))
    console.log('filter large', filterLarge)
    const filterSmall = (project_type.includes("Small"))
    console.log('filter small', filterSmall)

    const small = [
        {
            "name": "Rejected Small TLEF Projects",
            "value": projects.Small,
            "label": Math.round(((projects.Small / 100) * 100))+"%" 
        },
        {
            "name": "Funded Small TLEF Projects",
            "value": smallprojects.length,
            // success rate: (numSuccessfulProjects / totalProjects) * 100
            "label": Math.round(((smallprojects.length / (smallprojects.length + projects.Small))) * 100)+"%" 
        }
    ];
    console.log(projects)
    console.log('small value:', small[0].value)
    console.log('small percentage:', small[0].label)
    console.log('large projects:', largeprojects)
    console.log('small projects:', smallprojects)
    console.log('funded small', smallprojects.length)

    const large = [
        {
            "name": "Rejected Large TLEF Projects",
            "value": projects.Large,
            "label": ((projects.Large / 100) * 100)+"%"
        },
        {
            "name": "Large TLEF Projects",
            "value": largeprojects.length,
            "label": Math.round(((largeprojects.length  / (largeprojects.length + projects.Large))) * 100)+"%"
        }
    ];
    console.log('large value:', large[0].value)

    // returns true if any Large or Small project has data (not 0) 
    const hasData = Object.values(projects).some(value => value !== 0)

    if (!hasData) {
        return <div> No summaries matching this criteria. </div>;
    }
    return (
        <React.Fragment>
        <div className={styles.sr}>
        <Grid container spacing={1} justifyContent='flex-start'>
                <Grid item xs={6}>
    <ResponsiveContainer height={300} width='99%'>
    {!filterLarge &&  <p className={styles["sr-title"]}>Small TLEF Innovation Projects</p> }
    {!filterLarge && <p className={styles["sr-info"]}>Proposals: {smallprojects.length + projects.Small } | Funded: {smallprojects.length} </p> }
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
    </Grid>
    <Grid item xs={6}>
    <ResponsiveContainer height={300} width='99%'>
    {!filterSmall && <p className={styles["sr-title"]}>Large TLEF Innovation Projects</p> }
    {!filterSmall && <p className={styles["sr-info"]}>Proposals: {largeprojects.length + projects.Large } | Funded: {largeprojects.length} </p> }
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
    <div className={styles.description}>
            <p><b>{totalprojects.length}</b> projects received funding during selected TLEF rounds.</p>
        </div>
        </React.Fragment>
    );
};

export default SuccessRateChart;

// import React from 'react';
// import styles from "./charts.module.css";
// import { Bar, BarChart, LabelList, Legend, Rectangle, Tooltip, XAxis, YAxis } from 'recharts';

// function SuccessRateChart({ projects }) {

//     const small = [
//         {
//             "name": "Small TLEF Projects",
//             "value": 44 / 62,
//             "label": "71%"
//         }
//     ];

//     const large = [
//         {
//             "name": "Large TLEF Projects",
//             "value": 10 / 13,
//             "label": "77%"
//         }
//     ];

//     const domain = [0, 1];
//     const ticks = [
//         0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1
//     ];

//     const toPercent = (decimal, fixed = 0) => `${(decimal * 100).toFixed(fixed)}%`;

//     const getPercent = (value, total) => {
//         const ratio = total > 0 ? value / total : 0;

//         return toPercent(ratio, 2);
//     };

//     const customLabel = (props) => {
//         const { x, y, width, height, value } = props;
//         return (
//             <text x={590} y={y + height / 3 * 2} textAnchor="end" fontStyle="italic">
//                 {value}
//             </text>
//         )
//     }

//     return (
//         <React.Fragment>
//             <div className={styles.chart}>
//                 <div className={styles.sr}>

//                     <div className={styles["sr-bar"]}>
//                         <p className={styles["sr-title"]}>Small TLEF Innovation Projects</p>
//                         <p className={styles["sr-info"]}>Proposals: 62 | Funded: 44</p>
//                         <BarChart width={600} height={70} layout="vertical" data={small}>
//                             <XAxis type="number" domain={domain} tick={ticks} tickCount={10} tickFormatter={toPercent} hide />
//                             <YAxis type="category" dataKey="name" hide />
//                             <Bar dataKey="value" fill="#FB812D" background={{ fill: "#DCDDDE" }}>
//                                 <LabelList width={500} content={customLabel} position="right" dataKey="label" />
//                             </Bar>
//                         </BarChart>
//                     </div>

//                     <div className={styles["sr-bar"]}>
//                         <p className={styles["sr-title"]}>Large TLEF Innovation Projects</p>
//                         <p className={styles["sr-info"]}>Proposals: 13 | Funded: 10</p>
//                         <BarChart width={600} height={70} layout="vertical" data={large} stackOffset='expand'>
//                             <XAxis type="number" domain={domain} tick={ticks} tickCount={10} tickFormatter={toPercent} hide />
//                             <YAxis type="category" dataKey="name" hide />
//                             <Bar dataKey="value" fill="#13588B" background={{ fill: "#DCDDDE" }}>
//                                 <LabelList width={500} content={customLabel} position="right" dataKey="label" />
//                             </Bar>
//                         </BarChart>
//                     </div>

//                 </div>
//             </div>
//             <div className={styles.space}></div>
//             <div className={styles.description}>
//                 <p>{projects.length} projects received funding during selected TLEF rounds.</p>
//             </div>
//         </React.Fragment>
//     );
// };

// export default SuccessRateChart;