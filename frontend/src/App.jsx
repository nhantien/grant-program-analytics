import './App.css';
import { useState, useEffect } from 'react';
import Filter from './components/Filter.jsx';
import SearchBar from './components/SearchBar.jsx';
import FilterList from './components/FilterList.jsx';
import TableItem from './components/TableItem.jsx';
import ClearIcon from '@mui/icons-material/Clear';
import IconButton from '@mui/material/IconButton';

import { Project, YEARS, PROJECT_TYPE, FACULTY } from './constants/index.js';

const BASE_URL = 'http://localhost:3001/';

const handleSearch = (searchText) => {
  // Implement your search logic here using the searchText
  console.log('Searching for:', searchText);
};

const options = ['Option 1', 'Option 2', 'Option 3'];

const handleFilterSelect = (selectedOption) => {
  // Implement your filter logic here using the selectedOption
  console.log('Selected filter:', selectedOption);
};

function App() {

  const [appliedFilters, setAppliedFilters] = useState({
    "FundingYear": ["2022/2023"],
    "ProjectType": [],
    "Faculty": [],
    "FocusArea": [],
  });

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
          body: JSON.stringify({ appliedFilters }),
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
            proj.ProjectYear,
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
      "FundingYear": ["2022/23"],
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
              <Filter options={YEARS} onSelect={handleSelectFilter} defaultValue="" type="FundingYear" />
              <Filter options={PROJECT_TYPE} onSelect={handleSelectFilter} defaultValue="Project Type (Any)" type="ProjectType" />
              <Filter options={FACULTY} onSelect={handleSelectFilter} defaultValue="Faculty (Any)" type="Faculty" />
              <Filter options={options} onSelect={handleSelectFilter} defaultValue="Focus Area" type="FocusArea" />
            </div>
          </div>
          <div style={{ width: "30rem", marginLeft: '3rem' }}>
            <p style={{ fontSize: '1.25rem' }}>Displayed per page</p>
            <Filter options={options} onSelect={handleFilterSelect} defaultValue="All" />
          </div>
        </div>

        <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "end", marginLeft: "5rem" }}>
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
          <thead style={{ color: 'white', backgroundColor: 'black' }}>
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
              sortedProjects.map((project) => (
                <TableItem project={project} />
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
