import { useState } from "react";
import styles from "./SimilarProjects.module.css";
import { Table, TableBody, TableCell, TableContainer, TableRow, Paper, Button } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { SAMPLE_SIMILAR_PROJECTS } from "../../constants";
import { Link } from "react-router-dom";


//TODO: alignment of expand/collapse button for mobile UI
function SimilarProjects({ project, type }) {

    const [showAll, setShowAll] = useState(false);
    const itemsToDisplay = showAll ? SAMPLE_SIMILAR_PROJECTS : SAMPLE_SIMILAR_PROJECTS.slice(0, 5);
    const titleClass = type === "individual" ? styles["title-individual"] : styles["title-snapshot"];

    return (
        <div className={styles.bg}>
            <div className={titleClass}>
                Similar Projects
            </div>

            <TableContainer component={Paper}>
                <Table className={styles.wrapper} aria-label="customized-table">

                    <TableBody>
                        <TableRow>
                            <TableCell className={styles.TableHeader}>Title</TableCell>
                            <TableCell className={styles.TableHeader}>Project Type</TableCell>
                            <TableCell className={styles.TableHeader}>Primary Investigator</TableCell>
                            <TableCell className={styles.TableHeader}>Faculty</TableCell>
                            <TableCell className={styles.TableHeader}>Funding Year</TableCell>
                        </TableRow>

                        {itemsToDisplay.map((proj) =>
                            <TableRow>
                                <TableCell className={styles.TableCell}><Link to="#">{proj.title}</Link></TableCell>
                                <TableCell className={styles.TableCell}>{proj.type}</TableCell>
                                <TableCell className={styles.TableCell}>{proj.investigator}</TableCell>
                                <TableCell className={styles.TableCell}>{proj.faculty}</TableCell>
                                <TableCell className={styles.TableCell}>{proj.fundingYear}</TableCell>
                            </TableRow>
                        )}
                    </TableBody>

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

                </Table>
            </TableContainer>
        </div>
    );
};

export default SimilarProjects;