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
    const [selectedSuccessProjects, setSelectedSuccessProjects] = useState(projects);
    const [selectedFacultyProjects, setSelectedFacultyProjects] = useState({});
    const [selectedRange, setSelectedRange] = useState(range);
    const [selectedLargeProjects, setSelectedLargeProjects] = useState({});
    const [selectedSmallProjects, setSelectedSmallProjects] = useState({});

    // Success Rate Chart 
    const generateSuccessQueryString = (filters) => {

        const str = `query testCountDeclinedProjects {
            countDeclinedProjects(method: "countDeclinedProjects", filter: {
                funding_year: ${JSON.stringify(filters["funding_year"])},
                project_faculty: ${JSON.stringify(filters["project_faculty"])},
                project_type: ${JSON.stringify(filters["project_type"])},
                focus_area: ${JSON.stringify(filters["focus_area"])},
                search_text: ${JSON.stringify(filters["search_text"])}
            }) {
                Large
                Small
            }
        }`;

        console.log(str);

        return str;
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const query_string = generateSuccessQueryString(appliedFilters);
                const client = generateClient()
                const results = await client.graphql({
                    query: query_string,
                });

                const num = results.data.countDeclinedProjects;
                console.log(num)

                setSelectedSuccessProjects(num);

            } catch (e) {
                console.log(e);
            }
        };

        fetchData();
    }, [appliedFilters]);

    // Funding Chart
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
        const fetchProjectData = async () => {
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

                 // Filter projects based on project_type
            const largeProjects = proposals.filter(proj => proj.project_type === 'Large');
            const smallProjects = proposals.filter(proj => proj.project_type === 'Small');

            setSelectedProjects(newProjects);
            setSelectedLargeProjects(largeProjects);
            setSelectedSmallProjects(smallProjects);
            

            } catch (e) {
                console.log(e);
            }
        };

        fetchProjectData();
    }, [appliedFilters]);

    // Faculty Engagement Chart 
    const generateFacultyQueryString = (filters) => {

        const str = `query testCountFacultyMembersByStream {
            countFacultyMembersByStream(method: "countFacultyMembersByStream", filter: {
                funding_year: ${JSON.stringify(filters["funding_year"])},
                project_faculty: ${JSON.stringify(filters["project_faculty"])},
                project_type: ${JSON.stringify(filters["project_type"])},
                focus_area: ${JSON.stringify(filters["focus_area"])},
                search_text: ${JSON.stringify(filters["search_text"])}
            }) {
                Large {
                    Admin
                    Student
                    External
                    Research
                    Teaching
                }
                Small {
                    Admin
                    Student
                    External
                    Research
                    Teaching
                }
            }
        }`;

        console.log(str);

        return str;
    }

    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchFacultyData = async () => {
            try {
                const query_string = generateFacultyQueryString(appliedFilters);
                console.log(query_string)
                const client = generateClient()
                const results = await client.graphql({
                    query: query_string,
                });

                const faculty = results.data.countFacultyMembersByStream;
                console.log(faculty)
                setLoading(false);

                setSelectedFacultyProjects(faculty);

            } catch (e) {
                console.log(e);
                setLoading(false);
            }
        };

        fetchFacultyData();
    }, [appliedFilters]);

    const handleClick = (section) => {
        document.getElementById(section).scrollIntoView({ behavior: "smooth" });
    };

    const charts = {
        successRate: (<SuccessRateChart projects={selectedSuccessProjects} totalprojects={selectedProjects} largeprojects={selectedLargeProjects} smallprojects={selectedSmallProjects}/> ),
        numGrants: (<NumGrantsChart projects={selectedProjects} />),
        numProjects: (<NumProjectsChart projects={selectedProjects} />),
        funding: (<FundingChart projects={selectedProjects} />),
        studentReach: (<StudentReachChart />),
        teamMember: (<TeamMemberChart projects={selectedFacultyProjects}/>)
    };

    return (
        <div className={styles.Snapshot}>

            <SnapshotHeader range={selectedRange} setRange={setSelectedRange} />

            <div className={styles.navbar}>
                <button onClick={() => handleClick("success-rate")}>Success Rate</button>
                {/* <button onClick={() => handleClick("num-grants")}>Number of Grants</button> */}
                <button onClick={() => handleClick("num-projects")}>Number of Grants and Projects</button>
                <button onClick={() => handleClick("funding")}>Funding Awarded</button>
                <button onClick={() => handleClick("student-reach")}>Student Reach</button>
                <button onClick={() => handleClick("faculty-engagement")}>Faculty Engagement</button>
            </div>

            <section id="success-rate"> <SnapshotBox chart={charts.successRate} type={0} title="Success Rate" /></section>
            {/* <section id="num-grants"> <SnapshotBox chart={charts.numGrants} type={0} title="Number of Grants" /> </section> */}
            <section id="num-projects"> <SnapshotBox chart={charts.numProjects} type={1} title="Number of Projects and Grants" /> </section>
            <section id="funding"> <SnapshotBox chart={charts.funding} type={0} title="Funding Awarded" /> </section>
            <section id="student-reach"> <SnapshotBox chart={charts.studentReach} type={1} title="Student Reach" /> </section>
            
            {loading ? (
        // Display a loading circle or spinner while data is being fetched
        <div>Loading...</div>
      ) : selectedFacultyProjects.Large   ? (
        // render graph if data is available 
        <section id="faculty-engagement"> <SnapshotBox chart={charts.teamMember} type={0} title="Faculty Engagement" /> </section>
      ) : (
        // if data empty 
        <div>No data available</div>
      )}
        </div>
    );
};

export default Snapshot;