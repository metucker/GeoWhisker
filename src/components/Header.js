import Logo from './Logo';
import React from 'react';

export default function Header() {
    return (
      <nav className="navBar">
          <Logo/>
          GeoWhisker
        <ul>
          <li>
            <a href="/home">Home</a>
          </li>
          <li>
            <a href="/browse">Browse</a>
          </li>
        </ul>
      </nav>
    )
  }