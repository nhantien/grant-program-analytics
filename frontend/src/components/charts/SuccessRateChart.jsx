import React from 'react';
import styles from "./charts.module.css";
import { Bar, BarChart, LabelList, Legend, Rectangle, Tooltip, XAxis, YAxis } from 'recharts';

function SuccessRateChart({ projects }) {

    const small = [
        {
            "name": "Small TLEF Projects",
            "value": 44 / 62,
            "label": "71%"
        }
    ];

    const large = [
        {
            "name": "Large TLEF Projects",
            "value": 10 / 13,
            "label": "77%"
        }
    ];

    const domain = [0, 1];
    const ticks = [
        0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1
    ];

    const toPercent = (decimal, fixed = 0) => `${(decimal * 100).toFixed(fixed)}%`;

    const getPercent = (value, total) => {
        const ratio = total > 0 ? value / total : 0;

        return toPercent(ratio, 2);
    };

    const customLabel = (props) => {
        const { x, y, width, height, value } = props;
        return (
            <text x={590} y={y + height / 3 * 2} textAnchor="end" fontStyle="italic">
                {value}
            </text>
        )
    }

    return (
        <React.Fragment>
            <div className={styles.chart}>
                <div className={styles.sr}>

                    <div className={styles["sr-bar"]}>
                        <p className={styles["sr-title"]}>Small TLEF Innovation Projects</p>
                        <p className={styles["sr-info"]}>Proposals: 62 | Funded: 44</p>
                        <BarChart width={600} height={70} layout="vertical" data={small}>
                            <XAxis type="number" domain={domain} tick={ticks} tickCount={10} tickFormatter={toPercent} hide />
                            <YAxis type="category" dataKey="name" hide />
                            <Bar dataKey="value" fill="#FB812D" background={{ fill: "#DCDDDE" }}>
                                <LabelList width={500} content={customLabel} position="right" dataKey="label" />
                            </Bar>
                        </BarChart>
                    </div>

                    <div className={styles["sr-bar"]}>
                        <p className={styles["sr-title"]}>Large TLEF Innovation Projects</p>
                        <p className={styles["sr-info"]}>Proposals: 13 | Funded: 10</p>
                        <BarChart width={600} height={70} layout="vertical" data={large} stackOffset='expand'>
                            <XAxis type="number" domain={domain} tick={ticks} tickCount={10} tickFormatter={toPercent} hide />
                            <YAxis type="category" dataKey="name" hide />
                            <Bar dataKey="value" fill="#13588B" background={{ fill: "#DCDDDE" }}>
                                <LabelList width={500} content={customLabel} position="right" dataKey="label" />
                            </Bar>
                        </BarChart>
                    </div>

                </div>
            </div>
            <div className={styles.space}></div>
            <div className={styles.description}>
                <p>{projects.length} projects received funding during selected TLEF rounds.</p>
            </div>
        </React.Fragment>
    );
};

export default SuccessRateChart;