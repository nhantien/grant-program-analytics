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
import { FormatColorResetRounded } from "@mui/icons-material";



Amplify.configure(config);

function Snapshot() {

    const { appliedFilters } = useContext(FiltersContext);
    
    const location = useLocation();
    const { projects, range } = location.state;
    const [selectedProjects, setSelectedProjects] = useState(projects);
    const [selectedSuccessProjects, setSelectedSuccessProjects] = useState(projects);
    const [selectedFacultyProjects, setSelectedFacultyProjects] = useState({});
    const [selectedReachProjects, setSelectedReachProjects] = useState({});
    const [selectedReachInfoProjects, setSelectedReachInfoProjects] = useState({});
    const [selectedCountProjects, setSelectedCountProjects] = useState({});
    const [selectedRange, setSelectedRange] = useState(range);
    const [selectedLargeProjects, setSelectedLargeProjects] = useState({});
    const [selectedSmallProjects, setSelectedSmallProjects] = useState({});

    // loading states 
    const [loading, setLoading] = useState(true);
    const [reachLoading, setReachLoading] = useState(true);
    const [countLoading, setCountLoading] = useState(true);

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
                setCountLoading(false);

                setSelectedSuccessProjects(num);

            } catch (e) {
                console.log(e);
                setCountLoading(false);
            }
        };

        fetchData();
    }, [appliedFilters]);

    // Count projects and grants chart  
    const generateCountProjectsAndGrantsString = (filters) => {

        const str = `query testCountProjectsAndGrants {
            countProjectsAndGrants(method: "countProjectsAndGrants", filter: {
                funding_year: ${JSON.stringify(filters["funding_year"])},
                project_faculty: ${JSON.stringify(filters["project_faculty"])},
                project_type: ${JSON.stringify(filters["project_type"])},
                focus_area: ${JSON.stringify(filters["focus_area"])},
                search_text: ${JSON.stringify(filters["search_text"])}
            }) {
                project {
                    Large
                    Small
                }
                grant {
                    Large
                    Small
                }
            }
        }`;

        console.log(str);

        return str;
    }

    useEffect(() => {
        const fetchCountData = async () => {
            try {
                const query_string = generateCountProjectsAndGrantsString(appliedFilters);
                const client = generateClient()
                const results = await client.graphql({
                    query: query_string,
                });

                const num = results.data.countProjectsAndGrants;
                console.log(num)

                setSelectedCountProjects(num);

            } catch (e) {
                console.log(e);
            }
        };

        fetchCountData();
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
            console.log(smallProjects);

            } catch (e) {
                console.log(e);
            }
        };

        fetchProjectData();
    }, [appliedFilters]);

    // Student Reach Chart 
    const generateReachQueryString = (filters) => {

        const str = `query testCountTotalReachByFaculty {
            countTotalReachByFaculty(method: "countTotalReachByFaculty", filter: {
                funding_year: ${JSON.stringify(filters["funding_year"])},
                project_faculty: ${JSON.stringify(filters["project_faculty"])},
                project_type: ${JSON.stringify(filters["project_type"])},
                focus_area: ${JSON.stringify(filters["focus_area"])},
                search_text: ${JSON.stringify(filters["search_text"])}
            }) { 
                Large {
                    project_faculty
                    reach
                    }
                Small {
                    project_faculty
                    reach
                }
            }
        }`;

        console.log(str);

        return str;
    }

    useEffect(() => {
        const fetchReachData = async () => {
            try {
                const query_string = generateReachQueryString(appliedFilters);
                console.log(query_string)
                const client = generateClient()
                const results = await client.graphql({
                    query: query_string,
                });

                const reach = results.data.countTotalReachByFaculty;
                console.log(reach)
                setReachLoading(false);

                setSelectedReachProjects(reach);

            } catch (e) {
                console.log(e);
                setReachLoading(false);
            }
        };

        fetchReachData();
    }, [appliedFilters]);

    // Student Reach Chart 
    const generateReachInfoQueryString = (filters) => {

        const str = `query testGetStudentReachInfo {
            getStudentReachInfo(method: "getStudentReachInfo", filter: {
                funding_year: ${JSON.stringify(filters["funding_year"])},
                project_faculty: ${JSON.stringify(filters["project_faculty"])},
                project_type: ${JSON.stringify(filters["project_type"])},
                focus_area: ${JSON.stringify(filters["focus_area"])},
                search_text: ${JSON.stringify(filters["search_text"])}
            }) {
                faculty
                course
                section
            }
          }`;

        console.log(str);

        return str;
    }

    useEffect(() => {
        const fetchReachInfoData = async () => {
            try {
                const query_string = generateReachInfoQueryString(appliedFilters);
                console.log(query_string)
                const client = generateClient()
                const results = await client.graphql({
                    query: query_string,
                });

                const reachinfo = results.data.getStudentReachInfo;
                console.log('reach info', reachinfo)
                setReachLoading(false);

                setSelectedReachInfoProjects(reachinfo);

            } catch (e) {
                console.log(e);
                setReachLoading(false);
            }
        };

        fetchReachInfoData();
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
        numProjects: (<NumProjectsChart projects={selectedCountProjects} />),
        funding: (<FundingChart projects={selectedProjects} />),
        studentReach: (<StudentReachChart projects={selectedReachProjects} reachdata={selectedReachInfoProjects}/>),
        teamMember: (<TeamMemberChart projects={selectedFacultyProjects} amount={selectedProjects}/>)
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
            {countLoading ? (
            <div>Loading...</div>
            ) : selectedCountProjects.project   ? (
             <section id="num-projects"> <SnapshotBox chart={charts.numProjects} type={1} title="Number of Grants and Projects" /> </section>
            ) : (
                <div>No data available</div>
            )}
            <section id="funding"> <SnapshotBox chart={charts.funding} type={0} title="Funding Awarded" /> </section>
            {reachLoading ? (
         <div>Loading...</div>
        ) : selectedReachProjects.Large   ? (
            <section id="student-reach"> <SnapshotBox chart={charts.studentReach} type={1} title="Student Reach" /> </section>
        ) : (
            <div>No data available</div>
        )}
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