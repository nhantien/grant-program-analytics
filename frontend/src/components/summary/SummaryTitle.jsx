import { Grid } from "@mui/material";
import styles from "./SummaryTitle.module.css";

function SummaryTitle({ data }) {
    return (

        <div className={styles.bg}>
            <div className={styles.container}>
                <Grid container style={{ alignItems: 'flex-end' }}>
                    <Grid item xs={12} sm={8}>
                        <div className={styles.title}>
                            {data.title}
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <div className={styles.status}>
                            {data.status}
                        </div>
                    </Grid>
                </Grid>
            </div>

            <div className={styles.container}>
                <Grid container>
                    <Grid item xs={12} sm={6}>
                        <div className={styles.faculty}>
                            {data.project_faculty}
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <div className={styles.years}>
                            {data.years} years
                        </div>
                    </Grid>
                </Grid>
            </div>

            <div className={styles.container}>
                <Grid container>
                    <Grid item xs={12} sm={6}>
                        <div className={styles["normal-text"]}>
                            Total Student Reach: {data.reach}
                        </div>
                    </Grid>
                </Grid>
            </div>
        </div>
    );
}

export default SummaryTitle;