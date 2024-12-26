import { Grid } from "@mui/material";
import styles from "./ProjectOutcome.module.css";

function ProjectOutcome({ data }) {

    if (data === "" ||  data === "TBD") return null;

    return (
        <div className={styles.bg}>
            <div className={styles.title}>
                Project Outcomes
            </div>
            <div className={styles.container}>
                <Grid container>
                    <Grid item xs={12}>
                        <div className={styles["description-body"]} style={{ whiteSpace: "pre-line" }}>
                            {`${data}`}
                        </div>
                    </Grid>
                </Grid>
            </div>

        </div>
    );
}

export default ProjectOutcome;