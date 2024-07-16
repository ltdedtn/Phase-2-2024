import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "../../Pages/users/UserContext";

const Header = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const { username, setUsername } = useUserContext();

  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTheme = e.target.checked ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUsername(null);
    navigate("/login");
  };

  useEffect(() => {
    const localTheme = localStorage.getItem("theme");
    document
      .querySelector("html")
      ?.setAttribute("data-theme", localTheme || "light");
  }, [theme]);

  return (
    <div className="navbar bg-base-100 shadow-lg px-4 sm:px-8">
      <div className="flex-auto">
        <Link to="/">Home</Link>
        <Link to="/stories" className="ml-4">
          Stories
        </Link>
        <Link to="/characters" className="ml-4">
          Characters
        </Link>
        <Link to="/dash" className="ml-4">
          Users
        </Link>
      </div>
      <div className="flex-none">
        {username ? (
          <>
            <span>Welcome, {username}!</span>
            <button className="btn btn-ghost ml-4" onClick={handleLogout}>
              Sign Out
            </button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
      <div className="flex-none">
        <button className="btn btn-square btn-ghost">
          <label className="swap swap-rotate w-12 h-12">
            <input
              type="checkbox"
              onChange={handleToggle}
              checked={theme === "dark"}
            />
            <h2 className="w-8 h-8 swap-off">Set Dark</h2>
            <h2 className="w-8 h-8 swap-on">Set Light</h2>
          </label>
        </button>
      </div>
    </div>
  );
};

export default Header;
