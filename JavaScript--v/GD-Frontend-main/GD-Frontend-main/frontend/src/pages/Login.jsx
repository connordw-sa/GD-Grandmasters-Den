import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../zustand/store";

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const loginRegisterUser = useStore((state) => state.loginRegister);
  const username = useStore((state) => state.user?.username);
  const isLoggedIn = useStore((state) => state.isLoggedIn);

  useEffect(() => {
    if (isLoggedIn) {
      navigate(`/home/${username}`);
    }
  }, [isLoggedIn, navigate, username]);

  const switchForm = () => {
    setIsLogin(!isLogin);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const email = event.target.email.value;
    const password = event.target.password.value;
    const username = isLogin ? null : event.target.username.value;

    await loginRegisterUser({
      email: email,
      password: password,
      username: username
    });
  };

  return (
    <div className="login-page d-flex justify-content-center align-items-center">
      <div className="login-form">
        <h1 className="text-light">{isLogin ? "Login" : "Register"}</h1>
        <form
          onSubmit={handleSubmit}
          className="d-flex flex-column justify-content-between h-25"
        >
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            required
          />
          {!isLogin && (
            <input
              type="text"
              name="username"
              id="username"
              placeholder="Username"
              required
            />
          )}
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            required
          />

          <button type="submit" className="btn btn-secondary">
            {isLogin ? "Login" : "Register"}
          </button>
        </form>
        <button
          type="button"
          className="btn btn-link text-light"
          onClick={switchForm}
        >
          {isLogin ? "Register" : "Login"}
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
