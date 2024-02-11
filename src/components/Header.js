import Logo from './Logo';
import React from 'react';

export default function Header() {
    return (
      <nav className="navBar">
        <row>
          <Logo/>
          <h1>GeoWhisker</h1>

        <a href="/">Home</a>
         
         <a href="/browse">Browse</a>  
       
        </row>
        
          
      </nav>
    )
  }