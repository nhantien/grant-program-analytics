import styles from "./SnapshotHeader.module.css";
import { Slider } from "@mui/material";
import { Filter } from "../util";
import { FACULTY } from "../../constants";
import { useState } from "react";


function SnapshotHeader({ projects }) {
    const len = projects.length;
    const onSelect = (val, type) => {
        console.log("Selected");
    }

    const [range, setRange] = useState([2015, 2023]);
    const handleChange = (event, newRange) => {
        setRange(newRange);
    };



    return (
        <div className={styles.bg}>
            <div className={styles.title}>
                Annual TLEF Snapshot
            </div>

            <div className={styles.selectedProjects}>
                ({len} project{len === 1 ? "" : "s"} selected)
            </div>

            <div className={styles.filters}>
                <div className={styles.faculty}>
                    <p>Filter by:</p>
                    <Filter options={FACULTY} onSelect={onSelect} defaultValue="Faculty" type="Faculty" />
                </div>

                <div className={styles.slider}>
                    <p>Year range:</p>
                    <Slider
                        getAriaLabel={() => "Year range"}
                        max={2023}
                        min={2015}
                        value={range}
                        onChange={handleChange}
                        valueLabelDisplay="on"
                    />
                </div>
            </div>
        </div>
    );
};

export default SnapshotHeader;