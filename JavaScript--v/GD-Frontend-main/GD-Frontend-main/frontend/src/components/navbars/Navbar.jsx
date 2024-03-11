import React from "react";
import { Navbar } from "react-bootstrap";
import blackKnight from "../../assets/pieces/w-knight.png";
import { useStore } from "../../zustand/store";
import { useNavigate } from "react-router-dom";

export default function MyNavbar() {
  const logout = useStore((state) => state.logout);
  const username = useStore((state) => state.user.username);
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  return (
    <Navbar className="sticky-top navbar-navbar">
      <div className="navbar nav d-flex justify-content-between align-items-center">
        <a href={`/home/${username}`}>
          <div className="d-flex align-items-center">
            <img className="logo-img" src={blackKnight} alt="logo" />
            <h5 className="nav navbar-links ml-2">GD</h5>
          </div>
        </a>
        <a href="/rules">
          <h5 className="nav navbar-links">Chess Rules</h5>
        </a>
        <a href="/contact">
          <h5 className="nav navbar-links">Contact</h5>
        </a>
        <button className="no-style-navbar-button" onClick={handleLogout}>
          <h5 className="nav navbar-links">Logout</h5>
        </button>
      </div>
    </Navbar>
  );
}
