import React, { useState, useEffect } from 'react';
import withAuthentication from '../components/Authentication/withAuthentication';
import CatList from '../components/CatList';
import LoadingSpinner from '../components/Loading/LoadingSpinner';


function Browse() {
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch cats from the backend API
    fetch('/cats')
      .then(response => response.json())
      .then(data => setCats(data))
      //.then(() => setLoading(false))
      .catch(error => console.error('Error fetching cats:', error));
      setLoading(false);
  }, []);

  return (
    <>
    {!loading ? (
      <>
      <h1>Browse Cats Near You</h1>
      {/* <div className="cat-list"> */}
        <CatList cats={cats} />
      {/* </div> */}
      </>
    ) : (
      <LoadingSpinner/>
    )}
      
    </>
  );
}

export default withAuthentication(Browse)