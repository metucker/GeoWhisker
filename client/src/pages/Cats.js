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
    <>
      <h1>Cats</h1>
      <div className="cat-page">
        <CatList cats={cats} />
      </div>
    </>
)};

export default Cat;