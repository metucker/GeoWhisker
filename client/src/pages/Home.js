import '../App.css';
import '../components/Authentication/Authentication.css';
import backgroundPhoto from '../assets/images/pexels-cat1.jpg'
import LogIn from './LogIn'
import SignUp from './SignUp';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';



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
    // Additional logic or navigation after login
  };


  return (
    <>
      <div className="Home" >
        <div className='container'>
          
        </div>
        {/* Render different content based on login status */}
        {isLoggedIn ? (
          <p>Welcome! You are logged in.</p>
        ) : (
          <>
            {/* Conditionally render signup or login based on state */}
            {showSignUp ? <SignUp onLoginSuccess={handleLoginSuccess}/> : <LogIn onLoginSuccess={handleLoginSuccess} />}
            {/* Conditionally render signup or login based on state */}
            {showSignUp ? <SignUp onLoginSuccess={handleLoginSuccess} /> : <LogIn />}
          </>
        )}
       
        {window.location.pathname === '/signup' && <SignUp onLoginSuccess={handleLoginSuccess} />}
        {window.location.pathname === '/login' && <LogIn />}
       

        {/* <div className='backgroundPhoto'>
        <img src={backgroundPhoto} className="App-logo" alt="logo" Style = {{
          backgroundImage: `url(${backgroundPhoto})`, 
          backgroundSize: "cover, fill",
          backgroundRepeat: "no-repeat", 
          backgroundPosition: "center", 
          height: "100vh", width: "100%"
          }}
          />
          </div> */}
          
      </div>
      </>
  );
}

export default Home;
