import "./TableItem.css";

const TableItem = ({ project, color }) => {
  const bgColor = color ? "white" : "#DFF2FF";
  const statusColor = project.status === "Active\r" ? "#d4734c" : "#64b53c"
  return (
    <tr style={{ position: "relative", backgroundColor: bgColor }}>
      <td>{project.fundingYear}</td>
      <td>{project.type}</td>
      <td>{project.investigator}</td>
      <td>{project.faculty}</td>
      <td style={{textAlign: "start"}}>{project.title}</td>
      <td>{project.projectYear}</td>
      <td>${project.amount}</td>
      <td style={{ color: statusColor }}>{project.status}</td>
      <td><a href={project.report}>Link to Report</a></td>
      <td><a href={project.poster}>Link to Poster</a></td>
      <div className="select-btn">
        <span>Select project</span>
        <input type="checkbox" />
      </div>
    </tr>
  );
}

export default TableItem;