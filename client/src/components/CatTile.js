import React from 'react';
import { Link } from 'react-router-dom'
import FavoriteButton from './FavoriteButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCat } from '@fortawesome/free-solid-svg-icons';

const CatTile = ({ cat }) => {
  // Convert the Blob object to a data URL

  const photoUrl = cat.photo ? `data:image/jpeg;base64,${cat.photo}` : null;
  const catURL = `http://localhost:3000/cats/${cat.catID}`;
  // const photoUrl = URL.createObjectURL(new Blob([cat.photo], { type: 'image/jpeg' }));

  return (
    <div className="cat-tile">
      <div className="cat-photo">
        <Link key={cat.catID} to={`/cats/${cat.catID}`}>
        {photoUrl ? (
            <img src={photoUrl} alt={cat.cname} />
          ) : (
            <FontAwesomeIcon icon={faCat} size="10x" color="white" />
          )}

        </Link>

      </div>
      <div className="cat-details">
        <Link key={cat.catID} to={`/cats/${cat.catID}`}>

          <h2>{cat.cname}</h2>
        </Link>
        <p>Age: {cat.age}</p>
        <p>Aliases: {cat.aliases}</p>
        {/* <p>Geographical Area: {cat.geographical_area}</p>
        <p>Microchipped: {cat.microchipped}</p> */}
        <FavoriteButton catID={cat.catID} />

      

        {/* Add more details as needed */}
      </div>
    </div>
  );
};

export default CatTile;
