import { Bar, BarChart, LabelList, Legend, Rectangle, Tooltip, XAxis, YAxis } from 'recharts';
import React from 'react';
import styles from "./charts.module.css";

function FundingChart({ projects }) {

    const len = projects.length;

    const formattedAmount = (amount) => {
        return (
            parseInt(amount).toLocaleString("en-CA", {
                style: "currency",
                currency: "CAD",
                minimumFractionDigits: 0
            })
        )
    };

    const fundingData = () => {
        const map = new Map();
        let total = 0;
        projects.forEach((project) => {
            const t = project.type;
            const f = project.faculty;
            const a = parseInt(project.amount);

            if (map.has(f)) {
                let newVal = map.get(f);
                newVal[t] = newVal[t] + a;
                map.set(f, newVal);
            } else {
                let newVal = {
                    "Large TLEF": 0,
                    "Small TLEF": 0
                };
                newVal[t] = a;
                map.set(f, newVal);
            }

            total += a;
        });
        const res = [];
        for (let [faculty, value] of map) {
            const amount = value["Large TLEF"] + value["Small TLEF"];
            const percentage = Math.round((amount / total) * 100 * 10) / 10;
            const data = {
                "name": faculty,
                "Large TLEF": value["Large TLEF"],
                "Small TLEF": value["Small TLEF"],
                "value": amount,
                "label": `${formattedAmount(amount)} (${percentage}%)`
            };
            res.push(data);
        }

        return { res, total };
    };

    const { res, total } = fundingData();

    const isMobile = () => {
        return window.screen.width <= 576;
    }

    const CustomToolTip = ({ active, payload, label }) => {

        if (active && payload && label) {
            return (
                <div className={styles["funding-tooltip"]}>
                    <span className={styles["funding-tooltip-title"]}>
                        {label}
                    </span>
                    <div className={styles["funding-tooltip-content"]}>
                        <span style={{ color: "#FB812D" }}>Large TLEF: {formattedAmount(payload[0].payload["Large TLEF"])}</span>
                        <br />
                        <span style={{ color: "#13588B" }}>Small TLEF: {formattedAmount(payload[0].payload["Small TLEF"])}</span>
                        <br />
                        <span style={{ fontWeight: 600 }}> Total: {payload[0].payload.label}</span>
                    </div>
                </div>
            );
        }

        return null;
    }

    const customLabel = (props) => {
        const { x, y, width, height, value } = props;
        return (
            <text x={840} y={y + height / 3 * 2} textAnchor="end" fill="#081252" fontStyle="italic">
                {value}
            </text>
        )
    }

    const { width, height, layout } = (isMobile())
        ? { width: 350, height: 500, layout: "horizontal" }
        : { width: 850, height: 500, layout: "vertical" };

    const xAxis = (isMobile())
        ? (<XAxis type="category" hide />) : (<XAxis type="number" padding={{ right: 150 }} hide />);

    const yAxis = (isMobile())
        ? (<YAxis type="number" padding={{ top: 150 }} hide />) : (<YAxis type="category" dataKey="name" width={120} />);

    const label = (isMobile())
        ? null : <LabelList width={500} content={customLabel} position="right" dataKey="label" fill="#081252" style={{ fontStyle: "italic" }} />;

    return (
        <React.Fragment>

            <div className={styles.description}>
                The TLEF awarded the total of <b>{formattedAmount(total)}</b> funding for selected {len} projects.
            </div>
            <div className={styles.space}></div>
            <div className={styles.chart}>
                <BarChart width={width} height={height} layout={layout} data={res}>
                    {xAxis}
                    {yAxis}
                    {isMobile() && <Tooltip content={<CustomToolTip />} cursor={{ fill: "transparent" }} position={{ x: 100, y: 25 }} />}
                    <Tooltip content={CustomToolTip} />
                    <Legend verticalAlign='top' iconType='square' height={36} />
                    <Bar dataKey="Small TLEF" stackId="a" background={{ fill: "#EEEE" }} fill="#13588B" />
                    <Bar dataKey="Large TLEF" stackId="a" fill="#FB812D">{label}</Bar>
                    
                </BarChart>
            </div>
            
        </React.Fragment>
    );

    return (
        <React.Fragment>
            <div className={styles.chart}>
                <BarChart width={width} height={height} layout={layout} data={res} >
                    {xAxis}
                    {yAxis}
                    {isMobile() && <Tooltip content={<CustomToolTip />} cursor={{ fill: "transparent" }} position={{ x: 100, y: 25 }} />}
                    <Bar dataKey="value" fill="#081252" background={{ fill: "#EEE" }} activeBar={<Rectangle fill="lightblue" />}>
                        {label}
                    </Bar>
                </BarChart>
            </div>
            <div className={styles.space}></div>
            <div className={styles.description}>
                The TLEF awarded the total of {formattedAmount(total)} funding for selected {len} projects.
            </div>
        </React.Fragment>
    );
};

export default FundingChart;