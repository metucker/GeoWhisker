import React, { useState, useEffect } from 'react';

const FavoriteButton = ({ catID }) => {
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    // Fetch the favorited status when the component mounts
    fetchFavoritedStatus();
  }, []);

  const fetchFavoritedStatus = async () => {
    try {
      // Fetch the favorited status from the server
      const response = await fetch(`http://localhost:4000/favorites/${catID}`, {
        withCredentials: true, // Include cookies in the request
      });

      // Check if the cat is favorited by the current user
      if (response.ok) {
        // Parse the response JSON
        const data = await response.json();
        // Check if the cat is favorited by the current user
        setIsFavorited(data.isFavorited);
      } else {
        console.error('Failed to fetch favorited status.');
      }
    } catch (error) {
      console.error('Failed to fetch favorited status.');
    }
  };

  const handleFavoriteToggle = async () => {
    try {
      // Toggle the favorite status by sending a request to the server
      const response = await fetch(`http://localhost:4000/addfavorites/${catID}`, {
        method: 'POST',
        withCredentials: true, // Include cookies in the request
      });

      if (response.ok) {
        // Parse the response JSON
        const data = await response.json();
        // Check if the cat is favorited by the current user
        //setIsFavorited(data.isFavorited);
        setIsFavorited((prevIsFavorited) => !prevIsFavorited);
        console.log("New cat added to favorites!");
      } else {
        console.error('Failed to toggle favorite status.');
      }
      // Update the local state to reflect the toggled favorite status
    } catch (error) {
      console.error('Failed to toggle favorite status.', error);
    }
  };

  return (
    <button onClick={handleFavoriteToggle}>
      {isFavorited ? 'Remove from Favorites' : 'Favorite'}
    </button>
  );
};

export default FavoriteButton;
