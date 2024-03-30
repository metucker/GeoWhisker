import '../App.css';
import '../components/Authentication/Authentication.css';
import LogIn from './LogIn'
import SignUp from './SignUp';
import Main from './Main';
import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../components/Loading/LoadingSpinner'; // Import a loading spinner component

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {

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
      } finally {
        setIsLoading(false); // Mark session check as complete
      }
    };

    checkSessionValidity();

    
    // Check authentication status here and update isLoggedIn state accordingly
    // const isAuthenticated = checkAuthentication(); // Implement this function
    // setIsLoggedIn(isAuthenticated);
  }, []);

  const checkAuthentication = () => {
    // Implement logic to check if user is authenticated
    // For example, you can check if there's a token in localStorage
    return localStorage.getItem('token') !== null;
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);

    return localStorage.getItem('token') !== null; // Check if token exists in localStorage

  };

  const handleSignUpSuccess = () => {
    setIsLoggedIn(true);

    return localStorage.getItem('token') !== null; // Check if token exists in localStorage

  };

  const toggleMode = () => {
    setIsSignUpMode(!isSignUpMode);
  };

  return (
    <div className="Home" >
      <div className='container'>
        {isLoading ? ( // Show loading spinner if isLoading is true
          <LoadingSpinner />
        ) : !isLoggedIn ? (
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
