import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {

    return (
        <nav className="navbar">
        <ul className="nav">
            <li class="home-link"><NavLink to="/">Home</NavLink></li>
            <li class="about-link"><NavLink to="/about">About</NavLink></li>
            <li class="about-link"><NavLink to="/projects">Projects</NavLink></li>
        </ul>
        </nav>
    );
    };
  
export default Navbar;