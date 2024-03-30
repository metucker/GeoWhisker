import '../App.css';
import '../components/Authentication/Authentication.css';
import backgroundPhoto from '../assets/images/pexels-cat1.jpg'
import LogIn from './LogIn'
import SignUp from './SignUp';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCat, faUser, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

function Home() {

  const navigate = useNavigate();
  const [showSignUp, setShowSignUp] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSignUpClick = () => {
    setShowSignUp(true);
    navigate('/signup');
  };

  const handleLoginSuccess = () => {
    // Handle successful login
    setIsLoggedIn(true);
    //setShowSignUp(false);
    console.log('Type of handleLoginSuccess:', typeof handleLoginSuccess);

    console.log('User logged in successfully and handleLoginSuccess was called!');
    navigate('/home');
    // Additional logic or navigation after login
  };

  useEffect(() => {
    // Check session validity when the component mounts
    const checkSessionValidity = async () => {
      try {
        const response = await fetch('http://localhost:4000/session', {
          method: 'GET',
          credentials: 'include', // Include cookies in the request
        });

        if (response.ok) {
          setIsLoggedIn(true); // User is authenticated
        } else {
          setIsLoggedIn(false); // User is not authenticated
        }
      } catch (error) {
        console.error('Error checking session validity:', error);
        setIsLoggedIn(false); // Assume user is not authenticated in case of error
      } 
    };

    checkSessionValidity();
  }, []);

 

  // if (!isLoggedIn) {
  //   navigate('/login'); // Redirect to login page if user is not authenticated
  //   return null; // Render nothing until authentication status is determined
  // }

  return (
    <>
      <div className="Home" >
        <div className='container'>
          
        {/* Render different content based on login status */}
        {!isLoggedIn ? (
          <>
            {console.log('Type of handleLoginSuccess in Home:', typeof handleLoginSuccess)}
            {showSignUp ? <SignUp handleLoginSuccess={handleLoginSuccess}/> : <LogIn handleLoginSuccess={handleLoginSuccess} />}
          </>
        ) : (
          <>
          <div className='homePage'>
            <p>Welcome!</p>
            {/* Buttons for logged-in users */}
            <div className='options'>
              <button onClick={() => navigate('/browse')}>Browse Cats <FontAwesomeIcon icon={faMagnifyingGlass}/></button>
              <button onClick={() => navigate('/addcat')}>Add Cat <FontAwesomeIcon icon={faCat}/></button>
              <button onClick={() => navigate('/user')}>Edit Profile <FontAwesomeIcon icon={faUser}/></button>
            </div>

            {/* Section for Your Cats and Your Cat Map */}
            <div className='columns'>
              {/* Left column - Your Cats */}
              <div className='yourCats'>
                <h2>Your Cats</h2>
                {/* Add content for Your Cats */}
              </div>
              {/* Right column - Your Cat Map */}
              <div className='catMap'>
                <h2>Your Cat Map</h2>
                {/* Add content for Your Cat Map */}
              </div>
            </div>
          </div>
          </>
        )}
        </div>
      </div> 
      </>
  )
}

export default Home;
