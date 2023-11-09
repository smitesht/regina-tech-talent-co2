import React from "react";
import "./Header.scss";
import { NavLink } from "react-router-dom";
import { FaCanadianMapleLeaf } from "react-icons/fa";

const Header = () => {
  return (
    <header className="header-container">
      <div className="brand">
        <img src="./images/brand.png" alt="Brand" />
        <h1>SustainaTRACK</h1>
      </div>

      <nav>
        <NavLink to="/">Vehicle</NavLink>
        <NavLink to="/house">House</NavLink>
        <NavLink to="/flight">Flight</NavLink>
      </nav>
    </header>
  );
};

export default Header;
