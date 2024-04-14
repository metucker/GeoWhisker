// User.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DisplayUser from '../components/Users/DisplayUser'; // Import the DisplayUser component
import LoadingSpinner from '../components/Loading/LoadingSpinner'; // Import a loading spinner component

const UserProfile = () => {
    // State and logic for editing user data
    const { userID } = useParams();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // State to track loading status
    const navigate = useNavigate();

    useEffect(() => {
    const fetchUserData = async () => {
        try {
            const response = await fetch(`http://localhost:4000/user/${userID}`, {
                method: 'GET',
                credentials: 'include', // Include cookies in the request
            });
            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
                console.log('User data:', userData);
                setIsLoading(false);
            } else {
                throw new Error('Failed to fetch user data');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            //setIsLoading(false); // Mark data fetching as complete
        }
    };
    fetchUserData();
}, []);

    return (
        <div>
            {/* Logic for editing user data */}
            {/* Render the DisplayUser component */}

        {isLoading ? 
            <LoadingSpinner /> : 
            (user ? <DisplayUser user={user} /> : <p>User not found</p>)}       
 
        </div>
    );
};

export default UserProfile;
