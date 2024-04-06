import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../Loading/LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import './Authentication.css';



const withAuthentication = (WrappedComponent) => {
    const WrappedComponentWithAuth = (props) => {
    const navigate = useNavigate();

//   const WithAuthentication = (props) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
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
    }, []);

    return (
      <div className="AuthenticationWrapper">
        {isLoading ? (
          <LoadingSpinner />
        ) : isLoggedIn ? (
          <WrappedComponent {...props} />
        ) : (
            <div className="returnToHome">
                <p>Please log in to access this page.</p>
                <button onClick={() => navigate('/home')}>Return to Log In</button>
            </div>
        )}
      </div>
    );
};

  return WrappedComponentWithAuth;
};

export default withAuthentication;
