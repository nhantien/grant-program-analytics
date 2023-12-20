import styles from "./SummaryTitle.module.css";

function SummaryTitle({ project }) {
    return (

        <div className={styles.bg}>
            <div className={styles.container}>
                <div className={styles.title}>
                    {project.title}
                </div>
                <div className={styles.status}>
                    {project.status}
                </div>
            </div>

            <div className={styles.container}>
                <div className={styles.faculty}>
                    {project.faculty}
                </div>
                <div className={styles.years}>
                    3 Years (April 2020 - April 2023)
                </div>
            </div>
        </div>
    );
}

export default SummaryTitle;