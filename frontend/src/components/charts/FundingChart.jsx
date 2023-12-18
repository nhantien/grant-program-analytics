import { Bar, BarChart, LabelList, XAxis, YAxis } from 'recharts';
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

        const totalAmount = formattedAmount(total);

        return { res, totalAmount};
    };

    return (
        <React.Fragment>
            <div className={styles.chart}>
                <BarChart width={700} height={400} layout="vertical" data={fundingData().res} >
                    <XAxis type="number" padding={{ right: 300 }} hide />
                    <YAxis type="category" hide />
                    <Bar dataKey="value" fill="#081252" background={{ fill: "#EEE" }}>
                        <LabelList width={500} dataKey="label" position="right" fill="#081252" style={{ fontStyle: "italic" }} />
                    </Bar>
                </BarChart>
            </div>
            <div className={styles.space}></div>
            <div className={styles.description}>
                The TLEF awarded the total of {fundingData().totalAmount} funding for selected {len} projects.
            </div>
        </React.Fragment>
    );
};

export default FundingChart;