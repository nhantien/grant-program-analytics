// react
import { useEffect, useState } from "react";
// react-router
import { useParams } from "react-router-dom";
// amplify
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api'
// css styles
import styles from "./Summary.module.css";
// components
import { SummaryTitle, SummaryDescription, SummaryTable, Posters, SimilarProjects } from "../components/summary";
// constants
import { Project } from "../constants";

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

function Summary() {
    const { id } = useParams();

    const [isLoading, setIsLoading] = useState(false);

    const [titleData, setTitleData] = useState({});
    const [descriptionData, setDescriptionData] = useState({});
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const query = `query MyQuery {
                getIndividualSummaryInfo(method: "getIndividualSummaryInfo", grantId: "${id}") {
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
                }

                getTeamMembersByGrantId(method: "getTeamMembersByGrantId", grantId: "${id}") {
                    grant_id
                    members {
                        member_name
                        member_title
                        member_faculty
                        member_unit
                    }
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

                setTitleData({
                    title: summaryInfo[0].title,
                    project_faculty: summaryInfo[0].project_faculty,
                    years: summaryInfo.length,
                    status: "Active"
                });

                setDescriptionData({
                    summary: summaryInfo[0].summary,
                    status: "Active"
                });

                let tableInfo = [];
                summaryInfo.map((grant) => {
                    tableInfo.push({
                        project_year: grant.project_year,
                        pi_name: grant.pi_name,
                        project_type: grant.project_type,
                        funding_amount: grant.funding_amount,
                        focus_areas: grant.focus_areas,
                        co_curricular_reach: grant.description,
                        team_members: teamMembers[0].members,
                    });
                });
                console.log(tableInfo);
                setTableData(tableInfo);

                setIsLoading(false);
            } catch (e) {
            console.log(e);
            }
        };

        fetchData();
    }, []);

    if (isLoading) return null;

    return (
        <div className={styles.Summary}>
            <SummaryTitle data={titleData} />
            <SummaryDescription data={descriptionData} />
            {
                tableData.map((grant) => (
                    <SummaryTable key={grant.project_year} data={grant} />
                ))
            }
        </div>
    )



    // if (!project) return null;

    // return (

    //     <div className={styles.Summary}>
    //         <SummaryTitle project={project} />
    //         <SummaryDescription project={project} />
    //         <SummaryTable project={project} />
    //         <Posters project={project} />
    //         <SimilarProjects project={project} type="individual" />
    //     </div>


    // );
};

export default Summary;