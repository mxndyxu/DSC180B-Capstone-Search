import React from 'react';
import { NavLink } from 'react-router-dom';

// Navbar component
const Navbar = () => {
    // Render navigation links
    return (
        <nav className="navbar">
            <ul className="nav">
                <li id="home-link" className="nav-menu-item"><NavLink to="/">Home</NavLink></li>
                <li id="about-link" className="nav-menu-item"><NavLink to="/about">About</NavLink></li>
                <li id="about-link" className="nav-menu-item"><NavLink to="/projects">Projects</NavLink></li>
            </ul>
        </nav>
    );
};
  
// Export Navbar component
export default Navbar;