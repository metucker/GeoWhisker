import React, { useState, useEffect } from 'react';
import CatTile from '../components/CatTile';
import withAuthentication from '../components/Authentication/withAuthentication';

const Cat = () => {
  const [favoritedCats, setFavoritedCats] = useState([]);

  useEffect(() => {
    const fetchFavoritedCats = async () => {
      try {
        const response = await fetch(`http://localhost:4000/userfavorites/`, {
          withCredentials: true, // Include cookies in the request
        });
        if (response.ok) {
          const data = await response.json(); // Await the JSON parsing
          setFavoritedCats(data);
        }
      } catch (error) {
        console.error('Error fetching favorited cats:', error);
      }
    };

    fetchFavoritedCats(); // Call the async function immediately
  }, []);;

  // Filter the list of cats to only include favorited cats
  const filteredCats = (cat => favoritedCats.includes(cat.catID));

  return (
    <>
      <h1>Cats</h1>
      <div className="cat-page">
      {favoritedCats.map(cat => (
        <>
          {/* <Link key={cat.catID} to={`/cats/${cat.catID}`}> */}
          <CatTile key={cat.catID} cat={cat} >
          </CatTile>
          {/* </Link> */}
        </>
      ))}
      </div>
    </>
  );
};

export default withAuthentication(Cat);

// const Cat = () => {
//   const [cats, setCats] = useState([]);

//   useEffect(() => {
//     // Fetch cats from the backend API
//     fetch('/cats')
//       .then(response => response.json())
//       .then(data => setCats(data))
//       .catch(error => console.error('Error fetching cats:', error));
//   }, []);

//   return (
//     <>
//       <h1>Cats</h1>
//       <div className="cat-page">
//         <CatList cats={cats} />
//       </div>
//     </>
// )};

// export default Cat;