import styles from './HomePage.module.css';
import { useState, useEffect } from 'react';
import { FilterList, SearchBar, TableItem, VerticalTableItem } from '../components/home';
import { Filter } from "../components/util";
import ClearIcon from '@mui/icons-material/Clear';
import { IconButton, Select, MenuItem, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';

import { Project, BASE_URL, YEARS, PROJECT_TYPE, FACULTY, sleep, SAMPLE_PROJECT } from '../constants';

const options = ['Option 1', 'Option 2', 'Option 3'];

function HomePage() {

    const [appliedFilters, setAppliedFilters] = useState({
        "FundingYear": ["2022/2023"],
        "ProjectType": [],
        "Faculty": [],
        "FocusArea": [],
        "SearchText": []
    });
    const [projectsPerPage, setProjectsPerPage] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [projects, setProjects] = useState([]);
    const [sort, setSort] = useState({
        "order": "asc",
        "property": null
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFilteredData = async () => {
            try {
                setProjects([]);
                setLoading(true);
                const res = await fetch(BASE_URL + "filter", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", },
                    body: JSON.stringify({ appliedFilters }),
                });
                if (!res.ok) throw new Error("Network response was not ok");

                const data = await res.json();
                const newProjects = data.map((proj) => {

                    // Make sure to return the new Project instance
                    return new Project(
                        proj.ID,
                        proj.FundingYear,
                        proj.ProjectType,
                        proj.Investigator,
                        proj.Faculty,
                        proj.Title,
                        "1",
                        proj.Amount,
                        proj.ProjectStatus
                    );
                });

                setProjects(newProjects);
                setLoading(false);
            } catch (err) {
                console.log(err);
            }
        };

        fetchFilteredData();
    }, [appliedFilters]);

    const handleSort = (property) => {
        if (property === sort["property"]) {
            setSort({
                "order": sort["order"] === "asc" ? "desc" : "asc",
                "property": sort["property"]
            });
        } else {
            setSort({
                "order": "asc",
                "property": property
            });
        }
    };

    const sortedProjects = [...projects].sort((a, b) => {
        const aValue = a[sort["property"]] || "";
        const bValue = b[sort["property"]] || "";

        if (sort["order"] === 'asc') {
            return aValue.localeCompare(bValue, undefined, { numeric: true });
        } else {
            return bValue.localeCompare(aValue, undefined, { numeric: true });
        }
    });

    const startIndex = (projectsPerPage === "All") ? 0 : (currentPage - 1) * projectsPerPage;;
    const endIndex = (projectsPerPage === "All" || startIndex + projectsPerPage > sortedProjects.length) ? sortedProjects.length : startIndex + projectsPerPage;
    const projectsToDisplay = sortedProjects.slice(startIndex, endIndex);

    const handleSelectFilter = (selectedFilter, filterType) => {
        const newFilters = [...appliedFilters[filterType], selectedFilter];
        setAppliedFilters((prevFilters) => ({
            ...prevFilters,
            [filterType]: newFilters,
        }));
    };

    const handleSelectSearchTextFilter = (keywords) => {
        setAppliedFilters((prevFilters) => ({
            ...prevFilters,
            "SearchText": keywords,
        }));
    };

    const handleClearFilter = (filterToRemove, filterType) => {
        if (filterType === "SearchText") {
            setAppliedFilters((prevFilters) => ({
                ...prevFilters,
                "SearchText": [],
            }));
            return;
        }
        const updatedFilters = appliedFilters[filterType].filter((filter) => filter !== filterToRemove);
        setAppliedFilters((prevFilters) => ({
            ...prevFilters,
            [filterType]: updatedFilters,
        }));
    };

    const handleClearSearchTextFilter = () => {
        setAppliedFilters((prevFilters) => ({
            ...prevFilters,
            "SearchText": [],
        }));
    };

    const handleClearAllFilters = () => {
        const newFilters = {
            "FundingYear": ["2022/2023"],
            "ProjectType": [],
            "Faculty": [],
            "FocusArea": [],
            "SearchText": []
        };
        setAppliedFilters(newFilters);
    };

    const handleSelectDisplayPerPage = (e) => {
        setProjectsPerPage(Number(e.target.value) || "All");
        setCurrentPage(1);
    }


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

    const handleNavigateBack = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    }

    const handleNavigateForward = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    }


    return (
        <div className={styles.bg}>
            <header className={styles["app-header"]}>
                <div className={styles.container}>
                    <h2 className={styles.title}>TLEF Funded Proposals</h2>
                    <SearchBar onSearch={handleSelectSearchTextFilter} onClear={handleClearSearchTextFilter} />
                </div>

                <div className={styles["open-search"]}>
                    <button onClick={(e) => handleOpenSearch(e)}>Open Advanced Search</button>
                </div>

                <div id="filters" className={styles["filters-div"]}>
                    <div className={styles["project-filters"]}>
                        <span className={styles["filter-text"]}>Filter by</span>
                        <div className={styles.filters}>
                            <Filter options={YEARS} onSelect={handleSelectFilter} defaultValue="Funding Year" type="FundingYear" snapshot={false} />
                            <Filter options={PROJECT_TYPE} onSelect={handleSelectFilter} defaultValue="Project Type" type="ProjectType" snapshot={false} />
                            <Filter options={FACULTY} onSelect={handleSelectFilter} defaultValue="Faculty" type="Faculty" snapshot={false} />
                            <Filter options={options} onSelect={handleSelectFilter} defaultValue="Focus Area" type="FocusArea" snapshot={false} />
                        </div>
                    </div>
                    <div className={styles["display-per-page"]}>
                        <span className={styles["filter-text"]} style={{ display: "block", textAlign: "right" }}>Displayed per page</span>
                        <Select
                            className={styles["display-pp-dropdown"]}
                            value={projectsPerPage}
                            onChange={(e) => handleSelectDisplayPerPage(e)}
                        >
                            <MenuItem value={"All"}>All</MenuItem>
                            <MenuItem value={10}>10</MenuItem>
                            <MenuItem value={20}>20</MenuItem>
                            <MenuItem value={30}>30</MenuItem>
                        </Select>
                    </div>
                </div>

                <div className={styles["lower-header-div"]}>

                    <div className={styles["applied-filters"]}>
                        <span style={{ marginTop: "1rem", marginBottom: "0.5rem" }}>Applied Filters</span>
                        <div className={styles["filters-box"]}>
                            <FilterList filters={appliedFilters} onClearFilter={handleClearFilter} />
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
                                        projects: sortedProjects,
                                        filters: appliedFilters
                                    }}
                                    style={{ textDecoration: "none", color: "white" }}
                                >
                                    Generate Project Summary
                                </Link>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div>
                <table className={styles["home-table"]} style={{ width: "100%", borderCollapse: 'collapse' }}>
                    <thead style={{ width: "100%", color: 'white', backgroundColor: '#081252' }}>
                        <tr>
                            <th onClick={() => handleSort("fundingYear")}>Funding Year {sort["order"] === "asc" ? '▲' : '▼'}</th>
                            <th onClick={() => handleSort("type")}>Project Type {sort["order"] === "asc" ? '▲' : '▼'}</th>
                            <th onClick={() => handleSort("investigator")}>Principal Investigator {sort["order"] === "asc" ? '▲' : '▼'}</th>
                            <th onClick={() => handleSort("faculty")}>Faculty {sort["order"] === "asc" ? '▲' : '▼'}</th>
                            <th onClick={() => handleSort("title")}>Title {sort["order"] === "asc" ? '▲' : '▼'}</th>
                            <th onClick={() => handleSort("projectYear")}>Project Year {sort["order"] === "asc" ? '▲' : '▼'}</th>
                            <th onClick={() => handleSort("amount")}>Amount {sort["order"] === "asc" ? '▲' : '▼'}</th>
                            <th onClick={() => handleSort("status")}>Status {sort["order"] === "asc" ? '▲' : '▼'}</th>
                            <th>Report</th>
                            <th>Poster</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            sortedProjects.length === 0 &&
                            <TableItem key={-1} project={SAMPLE_PROJECT} color={false} />
                        }
                        {
                            (window.screen.width > 576) &&
                            projectsToDisplay.map((project, index) => (
                                <TableItem key={project.id} project={project} color={index % 2 === 0} />
                            ))
                        }
                    </tbody>
                </table>

                {
                    loading &&
                    <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                        <CircularProgress />
                    </div>
                }

                {
                    (sortedProjects.length === 0 && loading === false) &&
                    <h2 style={{ width: "100%", textAlign: "center", marginTop: 0 }}>No projects found.</h2>
                }

                <div className={styles["mobile-table"]}>
                    {
                        window.screen.width <= 576 &&
                        projectsToDisplay.map((project) => (
                            <VerticalTableItem key={project.id} project={project} />
                        ))
                    }
                </div>
            </div>

            <div className={styles.pagination}>
                <button className={styles["page-btn"]} onClick={handleNavigateBack} disabled={currentPage === 1}>
                    &lt;
                </button>
                <span>Current Page: {currentPage}</span>
                <button className={styles["page-btn"]} onClick={handleNavigateForward} disabled={endIndex >= sortedProjects.length}>
                    &gt;
                </button>
            </div>
        </div>
    );
}

export default HomePage;
