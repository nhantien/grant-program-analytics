import { Grid } from "@mui/material";
import styles from "./SummaryDescription.module.css";

function SummaryDescription({ data }) {
    return (
        <div className={styles.bg}>
            <div className={styles.container}>
                <Grid container>
                    <Grid item xs={12}>
                        <div className={styles.title}>Summary</div>
                        <div className={styles["description-body"]} style={{ whiteSpace: "pre-line" }}>
                            {`${data.summary}`}
                        </div>
                    </Grid>
                </Grid>
            </div>

            {data.status === "Completed" && <div className={styles.report}>Report: <a href="#">2022-TLEF-Final-Report-Elmo-WEB.pdf</a></div>}

        </div>
    );
}

export default SummaryDescription;