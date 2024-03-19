import React, { useState, useEffect } from 'react';
import CatList from '../components/CatList';

const Cat = () => {
  const [cats, setCats] = useState([]);

  useEffect(() => {
    // Fetch cats from the backend API
    fetch('/cats')
      .then(response => response.json())
      .then(data => setCats(data))
      .catch(error => console.error('Error fetching cats:', error));
  }, []);

  return (
    <div className="cat-page">
      <h1>Cats</h1>
      <CatList cats={cats} />
    </div>
  );
};

export default Cat;