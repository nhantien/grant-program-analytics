import { Grid } from "@mui/material";
import styles from "./ProjectOutcome.module.css";

function ProjectOutcome({ data }) {
    return (
        <div className={styles.bg}>
            <div className={styles.title}>
                Project Outcomes
            </div>
            <div className={styles.container}>
                <Grid container>
                    <Grid item xs={12}>
                        <div className={styles["description-body"]} style={{ whiteSpace: "pre-line" }}>
                            {`1) FMED 426: The creation of professional neuroanatomy / neurophysiology video modules gave the students a conceptual framework to refer to as they worked through the content of their weeks. These modules also allowed for students to access the material anytime and anywhere. \n
                        2) CAPS 301: Online modules helped students to prepare for the class so that class time could focus on the discussion of functional and applied neuroscience. \n
                        3) RHSC 420: The online videos and modules were an integral part of the course required for preparation for all lecture and lab sessions. \n
                        4) BMEG 410: Online modules constituted a repository of information that students used as they navigated the world of neuro-imaging. Class time was only used to cover the most basic concepts and the modules gave those students with a deeper interest the opportunity to build a neuroanatomy / neuroscience knowledge base.`}
                        </div>
                    </Grid>
                </Grid>
            </div>

        </div>
    );
}

// function ProjectOutcome({ data }) {

//     if (data === "") return null;

//     return (
//         <div className={styles.bg}>
//             <div className={styles.title}>
//                 Project Outcome
//             </div>
//             <div className={styles.container}>
//                 <Grid container>
//                     <Grid item xs={12}>
//                         <div className={styles["description-body"]} style={{ whiteSpace: "pre-line" }}>
//                             {`${data}`}
//                         </div>
//                     </Grid>
//                 </Grid>
//             </div>

//         </div>
//     );
// }

export default ProjectOutcome;