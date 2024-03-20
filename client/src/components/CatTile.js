import React from 'react';

const CatTile = ({ cat }) => {
  // Convert the Blob object to a data URL
  const photoUrl = `data:image/jpeg;base64,${cat.photo}`;
  // const photoUrl = URL.createObjectURL(new Blob([cat.photo], { type: 'image/jpeg' }));

  return (
    <div className="cat-tile">
      <div className="cat-photo">
        <img src={photoUrl} alt={cat.cname} />
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
