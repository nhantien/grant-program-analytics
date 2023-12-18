import { useLocation } from "react-router-dom";
import { SnapshotHeader, SnapshotBox, SimilarProjects } from "../components";
import { FundingChart, NumGrantsChart, NumProjectsChart, StudentReachChart, TeamMemberChart } from "../components/charts";
import styles from "./Snapshot.module.css";

function Snapshot() {

    const location = useLocation();
    const { projects } = location.state || {};

    

    const handleClick = (section) => {
        document.getElementById(section).scrollIntoView({ behavior: "smooth" });
    };

    const charts = {
        numGrants: (<NumGrantsChart projects={projects} />),
        numProjects: (<NumProjectsChart projects={projects} />),
        funding: (<FundingChart projects={projects} />),
        studentReach: (<StudentReachChart projects={projects} />),
        teamMember: (<TeamMemberChart projects={projects} />)
    };

    return (
        <div className={styles.Snapshot}>

            <SnapshotHeader projects={projects} />

            <div className={styles.navbar}>
                <button onClick={() => handleClick("num-grants")}>Number of Grants</button>
                <button onClick={() => handleClick("num-projects")}>Number of Projects</button>
                <button onClick={() => handleClick("funding")}>Funding Awarded</button>
                <button onClick={() => handleClick("student-reach")}>Student Reach</button>
                <button onClick={() => handleClick("team-member")}>Team Member Counts</button>
                <button onClick={() => handleClick("similar-projects")}>Similar Projects</button>
            </div>

            <section id="num-grants"> <SnapshotBox chart={charts.numGrants} type={0} title="Number of Grants" /> </section>
            <section id="num-projects"> <SnapshotBox chart={charts.numProjects} type={1} title="Number of Projects" /> </section>
            <section id="funding"> <SnapshotBox chart={charts.funding} type={0} title="Funding Awarded" /> </section>
            <section id="student-reach"> <SnapshotBox chart={charts.studentReach} type={1} title="Student Reach" /> </section>
            <section id="team-member"> <SnapshotBox chart={charts.teamMember} type={0} title="Team Member Counts" /> </section>
            <section id="similar-projects"> <SimilarProjects project={projects} type="snapshot" /> </section>
        </div>
    );
};

export default Snapshot;