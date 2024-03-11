import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../zustand/Store";
import Form from "../components/login/Form";

const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const isLoggedIn = useStore((state) => state.isLoggedIn);
  useStore((state) => state.logState());
  const loginRegister = useStore((state) => state.loginRegister);
  const error = useStore((state) => state.error);
  const username = useStore((state) => state.user?.username);

  useEffect(() => {
    if (isLoggedIn) {
      navigate(`/home/${username}`);
    }
  }, [isLoggedIn, navigate, username]);

  const switchForm = () => {
    setIsLogin(!isLogin);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const email = (
      event.currentTarget.elements.namedItem("email") as HTMLInputElement
    ).value;
    const password = (
      event.currentTarget.elements.namedItem("password") as HTMLInputElement
    ).value;
    const username = isLogin
      ? undefined
      : (event.currentTarget.elements.namedItem("username") as HTMLInputElement)
          .value;

    await loginRegister({ email, password, username });
  };

  return (
    <div className="login-page d-flex justify-content-center align-items-center">
      <div className="login-form">
        <h1 className="text-light">{isLogin ? "Login" : "Register"}</h1>
        <Form isLogin={isLogin} handleSubmit={handleSubmit} error={error} />
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
