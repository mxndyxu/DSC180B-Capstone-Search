import React from 'react';
import Navbar from './Navbar';
import '../styles/Layout.css';

const Layout = ({ children }) => (
  <div>
    <Navbar />
    {children}
  </div>
);

export default Layout;
