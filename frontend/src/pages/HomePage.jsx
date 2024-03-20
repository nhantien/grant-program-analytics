// react
import { useState, useEffect, useContext } from 'react';
// react-router
import { Link } from 'react-router-dom';
// mui
import ClearIcon from '@mui/icons-material/Clear';
import { IconButton, CircularProgress, Collapse, Slider } from '@mui/material';
// amplify
import { generateClient } from 'aws-amplify/api';
// css styles
import styles from './HomePage.module.css';
// context
import { FiltersContext } from '../App';
// components
import { SearchBar, VerticalTableItem, ProjectTable } from '../components/home';
import { Filter, FilterList, FundingYearFilter } from "../components/util";
// constants
import { Project, PROJECT_TYPE, MARKS } from '../constants';

function HomePage() {

    const client = generateClient();

    const { appliedFilters, setAppliedFilters } = useContext(FiltersContext);

    const [options, setOptions] = useState({});
    const [optionsLoading, setOptionsLoading] = useState(true);

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showSlider, setShowSlider] = useState(false);
    const [range, setRange] = useState([1999, 2023]);
    const [rangeString, setRangeString] = useState("");

    const generateQueryString = (filters) => {

        const str = `query homePage {
            getFilteredProposals(method: "getFilteredProposals", filter: {
                funding_year: ${JSON.stringify(filters["funding_year"])},
                project_faculty: ${JSON.stringify(filters["project_faculty"])},
                project_type: ${JSON.stringify(filters["project_type"])},
                focus_area: ${JSON.stringify(filters["focus_area"])},
                search_text: ${JSON.stringify(filters["search_text"])}
            }) {
                grant_id
                project_id
                funding_year
                project_type
                pi_name
                project_faculty
                funding_amount
                title
                project_year
            }

            loadFaculty(method: "loadFaculty") {
                faculty_name
                faculty_code
            }

            loadFocusArea(method: "loadFocusArea") {
                label
                value
            }
        }`;

        return str;
    }

    const setDropdownOptions = (faculties, focusAreas) => {
        let facultiesJSON = {};
        faculties.map((faculty) => {
            facultiesJSON[faculty.faculty_code] = faculty.faculty_name;
        });

        let focusAreasJSON = {};
        focusAreas.map((area) => {
            focusAreasJSON[area.value] = area.label;
        });

        const currentYear = new Date().getFullYear();
        let yearsJSON = {};
        for (let i = 1999; i <= currentYear; i++) {
            const yearString = `${i}/${i+1}`;
            const iString = i.toString();
            yearsJSON[iString] = yearString;
        }
 
        setOptions({
            funding_year: yearsJSON,
            project_type: PROJECT_TYPE,
            project_faculty: facultiesJSON,
            focus_area: focusAreasJSON
        });
    }

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const queryString = `query load {
                    loadFaculty(method: "loadFaculty") {
                        faculty_name
                        faculty_code
                    }

                    loadFocusArea(method: "loadFocusArea") {
                        label
                        value
                    }
                }`;

                const results = await client.graphql({
                    query: queryString
                });

                const faculties = results.data.loadFaculty;
                const focusAreas = results.data.loadFocusArea;

                setDropdownOptions(faculties, focusAreas);
                setOptionsLoading(false);

            } catch (e) {
                console.log(e);
            }
        };

        fetchOptions();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const queryString = generateQueryString(appliedFilters);

                const results = await client.graphql({
                    query: queryString
                });

                const proposals = results.data.getFilteredProposals;

                const newProjects = proposals.map((proj) => {
                    return new Project(
                        proj.grant_id,
                        proj.funding_year + "/" + (+proj.funding_year + 1),
                        proj.project_type,
                        proj.pi_name,
                        proj.project_faculty,
                        proj.title,
                        proj.project_year,
                        proj.funding_amount,
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
            "funding_year": ["2022"],
            "project_type": [],
            "project_faculty": [],
            "focus_area": [],
            "search_text": []
        };
        setAppliedFilters(newFilters);
    };

    // for mobile UI
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

    // when the slider changes but it is still on focus
    const handleSliderChange = (event, newRange) => {
        setRange(newRange);
    }

    // update filters when the slider gets out of focus
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
                            <FundingYearFilter options={optionsLoading ? {} : options.funding_year} setShowSlider={setShowSlider} snapshot={false} />
                            <Filter options={optionsLoading ? {} : options.project_type} defaultValue="Project Type" type="project_type" snapshot={false} />
                            <Filter options={optionsLoading ? {} : options.project_faculty} defaultValue="Faculty/Unit" type="project_faculty" snapshot={false} />
                            <Filter options={optionsLoading ? {} : options.focus_area} defaultValue="Focus Area" type="focus_area" snapshot={false} />
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
                            <FilterList options={optionsLoading ? {'funding_year': { '2022': '2022/2023' }} : options} rangeString={rangeString} setRangeString={setRangeString} />
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
