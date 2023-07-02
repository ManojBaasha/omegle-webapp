import React from 'react';
import '../assets/NavBar.css'
import { Link } from 'react-router-dom';

function NavBar() {
  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/chat">Chat</Link></li>
        <li><Link to="/settings">Settings</Link></li>
        <li><Link to="/test">Test</Link></li>
        <li><Link to="/loading">Loading</Link></li>
        <li><Link to="/register">Register</Link></li>
      </ul>
    </nav>
  );
}

export default NavBar;
