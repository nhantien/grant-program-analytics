import styles from "./SnapshotHeader.module.css";
import { FiltersContext } from "../../App";
import { Slider, IconButton, Collapse } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Filter, FundingYearFilter } from "../util";
import { FilterList } from "../home";
import ClearIcon from '@mui/icons-material/Clear';
import { YEARS, FACULTY, PROJECT_TYPE, MARKS } from "../../constants";
import { useContext, useEffect, useState } from "react";


function SnapshotHeader({ range, setRange }) {

    const { appliedFilters, setAppliedFilters } = useContext(FiltersContext);

    const [showSlider, setShowSlider] = useState(appliedFilters["FundingYear"].length > 1);
    const [rangeString, setRangeString] = useState(range[0] + "/" + (range[0]+1) + " - " + range[1] + "/" + (range[1]+1));

    const options = ["Option 1", "Option 2", "Option 3"];

    const convertYear = (year) => {
        const yearStr = year.substring(0, year.indexOf("/"));
        return parseInt(yearStr);
    }

    useEffect(() => {
        const years = appliedFilters["FundingYear"];
        if (years.indexOf("select range of years") >= 0) return;
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
    }, [appliedFilters]);

    const onSelect = (newFilters, filterType) => {
        setAppliedFilters((prevFilters) => ({
            ...prevFilters,
            [filterType]: newFilters
        }));
    };

    const handleClearAll = () => {
        const newFilters = {
            "FundingYear": ["2022"],
            "ProjectType": [],
            "Faculty": [],
            "FocusArea": [],
            "SearchText": []
        };
        setAppliedFilters(newFilters);
    };

    const handleSliderChange = (event, newRange) => {
        setRange(newRange);
    }

    const applyRangeFilter = (range) => {
        const min = range[0];
        const max = range[1];
        let years = [];
        for (let i = min; i <= max; i++) {
            const year = i + "/" + (i + 1);
            years.push(year);
        }

        setAppliedFilters((prevFilters) => ({
            ...prevFilters,
            ["FundingYear"]: years,
        }));

        setRangeString(min + "/" + (min+1) + " - " + max + "/" + (max+1));
    }

    return (
        <div className={styles.bg}>
            <div className={styles.title}>
                TLEF Program Summary
            </div>

            <div className={styles.filters}>

                <div className={styles.dropdowns}>

                    <div className={styles["dropdown-filters"]}>
                        <FundingYearFilter setShowSlider={setShowSlider} snapshot={true} />
                        <Filter options={PROJECT_TYPE} defaultValue="Project Type" type="ProjectType" snapshot={true} />
                        <Filter options={FACULTY} defaultValue="Faculty/Unit" type="Faculty" snapshot={true} />
                        <Filter options={options} defaultValue="Focus Area" type="FocusArea" snapshot={true} />
                    </div>

                    {/* <div>
                        <IconButton onClick={() => {setShowSlider(!showSlider)}}>
                            <span style={{ fontSize: "1rem", color: "#000" }}>select range of years</span> <ExpandMoreIcon />
                        </IconButton>
                    </div> */}

                    <Collapse
                        in={showSlider}
                        timeout="auto"
                        unmountOnExit
                    >
                        <div className={styles.slider}>
                            <span style={{ width: "15%" }}>Year Range:</span>
                            <Slider
                                max={2023}
                                min={1999}
                                value={range}
                                onChange={handleSliderChange}
                                onChangeCommitted={() => applyRangeFilter(range)}
                                marks={MARKS}
                                valueLabelDisplay="on"
                            />
                        </div>
                    </Collapse>

                    <div className={styles["applied-filters"]}>
                        <span style={{ marginTop: "1rem", marginBottom: "0.5rem" }}>Applied Filters</span>
                        <div className={styles["filters-box"]}>
                            <FilterList rangeString={rangeString} setRangeString={setRangeString} />
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
        </div>
    );
};

export default SnapshotHeader;