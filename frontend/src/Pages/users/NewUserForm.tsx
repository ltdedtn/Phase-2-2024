import React, { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";

const SignUp: React.FC = () => {
  const navigate = useNavigate();

  const USER_REGEX = /^[a-zA-Z0-9]{5,30}$/;
  const PASSWORD_REGEX =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const [username, setUsername] = useState("");
  const [validUsername, setValidUsername] = useState(false);
  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
    setValidUsername(USER_REGEX.test(event.target.value));
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    setValidEmail(EMAIL_REGEX.test(event.target.value));
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
    setValidPassword(PASSWORD_REGEX.test(event.target.value));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validUsername || !validEmail || !validPassword) {
      alert("Please fill out the form correctly.");
      return;
    }

    const signUpData = {
      Username: username,
      Email: email,
      Password: password,
    };

    try {
      console.log("Sign up data:", signUpData);
      const response = await fetch("/api/User/Register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signUpData),
      });

      if (!response.ok) {
        throw new Error("Sign up failed");
      }

      // Handle successful sign up, e.g., navigate to login page
      navigate("/login"); // Navigate to login or any other route
    } catch (error) {
      console.error("Sign up error:", error);
      alert("Sign up failed. Please try again.");
    }
  };

  return (
    <>
      <Header />
      <div className="pt-8 relative flex flex-col justify-center">
        <div className="p-6 m-auto bg-grey rounded-md shadow-md ring-2 ring-gray-800/50 lg:max-w-xl">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="form">
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
                  onChange={handleUsernameChange}
                />
                {!validUsername && (
                  <span className="text-red-500">Invalid username</span>
                )}
              </div>
              <div>
                <label className="label" htmlFor="email">
                  Email:
                </label>
                <input
                  className={`w-full input input-bordered`}
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  autoComplete="off"
                  placeholder="Email"
                  onChange={handleEmailChange}
                />
                {!validEmail && (
                  <span className="text-red-500">Invalid email</span>
                )}
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
                  value={password}
                  autoComplete="off"
                  placeholder="Password"
                  onChange={handlePasswordChange}
                />
                {!validPassword && (
                  <span className="text-red-500">
                    Password must be at least 8 characters long and include at
                    least one letter, one number, and one special character.
                  </span>
                )}
              </div>

              <div>
                <button className="btn btn-block" type="submit">
                  Sign Up
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignUp;
