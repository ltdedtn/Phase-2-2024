import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Login from "./Pages/users/Login";
import SignUp from "./Pages/users/NewUserForm";
import UserDash from "./Pages/users/UserDash";

function App() {
  return (
    <div className="h-full min-h-full">
      <Router>
        <Routes>
          <Route path="/" element={<Header />}></Route>
          <Route path="/dash" element={<UserDash />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/signUp" element={<SignUp />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
