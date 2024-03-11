import React, { useState, useEffect } from "react";
import { Navbar } from "react-bootstrap";
import blackKnight from "../../assets/pieces/w-knight.png";
import { useStore } from "../../zustand/Store";
import { useNavigate } from "react-router-dom";

const MyNavbar: React.FC = () => {
  const logout = useStore((state) => state.logout);
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Navbar className="sticky-top navbar-navbar">
      <div className="navbar nav d-flex justify-content-between align-items-center">
        <a href="/home">
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
        <button onClick={handleLogout} className="no-style-navbar-button">
          <h5 className="nav navbar-links">Logout</h5>
        </button>
      </div>
    </Navbar>
  );
};

export default MyNavbar;
