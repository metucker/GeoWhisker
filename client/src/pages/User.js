import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../App.css';
import '../components/Authentication/Authentication.css';
import LoadingSpinner from '../components/Loading/LoadingSpinner'; // Import a loading spinner component
import { useNavigate, Link } from 'react-router-dom';
import EditUser from '../components/Users/EditUser';


const User = () => {
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        name: user ? user[4] : '',
        email: user ? user[3] : ''
    });
    const [isLoading, setIsLoading] = useState(true); // State to track loading status
    const navigate = useNavigate();


    const fetchUserData = async () => {
        try {
            const response = await fetch('http://localhost:4000/user', {
                method: 'GET',
                credentials: 'include', // Include cookies in the request
            });
            if (response.ok) {
                const userData = await response.json();
                console.log('User data id:', userData)
                setUser(userData);
                setFormData(userData); // Set form data to user data
                console.log('User data:', userData, "and user: ", user );
            } else {
                throw new Error('Failed to fetch user data');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setIsLoading(false); // Mark data fetching as complete
        }
    };

    useEffect(() => {
        const checkSessionValidity = async () => {
            try {
                const response = await fetch('http://localhost:4000/session', {
                    method: 'GET',
                    credentials: 'include', // Include cookies in the request
                });

                if (response.ok) {
                    fetchUserData(); // Fetch user data if session is valid
                } else {
                    console.log('User not authenticated');
                    setIsLoading(false); // Mark loading as complete even if user is not authenticated
                }
            } catch (error) {
                console.error('Error checking session validity:', error);
                setIsLoading(false); // Mark loading as complete in case of error
            }
        };

        checkSessionValidity();

        if (user) {
            setFormData({
                name: user[4],
                email: user[3]
            });
        }

    }, []);

    if (isLoading) {
        return <LoadingSpinner />; // Show loading spinner while checking session validity and fetching user data
    }


    if (!user) {
        //navigate('/home');
        return <alert>User not found.</alert>; // Handle case where user data is not available
    }

    return (
        <div className="userProfile">
            <h1>Edit User Profile</h1>
            <h2> Edit your profile below. </h2>
                <button>
                <Link className="preview-link" key={user[0]} to={`/user/${user[0]}`} target="_blank" rel="noopener noreferrer">
            View Preview
            </Link>
                </button>
           
            
            
            {user && <EditUser user={user} />}
        </div>
    );
};

export default User;
