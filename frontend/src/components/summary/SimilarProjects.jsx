import { useState } from "react";
import styles from "./SimilarProjects.module.css";
import { Table, TableBody, TableCell, TableContainer, TableRow, Paper, Button, Grid } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { Link } from "react-router-dom";


//TODO: alignment of expand/collapse button for mobile UI
function SimilarProjects({ projects, server }) {

    const [showAll, setShowAll] = useState(false);
    // const itemsToDisplay = showAll ? SAMPLE_SIMILAR_PROJECTS : SAMPLE_SIMILAR_PROJECTS.slice(0, 5);

    if (projects.length === 0) return null;

    return (
        <div className={styles.bg}>
            <Grid container>
                <Grid item sm={12} zeroMinWidth={true} >
                    <div className={styles.title}>
                        Similar Projects
                    </div>

                    <TableContainer component={Paper} sx={{ maxWidth: "100%" }}>
                        <Table className={styles.wrapper} stickyHeader >

                            <TableBody>
                                <TableRow>
                                    <TableCell className={styles.StickyHeader}>Title</TableCell>
                                    <TableCell className={styles.TableHeader}>Project Type</TableCell>
                                    <TableCell className={styles.TableHeader}>Primary Investigator</TableCell>
                                    <TableCell className={styles.TableHeader}>Faculty</TableCell>
                                    <TableCell className={styles.TableHeader}>Funding Year</TableCell>
                                </TableRow>

                                {projects.map((proj) =>
                                    <TableRow key={proj.grant_id}>
                                        <TableCell className={styles.StickyCell}>
                                            <Link to={`/summary/${proj.grant_id}${server === "staging" ? "?staging=true" : ""}`}>{proj.title}</Link>
                                        </TableCell>
                                        <TableCell className={styles.TableCell}>{proj.project_type}</TableCell>
                                        <TableCell className={styles.TableCell}>{proj.pi_name}</TableCell>
                                        <TableCell className={styles.TableCell}>{proj.project_faculty}</TableCell>
                                        <TableCell className={styles.TableCell}>{proj.funding_year}</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>

                            {
                                projects.length > 5 &&
                                <TableRow>
                                    <TableCell style={{ height: "2rem" }} colSpan={5} align="center">
                                        <Button onClick={() => setShowAll(!showAll)} fullWidth>
                                            {showAll ?
                                                <div className={styles.btn}>
                                                    Show Less
                                                    <ExpandLessIcon />
                                                </div>
                                                :
                                                <div className={styles.btn}>
                                                    Show More
                                                    <ExpandMoreIcon />
                                                </div>
                                            }
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            }

                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>

        </div>
    );
};

export default SimilarProjects;