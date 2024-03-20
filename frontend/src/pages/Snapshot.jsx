// react
import React from "react";
import { useState, useEffect, useContext } from "react";
// react-router
import { useLocation } from "react-router-dom";
// amplify
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
import { PROJECT_TYPE } from "../constants";


function Snapshot() {

    const client = generateClient();

    const { appliedFilters } = useContext(FiltersContext);

    const location = useLocation();
    const { projects, range } = location.state;
    const [selectedProjects, setSelectedProjects] = useState(projects);
    const [declinedProjects, setDeclinedProjects] = useState(projects);
    const [facultyEngagement, setFacultyEngagement] = useState({});
    const [reachCount, setReachCount] = useState({});
    const [reachInfo, setReachInfo] = useState({});
    const [numProjectsAndGrants, setNumProjectsAndGrants] = useState({});
    const [uniqueStudent, setUniqueStudent] = useState({});
    const [selectedRange, setSelectedRange] = useState(range);
    const [selectedLargeProjects, setSelectedLargeProjects] = useState({});
    const [selectedSmallProjects, setSelectedSmallProjects] = useState({});
    const [options, setOptions] = useState({});

    // loading states 
    const [loading, setLoading] = useState(true);
    const [optionsLoading, setOptionsLoading] = useState(true);

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

            getUniqueStudent(method: "getUniqueStudent", fundingYear: "${appliedFilters["funding_year"][0]}") {
                  funding_year
                  unique_student
                  funding_amount
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

    const setDropdownOptions = (faculties, focusAreas) => {
        let facultiesJSON = {};
        faculties.map((faculty) => {
            facultiesJSON[faculty.faculty_code] = faculty.faculty_name;
        });

        let focusAreasJSON = {};
        focusAreas.map((area) => {
            focusAreasJSON[area.value] = area.label;
        });

        const currentYear = new Date().getFullYear();
        let yearsJSON = {};
        for (let i = 1999; i <= currentYear; i++) {
            const yearString = `${i}/${i+1}`;
            const iString = i.toString();
            yearsJSON[iString] = yearString;
        }
 
        setOptions({
            funding_year: yearsJSON,
            project_type: PROJECT_TYPE,
            project_faculty: facultiesJSON,
            focus_area: focusAreasJSON
        });
    }

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const queryString = `query load {
                    loadFaculty(method: "loadFaculty") {
                        faculty_name
                        faculty_code
                    }

                    loadFocusArea(method: "loadFocusArea") {
                        label
                        value
                    }
                }`;

                const results = await client.graphql({
                    query: queryString
                });

                const faculties = results.data.loadFaculty;
                const focusAreas = results.data.loadFocusArea;

                setDropdownOptions(faculties, focusAreas);
                setOptionsLoading(false);

            } catch (e) {
                console.log(e);
            }
        };

        fetchOptions();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const query_string = generateQuery(appliedFilters);
                console.log(query_string);
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
                const uniqueStudent = results.data.getUniqueStudent;

                setDeclinedProjects(declinedProjects);
                setNumProjectsAndGrants(projectsAndGrants);
                setSelectedProjects(proposals);
                setSelectedLargeProjects(largeProposals);
                setSelectedSmallProjects(smallProposals);
                setReachCount(reach);
                setReachInfo(reachInfo);
                setFacultyEngagement(facultyEngagement);
                setUniqueStudent(uniqueStudent);
                console.log("unique student", uniqueStudent)

                setLoading(false);
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
        successRate: (<SuccessRateChart projects={declinedProjects} totalprojects={selectedProjects} largeprojects={selectedLargeProjects} smallprojects={selectedSmallProjects} />),
        numProjects: (<NumProjectsChart projects={numProjectsAndGrants} />),
        funding: (<FundingChart projects={selectedProjects} />),
        studentReach: (<StudentReachChart projects={reachCount} reachdata={reachInfo} unique={uniqueStudent} />),
        teamMember: (<FacultyEngagementChart projects={facultyEngagement} amount={selectedProjects} unique={uniqueStudent}/>)
    };

    return (
        <div className={styles.Snapshot}>

            <SnapshotHeader options={options} optionsLoading={optionsLoading} range={selectedRange} setRange={setSelectedRange} />

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
                    <section id="faculty-engagement"> <SnapshotBox chart={charts.teamMember} type={0} title="Faculty and Student Engagement" /> </section>
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