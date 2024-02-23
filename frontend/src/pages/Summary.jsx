// react
import { useEffect, useState } from "react";
// react-router
import { useParams } from "react-router-dom";
// css styles
import styles from "./Summary.module.css";
// components
import { SummaryTitle, SummaryDescription, SummaryTable, Posters } from "../components/summary";
import { SimilarProjects } from "../components/util";
// constants
import { Project } from "../constants";

function Summary() {
    const { id } = useParams();
    const [project, setProject] = useState(null);

    // TODO: replace this with a new GraphQL query
    // useEffect(() => {
    //     const fetchProjectFromId = async () => {
    //         try {
    //             const response = await fetch(BASE_URL + `project/?id=${id}`, {
    //                 method: 'GET'
    //             });

    //             if (!response.ok) {
    //                 throw new Error('Failed to fetch project');
    //             }

    //             const data = await response.json();
    //             const proj = data[0];
    //             const newProject = new Project(
    //                 proj.ID,
    //                 proj.FundingYear,
    //                 proj.ProjectType,
    //                 proj.Investigator,
    //                 proj.Faculty,
    //                 proj.Title,
    //                 '1',
    //                 proj.Amount,
    //                 proj.ProjectStatus
    //             );

    //             setProject(newProject);
    //         } catch (err) {
    //             console.log(err);
    //         }
    //     };

    //     fetchProjectFromId();
    // }, []);

    if (!project) return null;

    return (

        <div className={styles.Summary}>
            <SummaryTitle project={project} />
            <SummaryDescription project={project} />
            <SummaryTable project={project} />
            <Posters project={project} />
            <SimilarProjects project={project} type="individual" />
        </div>


    );
};

export default Summary;