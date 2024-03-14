import styles from "./SummaryTable.module.css";
import SummaryTableItem from "./SummaryTableItem";
import { SAMPLE_STUDENT_REACH } from "../../constants";

function SummaryTable({ data }) {

    const focusAreas = data.focus_areas.map((area) => area.replaceAll("_", " "));


    const formattedYear = `${data.funding_year}/${+data.funding_year + 1}`;

    const formattedAmount = parseInt(data.funding_amount).toLocaleString("en-CA", {
        style: "currency",
        currency: "CAD",
        minimumFractionDigits: 0
    });

    data.team_members.sort((a, b) => a.member_name.localeCompare(b.member_name));

    const pi = data.team_members.filter(function(member) {
        return member.member_name === data.pi_name;
    });

    const teamMembers = data.team_members.filter(function(member) {
        return member.member_name !== data.pi_name;
    });

    let totalCount = 0;
    data.student_reach.map((course) => {
        totalCount += course.reach;
    });

    const reachData = {
        courses: data.student_reach,
        count: totalCount
    };


    return (
        <div className={styles.bg}>
            <div className={styles.title}>
                Year {data.project_year} ({formattedYear})
            </div>

            <SummaryTableItem field="Primary Investigator" data={pi} color="#FFF" />
            <SummaryTableItem field="Project Type" data={data.project_type} color="#DFF2FF" />
            <SummaryTableItem field="Funded Amount" data={formattedAmount} color="#FFF" />
            {
                data.focus_areas.length > 0 &&
                <SummaryTableItem field="Focus Area(s)" data={focusAreas} color="#DFF2FF" />
            }
            <SummaryTableItem field="Team Members" data={teamMembers} color="#FFF" />
            {
                data.student_reach.length > 0 &&
                <SummaryTableItem field="Student Reach" data={reachData} color="#DFF2FF" />
            }
            {
                data.co_curricular_reach.length > 0 &&
                <SummaryTableItem field="Co-curricular Reach" data={data.co_curricular_reach} color="#FFF" />
            }
        </div>
    );
}

export default SummaryTable;