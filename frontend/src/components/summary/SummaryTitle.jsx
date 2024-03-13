import styles from "./SummaryTitle.module.css";

function SummaryTitle({ data }) {
    return (

        <div className={styles.bg}>
            <div className={styles.container}>
                <div className={styles.title}>
                    {data.title}
                </div>
                <div className={styles.status}>
                    {data.status}
                </div>
            </div>

            <div className={styles.container}>
                <div className={styles.faculty}>
                    {data.project_faculty}
                </div>
                <div className={styles.years}>
                    {data.years} years
                </div>
            </div>
        </div>
    );
}

export default SummaryTitle;