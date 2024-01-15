import { Link } from "react-router-dom";

import styles from "./VerticalTableItem.module.css";
import { useState } from "react";

function VerticalTableItem({ project, isSelected, onSelect }) {

    const [status, setStatus] = useState(isSelected);
    const statusColor = project.status === "Active\r" ? "#d4734c" : "#64b53c";

    const formattedAmount = parseInt(project.amount).toLocaleString("en-CA", {
        style: "currency",
        currency: "CAD",
        minimumFractionDigits: 0
    });

    const titleText = project.title.slice(0, 30) + "...";

    const handleSelect = () => {
        if (status) {
            setStatus(false);
            onSelect(prevSelected => prevSelected.filter(proj => proj !== project.id));
        } else {
            setStatus(true);
            onSelect(prevSelected => [...prevSelected, project.id]);
        }
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.field} style={{ backgroundColor: '#081252', color: "white", fontWeight: 700 }}>
                <div className={styles.key}>Title:</div>
                <div className={styles.value}><Link className={styles.title} to={`/summary/${project.id}`}>{titleText}</Link></div>
            </div>

            <div className={styles.field}>
                <div className={styles.key}>Funding Year:</div>
                <div className={styles.value}>{project.fundingYear}</div>
            </div>

            <div className={styles.field}>
                <div className={styles.key}>Project Type:</div>
                <div className={styles.value}>{project.type}</div>
            </div>

            <div className={styles.field}>
                <div className={styles.key}>Primary Investigator:</div>
                <div className={styles.value}>{project.investigator}</div>
            </div>

            <div className={styles.field}>
                <div className={styles.key}>Faculty:</div>
                <div className={styles.value}>{project.faculty}</div>
            </div>

            <div className={styles.field}>
                <div className={styles.key}>Project Year:</div>
                <div className={styles.value}>{project.projectYear}</div>
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
                <div className={styles.value}><a href={project.report}>Link to Report</a></div>
            </div>

            <div className={styles.field}>
                <div className={styles.key}>Poster:</div>
                <div className={styles.value}><a href={project.poster}>Link to Poster</a></div>
            </div>

            <div className={styles["select-btn"]}>
                <span>Select project</span>
                <input type="checkbox" checked={status} onChange={handleSelect} />
            </div>

        </div>
    )

    //   return (
    //     <tr style={{ position: "relative", backgroundColor: bgColor }}>
    //       <td>{project.fundingYear}</td>
    //       <td>{project.type}</td>
    //       <td>{project.investigator}</td>
    //       <td>{project.faculty}</td>
    //       <td style={{ textAlign: "start" }}> <Link to={`/summary/${project.id}`}>{titleText}</Link> </td>
    //       <td>{project.projectYear}</td>
    //       <td>{formattedAmount}</td>
    //       <td style={{ color: statusColor }}>{project.status}</td>
    //       <td><a href={project.report}>Link to Report</a></td>
    //       <td><a href={project.poster}>Link to Poster</a></td>
    //       <div className={styles["select-btn"]}>
    //         <span>Select project</span>
    //         <input type="checkbox" checked={status} onChange={handleSelect} />
    //       </div>
    //     </tr>
    //   );

}

export default VerticalTableItem;