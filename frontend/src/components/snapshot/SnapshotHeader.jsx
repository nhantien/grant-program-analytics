// react
import React from "react";
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { useContext, useState } from "react";
// mui
import ClearIcon from '@mui/icons-material/Clear';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Slider, IconButton, Collapse, Grid } from "@mui/material";
// css style
import styles from "./SnapshotHeader.module.css";
// context
import { FiltersContext } from "../../App";
// components
import { Filter, FilterList, FundingYearFilter } from "../util";
// constants
import { CURRENT_YEAR, MARKS } from "../../constants";


function SnapshotHeader({ options, optionsLoading, range, setRange, server }) {

    const path = window.location.pathname;

    const { appliedFilters, setAppliedFilters } = useContext(FiltersContext);

    const [showSlider, setShowSlider] = useState(appliedFilters["funding_year"].length > 1);
    const [rangeString, setRangeString] = useState(range[0] + "/" + (range[0] + 1) + " - " + range[1] + "/" + (range[1] + 1));

    const convertYear = (year) => {
        const yearStr = year.substring(0, year.indexOf("/"));
        return parseInt(yearStr);
    }

    const handleClearAll = () => {
        const newFilters = {
            "funding_year": [CURRENT_YEAR.toString()],
            "project_type": [],
            "project_faculty": [],
            "focus_area": [],
            "search_text": []
        };
        setAppliedFilters(newFilters);
    };

    // called when the slider changes but is still on focus
    const handleSliderChange = (event, newRange) => {
        setRange(newRange);
    }

    // called when the slider gets out of focus
    // when the user changes the slider range, add years to appliedFilters one by one
    // e.g. select '2020 - 2022' -> ["2020", "2021", "2022"]
    const applyRangeFilter = (range) => {
        const min = range[0];
        const max = range[1];
        let years = [];
        for (let i = min; i <= max; i++) {
            years.push(i.toString());
        }

        setAppliedFilters((prevFilters) => ({
            ...prevFilters,
            "funding_year": years,
        }));

        setRangeString(min + "/" + (min + 1) + " - " + max + "/" + (max + 1));
    }

    return (
        <div className={styles.bg}>
             <div className={styles["back"]}>
                        <div>
                        <Link to={path.includes('staging') ? '/staging' : '/'}>
                        <ArrowBackIcon  sx={{ color: "#002145", fontSize: "2.2rem" }}/>
                        </Link>
                        </div>
                    </div>
            <div className={styles.title}>
                TLEF Program Summary
            </div>

            <div className={styles.filters}>

                <Grid container className={styles.dropdowns}>
                    <Grid xs={12} className={styles["dropdown-filters"]}>
                        <Grid container spacing={1}>
                            <Grid item xs={12} md={3}>
                                <FundingYearFilter options={optionsLoading ? {} : options.funding_year} setShowSlider={setShowSlider} snapshot={false} />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Filter options={optionsLoading ? {} : options.project_type} defaultValue="Project Type" type="project_type" snapshot={false} />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Filter options={optionsLoading ? {} : options.project_faculty} defaultValue="Faculty/College/Unit" type="project_faculty" snapshot={false} />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Filter options={optionsLoading ? {} : options.focus_area} defaultValue="Focus Area" type="focus_area" snapshot={false} />
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12}>
                        <Collapse
                            in={showSlider}
                            timeout="auto"
                            unmountOnExit
                        >
                            <Grid container className={styles.slider}>
                                <Grid xs={12} md={2}>
                                    <span>Year Range:</span>
                                </Grid>
                                <Grid xs={12} md={10}>
                                    <Slider
                                        max={2023}
                                        min={1999}
                                        value={range}
                                        onChange={handleSliderChange}
                                        onChangeCommitted={() => applyRangeFilter(range)}
                                        marks={MARKS}
                                        valueLabelDisplay="on"
                                    />
                                </Grid>
                            </Grid>
                        </Collapse>
                    </Grid>

                    <Grid item xs={12}>
                        <div className={styles["applied-filters"]}>
                            <span style={{ marginTop: "1rem", marginBottom: "0.5rem" }}>Applied Filters</span>
                            <div className={styles["filters-box"]}>
                            { !optionsLoading &&
                                    <FilterList options={optionsLoading ? { 'funding_year': { '2024': '2024/2025' } } : options} rangeString={rangeString} setRangeString={setRangeString} />
                                }
                                <div className={styles["clear-filters-div"]}>
                                    <p className={styles.text}>Clear All</p>
                                    <IconButton onClick={handleClearAll} size="small">
                                        <ClearIcon />
                                    </IconButton>
                                </div>
                            </div>
                        </div>
                    </Grid>
                </Grid>

            </div>
        </div>
    );
};

export default SnapshotHeader;