import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const Header = () => {
    // use theme from local storage if available or set light theme
    const [theme, setTheme] = useState(
      localStorage.getItem("theme") ? localStorage.getItem("theme") : "light"
    );
  
    // update state on toggle
    const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked) {
        setTheme("dark");
      } else {
        setTheme("light");
      }
    };
    useEffect(() => {
      localStorage.setItem("theme", theme ?? "");
      const localTheme = localStorage.getItem("theme");
      // add custom data-theme attribute to html tag required to update theme using DaisyUI
      document.querySelector("html")?.setAttribute("data-theme", localTheme ?? "");
    }, [theme]);
  return (
    
    <div className="navbar bg-base-100 shadow-lg px-4 sm:px-8">
    <div className="flex-auto">
      <Link to="/">Home</Link>
    </div>
    <div className="flex-none">
      <Link to="/login">Login</Link>
    </div>
    <div className="flex-none">
      {/* Toggle button here */}
      <button className="btn btn-square btn-ghost">
        <label className="swap swap-rotate w-12 h-12">
          <input
            type="checkbox"
            onChange={handleToggle}
            // show toggle image based on localstorage theme
            checked={theme === "light" ? false : true}
          />
          <h2 className="w-8 h-8 swap-off">
            Set Dark
          </h2>
          <h2 className="w-8 h-8 swap-on">
            Set Light
          </h2>
        </label>
      </button>
    </div>
  </div>
  );
};

export default Header;
