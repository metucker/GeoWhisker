import React, { useEffect, useState } from 'react';
import { LoadScript, GoogleMap, DrawingManager } from '@react-google-maps/api'; 

const AddCatMap = () => {
    const [map, setMap] = useState(null);
    const [drawingManager, setDrawingManager] = useState(null);
    const [defaultLocation, setDefaultLocation] = useState({ lat: 0, lng: 0 });

    useEffect(() => {
        const onLoad = () => {
            const drawingManager = new window.google.maps.drawing.DrawingManager({
                drawingMode: window.google.maps.drawing.OverlayType.POLYGON,
                drawingControl: true,
                drawingControlOptions: {
                    position: window.google.maps.ControlPosition.TOP_CENTER,
                    drawingModes: ['polygon']
                }
            });
            setDrawingManager(drawingManager);
        };

        if (window.google && window.google.maps) {
            onLoad();
        } else {
            // Load the Google Maps API script
            const googleMapsScript = document.createElement('script');
            console.log("TEST: ", process.env.REACT_APP_KEY1);
            googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&libraries=drawing`;
            window.document.body.appendChild(googleMapsScript);
            googleMapsScript.addEventListener('load', onLoad);
        }

        // Get default location using Geolocation API
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                setDefaultLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
            }, error => {
                console.error('Error getting default location:', error);
            });
        } else {
            console.error('Geolocation is not supported by this browser.');
        }

        return () => {
            if (drawingManager) {
                drawingManager.setMap(null);
            }
        };
    }, []);

    const onPolygonComplete = (polygon) => {
        // Do something with the completed polygon, e.g., save its coordinates
        const polygonCoordinates = polygon.getPath().getArray();
        console.log(polygonCoordinates);
    };

    return (
        <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
            <GoogleMap
                mapContainerStyle={{ width: '100%', height: '400px', maxWidth: '800px'}}
                zoom={8}
                center={defaultLocation}
                onLoad={map => setMap(map)}
            >
                {drawingManager && <DrawingManager
                    drawingMode={window.google.maps.drawing.OverlayType.POLYGON}
                    drawingControl={true}
                    drawingControlOptions={{
                        position: window.google.maps.ControlPosition.TOP_CENTER,
                        drawingModes: ['polygon']
                    }}
                    onPolygonComplete={onPolygonComplete}
                />}
            </GoogleMap>
        </LoadScript>
    );
};

export default AddCatMap;
