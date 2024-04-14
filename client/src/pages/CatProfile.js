// CatPage.js

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import FavoriteButton from '../components/FavoriteButton';
import AddComment from '../components/Comments/AddComment';
import Comments from '../components/Comments/Comments';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCat } from '@fortawesome/free-solid-svg-icons';
import './Cat.css';
import withAuthentication from '../components/Authentication/withAuthentication';

const CatProfile = () => {
  const { catID } = useParams();
  const [cat, setCat] = useState(null);
  const [photo, setPhoto] = useState(null);
  console.log('Cat ID:', catID);


  useEffect(() => {
    // Fetch data about the cat with the specified ID
    const fetchCat = async () => {
      try {
        console.log('Fetching cat with ID:', catID);
        const response = await fetch(`http://localhost:4000/cat/${catID}`);
        if (response.ok) {
          const data = await response.json();
          console.log('Cat data:', data);
          setCat(data);
          console.log("CAT PHOTO: ", data[0].photo);
          setPhoto(data[0].photo);
        } else {
          console.error('Failed to fetch cat');
        }
      } catch (error) {
        console.error('Error fetching cat:', error.message);
      }
    };

    fetchCat();
  }, []);

  return (
    <>
    <div className="addCat">
      {cat ? (
        <div>
          <h1>Cat Profile</h1>
            {photo ? (
              <img src={`data:image/jpeg;base64,${photo}`} alt={cat.cname} />
            ) : (
              <FontAwesomeIcon icon={faCat} style={{ color: 'blue', fontSize: '24px' }} />
            )}
          <h2>{cat[0].cname}</h2>
          <p>Age: {cat[0].age}</p>
          {/* Display other cat details */}
          <FavoriteButton catID={catID} />
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
    <div className='comment'>
      <AddComment catID={catID} />
      <Comments catID={catID} />
    </div>
    </>
    
  );
};

export default withAuthentication(CatProfile);
