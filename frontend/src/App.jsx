import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Summary from "./pages/Summary";

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<HomePage />} />
        <Route path="/summary/:id" element={<Summary />} />
      </Routes>
    </Router>
  );
  
};

export default App;
