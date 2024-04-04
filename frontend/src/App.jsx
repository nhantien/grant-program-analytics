// react
import React, { createContext, useState } from "react";
// react-router
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useLocation } from 'react-router-dom';
// amplify
import { Amplify } from 'aws-amplify';
// components
import HomePage from "./pages/HomePage";
import Summary from "./pages/Summary";
import Snapshot from "./pages/Snapshot";

export const FiltersContext = createContext("filters");

Amplify.configure({
  API: {
      GraphQL: {
          endpoint: process.env.REACT_APP_APPSYNC_ENDPOINT,
          region: process.env.REACT_APP_AWS_REGION,
          defaultAuthMode: 'iam',
      }
  },
  Auth: {
      Cognito: {
          identityPoolId: process.env.REACT_APP_COGNITO_IDENTITY_POOL_ID,
          region: process.env.REACT_APP_AWS_REGION,
          allowGuestAccess: true
      }
  }
});

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
          <Route path="/" exact element={<HomePage />}>
          const location = useLocation();
          const myParam = new URLSearchParams(location.search).get('myParam');
          console.log("PARAMETER", myParam);
          </Route>
          <Route path="/summary/:id" element={<Summary />} />
          <Route path="/snapshot" element={<Snapshot />} />
        </Routes>
      </Router>
    </FiltersContext.Provider>

  );

};

export default App;
