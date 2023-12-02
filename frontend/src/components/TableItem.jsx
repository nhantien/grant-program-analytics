import { Project } from "../constants";
import "./TableItem.css";

const TableItem = ({ project }) => {
  return (
    <tr style={{ position: "relative" }}>
      <td>{project.fundingYear}</td>
      <td>{project.type}</td>
      <td>{project.investigator}</td>
      <td>{project.faculty}</td>
      <td>{project.title}</td>
      <td>{project.projectYear}</td>
      <td>${project.amount}</td>
      <td>{project.status}</td>
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