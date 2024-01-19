import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { SnapshotHeader, SnapshotBox } from "../components/snapshot";
import { FundingChart, NumGrantsChart, NumProjectsChart, StudentReachChart, TeamMemberChart } from "../components/charts";
import { Project } from "../constants";
import styles from "./Snapshot.module.css";

function Snapshot() {

    const location = useLocation();
    console.log(location.state);
    const { projects, filters } = location.state;

    const [selectedProjects, setSelectedProjects] = useState(projects);
    const [appliedFilters, setAppliedFilters] = useState(filters);

    const BASE_URL = 'http://localhost:3001/';
    useEffect(() => {
        const fetchFilteredData = async () => {
            try {
                const res = await fetch(BASE_URL + "filter", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", },
                    body: JSON.stringify({ appliedFilters }),
                });
                if (!res.ok) throw new Error("Network response was not ok");

                const data = await res.json();
                const newProjects = data.map((proj) => {

                    // Make sure to return the new Project instance
                    return new Project(
                        proj.ID,
                        proj.FundingYear,
                        proj.ProjectType,
                        proj.Investigator,
                        proj.Faculty,
                        proj.Title,
                        "1",
                        proj.Amount,
                        proj.ProjectStatus
                    );
                });

                setSelectedProjects(newProjects);
            } catch (err) {
                console.log(err);
            }
        };

        fetchFilteredData();
    }, [appliedFilters]);

    const handleClick = (section) => {
        document.getElementById(section).scrollIntoView({ behavior: "smooth" });
    };

    const charts = {
        numGrants: (<NumGrantsChart projects={selectedProjects} />),
        numProjects: (<NumProjectsChart projects={selectedProjects} />),
        funding: (<FundingChart projects={selectedProjects} />),
        studentReach: (<StudentReachChart projects={selectedProjects} />),
        teamMember: (<TeamMemberChart projects={selectedProjects} />)
    };

    return (
        <div className={styles.Snapshot}>

            <SnapshotHeader projects={selectedProjects} filters={appliedFilters} setFilters={setAppliedFilters} />

            <div className={styles.navbar}>
                <button onClick={() => handleClick("num-grants")}>Number of Grants</button>
                <button onClick={() => handleClick("num-projects")}>Number of Projects</button>
                <button onClick={() => handleClick("funding")}>Funding Awarded</button>
                <button onClick={() => handleClick("student-reach")}>Student Reach</button>
                <button onClick={() => handleClick("team-member")}>Team Member Counts</button>
            </div>

            <section id="num-grants"> <SnapshotBox chart={charts.numGrants} type={0} title="Number of Grants" /> </section>
            <section id="num-projects"> <SnapshotBox chart={charts.numProjects} type={1} title="Number of Projects" /> </section>
            <section id="funding"> <SnapshotBox chart={charts.funding} type={0} title="Funding Awarded" /> </section>
            <section id="student-reach"> <SnapshotBox chart={charts.studentReach} type={1} title="Student Reach" /> </section>
            <section id="team-member"> <SnapshotBox chart={charts.teamMember} type={0} title="Team Member Counts" /> </section>
        </div>
    );
};

export default Snapshot;