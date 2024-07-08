import React, { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";

const Login: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const loginData = {
      UsernameOrEmail: formData.get("username") as string,
      Password: formData.get("password") as string,
    };

    try {
      const response = await fetch("/api/User/Login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      // Handle successful login, e.g., save token to localStorage
      navigate("/dashboard"); // Navigate to dashboard or any other route
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <>
      <Header />
      <div className="pt-8 relative flex flex-col justify-center">
        <div className="p-6 m-auto bg-grey rounded-md shadow-md ring-2 ring-gray-800/50 lg:max-w-xl">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="form">
              <h2>Login</h2>
            </div>
            <div>
              <label className="label" htmlFor="username">
                Username/Email:
              </label>
              <input
                className={`w-full input input-bordered`}
                type="text"
                id="username"
                name="username"
                autoComplete="off"
                placeholder="Username or Email"
              />
            </div>
            <div>
              <label className="label" htmlFor="password">
                Password: <span className="nowrap"></span>
              </label>
              <input
                className={`w-full input input-bordered`}
                type="password"
                id="password"
                name="password"
                autoComplete="off"
                placeholder="Password"
              />
            </div>
            <div>
              <button className="btn btn-block" type="submit">
                Login
              </button>
            </div>
            <div>
              <Link to="/signUp">
                <button className="btn btn-block" type="button">
                  Sign Up
                </button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
