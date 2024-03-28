import { Grid } from "@mui/material";
import styles from "./SummaryTableItem.module.css";

function SummaryTableItem({ field, data, color }) {

    let dataHTML;
    if (field === "Primary Investigator") {
        dataHTML = (
            <div className={styles.data} style={{ backgroundColor: color }}>
                {data.map((member) =>
                    <Grid key={`summary-table-item-pi`} container spacing={1} style={{ alignItems: "center" }}>
                        <Grid item xs={5} sm={3}>
                            {member.member_name}
                        </Grid>
                        <Grid item xs={7} sm={9}>
                            {member.member_title}, {member.member_faculty}
                        </Grid>
                    </Grid>
                )}
            </div>
        )
    }
    else if (field === "Focus Area(s)") {
        dataHTML = (
            <div className={styles.data} style={{ backgroundColor: color }}>
                <Grid container>
                    <Grid item xs={12}>
                        {data.join(", ")}
                    </Grid>
                </Grid>
            </div>
        );
    } else if (field === "Team Members") {
        dataHTML = (
            <div className={styles.data} style={{ backgroundColor: color }}>
                {data.map((member, i) =>
                    <div key={`summary-table-item-member-${i}`} className={styles.member}>
                        <Grid container spacing={1}>
                            <Grid item xs={4} sm={3}>
                                {member.member_name}
                            </Grid>
                            <Grid item xs={7} sm={9}>
                                {member.member_title}, {member.member_faculty}
                            </Grid>
                        </Grid>
                    </div>
                )}
            </div>
        );
    } else if (field === "Student Reach") {
        dataHTML = (
            <div className={styles.data} style={{ backgroundColor: color }}>
                <div className={styles.courses}>
                    {data.courses.map((course, i) => (
                        <div key={`course-${i}`} className={styles.course}>{course.course_name} {course.section}</div>
                    ))}
                </div>

                <div className={styles.reach}>
                    {data.count} students impacted.
                </div>
            </div>
        )
    } else {
        dataHTML = (
            <Grid container>
                <Grid item xs={12}>
                    <div className={styles.data} style={{ backgroundColor: color }}>
                        {data}
                    </div>
                </Grid>
            </Grid>
        );
    }

    return (
        <div className={styles.container}>
            <Grid container>
                <Grid item xs={12} sm={3}>
                    <div className={styles.field}>
                        {field}
                    </div>
                </Grid>
                <Grid item xs={12} sm={9}>
                    {dataHTML}
                </Grid>
            </Grid>
        </div>
    );
}

export default SummaryTableItem;