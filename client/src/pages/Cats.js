import React, { useState, useEffect } from 'react';
import CatTile from '../components/CatTile';
import withAuthentication from '../components/Authentication/withAuthentication';
import LoadingSpinner from '../components/Loading/LoadingSpinner';

const Cats = () => {
  const [favoritedCats, setFavoritedCats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavoritedCats = async () => {
      try {
        const response = await fetch(`http://localhost:4000/favoritelist`, {
          credentials: 'include',
        });

        if (response.ok) {
          console.log("RESPONSE: ", response)
          const data = await response.json();
          console.log("DATA: ", data);
          setFavoritedCats(data);
          // const transformedCats = data.map(catArray => {
          //   return {
          //     catID: catArray[0],
          //     cname: catArray[1],
          //     age: catArray[4],
          //     age: catArray[4],
          //     aliases: catArray[5],
          //     geographical_area: catArray[6],
          //     microchipped: catArray[7],
          //     photo: catArray[10],
          //     // Add more properties as needed
          //   };
          // });

          // setFavoritedCats(transformedCats);
        } else {
          console.error('Failed to fetch favorited cats:', response.statusText);
        }
        setLoading(false);

      } catch (error) {
        console.error('Error fetching favorited cats:', error);
      } 
    };

    fetchFavoritedCats();
  }, []);

  return (
    <>
      <h1>Cats</h1>
      <div className="cat-list">
        {loading ? (
          <>
            <p>Loading...</p>
            <LoadingSpinner />
          </>
        ) : favoritedCats.length > 0 ? (
          favoritedCats.map((cat, index) => (
            <CatTile key={index} cat={cat} />
          ))
        ) : (
          <p>No favorited cats available.</p>
        )}
      </div>
    </>
  );
};

export default withAuthentication(Cats);
