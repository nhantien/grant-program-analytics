import { useState } from "react";
import styles from "./SimilarProjects.module.css";
import { Table, TableBody, TableCell, TableContainer, TableRow, Paper, Button } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { SAMPLE_SIMILAR_PROJECTS } from "../constants";
import { Link } from "react-router-dom";


function SimilarProjects({ project }) {

    const [showAll, setShowAll] = useState(false);
    const itemsToDisplay = showAll ? SAMPLE_SIMILAR_PROJECTS : SAMPLE_SIMILAR_PROJECTS.slice(0, 5);

    return (
        <div className={styles.bg}>
            <div className={styles.title}>
                Similar Projects
            </div>

            <TableContainer component={Paper}>
                <Table aria-label="customized-table">

                    <TableBody>
                        <TableRow sx={{ borderBottom: 1, height: 10 }}>
                            <TableCell style={{ width: "33%", height: "4rem", fontWeight: 700, fontSize: "1.125rem" }}>Title</TableCell>
                            <TableCell style={{ width: "33%", height: "4rem", fontWeight: 700, fontSize: "1.125rem" }}>Primary Investigator</TableCell>
                            <TableCell style={{ width: "33%", height: "4rem", fontWeight: 700, fontSize: "1.125rem" }}>Funding Year</TableCell>
                        </TableRow>

                        {itemsToDisplay.map((proj) =>
                            <TableRow>
                                <TableCell style={{ fontSize: "0.9375rem", height: "4rem" }}><Link to="#">{proj.title}</Link></TableCell>
                                <TableCell style={{ fontSize: "0.9375rem", height: "4rem" }}>{proj.investigator}</TableCell>
                                <TableCell style={{ fontSize: "0.9375rem", height: "4rem" }}>{proj.fundingYear}</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                    <TableRow>
                        <TableCell style={{ height: "2rem" }} colSpan={3} align="center">
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