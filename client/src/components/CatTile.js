import React from 'react';

const CatTile = ({ cat }) => {
  return (
    <div className="cat-tile">
      <div className="cat-photo">
        <img src={`data:image/jpeg;base64,${cat.photo}`} alt={cat.cname} />
      </div>
      <div className="cat-details">
        <h2>{cat.cname}</h2>
        <p>Age: {cat.age}</p>
        <p>Aliases: {cat.aliases}</p>
        <p>Geographical Area: {cat.geographical_area}</p>
        <p>Microchipped: {cat.microchipped}</p>
        {/* Add more details as needed */}
      </div>
    </div>
  );
};

export default CatTile;
