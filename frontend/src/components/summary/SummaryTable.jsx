import { Grid } from "@mui/material";
import styles from "./SummaryTable.module.css";
import SummaryTableItem from "./SummaryTableItem";

function SummaryTable({ data }) {

    const focusAreas = data.focus_areas.map((area) => area.replaceAll("_", " "));

    const formattedYear = `${data.funding_year}/${+data.funding_year + 1}`;

    const formattedAmount = parseInt(data.funding_amount).toLocaleString("en-CA", {
        style: "currency",
        currency: "CAD",
        minimumFractionDigits: 0
    });

    data.team_members.sort((a, b) => a.member_name.localeCompare(b.member_name));

    const pi_as_member = data.team_members.filter(function (member) {
        return member.member_name === data.pi_name;
    });

    const pi = pi_as_member.length > 0 ? pi_as_member : [{
        member_name: data.pi_name,
        member_position: "",
        member_faculty: "",
    }];

    const teamMembers = data.team_members.filter(function (member) {
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
            <Grid container>
                <Grid item xs={12}>
                    <div className={styles.title}>
                        Year {data.project_year} ({formattedYear})
                    </div>
                </Grid>
                <Grid item xs={12}>
                    <SummaryTableItem field="Primary Investigator" data={pi} color="#FFF" />
                    <SummaryTableItem field="Project Type" data={data.project_type} color="#FFF" />
                    <SummaryTableItem field="Funded Amount" data={formattedAmount} color="#FFF" />
                    {
                        data.focus_areas.length > 0 &&
                        <SummaryTableItem field="Focus Area(s)" data={focusAreas} color="#FFF" />
                    }{
                        teamMembers.length > 0 &&
                        <SummaryTableItem field="Team Members" data={teamMembers} color="#FFF" />
                    }
                    {
                        data.student_reach.length > 0 &&
                        <SummaryTableItem field="Student Reach" data={reachData} color="#FFF" />
                    }
                    {
                        data.co_curricular_reach.length > 0 &&
                        <SummaryTableItem field="Co-curricular Reach" data={data.co_curricular_reach} color="#FFF" />
                    }
                </Grid>
            </Grid>
        </div>
    );
}

export default SummaryTable;