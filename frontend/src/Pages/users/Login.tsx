import React from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header/Header";

const Login: React.FC = () => {
  const content = (
    <>
      <Header />
      <div className="pt-8 relative flex flex-col justify-center">
        <div className="p-6 m-auto bg-grey rounded-md shadow-md ring-2 ring-gray-800/50 lg:max-w-xl">
          <form className="space-y-4">
            <div className="form">
              <h2>Login</h2>
            </div>
            <div>
              <label className="label" htmlFor="username">
                Username:
              </label>
              <input type="text" id="username" />
            </div>
            <div>
              <label className="label" htmlFor="password">
                Password: <span className="nowrap"></span>
              </label>
              <input type="password" id="password" />
            </div>
            <div>
              <button className="btn btn-block" type="submit">
                Login
              </button>
            </div>
            <div>
              <Link to="/signUp">
                <button className="btn btn-block" type="submit">
                  Sign Up
                </button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
  return content;
};

export default Login;
