import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROLES } from "../../config/roles";
import Header from "../../components/Header/Header";

const USER_REGEX = /^[a-zA-Z0-9]{5,30}$/;
const PASSWORD_REGEX =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

const NewUserForm = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [validUsername, setValidUsername] = useState(false);
  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [roles, setRoles] = useState(["User"]);

  useEffect(() => {
    setValidUsername(USER_REGEX.test(username));
  }, [username]);

  useEffect(() => {
    setValidPassword(PASSWORD_REGEX.test(password));
  }, [password]);


  const content = (
    <>
      <Header />
      <div className="pt-8 relative flex flex-col justify-center">
        <div className="p-6 m-auto bg-grey rounded-md shadow-md ring-2 ring-gray-800/50 lg:max-w-xl">
          <form className="space-y-4">
            <div className="form">
              <h2>New User</h2>
            </div>
            <div>
              <label className="label" htmlFor="username">
                Username:
              </label>
              <input
                className={`w-full input input-bordered`}
                type="text"
                id="username"
                name="username"
                value={username}

                autoComplete="off"
                placeholder="Username"
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
                value={password}
    
                autoComplete="off"
                placeholder="Password"
              ></input>{" "}
            </div>
            <label className="lable" htmlFor="roles">
              ASSIGNED ROLES:
            </label>
            <div className="dropdown dropdown-right">
              <div tabIndex={0} role="button" className="btn m-1">
                {roles ? (
                  <div className="relative">
                    <div className="flex items-center justify-between">
                      <span>{roles}</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 12a1 1 0 01-.707-.293l-4-4a1 1 0 011.414-1.414L10 9.586l3.293-3.293a1 1 0 111.414 1.414l-4 4A1 1 0 0110 12z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                ) : (
                  "Select a Role"
                )}
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
              >

              </ul>
            </div>
            <div>
              <button
                className="btn btn-block"
                type="submit"
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
  return content;
};

export default NewUserForm;