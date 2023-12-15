import { useParams, useLocation } from "react-router-dom";
import { HashLink } from 'react-router-hash-link';
import { Bar, BarChart, LabelList, Pie, PieChart, Tooltip, XAxis, YAxis } from 'recharts';
import { SnapshotHeader, SnapshotBox, SimilarProjects } from "../components";
import styles from "./Snapshot.module.css";
import { useState, useEffect } from "react";

function Snapshot() {

    const location = useLocation();
    const { projects } = location.state || {};
    const [selectedProjects, setSelectedProjects] = useState(projects);

    const formattedAmount = (amount) => {
        return (
            parseInt(amount).toLocaleString("en-CA", {
                style: "currency",
                currency: "CAD",
                minimumFractionDigits: 0
            })
        )
    };

    const fundingData = () => {
        const map = new Map();
        let total = 0;
        selectedProjects.forEach((project) => {
            const f = project.faculty;
            const a = parseInt(project.amount);

            if (map.has(f)) {
                map.set(f, map.get(f) + a);
            } else {
                map.set(f, a);
            }

            total += a;
        });
        const res = [];
        for (let [faculty, amount] of map) {
            const percentage = Math.round((amount / total) * 100 * 10) / 10;
            const data = {
                "name": faculty,
                "value": amount,
                "label": `${faculty}: ${formattedAmount(amount)} (${percentage}%)`
            };
            res.push(data);
        }

        return res;
    };

    const fundingChart = (
        <BarChart width={700} height={400} layout="vertical" data={fundingData()} barSize={25} >
            <XAxis type="number" padding={{right: 300}} hide />
            <YAxis type="category" hide />
            <Bar dataKey="value" fill="#081252" background={{fill: "#EEE"}}>
                <LabelList width={500} dataKey="label" position="right" fill="#081252" style={{ fontStyle: "italic"}} />
            </Bar>
        </BarChart>
    )

    return (
        <div className={styles.Snapshot}>

            <SnapshotHeader projects={selectedProjects} />

            <div className={styles.navbar}>
                <HashLink smooth to="#num-grants" onClick={() => console.log(projects)}>Number of Grants</HashLink>
                <HashLink smooth to="#num-projects">Number of Projects</HashLink>
                <HashLink smooth to="#funding">Funding Awarded</HashLink>
                <HashLink smooth to="#student-reach">Student Reach</HashLink>
                <HashLink smooth to="#team-member">Team Member Counts</HashLink>
                <HashLink smooth to="#similar-projects">Similar Projects</HashLink>
            </div>

            <section id="num-grants"> <SnapshotBox chart={null} type={0} title="Number of Grants" /> </section>
            <section id="num-projects"> <SnapshotBox chart={null} type={1} title="Number of Projects" /> </section>
            <section id="funding"> <SnapshotBox chart={fundingChart} type={0} title="Funding Awarded" /> </section>
            <section id="student-reach"> <SnapshotBox chart={null} type={1} title="Student Reach" /> </section>
            <section id="team-member"> <SnapshotBox chart={null} type={0} title="Team Member Counts" /> </section>
            <section id="similar-projects"> <SimilarProjects project={selectedProjects} type="snapshot" /> </section>
        </div>
    );
};

export default Snapshot;