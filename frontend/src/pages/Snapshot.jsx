// react
import React from "react";
import { useState, useEffect, useContext } from "react";
// react-router
import { useLocation } from "react-router-dom";
// amplify
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
// mui
import { CircularProgress } from "@mui/material";
// css style
import styles from "./Snapshot.module.css";
// context
import { FiltersContext } from "../App";
// components
import { SnapshotHeader, SnapshotBox } from "../components/snapshot";
import { FundingChart, NumProjectsChart, StudentReachChart, FacultyEngagementChart, SuccessRateChart } from "../components/charts";
// constants
import { Project } from "../constants";



// Amplify.configure(config);

Amplify.configure({
    API: {
        GraphQL: {
            endpoint: 'https://3gxzh6hlrnebblrm2dqzxhn2fi.appsync-api.ca-central-1.amazonaws.com/graphql',
            region: 'ca-central-1',
            defaultAuthMode: 'iam',
        }
    },
    Auth: {
        Cognito: {
            identityPoolId: 'ca-central-1:f4415d83-459f-4bdf-9981-c065dd3cdd53',
            region: 'ca-central-1',
            allowGuestAccess: true
        }
    }
});

function Snapshot() {

    const { appliedFilters } = useContext(FiltersContext);

    const location = useLocation();
    const { projects, range } = location.state;
    const [selectedProjects, setSelectedProjects] = useState(projects);
    const [declinedProjects, setDeclinedProjects] = useState(projects);
    const [facultyEngagement, setFacultyEngagement] = useState({});
    const [reachCount, setReachCount] = useState({});
    const [reachInfo, setReachInfo] = useState({});
    const [numProjectsAndGrants, setNumProjectsAndGrants] = useState({});
    const [selectedRange, setSelectedRange] = useState(range);
    const [selectedLargeProjects, setSelectedLargeProjects] = useState({});
    const [selectedSmallProjects, setSelectedSmallProjects] = useState({});

    // loading states 
    const [loading, setLoading] = useState(true);
    const [fundingLoading, setFundingLoading] = useState(true);
    const [reachLoading, setReachLoading] = useState(true);
    const [countLoading, setCountLoading] = useState(true);

    const generateQuery = (filters) => {
        const str = `query test {
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


            getFilteredProposals(method: "getFilteredProposals", filter: {
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
                funding_amount
                title
                project_year
            }


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

        return str;
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const query_string = generateQuery(appliedFilters);
                console.log(query_string);
                const client = generateClient()
                const results = await client.graphql({
                    query: query_string,
                });

                const declinedProjects = results.data.countDeclinedProjects;
                const projectsAndGrants = results.data.countProjectsAndGrants;
                const proposals = results.data.getFilteredProposals;
                const largeProposals = proposals.filter(proj => proj.project_type === 'Large');
                const smallProposals = proposals.filter(proj => proj.project_type === 'Small' || proj.project_type === "Inter");
                const reach = results.data.countTotalReachByFaculty;
                const reachInfo = results.data.getStudentReachInfo;
                const facultyEngagement = results.data.countFacultyMembersByStream;

                setDeclinedProjects(declinedProjects);
                setNumProjectsAndGrants(projectsAndGrants);
                setSelectedProjects(proposals);
                setSelectedLargeProjects(largeProposals);
                setSelectedSmallProjects(smallProposals);
                setReachCount(reach);
                setReachInfo(reachInfo);
                setFacultyEngagement(facultyEngagement);

                setLoading(false);
            } catch (e) {
                console.log(e);

            }
        };

        fetchData();
    }, [appliedFilters]);

    // // Success Rate Chart 
    // const generateSuccessQueryString = (filters) => {

    //     const str = `query testCountDeclinedProjects {
    //         countDeclinedProjects(method: "countDeclinedProjects", filter: {
    //             funding_year: ${JSON.stringify(filters["funding_year"])},
    //             project_faculty: ${JSON.stringify(filters["project_faculty"])},
    //             project_type: ${JSON.stringify(filters["project_type"])},
    //             focus_area: ${JSON.stringify(filters["focus_area"])},
    //             search_text: ${JSON.stringify(filters["search_text"])}
    //         }) {
    //             Large
    //             Small
    //         }
    //     }`;

    //     console.log(str);

    //     return str;
    // }

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const query_string = generateSuccessQueryString(appliedFilters);
    //             const client = generateClient()
    //             const results = await client.graphql({
    //                 query: query_string,
    //             });

    //             const num = results.data.countDeclinedProjects;
    //             setDeclinedProjects(num);
    //             setCountLoading(false);

    //         } catch (e) {
    //             console.log(e);
    //             setCountLoading(false);
    //         }
    //     };

    //     fetchData();
    // }, [appliedFilters]);

    // Count projects and grants chart  
    // const generateCountProjectsAndGrantsString = (filters) => {

    //     const str = `query testCountProjectsAndGrants {
    //         countProjectsAndGrants(method: "countProjectsAndGrants", filter: {
    //             funding_year: ${JSON.stringify(filters["funding_year"])},
    //             project_faculty: ${JSON.stringify(filters["project_faculty"])},
    //             project_type: ${JSON.stringify(filters["project_type"])},
    //             focus_area: ${JSON.stringify(filters["focus_area"])},
    //             search_text: ${JSON.stringify(filters["search_text"])}
    //         }) {
    //             project {
    //                 Large
    //                 Small
    //             }
    //             grant {
    //                 Large
    //                 Small
    //             }
    //         }
    //     }`;

    //     console.log(str);

    //     return str;
    // }

    // useEffect(() => {
    //     const fetchCountData = async () => {
    //         try {
    //             const query_string = generateCountProjectsAndGrantsString(appliedFilters);
    //             const client = generateClient()
    //             const results = await client.graphql({
    //                 query: query_string,
    //             });

    //             const num = results.data.countProjectsAndGrants;
    //             console.log(num)

    //             setNumProjectsAndGrants(num);

    //         } catch (e) {
    //             console.log(e);
    //         }
    //     };

    //     fetchCountData();
    // }, [appliedFilters]);

    // // Funding Chart
    // const generateQueryString = (filters) => {

    //     const str = `query homepage {
    //         getFilteredProposals(method: "getFilteredProposals", filter: {
    //             funding_year: ${JSON.stringify(filters["funding_year"])},
    //             project_faculty: ${JSON.stringify(filters["project_faculty"])},
    //             project_type: ${JSON.stringify(filters["project_type"])},
    //             focus_area: ${JSON.stringify(filters["focus_area"])},
    //             search_text: ${JSON.stringify(filters["search_text"])}
    //         }) {
    //             grant_id
    //             project_id
    //             funding_year
    //             project_type
    //             pi_name
    //             project_faculty
    //             funding_amount
    //             title
    //             project_year
    //         }
    //     }`;

    //     return str;
    // }

    // useEffect(() => {
    //     const fetchProjectData = async () => {
    //         try {
    //             const query_string = generateQueryString(appliedFilters);
    //             const client = generateClient()
    //             const results = await client.graphql({
    //                 query: query_string,
    //             });

    //             const proposals = results.data.getFilteredProposals;
    //             console.log(proposals.length);
    //             console.log(proposals);
    //             const newProjects = proposals.map((proj) => {
    //                 return new Project(
    //                     proj.grant_id,
    //                     proj.funding_year + "/" + (+proj.funding_year + 1),
    //                     proj.project_type,
    //                     proj.pi_name,
    //                     proj.project_faculty,
    //                     proj.title,
    //                     proj.project_year,
    //                     proj.funding_amount,
    //                     "Active"
    //                 );
    //             });

    //             // Filter projects based on project_type
    //             const largeProjects = proposals.filter(proj => proj.project_type === 'Large');
    //             const smallProjects = proposals.filter(proj => proj.project_type === 'Small' || proj.project_type === "Inter");

    //             setSelectedProjects(newProjects);
    //             setSelectedLargeProjects(largeProjects);
    //             setSelectedSmallProjects(smallProjects);
    //             console.log(smallProjects);

    //             setFundingLoading(false);

    //         } catch (e) {
    //             console.log(e);
    //         }
    //     };

    //     fetchProjectData();
    // }, [appliedFilters]);

    // // Student Reach Chart 
    // const generateReachQueryString = (filters) => {

    //     const str = `query testCountTotalReachByFaculty {
    //         countTotalReachByFaculty(method: "countTotalReachByFaculty", filter: {
    //             funding_year: ${JSON.stringify(filters["funding_year"])},
    //             project_faculty: ${JSON.stringify(filters["project_faculty"])},
    //             project_type: ${JSON.stringify(filters["project_type"])},
    //             focus_area: ${JSON.stringify(filters["focus_area"])},
    //             search_text: ${JSON.stringify(filters["search_text"])}
    //         }) { 
    //             Large {
    //                 project_faculty
    //                 reach
    //                 }
    //             Small {
    //                 project_faculty
    //                 reach
    //             }
    //         }
    //     }`;

    //     console.log(str);

    //     return str;
    // }

    // useEffect(() => {
    //     const fetchReachData = async () => {
    //         try {
    //             const query_string = generateReachQueryString(appliedFilters);
    //             console.log(query_string)
    //             const client = generateClient()
    //             const results = await client.graphql({
    //                 query: query_string,
    //             });

    //             const reach = results.data.countTotalReachByFaculty;
    //             console.log(reach)
    //             setReachLoading(false);

    //             setReachCount(reach);

    //         } catch (e) {
    //             console.log(e);
    //             setReachLoading(false);
    //         }
    //     };

    //     fetchReachData();
    // }, [appliedFilters]);

    // // Student Reach Chart 
    // const generateReachInfoQueryString = (filters) => {

    //     const str = `query testGetStudentReachInfo {
    //         getStudentReachInfo(method: "getStudentReachInfo", filter: {
    //             funding_year: ${JSON.stringify(filters["funding_year"])},
    //             project_faculty: ${JSON.stringify(filters["project_faculty"])},
    //             project_type: ${JSON.stringify(filters["project_type"])},
    //             focus_area: ${JSON.stringify(filters["focus_area"])},
    //             search_text: ${JSON.stringify(filters["search_text"])}
    //         }) {
    //             faculty
    //             course
    //             section
    //         }
    //       }`;

    //     console.log(str);

    //     return str;
    // }

    // useEffect(() => {
    //     const fetchReachInfoData = async () => {
    //         try {
    //             const query_string = generateReachInfoQueryString(appliedFilters);
    //             console.log(query_string)
    //             const client = generateClient()
    //             const results = await client.graphql({
    //                 query: query_string,
    //             });

    //             const reachinfo = results.data.getStudentReachInfo;
    //             console.log('reach info', reachinfo)
    //             setReachLoading(false);

    //             reachInfo(reachinfo);

    //         } catch (e) {
    //             console.log(e);
    //             setReachLoading(false);
    //         }
    //     };

    //     fetchReachInfoData();
    // }, [appliedFilters]);

    // // Faculty Engagement Chart 
    // const generateFacultyQueryString = (filters) => {

    //     const str = `query testCountFacultyMembersByStream {
    //         countFacultyMembersByStream(method: "countFacultyMembersByStream", filter: {
    //             funding_year: ${JSON.stringify(filters["funding_year"])},
    //             project_faculty: ${JSON.stringify(filters["project_faculty"])},
    //             project_type: ${JSON.stringify(filters["project_type"])},
    //             focus_area: ${JSON.stringify(filters["focus_area"])},
    //             search_text: ${JSON.stringify(filters["search_text"])}
    //         }) {
    //             Large {
    //                 Admin
    //                 Student
    //                 External
    //                 Research
    //                 Teaching
    //             }
    //             Small {
    //                 Admin
    //                 Student
    //                 External
    //                 Research
    //                 Teaching
    //             }
    //         }
    //     }`;

    //     console.log(str);

    //     return str;
    // }

    // useEffect(() => {
    //     const fetchFacultyData = async () => {
    //         try {
    //             const query_string = generateFacultyQueryString(appliedFilters);
    //             console.log(query_string)
    //             const client = generateClient()
    //             const results = await client.graphql({
    //                 query: query_string,
    //             });

    //             const faculty = results.data.countFacultyMembersByStream;
    //             console.log(faculty)
    //             setLoading(false);

    //             setFacultyEngagement(faculty);

    //         } catch (e) {
    //             console.log(e);
    //             setLoading(false);
    //         }
    //     };

    //     fetchFacultyData();
    // }, [appliedFilters]);

    const handleClick = (section) => {
        document.getElementById(section).scrollIntoView({ behavior: "smooth" });
    };

    const charts = {
        successRate: (<SuccessRateChart projects={declinedProjects} totalprojects={selectedProjects} largeprojects={selectedLargeProjects} smallprojects={selectedSmallProjects} />),
        numProjects: (<NumProjectsChart projects={numProjectsAndGrants} />),
        funding: (<FundingChart projects={selectedProjects} />),
        studentReach: (<StudentReachChart projects={reachCount} reachdata={reachInfo} />),
        teamMember: (<FacultyEngagementChart projects={facultyEngagement} amount={selectedProjects} />)
    };

    return (
        <div className={styles.Snapshot}>

            <SnapshotHeader range={selectedRange} setRange={setSelectedRange} />

            <div className={styles.navbar}>
                <button onClick={() => handleClick("success-rate")}>Success Rate</button>
                <button onClick={() => handleClick("num-projects")}>Number of Grants and Projects</button>
                <button onClick={() => handleClick("funding")}>Funding Awarded</button>
                <button onClick={() => handleClick("student-reach")}>Student Reach</button>
                <button onClick={() => handleClick("faculty-engagement")}>Faculty and Student Engagement</button>
            </div>

            {loading ? (
                <div style={{ width: '100%', display: "flex", justifyContent: "center", marginTop: "5rem" }}>
                    <CircularProgress />
                </div>
            ) : (
                <React.Fragment>
                    <section id="success-rate"> <SnapshotBox chart={charts.successRate} type={0} title="Success Rate" /></section>
                    <section id="num-projects"> <SnapshotBox chart={charts.numProjects} type={1} title="Number of Grants and Projects" /> </section>
                    <section id="funding"> <SnapshotBox chart={charts.funding} type={0} title="Funding Awarded" /> </section>
                    <section id="student-reach"> <SnapshotBox chart={charts.studentReach} type={1} title="Student Reach" /> </section>
                    <section id="faculty-engagement"> <SnapshotBox chart={charts.teamMember} type={0} title="Faculty Engagement" /> </section>
                </React.Fragment>
            )}


            {/* <section id="success-rate"> <SnapshotBox chart={charts.successRate} type={0} title="Success Rate" /></section>

            <section id="success-rate"> <SnapshotBox chart={charts.successRate} type={0} title="Success Rate" /></section>

            {countLoading ? (
                <div>Loading...</div>
            ) : numProjectsAndGrants.project ? (
                <section id="num-projects"> <SnapshotBox chart={charts.numProjects} type={1} title="Number of Grants and Projects" /> </section>
            ) : (
                <div>No data available</div>
            )}

            {fundingLoading ? (
                <div>Loading...</div>
            ) : selectedProjects ? (
                <section id="funding"> <SnapshotBox chart={charts.funding} type={0} title="Funding Awarded" /> </section>
            ) : (
                <div>No data available</div>
            )}

            {reachLoading ? (

                <div>Loading...</div>
            ) : reachCount.Large ? (
                <section id="student-reach"> <SnapshotBox chart={charts.studentReach} type={1} title="Student Reach" /> </section>
            ) : (
                <div>No data available</div>
            )}

            {loading ? (
                // Display a loading circle or spinner while data is being fetched
                <div>Loading...</div>
            ) : facultyEngagement.Large ? (
                // render graph if data is available 
                <section id="faculty-engagement"> <SnapshotBox chart={charts.teamMember} type={0} title="Faculty Engagement" /> </section>
            ) : (
                // if data empty 
                <div>No data available</div>
            )}

            <div>Loading...</div>
            ) : selectedReachProjects.Large   ? (
            <section id="student-reach"> <SnapshotBox chart={charts.studentReach} type={1} title="Student Reach" /> </section>
            ) : (
            <div>No data available</div>
         )}
            {loading ? (
                // Display a loading circle or spinner while data is being fetched
                <div>Loading...</div>
            ) : selectedFacultyProjects.Large ? (
                // render graph if data is available 
                <section id="faculty-engagement"> <SnapshotBox chart={charts.teamMember} type={0} title="Faculty and Student Engagement" /> </section>
            ) : (
                // if data empty 
                <div>No data available</div>
            )} */}
        </div>
    );
};

export default Snapshot;