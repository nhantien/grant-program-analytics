// react
import React, { useContext } from 'react';
// recharts
import { Bar, BarChart, LabelList, Legend, XAxis, YAxis } from 'recharts';
// css style
import styles from "./charts.module.css";
// context
import { FiltersContext } from '../../App';
// constants
import { SAMPLE_STUDENT_REACH } from '.';

function StudentReachChart() {

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
        if (yearInt < 2016) {
            isDataComplete = false;
        }
    });

    const customLabel = (props) => {
        const { x, y, width, height, value } = props;
        return (
            <text x={820} y={y + height / 3 * 2} textAnchor="end" fill="#081252" fontStyle="italic">
                {value.toLocaleString()}
            </text>
        )
    };

    return (
        <React.Fragment>
            <div className={styles.chart}>
                <BarChart width={850} height={500} layout='vertical' data={SAMPLE_STUDENT_REACH}>
                    <XAxis type='number' padding={{ right: 150}} hide />
                    <YAxis type='category' dataKey="name" width={120} />
                    <Legend verticalAlign='top' iconType='square' height={36} />
                    <Bar dataKey="Small TLEF" stackId="a" background={{ fill: "#EEEE" }} fill="#FB812D" />
                    <Bar dataKey="Large TLEF" stackId="a" fill="#13588B">
                    <LabelList width={500} content={customLabel} position="right" dataKey="total" fill="#081252" style={{ fontStyle: "italic" }} />
                    </Bar>
                </BarChart>
            </div>
            <div className={styles.space}></div>
            <div className={styles.description}>
                {!isDataComplete &&
                    <p className={styles.warning}>Please note, this particular TLEF metric is not available prior to the 2016/17 academic year.</p>
                }
                <p>TLEF projects funded in the selected year(s) reached <b>21,002</b> students in Small TLEF innovation projects and
                 <b>11,493</b> students in Large TLEF Transformation projects.</p>
                <p>Overall, the projects reached <b>162</b> courses (undergraduate and graduate) and <b>399</b> sections
                 across 9 Faculties at the UBCV campus, impacting <b>32,495</b> enrolments and <b>18,182</b> unique students.*</p>

                 <p className={styles["reach-annotation"]}>
                    *Students enrolled in more than one TLEF-supported course are only counted once.
                 </p>
            </div>
        </React.Fragment>
    );
};

export default StudentReachChart;