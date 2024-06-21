import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Login from "./Pages/users/Login";

function App() {
  return (
    <div className="h-full min-h-full">
      <Router>
        <Routes>
          <Route path="/" element={<Header />}></Route>
          <Route path="/login" element={<Login />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
