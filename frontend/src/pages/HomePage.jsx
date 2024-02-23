import styles from './HomePage.module.css';
import { useState, useEffect, useContext } from 'react';
import { FilterList, SearchBar, TableItem, VerticalTableItem, ProjectTable } from '../components/home';
import { Filter, FundingYearFilter } from "../components/util";
import ClearIcon from '@mui/icons-material/Clear';
import { IconButton, CircularProgress, Collapse, Slider } from '@mui/material';
import { Link } from 'react-router-dom';

import { Project, BASE_URL, PROJECT_TYPE, FACULTY, MARKS } from '../constants';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api'
import config from '../aws-exports';

import { FiltersContext } from '../App';

Amplify.configure(config);

// const options = ['Option 1', 'Option 2', 'Option 3'];

const options = [
    {
        "label": "Option 1",
        "value": 1
    },
    {
        "label": "Option 2",
        "value": 2
    },
    {
        "label": "Option 3",
        "value": 3
    },
];


function HomePage() {

    const { appliedFilters, setAppliedFilters } = useContext(FiltersContext);

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showSlider, setShowSlider] = useState(false);
    const [range, setRange] = useState([1999, 2023]);
    const [rangeString, setRangeString] = useState("");

    const generateQueryString = (filters) => {

        const str = `query testGetFilteredProjects {
            getFilteredProjects(method: "getFilteredProjects", filter: {
                funding_year: ${JSON.stringify(filters["FundingYear"])},
                project_faculty: ${JSON.stringify(filters["Faculty"])},
                project_type: ${JSON.stringify(filters["ProjectType"])},
                focus_area: ${JSON.stringify(filters["FocusArea"])},
                search_text: ${JSON.stringify(filters["SearchText"])}
            }) {
                grant_id
                project_id
                funding_year
                project_type
                pi_name
                project_faculty
                department
                funding_amount
            }
        }`;

        console.log(str);

        return str;
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const query_string = generateQueryString(appliedFilters);
                const client = generateClient()
                const results = await client.graphql({
                    query: query_string,
                });

                const proposals = results.data.getFilteredProjects;
                const newProjects = proposals.map((proj) => {
                    return new Project(
                        proj.grant_id,
                        proj.funding_year + "/" + (+proj.funding_year + 1),
                        proj.project_type,
                        proj.pi_name,
                        proj.project_faculty,
                        // (proj.faculty.includes("Faculty of ")) ? proj.faculty.replace("Faculty of ", "") : proj.faculty,
                        "sample title",
                        "1",
                        // proj.project_year,
                        proj.funding_amount,
                        // proj.amount,
                        "Active"
                    );
                });

                setProjects(newProjects);
                setLoading(false);

            } catch (e) {
                console.log(e);
            }
        };

        fetchData();
    }, [appliedFilters]);

    const handleClearAllFilters = () => {
        const newFilters = {
            "FundingYear": ["2022"],
            "ProjectType": [],
            "Faculty": [],
            "FocusArea": [],
            "SearchText": []
        };
        setAppliedFilters(newFilters);
    };

    const handleOpenSearch = (e) => {
        let filters = document.getElementById("filters");
        if (filters.style.display === "none") {
            filters.style.display = "flex";
            e.target.innerHTML = "Close Advanced Search";
        } else {
            filters.style.display = "none";
            e.target.innerHTML = "Open Advanced Search";
        }
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
            years.push(i.toString());
        }

        setAppliedFilters((prevFilters) => ({
            ...prevFilters,
            ["FundingYear"]: years,
        }));

        setRangeString(min + "/" + (min + 1) + " - " + max + "/" + (max + 1));
    }

    return (
        <div className={styles.bg}>
            <header className={styles["app-header"]}>
                <div className={styles.container}>
                    <h2 className={styles.title}>TLEF Funded Proposals</h2>
                    <SearchBar />
                </div>

                <div className={styles["open-search"]}>
                    <button onClick={(e) => handleOpenSearch(e)}>Open Advanced Search</button>
                </div>

                <div id="filters" className={styles["filters-div"]}>
                    <div className={styles["project-filters"]}>
                        <span className={styles["filter-text"]}>Filter by</span>
                        <div className={styles.filters}>
                            <FundingYearFilter setShowSlider={setShowSlider} snapshot={false} />
                            <Filter options={PROJECT_TYPE} defaultValue="Project Type" type="ProjectType" snapshot={false} />
                            <Filter options={FACULTY} defaultValue="Faculty/Unit" type="Faculty" snapshot={false} />
                            <Filter options={options} defaultValue="Focus Area" type="FocusArea" snapshot={false} />
                        </div>
                    </div>
                </div>

                <div style={{ width: "95%", marginLeft: "2.5%", marginRight: "2.5%" }}>
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
                </div>

                <div className={styles["lower-header-div"]}>

                    <div className={styles["applied-filters"]}>
                        <span style={{ marginTop: "1rem", marginBottom: "0.5rem" }}>Applied Filters</span>
                        <div className={styles["filters-box"]}>
                            <FilterList rangeString={rangeString} setRangeString={setRangeString} />
                            <div className={styles["clear-filters-div"]}>
                                <p className={styles.text}>Clear All</p>
                                <IconButton onClick={handleClearAllFilters} size="small">
                                    <ClearIcon />
                                </IconButton>
                            </div>
                        </div>
                    </div>

                    <div className={styles["generate-summary"]}>
                        <p className={styles["generate-summary-txt"]}>View a detailed summary of the currently displayed projects</p>
                        <div>
                            <button className={styles["generate-summary-btn"]}>
                                <Link
                                    to="/snapshot"
                                    state={{
                                        projects: projects,
                                        range: range,
                                    }}
                                    style={{ textDecoration: "none", color: "white" }}
                                >
                                    Generate Program Summary
                                </Link>
                            </button>
                        </div>
                    </div>

                </div>
            </header>

            <div>
                {
                    loading ?
                        (
                            <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                                <CircularProgress />
                            </div>
                        ) :
                        (
                            <ProjectTable projects={projects} />
                        )
                }

                {
                    (projects.length === 0 && loading === false) &&
                    <h2 style={{ width: "100%", textAlign: "center", marginTop: 0 }}>No projects found.</h2>
                }

                <div className={styles["mobile-table"]}>
                    {
                        window.screen.width <= 576 &&
                        projects.map((project) => (
                            <VerticalTableItem key={project.id} project={project} />
                        ))
                    }
                </div>
            </div>
        </div>
    );
}

export default HomePage;
