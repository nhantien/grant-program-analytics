import './App.css';
import { useState } from 'react';
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

const projects = [];
fetch(BASE_URL)
  .then((res) => {
    return res.json();
  }).then((json) => {
    console.log(json);
    json.map((data) => {
      projects.push(new Project(data.FundingYear, data.ProjectType, data.Investigator, data.Faculty, data.Title, data.ProjectYear, data.Amount, data.ProjectStatus));
    });
  }).catch((err) => {
    console.log(err);
  });

function App() {

  const [appliedFilters, setAppliedFilters] = useState(["2022/2023"]);

  const handleSelectFilter = (selectedFilter) => {
    const newFilters = [...appliedFilters, selectedFilter];
    setAppliedFilters(newFilters);
  }

  const handleClearFilter = (filterToRemove) => {
    const updatedFilters = appliedFilters.filter((filter) => filter !== filterToRemove);
    setAppliedFilters(updatedFilters);
  };

  const handleClearAll = () => {
    const newFilters = [];
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
              <Filter options={YEARS} onSelect={handleSelectFilter} defaultValue="" />
              <Filter options={PROJECT_TYPE} onSelect={handleSelectFilter} defaultValue="Project Type (Any)" />
              <Filter options={FACULTY} onSelect={handleSelectFilter} defaultValue="Faculty (Any)" />
              <Filter options={options} onSelect={handleSelectFilter} defaultValue="Focus Area" />
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
              <th>Project Type</th>
              <th>Principal Investigator</th>
              <th>Department/Faculty</th>
              <th>Title</th>
              <th>Project Year</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Report</th>
              <th>Poster</th>
            </tr>
          </thead>
          <tbody>
            {
              projects.map((project) => (
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
