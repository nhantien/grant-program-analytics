import React, { createContext, useState } from "react";
import { BrowserRouter as Router, Route, Routes, BrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Summary from "./pages/Summary";
import Snapshot from "./pages/Snapshot";

export const FiltersContext = createContext("filters");

function App() {

  const [appliedFilters, setAppliedFilters] = useState({
    "funding_year": ["2022"],
    "project_type": [],
    "project_faculty": [],
    "focus_area": [],
    "search_text": []
  });


  return (
    <FiltersContext.Provider value={{ appliedFilters, setAppliedFilters }}>
      <Router>
        <Routes>
          <Route path="/" exact element={<HomePage />} />
          <Route path="/summary/:id" element={<Summary />} />
          <Route path="/snapshot" element={<Snapshot />} />
        </Routes>
      </Router>
    </FiltersContext.Provider>

  );

};

export default App;
