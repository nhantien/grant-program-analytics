// react
import React, { createContext, useState } from "react";
// react-router
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// amplify
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
// components
import HomePage from "./pages/HomePage";
import Summary from "./pages/Summary";
import Snapshot from "./pages/Snapshot";
import { CURRENT_YEAR } from "./constants"

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
      region: process.env.REACT_APP_AWS_REGION,
      userPoolClientId: process.env.REACT_APP_COGNITO_USER_POOL_CLIENT_ID,
      userPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID,
      identityPoolId: process.env.REACT_APP_COGNITO_IDENTITY_POOL_ID,
      allowGuestAccess: true,
    }
  }
});

function HomePageWithAuth() {
  return (
    <div style={{ minWidth: '100vw', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Authenticator loginMechanisms={['username']} hideSignUp={true}>
        {({ signOut, user }) => (
          <HomePage signOut={signOut} />
        )}
      </Authenticator>
    </div>
  )
};

function App() {

  const [appliedFilters, setAppliedFilters] = useState({
    "funding_year": [CURRENT_YEAR.toString()],
    "project_type": [],
    "project_faculty": [],
    "focus_area": [],
    "search_text": []
  });

  return (
    <FiltersContext.Provider value={{ appliedFilters, setAppliedFilters }}>
      <Router>
        <Routes>
          <Route key='client' path="/" exact element={<HomePage />} />
          <Route key='client-summary' path="/summary/:id" element={<Summary />} />
          <Route key='client-snapshot' path="/snapshot" element={<Snapshot />} />
          <Route key='admin' path="/staging" element={<HomePageWithAuth />} />
          <Route key='admin-summary' path="/staging/summary/:id" element={<Summary />} />
          <Route key='admin-snapshot' path="/staging/snapshot" element={<Snapshot />} />
        </Routes>
      </Router>
    </FiltersContext.Provider>

  );

};

export default App;
