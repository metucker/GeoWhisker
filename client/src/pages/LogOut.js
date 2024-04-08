import React from "react";
import '../App.css';
import '../components/Authentication/Authentication.css';
import LoggingOut from '../components/Authentication/LoggingOut.js'
import withAuthentication from "../components/Authentication/withAuthentication.js";

const LogOut = () => {
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

    handleLogout();
    
    return (
        <>
        <LoggingOut/>
        </>
    );
}

export default withAuthentication(LogOut);