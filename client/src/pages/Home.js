import '../App.css';
import '../components/Authentication/Authentication.css';
import LogIn from './LogIn'
import SignUp from './SignUp';
import Main from './Main';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCat, faUser, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import LoadingSpinner from '../components/Loading/LoadingSpinner'; // Import a loading spinner component


// function Home() {

//   const navigate = useNavigate();
//   const [showSignUp, setShowSignUp] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [isLoading, setIsLoading] = useState(true); // New state for loading indicator


//   const handleSignUpClick = () => {
//     setShowSignUp(true);
//     // navigate('/signup');
//   };

//   const handleLoginSuccess = () => {
//     // Handle successful login
//     setIsLoggedIn(true);
//     //setShowSignUp(false);
//     console.log('Type of handleLoginSuccess in Home:', typeof handleLoginSuccess);

//     console.log('User logged in successfully and handleLoginSuccess was called!');
//     navigate('/home');
//     // Additional logic or navigation after login
//   };

//   useEffect(() => {
//     const checkSessionValidity = async () => {
//       try {
//         const response = await fetch('http://localhost:4000/session', {
//           method: 'GET',
//           credentials: 'include', // Include cookies in the request
//         });

//         if (response.ok) {
//           setIsLoggedIn(true); // User is authenticated
//         } else {
//           setIsLoggedIn(false); // User is not authenticated
//           // navigate('/login'); // Redirect to login page if user is not authenticated
//         }
//       } catch (error) {
//         console.error('Error checking session validity:', error);
//         setIsLoggedIn(false); // Assume user is not authenticated in case of error
//         // navigate('/login'); // Redirect to login page in case of error
//       } finally {
//         setIsLoading(false); // Mark session check as complete
//         console.log('Loading?', isLoading);
//       }
//     };

//     checkSessionValidity();
//   }); //removed [navigate]]

//   if (isLoading) {
//     // Render loading spinner while session validity check is in progress
//     return <LoadingSpinner />;
//   }
 

//   // if (!isLoggedIn) {
//   //   navigate('/login'); // Redirect to login page if user is not authenticated
//   //   return null; // Render nothing until authentication status is determined
//   // }

//   return (
//     <>
//       <div className="Home" >
//         <div className='container'>
          
//         {/* Render different content based on login status */}
//         {!isLoggedIn ? (
//           <>
//             {console.log('Type of handleLoginSuccess in Home:', typeof handleLoginSuccess)}
//             {showSignUp ? <SignUp handleLoginSuccess={handleLoginSuccess}/> : <LogIn handleLoginSuccess={handleLoginSuccess} />}
//           </>
//         ) : (
//           <>
//           <div className='homePage'>
//             <p>Welcome!</p>
//             {/* Buttons for logged-in users */}
//             <div className='options'>
//               <button onClick={() => navigate('/browse')}>Browse Cats <FontAwesomeIcon icon={faMagnifyingGlass}/></button>
//               <button onClick={() => navigate('/addcat')}>Add Cat <FontAwesomeIcon icon={faCat}/></button>
//               <button onClick={() => navigate('/user')}>Edit Profile <FontAwesomeIcon icon={faUser}/></button>
//             </div>

//             {/* Section for Your Cats and Your Cat Map */}
//             <div className='columns'>
//               {/* Left column - Your Cats */}
//               <div className='yourCats'>
//                 <h2>Your Cats</h2>
//                 {/* Add content for Your Cats */}
//               </div>
//               {/* Right column - Your Cat Map */}
//               <div className='catMap'>
//                 <h2>Your Cat Map</h2>
//                 {/* Add content for Your Cat Map */}
//               </div>
//             </div>
//           </div>
//           </>
//         )}
//         </div>
//       </div> 
//       </>
//   )
// }

// export default Home;

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSignUpMode, setIsSignUpMode] = useState(false);


  useEffect(() => {
    // Check authentication status here and update isLoggedIn state accordingly
    const isAuthenticated = checkAuthentication(); // Implement this function
    setIsLoggedIn(isAuthenticated);
  }, []);

  const checkAuthentication = () => {
    // Implement logic to check if user is authenticated
    // For example, you can check if there's a token in localStorage
    return localStorage.getItem('token') !== null;
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleSignUpSuccess = () => {
    setIsLoggedIn(true);
  };

  const toggleMode = () => {
    setIsSignUpMode(!isSignUpMode);
  };

  return (
    <div className="Home" >
      <div className='container'>
        {!isLoggedIn ? (
           <>
           {isSignUpMode ? (
             <SignUp handleSignUpSuccess={handleSignUpSuccess} />
           ) : (
             <LogIn handleLoginSuccess={handleLoginSuccess} />
           )}
           <p>
             {isSignUpMode
               ? "Already have an account? "
               : "New user? "}
             <button onClick={toggleMode}>
               {isSignUpMode ? "Log in" : "Sign up"}
             </button>
           </p>
         </>
        ) : (
          <Main/>
        )}
      </div>
    </div>
  );
};

export default Home;
