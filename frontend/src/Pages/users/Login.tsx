import React, { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const loginData = {
      Username: formData.get("username") as string,
      Password: formData.get("password") as string,
    };

    try {
      const response = await fetch("https://localhost:7023/api/User/Login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || "Login failed");
      }

      const data = await response.json();
      const token = data.token; // Assuming the response includes a 'token' field

      // Store token in localStorage or session storage for persistent login
      localStorage.setItem("token", token);

      // Navigate to dashboard or any other authenticated route
      navigate("/dash");
    } catch (error) {
      console.error("Login error:", error);
      setError("Login failed. Please try again.");
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
              {error && <p className="text-red-500">{error}</p>}
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
                Password:
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
