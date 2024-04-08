import Logo from './Logo';
import React from 'react';
import './Header.css'; // Create a separate CSS file for styling
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <>
    <div className='navBarContainer'>
      <div className="headerAndLogo">
        <div className="logo"><Logo/></div>
        <span className="brandName">GeoWhisker</span>
        </div>
        <nav className="navBar">
        <ul className="navLinks">
          <li>
            <a href="/home">Home</a>
          </li>
          <li>
            <a href="/cats">Cats</a>
          </li>
          <li>
            <a href="/browse">Browse</a>
          </li>
          <li>
            <a href="/resources">Resources</a>
          </li>
          <li>
            <a href="/logout">Log Out</a>
          </li>
        </ul>
        </nav>

        

      </div>
    </>
  );
}
