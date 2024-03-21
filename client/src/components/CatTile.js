import React from 'react';

const CatTile = ({ cat }) => {
  // Convert the Blob object to a data URL
  const photoUrl = `data:image/jpeg;base64,${cat.photo}`;
  const catURL = `http://localhost:3000/cats/${cat.catID}`;
  // const photoUrl = URL.createObjectURL(new Blob([cat.photo], { type: 'image/jpeg' }));

  return (
    <div className="cat-tile">
      <div className="cat-photo">
        {/* <a href={catURL}> */}
          <img src={photoUrl} alt={cat.cname} />
        {/* </a> */}
      </div>
      <div className="cat-details">
        {/* <a href={catURL}> */}
          <h2>{cat.cname}</h2>
        {/* </a> */}
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
