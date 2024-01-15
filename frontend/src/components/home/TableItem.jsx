import { Link } from "react-router-dom";

import styles from "./TableItem.module.css";
import { useState } from "react";

function TableItem({ project, color, isSelected, onSelect }) {

  const [status, setStatus] = useState(isSelected);

  const bgColor = color ? "white" : "#DFF2FF";
  const statusColor = project.status === "Active\r" ? "#d4734c" : "#64b53c";

  const formattedAmount = parseInt(project.amount).toLocaleString("en-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 0
  });

  const titleText = (window.screen.width <= 576 && project.title.length > 30) ? project.title.slice(0, 30) + "..." : project.title;

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
    <tr style={{ position: "relative", backgroundColor: bgColor }}>
      <td>{project.fundingYear}</td>
      <td>{project.type}</td>
      <td>{project.investigator}</td>
      <td>{project.faculty}</td>
      <td style={{ textAlign: "start" }}> <Link to={`/summary/${project.id}`}>{titleText}</Link> </td>
      <td>{project.projectYear}</td>
      <td>{formattedAmount}</td>
      <td style={{ color: statusColor }}>{project.status}</td>
      <td><a href={project.report}>Link to Report</a></td>
      <td><a href={project.poster}>Link to Poster</a></td>
      <div className={styles["select-btn"]}>
        <span>Select project</span>
        <input type="checkbox" checked={status} onChange={handleSelect} />
      </div>
    </tr>
  );

}

export default TableItem;