import { Grid } from "@mui/material";
import styles from "./SummaryTitle.module.css";

function SummaryTitle({ data }) {
    return (

        <div className={styles.bg}>
            <div className={styles.container}>
                <Grid container>
                    <Grid item xs={12}>
                        <div className={styles.title}>
                            {data.title}
                        </div>
                    </Grid>
                </Grid>
            </div>

            <div className={styles.container}>
                <Grid container>
                    <Grid item xs={10} md={5} lg={4}>
                        <div className={styles.status}>
                            <Grid container>
                                <Grid item xs={7}>
                                    Project Status:
                                </Grid>
                                <Grid item xs={5}>
                                    {data.status}
                                </Grid>
                            </Grid>
                        </div>
                    </Grid>
                </Grid>
            </div>

            <div className={styles.container}>
                <Grid container>
                    <Grid item xs={10} md={5} lg={4}>
                        <div className={styles.faculty}>
                            <Grid container>
                                <Grid item xs={7}>
                                    Project Faculty:
                                </Grid>
                                <Grid item xs={5}>
                                    {data.project_faculty}
                                </Grid>
                            </Grid>
                        </div>
                    </Grid>
                </Grid>
            </div>

            <div className={styles.container}>
                <Grid container>
                    <Grid item xs={10} md={5} lg={4}>
                        <div className={styles.years}>
                            <Grid container>
                                <Grid item xs={7}>
                                    Project Years:
                                </Grid>
                                <Grid item xs={5}>
                                    {data.years} Years
                                </Grid>
                            </Grid>
                        </div>
                    </Grid>
                </Grid>
            </div>

            <div className={styles.container}>
                <Grid container>
                    <Grid item xs={10} md={5} lg={4}>
                        {
                            data.reach > 0 &&
                            <Grid container className={styles["normal-text"]}>
                                <Grid item xs={7}>
                                    Student Reach:
                                </Grid>
                                <Grid item xs={4}>
                                    {data.reach}
                                </Grid>
                            </Grid>
                        }
                    </Grid>
                </Grid>
            </div>
        </div>
    );
}

export default SummaryTitle;