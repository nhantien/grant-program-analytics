import { useParams, useLocation } from "react-router-dom";
import { HashLink } from 'react-router-hash-link';
import { SnapshotHeader, SnapshotBox, SimilarProjects } from "../components";
import styles from "./Snapshot.module.css";
import { useState } from "react";

function Snapshot() {
    const location = useLocation();
    const { projects } = location.state || {};

    const [selectedProjects, setSelectedProjects] = useState(projects);
    
    return (
        <div className={styles.Snapshot}>

            <SnapshotHeader projects={selectedProjects} />

            <div className={styles.navbar}>
                <HashLink smooth to="#num-grants">Number of Grants</HashLink>
                <HashLink smooth to="#num-projects">Number of Projects</HashLink>
                <HashLink smooth to="#funding">Funding Awarded</HashLink>
                <HashLink smooth to="#student-reach">Student Reach</HashLink>
                <HashLink smooth to="#team-member">Team Member Counts</HashLink>
                <HashLink smooth to="#similar-projects">Similar Projects</HashLink>
            </div>
            
            <section id="num-grants"> <SnapshotBox projects={selectedProjects} type={0} title="Number of Grants" /> </section>
            <section id="num-projects"> <SnapshotBox projects={selectedProjects} type={1} title="Number of Projects" /> </section>
            <section id="funding"> <SnapshotBox projects={selectedProjects} type={0} title="Funding Awarded" /> </section>
            <section id="student-reach"> <SnapshotBox projects={selectedProjects} type={1} title="Student Reach" /> </section>
            <section id="team-member"> <SnapshotBox projects={selectedProjects} type={0} title="Team Member Counts" /> </section>
            <section id="similar-projects"> <SimilarProjects project={selectedProjects} type="snapshot" /> </section>
        </div>
    );
};

export default Snapshot;