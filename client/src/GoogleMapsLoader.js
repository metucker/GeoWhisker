import React, { useState, useEffect } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';

const GoogleMapsLoader = ({ children }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const { isLoaded: gMapsLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries: ['places', 'drawing']
    });

    useEffect(() => {
        setIsLoaded(gMapsLoaded);
    }, [gMapsLoaded]);

    return isLoaded ? children : <div>Loading Google Maps...</div>;
};

export default GoogleMapsLoader;