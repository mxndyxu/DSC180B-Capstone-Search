// Import libraries
import React from 'react';
import Navbar from './Navbar';
import '../styles/Layout.css';

// Functional component representing the layout of the application
const Layout = ({ children }) => (
  // Render a div containing Navbar and the children components
  <div className='page-container'>
    <Navbar />
    {children}
  </div>
);

export default Layout;
