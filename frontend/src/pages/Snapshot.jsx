import { useParams, useLocation } from "react-router-dom";
import { SnapshotHeader } from "../components";
import styles from "./Snapshot.module.css";

function Snapshot() {
    const location = useLocation();
    const { projects } = location.state || null;
    
    return (
        <div className={styles.Snapshot}>
            <SnapshotHeader projects={projects} />
        </div>
    );
};

export default Snapshot;