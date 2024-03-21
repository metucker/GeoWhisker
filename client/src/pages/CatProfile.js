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
        const response = await fetch(`http://localhost:4000/cats/${catID}`);
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
          <h2>{cat.cname}</h2>
          <p>Age: {cat.age}</p>
          {/* Display other cat details */}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default CatProfile;
