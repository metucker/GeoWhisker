// import React, { useState, useEffect } from 'react';
// import CatTile from '../components/CatTile';
// import withAuthentication from '../components/Authentication/withAuthentication';
// import LoadingSpinner from '../components/Loading/LoadingSpinner';

// const Cat = () => {
//   const [favoritedCats, setFavoritedCats] = useState([]);
//   const [loading, setLoading] = useState(true);


//   useEffect(() => {
//     const fetchFavoritedCats = async () => {
//       let data;
//       try {
//         const response = await fetch(`http://localhost:4000/userfavorites/`, {
//           credentials: 'include', // Include cookies in the request
//         });
//         if (response.ok) {
//           data = await response.json(); // Await the JSON parsing
//           const catData = await fetchCatById(data.favoriteCats.flat());
//           setFavoritedCats(catData);
//         }
//       } catch (error) {
//         console.error('Error fetching favorited cats:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (loading) {
//       fetchFavoritedCats(); // Call the async function only if loading
//     }
//   }, [loading]);

//   const fetchCatById = async (data) => {
//     let catData = [];
//     console.log('DATA:', data)
//     for (const catID of data) {
//       console.log('CAT ID:', catID);
//       try {
//         const response = await fetch(`http://localhost:4000/cat/${catID}`);
//         if (response.ok) {
//           let cat = await response.json();
//           cat = cat.flat();
//           catData.push(cat);
//         } else {
//           console.error(`Failed to fetch cat with ID ${catID}`);
//           return null;
//         }
//       } catch (error) {
//         console.error(`Error fetching cat with ID ${catID}:`, error);
//         return null;
//       }
//     }
//     return catData;
//   };

//   // Filter the list of cats to only include favorited cats

//   return (
//     <>
//       <h1>Cats</h1>
//       <div className="cat-page">
//         {loading ? (
//           <>
//             <p>Loading...</p>
//             <LoadingSpinner />
//           </>
//         ) : Array.isArray(favoritedCats) ? (
//           favoritedCats.map(cat => (
//             <CatTile cat={cat} />
//           ))
//         ) : (
//           <p>No favorited cats available.</p>
//         )}
//       </div>
//     </>
//   );
// };

// export default withAuthentication(Cat);

import React, { useState, useEffect } from 'react';
import CatTile from '../components/CatTile';
import withAuthentication from '../components/Authentication/withAuthentication';
import LoadingSpinner from '../components/Loading/LoadingSpinner';

const Cat = () => {
  const [favoritedCats, setFavoritedCats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavoritedCats = async () => {
      try {
        const response = await fetch(`http://localhost:4000/userfavorites/`, {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          const catIds = data.favoriteCats.flat();
          const catData = await fetchCatDetails(catIds);
          setFavoritedCats(catData.flat());
        } else {
          console.error('Failed to fetch favorited cats:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching favorited cats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoritedCats();
  }, []);

  const fetchCatDetails = async (catIds) => {
    const catData = [];
    for (const catId of catIds) {
      try {
        const response = await fetch(`http://localhost:4000/cat/${catId}`);
        if (response.ok) {
          const cat = await response.json();
          catData.push(cat);
          await delay(2000); // Add a delay of 1 second between fetch requests
        } else {
          console.error(`Failed to fetch cat with ID ${catId}`);
        }
      } catch (error) {
        console.error(`Error fetching cat with ID ${catId}:`, error);
      }
    }
    return catData;
  };

  const delay = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  return (
    <>
      <h1>Cats</h1>
      <div className="cat-page">
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

export default withAuthentication(Cat);
