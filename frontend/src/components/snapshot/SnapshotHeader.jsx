import styles from "./SnapshotHeader.module.css";
import { Slider, IconButton } from "@mui/material";
import { Filter } from "../util";
import { FilterList } from "../home";
import ClearIcon from '@mui/icons-material/Clear';
import { YEARS, FACULTY, PROJECT_TYPE } from "../../constants";
import { useState } from "react";


function SnapshotHeader({ projects, filters, setFilters }) {

    const options = ["Option 1", "Option 2", "Option 3"];

    const len = projects.length;

    const onSelect = (selectedFilter, filterType) => {
        const newFilters = [...filters[filterType], selectedFilter];
        setFilters((prevFilters) => ({
            ...prevFilters,
            [filterType]: newFilters,
        }));
    };

    const handleClear = (filterToRemove, filterType) => {
        if (filterType === "SearchText") {
            setFilters((prevFilters) => ({
                ...prevFilters,
                "SearchText": [],
            }));
            return;
        }
        const updatedFilters = filters[filterType].filter((filter) => filter !== filterToRemove);
        setFilters((prevFilters) => ({
            ...prevFilters,
            [filterType]: updatedFilters,
        }));
    };

    const handleClearAll = () => {
        const newFilters = {
            "FundingYear": ["2022/2023"],
            "ProjectType": [],
            "Faculty": [],
            "FocusArea": [],
            "SearchText": []
        };
        setFilters(newFilters);
    };

    const [range, setRange] = useState([2015, 2023]);
    const handleChange = (event, newRange) => {
        setRange(newRange);
    };

    return (
        <div className={styles.bg}>
            <div className={styles.title}>
                TLEF Snapshot
            </div>

            <div className={styles.selectedProjects}>
                ({len} project{len === 1 ? "" : "s"} selected)
            </div>

            <div className={styles.filters}>

                <div className={styles.dropdowns}>
                    <div className={styles["dropdown-filters"]}>
                        <Filter options={YEARS} onSelect={onSelect} defaultValue="Funding Year" type="FundingYear" snapshot={true} />
                        <Filter options={PROJECT_TYPE} onSelect={onSelect} defaultValue="Project Type" type="ProjectType" snapshot={true} />
                        <Filter options={FACULTY} onSelect={onSelect} defaultValue="Faculty" type="Faculty" snapshot={true} />
                        <Filter options={options} onSelect={onSelect} defaultValue="Focus Area" type="FocusArea" snapshot={true} />
                    </div>

                    <div className={styles["applied-filters"]}>
                        <span style={{ marginTop: "1rem", marginBottom: "0.5rem" }}>Applied Filters</span>
                        <div className={styles["filters-box"]}>
                            <FilterList filters={filters} onClearFilter={handleClear} />
                            <div className={styles["clear-filters-div"]}>
                                <p className={styles.text}>Clear All</p>
                                <IconButton onClick={handleClearAll} size="small">
                                    <ClearIcon />
                                </IconButton>
                            </div>
                        </div>
                    </div>
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