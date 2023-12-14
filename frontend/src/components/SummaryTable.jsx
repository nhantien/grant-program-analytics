import styles from "./SummaryTable.module.css";
import SummaryTableItem from "./SummaryTableItem";
import { SAMPLE_TEAM_MEMBERS, SAMPLE_STUDENT_REACH } from "../constants";

function SummaryTable({ project }) {

    const focusAreas = `Resource development, infrastructure development, resource sustainability, experiential and work-integrated learning`;
    const coCurricularReach =
        `
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod 
    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
    `;

    const formattedAmount = parseInt(project.amount).toLocaleString("en-CA", {
        style: "currency",
        currency: "CAD",
        minimumFractionDigits: 0
    });

    const nameArray = project.investigator.split(" ");
    const formattedName = nameArray[1] + ", " + nameArray[0] + ".";

    const memberNames = Array.from(Object.keys(SAMPLE_TEAM_MEMBERS)).sort();


    return (
        <div className={styles.bg}>
            <div className={styles.title}>
                Year 1 (2020/21)
            </div>

            <SummaryTableItem field="Primary Investigator" data={formattedName} color="#FFF" />
            <SummaryTableItem field="Project Type" data={project.type} color="#DFF2FF" />
            <SummaryTableItem field="Funded Amount" data={formattedAmount} color="#FFF" />
            <SummaryTableItem field="Focus Area(s)" data={focusAreas} color="#DFF2FF" />
            <SummaryTableItem field="Team Members" data={memberNames} color="#FFF" />
            <SummaryTableItem field="Student Reach" data={SAMPLE_STUDENT_REACH} color="#DFF2FF" />
            <SummaryTableItem field="Co-curricular Reach" data={coCurricularReach} color="#FFF" />
        </div>
    );
}

export default SummaryTable;