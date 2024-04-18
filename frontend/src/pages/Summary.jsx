// react
import { useEffect, useState } from "react";
// react-router
import { useParams, useSearchParams } from "react-router-dom";
// mui
import { CircularProgress } from "@mui/material";
// amplify
import { generateClient } from 'aws-amplify/api';
// css styles
import styles from "./Summary.module.css";
// components
import { SummaryTitle, SummaryDescription, SummaryTable, Posters, SimilarProjects, ProjectOutcome } from "../components/summary";


function Summary() {
    const { id } = useParams();

    const path = window.location.pathname;
    const server = path.includes("staging") ? "staging" : "production";

    const [isLoading, setIsLoading] = useState(false);

    const [titleData, setTitleData] = useState({});
    const [descriptionData, setDescriptionData] = useState({});
    const [tableData, setTableData] = useState([]);
    const [similarProjects, setSimilarProjects] = useState([]);
    const [projectOutcome, setProjectOutcome] = useState("");
    const [posters, setPosters] = useState([]);

    const countTotalReach = (reachData) => {
        let total = 0;
        reachData.forEach((yearlyReach) => {
            const courses = yearlyReach.reach;
            const yearlyCount = courses.reduce((partialSum, a) => partialSum + a.reach, 0);
            total += yearlyCount;
        });

        return total;
    }

    useEffect(() => {
        const fetchData = async () => {
            const query = `query MyQuery {
                getIndividualSummaryInfo(server: "${server}", method: "getIndividualSummaryInfo", grantId: "${id}") {
                    title
                    summary
                    project_year
                    project_type
                    project_faculty
                    pi_name
                    funding_year
                    funding_amount
                    description
                    focus_areas
                    project_status
                    project_outcome
                    report
                    poster
                }

                getTeamMembersByGrantId(server: "${server}", method: "getTeamMembersByGrantId", grantId: "${id}") {
                    grant_id
                    members {
                        member_name
                        member_title
                        member_faculty
                        member_unit
                    }
                }

                getStudentReachByGrantId(server: "${server}", method: "getStudentReachByGrantId", grantId: "${id}") {
                    grant_id
                    reach {
                        course_name
                        section
                        reach
                    }
                }

                getSimilarProjects(server: "${server}", method: "getSimilarProjects", grantId: "${id}") {
                    grant_id
                    project_type
                    pi_name
                    title
                    project_faculty
                    funding_year
                }

                loadFocusArea(server: "${server}", method: "loadFocusArea") {
                    label
                    value
                }
            }`;

            try {
                setIsLoading(true);
                const client = generateClient();
                const results = await client.graphql({
                    query: query,
                });

                const summaryInfo = results.data.getIndividualSummaryInfo;
                const teamMembers = results.data.getTeamMembersByGrantId;
                const studentReach = results.data.getStudentReachByGrantId;
                const focusAreas = results.data.loadFocusArea;

                setTitleData({
                    title: summaryInfo[summaryInfo.length - 1].title,
                    project_faculty: summaryInfo[0].project_faculty,
                    years: summaryInfo.length,
                    status: summaryInfo[summaryInfo.length - 1].project_status,
                    reach: countTotalReach(studentReach)
                });

                setDescriptionData({
                    summary: summaryInfo[summaryInfo.length - 1].summary,
                    status: summaryInfo[summaryInfo.length - 1].project_status,
                    report: summaryInfo[0].report
                });

                let focusAreasJSON = {};
                focusAreas.map((area) => {
                    focusAreasJSON[area.value] = area.label;
                });

                let tableInfo = [];
                let posterInfo = [];
                summaryInfo.forEach((grant, index) => {
                    tableInfo.push({
                        funding_year: grant.funding_year,
                        project_year: grant.project_year,
                        pi_name: grant.pi_name,
                        project_type: grant.project_type,
                        funding_amount: grant.funding_amount,
                        focus_areas: grant.focus_areas.map((area) => focusAreasJSON[area]),
                        co_curricular_reach: grant.description,
                        team_members: teamMembers.length > index ? teamMembers[index].members : [],
                        student_reach: studentReach.length > index ? studentReach[index].reach : [],
                    });

                    if (grant.poster) posterInfo.push({ year: grant.project_year, poster: grant.poster });
                });
                
                setTableData(tableInfo);
                setSimilarProjects(results.data.getSimilarProjects);
                setProjectOutcome(summaryInfo[summaryInfo.length - 1].project_outcome);
                setPosters(posterInfo);

                setIsLoading(false);
            } catch (e) {
                console.log(e);
            }
        };

        fetchData();
    }, [id]);

    if (isLoading) return (
        <div className={styles.Summary}>
            <div style={{ height: "100%", display: "flex", justifyContent: "center" }}>
                <CircularProgress />
            </div>
        </div>
    );

    return (
        <div className={styles.Summary}>
            <SummaryTitle data={titleData} />
            <SummaryDescription data={descriptionData} />
            {
                tableData.map((grant) => (
                    <SummaryTable key={grant.project_year} data={grant} />
                ))
            }
            <Posters posters={posters} />
            <SimilarProjects projects={similarProjects} server={server} />
            <ProjectOutcome data={projectOutcome} />
        </div>
    );
};

export default Summary;