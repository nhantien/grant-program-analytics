import './App.css';
import { useState, useEffect } from 'react';
import Filter from './components/Filter.jsx';
import SearchBar from './components/SearchBar.jsx';
import FilterList from './components/FilterList.jsx';
import TableItem from './components/TableItem.jsx';
import ClearIcon from '@mui/icons-material/Clear';
import { IconButton, Select, MenuItem } from '@mui/material';

import { Project, YEARS, PROJECT_TYPE, FACULTY } from './constants/index.js';

const BASE_URL = 'http://localhost:3001/';

const handleSearch = (searchText) => {
  // Implement your search logic here using the searchText
  console.log('Searching for:', searchText);
};

const options = ['Option 1', 'Option 2', 'Option 3'];

function App() {

  const [appliedFilters, setAppliedFilters] = useState({
    "FundingYear": ["2022/2023"],
    "ProjectType": [],
    "Faculty": [],
    "FocusArea": [],
  });
  const [projectsPerPage, setProjectsPerPage] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [projects, setProjects] = useState([]);
  const [sort, setSort] = useState({
    "order": "asc",
    "property": null
  });

  useEffect(() => {
    const fetchFilteredData = async () => {
      try {
        const res = await fetch(BASE_URL + "filter", {
          method: "POST",
          headers: { "Content-Type": "application/json", },
          body: JSON.stringify({ appliedFilters, projectsPerPage, currentPage }),
        });
        if (!res.ok) throw new Error("Network response was not ok");

        const data = await res.json();
        const newProjects = data.map((proj) => {
          // Log the properties of each project for debugging
          console.log("Project Properties:", proj);

          // Make sure to return the new Project instance
          return new Project(
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
      } catch (err) {
        console.log(err);
      }
    };

    fetchFilteredData();
  }, [appliedFilters, sort, projectsPerPage, currentPage]);

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

  const handleSelectFilter = (selectedFilter, filterType) => {
    const newFilters = [...appliedFilters[filterType], selectedFilter];
    setAppliedFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: newFilters,
    }));
  }

  const handleClearFilter = (filterToRemove, filterType) => {
    const updatedFilters = appliedFilters[filterType].filter((filter) => filter !== filterToRemove);
    setAppliedFilters((prevFilters) => ({
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

    };
    setAppliedFilters(newFilters);
  };


  return (
    <div className="App">
      <header className="App-header">
        <div className="container">
          <h2 style={{ textAlign: "start" }} className='title'>TLEF Funded Proposals</h2>
          <SearchBar onSearch={handleSearch} />
        </div>

        <div style={{ width: '100%', display: 'flex', justifyContent: "space-between" }}>
          <div style={{ width: "65rem", marginLeft: '3rem' }}>
            <p style={{ fontSize: "1.25rem" }} >Filter by</p>
            <div className='filters'>
              <Filter options={YEARS} onSelect={handleSelectFilter} defaultValue="Funding Year" type="FundingYear" />
              <Filter options={PROJECT_TYPE} onSelect={handleSelectFilter} defaultValue="Project Type" type="ProjectType" />
              <Filter options={FACULTY} onSelect={handleSelectFilter} defaultValue="Faculty" type="Faculty" />
              <Filter options={options} onSelect={handleSelectFilter} defaultValue="Focus Area" type="FocusArea" />
            </div>
          </div>
          <div style={{ width: "30rem", marginLeft: '3rem' }}>
            <p style={{ fontSize: '1.25rem' }}>Displayed per page</p>
            <Select
              style={{ width: "14.4375rem", backgroundColor: "white" }}
              value={projectsPerPage}
              onChange={(e) => setProjectsPerPage(Number(e.target.value) || "All")}
            >
              <MenuItem value={"All"}>All</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={30}>30</MenuItem>
            </Select>
          </div>
        </div>

        <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginLeft: "5rem" }}>
          <div className='applied-filters'>
            <span style={{ marginTop: "1rem", marginBottom: "1rem" }}>Applied Filters</span>
            <div className='filters-box'>
              <FilterList filters={appliedFilters} onClearFilter={handleClearFilter} />
              <div className="clear-filters-div">
                <p style={{ fontSize: "0.9375rem", textAlign: "start" }}>Clear All</p>
                <IconButton onClick={handleClearAll} size="small">
                  <ClearIcon />
                </IconButton>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", marginRight: "5rem" }}>
            <div style={{ width: "25.5625rem", height: "3.125rem" }}>
              <span style={{ textAlign: "start", fontSize: "1.25rem" }}>(selected n projects)</span>
              <br />
              <span style={{ textAlign: "start", fontSize: "1.875rem", fontWeight: 700 }}>Generate Project Summary</span>
            </div>
            <div style={{ width: "6.125rem", height: "4rem" }}>
              <button className="generate-summary-btn">Go</button>
            </div>
          </div>
        </div>
      </header>

      <div style={{ width: "100%" }}>
        <table style={{ width: "100%", borderCollapse: 'collapse' }}>
          <thead style={{ color: 'white', backgroundColor: '#081252' }}>
            <tr>
              <th>Funding Year</th>
              <th onClick={() => handleSort("type")}>Project Type {sort["order"] === "asc" ? '▲' : '▼'}</th>
              <th onClick={() => handleSort("investigator")}>Principal Investigator {sort["order"] === "asc" ? '▲' : '▼'}</th>
              <th onClick={() => handleSort("faculty")}>Department/Faculty {sort["order"] === "asc" ? '▲' : '▼'}</th>
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
              <h3 style={{ textAlign: "center" }}>No projects found.</h3>
            }
            {
              sortedProjects.map((project, index) => (
                <TableItem project={project} color={index % 2 === 0} />
              ))
            }
          </tbody>
        </table>
      </div>

      <div style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
        <p style={{ width: "4.4375rem", fontSize: "0.9375rem", fontWeight: "bold" }}>Select All</p>
        <input type="checkbox" />
      </div>

      <div style={{width: "100%", display: "flex", justifyContent: "flex-end", alignItems: "center", marginTop: "3rem"}}>
        <button className='page-btn' onClick={() => setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))} disabled={currentPage === 1}>
          &lt;
        </button>
        <span style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Current Page: {currentPage}</span>
        <button className='page-btn' onClick={() => setCurrentPage((prevPage) => prevPage + 1)} disabled={projectsPerPage === "All" || projects.length < projectsPerPage}>
          &gt;
        </button>
      </div>
    </div>
  );
}

export default App;
