// react-router
import { Link } from "react-router-dom";
// css style
import styles from "./TableItem.module.css";

function TableItem({ project, color }) {

  const bgColor = color ? "white" : "#DFF2FF";
  const statusColor = project.status === "Active\r" ? "#d4734c" : "#64b53c";

  const formattedAmount = parseInt(project.amount).toLocaleString("en-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 0
  });

  const titleText = (window.screen.width <= 576 && project.title.length > 30) ? project.title.slice(0, 30) + "..." : project.title;

  return (
    <tr className={project.id < 0 ? styles.hide : ""} style={{ position: "relative", backgroundColor: bgColor }}>
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
    </tr>
  );

}

export default TableItem;