// CatPage.js

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const CatProfile = () => {
  const { catID } = useParams();
  const [cat, setCat] = useState(null);
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
        } else {
          console.error('Failed to fetch cat');
        }
      } catch (error) {
        console.error('Error fetching cat:', error.message);
      }
    };

    fetchCat();
  }, [catID]);

  return (
    <div>
      {cat ? (
        <div>
          <h1>Cat Profile</h1>
          <img src={`data:image/jpeg;base64,${cat[0].photo}`} alt={cat.cname} />
          <h2>{cat[0].cname}</h2>
          <p>Age: {cat[0].age}</p>
          {/* Display other cat details */}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default CatProfile;
