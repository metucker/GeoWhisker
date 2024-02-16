import Logo from './Logo';
import React from 'react';
import './Header.css'; // Create a separate CSS file for styling

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
            <a href="/signup">Sign Up</a>
          </li>
          <li>
            <a href="/home">Home</a>
          </li>
          <li>
            <a href="/cats">Cats</a>
          </li>
          <li>
            <a href="/browse">Browse</a>
          </li>
        </ul>
        </nav>
      </div>
    </>
  );
}
