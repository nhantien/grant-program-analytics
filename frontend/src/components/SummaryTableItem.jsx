import styles from "./SummaryTableItem.module.css";

function SummaryTableItem({ field, data, color }) {

    let dataHTML;

    if (field === "Team Members") {
        console.log(data);
        dataHTML = (
            <div className={styles.teamMembers} style={{ backgroundColor: color }}>
                {Object.entries(data).map(([key, value]) => (
                    <div className={styles.member} key={key}>
                        <div className={styles.name}>
                            {key}
                        </div>
                        <div className={styles.job}>
                            {value}
                        </div>
                    </div>
                ))}
            </div>
        );
    } else if (field === "Student Reach") {
        console.log(data);
        dataHTML = (
            <div className={styles.studentReach} style={{ backgroundColor: color }}>
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