import React from 'react';
import { Link } from "react-scroll";

const NavBar = () => (
  <div className="nav-links">
    <Link to="home" smooth={true} duration={500}>Home<br></br></Link>
    <Link to="File-list" smooth={true} duration={500}>Download<br></br></Link>
    <Link to="code-formatter" smooth={true} duration={500}>Code Formatter</Link>
  </div>
);

export default NavBar;
