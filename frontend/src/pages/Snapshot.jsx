// react
import { useState, useEffect, useContext } from "react";
// react-router
import { useLocation } from "react-router-dom";
// amplify
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api'
import config from '../aws-exports';
// css style
import styles from "./Snapshot.module.css";
// context
import { FiltersContext } from "../App";
// components
import { SnapshotHeader, SnapshotBox } from "../components/snapshot";
import { FundingChart, NumGrantsChart, NumProjectsChart, StudentReachChart, TeamMemberChart, SuccessRateChart } from "../components/charts";
// constants
import { Project } from "../constants";



Amplify.configure(config);

function Snapshot() {

    const { appliedFilters } = useContext(FiltersContext);
    
    const location = useLocation();
    const { projects, range } = location.state;
    const [selectedProjects, setSelectedProjects] = useState(projects);
    const [selectedRange, setSelectedRange] = useState(range);

    const generateQueryString = (filters) => {

        const str = `query testGetFilteredProjects {
            getFilteredProjects(method: "getFilteredProjects", filter: {
                funding_year: ${JSON.stringify(filters["funding_year"])},
                project_faculty: ${JSON.stringify(filters["project_faculty"])},
                project_type: ${JSON.stringify(filters["project_type"])},
                focus_area: ${JSON.stringify(filters["focus_area"])},
                search_text: ${JSON.stringify(filters["search_text"])}
            }) {
                grant_id
                project_id
                funding_year
                project_type
                pi_name
                project_faculty
                department
                funding_amount
            }
        }`;

        console.log(str);

        return str;
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const query_string = generateQueryString(appliedFilters);
                const client = generateClient()
                const results = await client.graphql({
                    query: query_string,
                });

                const proposals = results.data.getFilteredProjects;
                const newProjects = proposals.map((proj) => {
                    return new Project(
                        proj.grant_id,
                        proj.funding_year + "/" + (+proj.funding_year + 1),
                        proj.project_type,
                        proj.pi_name,
                        proj.project_faculty,
                        "sample title",
                        "1",
                        // proj.project_year,
                        proj.funding_amount,
                        "Active"
                    );
                });

                setSelectedProjects(newProjects);

            } catch (e) {
                console.log(e);
            }
        };

        fetchData();
    }, [appliedFilters]);

    const handleClick = (section) => {
        document.getElementById(section).scrollIntoView({ behavior: "smooth" });
    };

    const charts = {
        successRate: (<SuccessRateChart projects={selectedProjects} />),
        numGrants: (<NumGrantsChart projects={selectedProjects} />),
        numProjects: (<NumProjectsChart projects={selectedProjects} />),
        funding: (<FundingChart projects={selectedProjects} />),
        studentReach: (<StudentReachChart />),
        teamMember: (<TeamMemberChart />)
    };

    return (
        <div className={styles.Snapshot}>

            <SnapshotHeader range={selectedRange} setRange={setSelectedRange} />

            <div className={styles.navbar}>
                <button onClick={() => handleClick("success-rate")}>Success Rate</button>
                <button onClick={() => handleClick("num-grants")}>Number of Grants</button>
                <button onClick={() => handleClick("num-projects")}>Number of Projects</button>
                <button onClick={() => handleClick("funding")}>Funding Awarded</button>
                <button onClick={() => handleClick("student-reach")}>Student Reach</button>
                <button onClick={() => handleClick("faculty-engagement")}>Faculty Engagement</button>
            </div>

            <section id="success-rate"> <SnapshotBox chart={charts.successRate} type={1} title="Success Rate" /></section>
            <section id="num-grants"> <SnapshotBox chart={charts.numGrants} type={0} title="Number of Grants" /> </section>
            <section id="num-projects"> <SnapshotBox chart={charts.numProjects} type={1} title="Number of Projects" /> </section>
            <section id="funding"> <SnapshotBox chart={charts.funding} type={0} title="Funding Awarded" /> </section>
            <section id="student-reach"> <SnapshotBox chart={charts.studentReach} type={1} title="Student Reach" /> </section>
            <section id="faculty-engagement"> <SnapshotBox chart={charts.teamMember} type={0} title="Faculty Engagement" /> </section>
        </div>
    );
};

export default Snapshot;