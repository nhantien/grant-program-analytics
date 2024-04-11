// react-router
import { Link } from "react-router-dom";
// css style
import styles from "./VerticalTableItem.module.css";

function VerticalTableItem({ project, server }) {

    const statusColor = project.status === "Active" ? "#64b53c" : "#d4734c";

    const formattedAmount = parseInt(project.funding_amount).toLocaleString("en-CA", {
        style: "currency",
        currency: "CAD",
        minimumFractionDigits: 0
    });

    return (
        <div className={styles.wrapper}>
            <div className={styles.field} style={{ backgroundColor: '#081252', color: "white", fontWeight: 700 }}>
                <div className={styles.key}>Title:</div>
                <div className={styles.value}>
                    <Link className={styles.title} to={`/summary/${project.id}${server === "staging" ? "?staging=true" : ""}`}>{project.title}</Link>
                </div>
            </div>

            <div className={styles.field}>
                <div className={styles.key}>Funding Year:</div>
                <div className={styles.value}>{project.funding_year}</div>
            </div>

            <div className={styles.field}>
                <div className={styles.key}>Project Type:</div>
                <div className={styles.value}>{project.project_type}</div>
            </div>

            <div className={styles.field}>
                <div className={styles.key}>Primary Investigator:</div>
                <div className={styles.value}>{project.pi_name}</div>
            </div>

            <div className={styles.field}>
                <div className={styles.key}>Faculty:</div>
                <div className={styles.value}>{project.project_faculty}</div>
            </div>

            <div className={styles.field}>
                <div className={styles.key}>Project Year:</div>
                <div className={styles.value}>{project.project_year}</div>
            </div>

            <div className={styles.field}>
                <div className={styles.key}>Amount:</div>
                <div className={styles.value}>{formattedAmount}</div>
            </div>

            <div className={styles.field}>
                <div className={styles.key}>Status:</div>
                <div className={styles.value} style={{ color: statusColor }}>{project.status}</div>
            </div>

            <div className={styles.field}>
                <div className={styles.key}>Report:</div>
                <div className={styles.value}>
                    {project.report ? <a href={project.report} target='_blank'>Report</a> : 'N/A'}
                </div>
            </div>

            <div className={styles.field}>
                <div className={styles.key}>Poster:</div>
                <div className={styles.value}>
                    {project.poster ? <a href={project.poster} target='_blank'>Poster</a> : 'N/A'}
                </div>
            </div>

        </div>
    )

}

export default VerticalTableItem;