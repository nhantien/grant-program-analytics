import "./TableItem.css";
import { Link } from "react-router-dom";

function TableItem({ project, color, onSelect }) {

  const bgColor = color ? "white" : "#DFF2FF";
  const statusColor = project.status === "Active\r" ? "#d4734c" : "#64b53c";

  const formattedAmount = parseInt(project.amount).toLocaleString("en-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 0
  });

  const handleSelect = () => {
    if (project.isSelected) {
      project.isSelected = false;
      onSelect(prevSelected => prevSelected.filter(proj => proj !== project));
    } else {
      project.isSelected = true;
      onSelect(prevSelected => [...prevSelected, project]);
    }
  };

  return (
    <tr style={{ position: "relative", backgroundColor: bgColor }}>
      <td>{project.fundingYear}</td>
      <td>{project.type}</td>
      <td>{project.investigator}</td>
      <td>{project.faculty}</td>
      <td style={{ textAlign: "start" }}> <Link to={`/summary/${project.id}`}>{project.title}</Link> </td>
      <td>{project.projectYear}</td>
      <td>{formattedAmount}</td>
      <td style={{ color: statusColor }}>{project.status}</td>
      <td><a href={project.report}>Link to Report</a></td>
      <td><a href={project.poster}>Link to Poster</a></td>
      <div className="select-btn">
        <span>Select project</span>
        <input type="checkbox" checked={project.isSelected} onChange={handleSelect} />
      </div>
    </tr>
  );

}

export default TableItem;