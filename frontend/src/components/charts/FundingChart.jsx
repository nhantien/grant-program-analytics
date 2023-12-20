import { Bar, BarChart, LabelList, Tooltip, XAxis, YAxis } from 'recharts';
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
            const f = project.faculty;
            const a = parseInt(project.amount);

            if (map.has(f)) {
                map.set(f, map.get(f) + a);
            } else {
                map.set(f, a);
            }

            total += a;
        });
        const res = [];
        for (let [faculty, amount] of map) {
            const percentage = Math.round((amount / total) * 100 * 10) / 10;
            const data = {
                "name": faculty,
                "value": amount,
                "label": `${faculty}: ${formattedAmount(amount)} (${percentage}%)`
            };
            res.push(data);
        }

        return { res, total };
    };

    const { res, total } = fundingData();

    const isMobile = () => {
        return window.screen.width <= 576;
    }

    const { width, height, layout } = (isMobile())
        ? { width: 350, height: 500, layout: "horizontal" }
        : { width: 700, height: 400, layout: "vertical" };

    const xAxis = (isMobile())
    ? (<XAxis type="category" hide />) : (<XAxis type="number" padding={{ right: 300 }} hide />);

    const yAxis = (isMobile())
    ? (<YAxis type="number" padding={{ top: 150 }} hide />) : (<YAxis type="category" hide />);

    const label = (isMobile())
    ? null : <LabelList width={500} dataKey="label" position="right" fill="#081252" style={{ fontStyle: "italic" }} />;

    const CustomToolTip = ({ active, payload, label }) => {
        if (active && payload && label) {
            return (
                <div className={styles["funding-tooltip"]}>
                    <p className="name">{res[label].name}:</p>
                    <p className="amount">{formattedAmount(payload[0].value)} ({Math.round((payload[0].value / total) * 100 * 10) / 10}%)</p>
                </div>
            );
        }

        return null;
    }


    return (
        <React.Fragment>
            <div className={styles.chart}>
                <BarChart width={width} height={height} layout={layout} data={res} >
                    {xAxis}
                    {yAxis}
                    { isMobile() && <Tooltip content={<CustomToolTip />} cursor={{ fill: "transparent" }} position={{ x: 100, y: 25 }}/>}
                    <Bar dataKey="value" fill="#081252" background={{ fill: "#EEE" }}>
                        {label}
                    </Bar>
                </BarChart>
            </div>
            <div className={styles.space}></div>
            <div className={styles.description}>
                The TLEF awarded the total of {total} funding for selected {len} projects.
            </div>
        </React.Fragment>
    );
};

export default FundingChart;