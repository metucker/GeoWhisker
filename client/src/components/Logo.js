import React from 'react';

const Logo = () => {
  return (
    <svg
      viewBox="0 0 100 100"
      width="100"
      height="100"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Cat head (circle) */}
      <circle cx="50" cy="45" r="30" fill="#40E0D0" />

      {/* Move both ears and whiskers up */}
      {/* Longer pointy ear (triangle) */}
      <polygon points="45,25 30,25 45,00" fill="#40E0D0" />

   

      {/* Shorter tipped ear (trapezoid) */}
      <polygon points="70,30 55,25 50,-5 50,-10" fill="#40E0D0" />



      {/* Move whiskers further left and right */}
      {/* Longer left whiskers (lines) */}
      <line x1="50" y1="45" x2="100" y2="40" stroke="#40E0D0" strokeWidth="2" />
      <line x1="50" y1="45" x2="100" y2="45" stroke="#40E0D0" strokeWidth="2" />
      <line x1="50" y1="45" x2="100" y2="50" stroke="#40E0D0" strokeWidth="2" />

      {/* Longer right whiskers (lines) */}
      <line x1="50" y1="45" x2="0" y2="40" stroke="#40E0D0" strokeWidth="2" />
      <line x1="50" y1="45" x2="0" y2="45" stroke="#40E0D0" strokeWidth="2" />
      <line x1="50" y1="45" x2="0" y2="50" stroke="#40E0D0" strokeWidth="2" />
    </svg>
  );
};

export default Logo;
