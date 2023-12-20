import styles from "./SummaryTableItem.module.css";
import { SAMPLE_TEAM_MEMBERS } from "../../constants";

function SummaryTableItem({ field, data, color }) {

    let dataHTML;

    //TODO: remove course name & replace with section code
    if (field === "Team Members") {
        dataHTML = (
            <div className={styles.data} style={{ backgroundColor: color }}>
                {data.map((name) =>
                    <div className={styles.member}>
                        <div className={styles.name}>
                            {name}
                        </div>
                        <div className={styles.job}>
                            {SAMPLE_TEAM_MEMBERS[name]}
                        </div>
                    </div>
                )}
            </div>
        );
    } else if (field === "Student Reach") {
        console.log(data);
        dataHTML = (
            <div className={styles.data} style={{ backgroundColor: color }}>
                <div className={styles.courses}>
                    {data.map((course) => (
                        <div className={styles.course}>{course}</div>
                    ))}
                </div>

                <div className={styles.reach}>
                    n student impact.
                </div>
            </div>
        )
    } else {
        dataHTML = (
            <div className={styles.data} style={{ backgroundColor: color }}>
                {data}
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.field}>
                {field}
            </div>

            {dataHTML}

        </div>
    );
}

export default SummaryTableItem;