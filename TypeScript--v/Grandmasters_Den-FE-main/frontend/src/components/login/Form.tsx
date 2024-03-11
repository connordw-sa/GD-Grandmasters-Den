import React from "react";

interface FormProps {
  isLogin: boolean;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  error: string | null;
}

const Form: React.FC<FormProps> = ({ isLogin, handleSubmit, error }) => {
  return (
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
      <input
        type="password"
        name="password"
        id="password"
        placeholder="Password"
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
      {error && <p className="text-danger">{error}</p>}
      <button type="submit" className="btn btn-secondary">
        {isLogin ? "Login" : "Register"}
      </button>
    </form>
  );
};

export default Form;
