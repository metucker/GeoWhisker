import React, { useState, useEffect } from 'react';
import withAuthentication from '../components/Authentication/withAuthentication';
import CatList from '../components/CatList';
import LoadingSpinner from '../components/Loading/LoadingSpinner';
import CatFilter from '../components/CatFilter';

function Browse() {
  const [cats, setCats] = useState([]);
  const [filteredCats, setFilteredCats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch cats from the backend API
    fetch('/cats')
      .then(response => response.json())
      .then(data => {
        setCats(data);
        setFilteredCats(data); // Initially set filtered cats to all cats
        setLoading(false);
      })
      
      //.then(() => setLoading(false))
      .catch(error => console.error('Error fetching cats:', error));
      // setLoading(false);
  }, []);

  const handleFilterChange = (searchTerm) => {
    // Implement filtering logic based on searchTerm

    const filtered = cats.filter((cat) =>
      cat.cname.toLowerCase().includes(searchTerm.toLowerCase())     
    );
    console.log("Results narrowed down to: ", filtered.length < cats.length ? "true" : "false");
    setFilteredCats(filtered);
    console.log("Filtered cats: ", filtered);
    console.log("Loading: ", loading)
  };

  return (
    <>
      <h1>Browse Cats Near You</h1>
      <CatFilter cats={cats} onFilterChange={handleFilterChange} />
      {!loading ? (
        <CatList newCats={filteredCats} />
      ) : (
        <LoadingSpinner />
      )}  
    </>
  );
}

export default withAuthentication(Browse)