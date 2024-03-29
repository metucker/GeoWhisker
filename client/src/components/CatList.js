import React, { useState, useEffect } from 'react';
import CatTile from './CatTile';
import { Link } from 'react-router-dom';

const CatList = () => {
  const [cats, setCats] = useState([]);

  useEffect(() => {
    fetchCats();
  }, []);

  const fetchCats = async () => {
    try {
      const response = await fetch('http://localhost:4000/cats'); // Replace with your backend API endpoint
      if (response.ok) {
        const data = await response.json();
        setCats(data);
      } else {
        console.error('Failed to fetch cats');
      }
    } catch (error) {
      console.error('Error fetching cats:', error.message);
    }
  };

  return (
    <div className="cat-list">
      {cats.map(cat => (
        <Link key={cat.catID} to={`/cats/${cat.catID}`}>
        <CatTile key={cat.catID} cat={cat} />
        </Link>
      ))}
    </div>
  );
};

export default CatList;
