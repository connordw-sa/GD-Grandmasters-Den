import "./App.css";
import React from "react";
import LoginPage from "./pages/Login";
import HomePage from "./pages/Home";
import GamePage from "./pages/Game";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Contact from "./components/contact/contact";
const App = () => (
  <div className="App">
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home/:username" element={<HomePage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/game/:gameId" element={<GamePage />} />
      </Routes>
    </BrowserRouter>
  </div>
);

export default App;
