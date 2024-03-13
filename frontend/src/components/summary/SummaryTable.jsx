import styles from "./SummaryTable.module.css";
import SummaryTableItem from "./SummaryTableItem";
import { SAMPLE_STUDENT_REACH } from "../../constants";

function SummaryTable({ data }) {

    const focusAreas = data.focus_areas.join(", ");

    const formattedAmount = parseInt(data.funding_amount).toLocaleString("en-CA", {
        style: "currency",
        currency: "CAD",
        minimumFractionDigits: 0
    });


    return (
        <div className={styles.bg}>
            <div className={styles.title}>
                Year {data.project_year} (2020/21)
            </div>

            <SummaryTableItem field="Primary Investigator" data={data.pi_name} color="#FFF" />
            <SummaryTableItem field="Project Type" data={data.project_type} color="#DFF2FF" />
            <SummaryTableItem field="Funded Amount" data={formattedAmount} color="#FFF" />
            <SummaryTableItem field="Focus Area(s)" data={focusAreas} color="#DFF2FF" />
            <SummaryTableItem field="Team Members" data={data.team_members} color="#FFF" />
            <SummaryTableItem field="Student Reach" data={SAMPLE_STUDENT_REACH} color="#DFF2FF" />
            {
                data.co_curricular_reach.length > 0 &&
                <SummaryTableItem field="Co-curricular Reach" data={data.co_curricular_reach} color="#FFF" />
            }
        </div>
    );
}

export default SummaryTable;