import React, { useState, useEffect } from 'react';
import withAuthentication from '../components/Authentication/withAuthentication';
import CatList from '../components/CatList';
import LoadingSpinner from '../components/Loading/LoadingSpinner';


function Browse() {
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
    {cats ? (
      <>
      <h1>Browse Cats Near You</h1>
      <div className="cat-page">
        <CatList cats={cats} />
      </div>
      </>
    ) : (
      <LoadingSpinner/>
    )}
      
    </>
  );
}

export default withAuthentication(Browse)