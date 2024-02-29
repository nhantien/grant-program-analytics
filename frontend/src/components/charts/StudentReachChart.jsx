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

function StudentReachChart( {projects, reachdata}) {

    const { appliedFilters } = useContext(FiltersContext);

    //const appliedscience = projects.filter(proj => projects.project_faculty === 'APSC');
    //console.log(appliedscience)

    let isDataComplete = true;

    // convert funding_year value from string to int
    // e.g. "2022/2023" -> 2022
    const convertYear = (year) => {
        const yearStr = year.substring(0, year.indexOf("/"));
        return parseInt(yearStr);
    }

    // no student reach data prior to 2016: flag if current filters contain years before 2016
    // displays warning message
    const years = appliedFilters["funding_year"];
    console.log(years);
    years.map((year) => {
        const yearInt = convertYear(year);
        if (yearInt < 2016) {
            isDataComplete = false;
        }
    });

    const customLabel = (props) => {
        const { x, y, width, height, value } = props;
        return (
            <text x={820} y={y + height / 3 * 2} textAnchor="end" fill="#081252" fontStyle="italic">
                {value.toLocaleString()} Students
            </text>
        )
    };

    // Transformation
    const STUDENT_REACH = [];
    console.log(projects)

    const calculateSmallReach = (faculty) => {
        const smallReach = projects.Small.find((item) => item.project_faculty === faculty)?.reach || 0;
        return smallReach;
      };

    const calculateLargeReach = (faculty) => {
        const largeReach = projects.Large.find((item) => item.project_faculty === faculty)?.reach || 0;
        return largeReach;
      };
    
      const totalLargeReach = projects.Large.reduce((sum, item) => sum + item.reach, 0);
      const totalSmallReach = projects.Small.reduce((sum, item) => sum + item.reach, 0);
      console.log('total large reach', totalLargeReach)
    
      projects.Small.forEach((item) => {
        const faculty = item.project_faculty;
        const smallReach = calculateSmallReach(faculty);
        const largeReach = calculateLargeReach(faculty);    
      
        STUDENT_REACH.push({
          name: faculty,
          "Large TLEF": largeReach,
          "Small TLEF": smallReach,
          total: largeReach + smallReach
        });
    });
    
    console.log(STUDENT_REACH)
    console.log(reachdata)

    return (
        <React.Fragment>
            <div className={styles.chart}>
                <BarChart width={850} height={500} layout='vertical' data={STUDENT_REACH}>
                    <XAxis type='number' padding={{ right: 150}} />
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
                <p>TLEF projects funded in the selected year(s) reached <b>{totalSmallReach}</b> students in Small TLEF innovation projects and
                 <b> {totalLargeReach}</b> students in Large TLEF Transformation projects.</p>
                <p>Overall, the projects reached <b>{reachdata.course}</b> courses (undergraduate and graduate) and <b>{reachdata.section}</b> sections
                 across <b>{reachdata.faculty}</b> Faculties at the UBCV campus, impacting <b>{totalSmallReach + totalLargeReach}</b> enrolments and <b>1000</b> unique students.*</p>

                 <p className={styles["reach-annotation"]}>
                    *Students enrolled in more than one TLEF-supported course are only counted once.
                 </p>
            </div>
        </React.Fragment>
    );
};

export default StudentReachChart;