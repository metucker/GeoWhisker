import React from 'react';

const LoggingOut = () => {
    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:4000/logout', {
                method: 'POST',
                credentials: 'include' // Include credentials for cross-origin requests
            });
            if (response.ok) {
                // Clear local storage or cookies
                // Redirect user or update UI
            } else {
                console.error('Failed to log out:', response.statusText);
            }
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <button onClick={handleLogout}>Log Out</button>
    );
};

export default LoggingOut;
