import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Login from "./Pages/users/Login";
import SignUp from "./Pages/users/NewUserForm";
import UserDash from "./Pages/users/UserDash";
import EditUserForm from "./Pages/users/EditUserForm";
import { UserProvider } from "./Pages/users/UserContext";

function App() {
  return (
    <div className="h-full min-h-full">
      <Router>
        <UserProvider>
          <Header />
          <Routes>
            <Route path="/dash" element={<UserDash />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signUp" element={<SignUp />} />
            <Route path="/dash/users/:userId/edit" element={<EditUserForm />} />
          </Routes>
        </UserProvider>
      </Router>
    </div>
  );
}

export default App;
