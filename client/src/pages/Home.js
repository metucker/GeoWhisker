import '../App.css';
import '../components/Authentication/Authentication.css';
import backgroundPhoto from '../assets/images/pexels-cat1.jpg'
import LogIn from './LogIn'
import SignUp from './SignUp';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
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
    navigate('/home');
    // Additional logic or navigation after login
  };

  return (
    <>
      <div className="Home" >
        <div className='container'>
          
        {/* Render different content based on login status */}
        {isLoggedIn ? (
          <>
            <p>Welcome!</p>
          </>
        ) : (
          <>
            {/* Conditionally render signup or login based on state */}
            {showSignUp ? <SignUp onLoginSuccess={handleLoginSuccess}/> : <LogIn onLoginSuccess={handleLoginSuccess} />}
            {/* Conditionally render signup or login based on state */}
          </>
        )}
        {isLoggedIn == true} {console.log('User logged in successfully!')}
       
        {window.location.pathname === '/signup' && <SignUp onLoginSuccess={handleLoginSuccess} />}
        {window.location.pathname === '/login' && <LogIn />}

        {isLoggedIn && (
          <div className='homePage'>
            {/* Buttons for logged-in users */}
            <div className='options'>
              <button onClick={() => navigate('/browse')}>Browse Cats <FontAwesomeIcon icon={faMagnifyingGlass}/></button>
              <button onClick={() => navigate('/addcat')}>Add Cat <FontAwesomeIcon icon={faCat}/></button>
              <button onClick={() => navigate('/editprofile')}>Edit Profile <FontAwesomeIcon icon={faUser}/></button>
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
        )}
          </div>
      </div>
      </>
  );
}

export default Home;
