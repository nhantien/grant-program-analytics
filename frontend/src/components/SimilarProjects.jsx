import styles from "./SimilarProjects.module.css";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { SAMPLE_SIMILAR_PROJECTS } from "../constants";


function SimilarProjects ({ project }) {
    return (
        <div className={styles.bg}>
            <div className={styles.title}>
                Similar Projects
            </div>

            <TableContainer component={Paper}>
                <Table aria-aria-label="customized-table">

                    <TableHead>
                        <TableRow sx={{ borderBottom: 1}}>
                            <TableCell style={{width: "50%", fontWeight: 700, fontSize: "1.25rem"}}>Project (title, PI, year)</TableCell>
                            <TableCell style={{width: "50%", fontWeight: 700, fontSize: "1.25rem"}}>Similarity</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {Object.entries(SAMPLE_SIMILAR_PROJECTS).map(([key, value]) => (
                            <TableRow>
                                <TableCell style={{fontSize: "1rem"}}>{key}</TableCell>
                                <TableCell style={{fontSize: "1rem"}}>{value}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>

                </Table>
            </TableContainer>
        </div>
    );
};

export default SimilarProjects;