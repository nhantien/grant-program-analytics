import styles from "./SnapshotHeader.module.css";
import { Slider, IconButton, Select, MenuItem } from "@mui/material";
import { Filter } from "../util";
import { FilterList } from "../home";
import ClearIcon from '@mui/icons-material/Clear';
import { YEARS, FACULTY, PROJECT_TYPE } from "../../constants";
import { useEffect, useState } from "react";


function SnapshotHeader({ projects, filters, setFilters }) {

    const [snapshotYear, setSnapshotYear] = useState("");
    const [range, setRange] = useState([]);

    const options = ["Option 1", "Option 2", "Option 3"];

    const convertYear = (year) => {
        const yearStr = year.substring(0, year.indexOf("/"));
        return parseInt(yearStr);
    }

    useEffect(() => {
        const years = filters["FundingYear"];
        let min = 0;
        let max = 0;
        years.map((year) => {
            const yearInt = convertYear(year);
            if (yearInt < min || min === 0) {
                min = yearInt;
            }
            if (yearInt > max) {
                max = yearInt;
            }
        })
        setRange([min, max]);
    }, [filters]);

    const onSelect = (selectedFilter, filterType) => {
        const newFilters = [...filters[filterType], selectedFilter];
        setFilters((prevFilters) => ({
            ...prevFilters,
            [filterType]: newFilters,
        }));
    };

    const handleSelectSnapshot = (event) => {
        const value = event.target.value;
        setSnapshotYear(value);
        const newFilters = {
            "FundingYear": [value],
            "ProjectType": [],
            "Faculty": [],
            "FocusArea": [],
            "SearchText": []
        };
        setFilters(newFilters);
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

    const handleChange = (event, newRange) => {
        setRange(newRange);
    };

    return (
        <div className={styles.bg}>
            <div className={styles.title}>
                TLEF Program Yearly Summary
            </div>

            <div className={styles.filters}>

                <div className={styles.dropdowns}>
                    <div className={styles["snapshot-filter"]}>
                        <p style={{ fontSize: "1.3rem", fontWeight: 550 }}>Annual TLEF Snapshot</p>
                        <Select
                            className={styles["snapshot-dropdown"]}
                            onChange={handleSelectSnapshot}
                            displayEmpty
                            fullWidth
                            variant="outlined"
                            value={snapshotYear}
                        >
                            <MenuItem value="" disabled>Select year to generate the annual snapshot</MenuItem>
                            {YEARS.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                    </div>

                    <div className={styles["filters-wrapper"]}>
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
                </div>

                <div className={styles.slider}>
                    <p>Year range:</p>
                    <Slider
                        getAriaLabel={() => "Year range"}
                        max={2023}
                        min={1999}
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