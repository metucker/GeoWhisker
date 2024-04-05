import React, { useEffect, useState } from 'react';
import { LoadScript, GoogleMap, DrawingManager, useLoadScript } from '@react-google-maps/api'; 

const AddCatMap = ({setPolygonCoordinates}) => {
    const [map, setMap] = useState(null);
    const [drawingManager, setDrawingManager] = useState(null);
    const [defaultLocation, setDefaultLocation] = useState({ lat: 0, lng: 0 });
    const [apiLoaded, setApiLoaded] = useState(false);

    useEffect(() => {

        const loadGoogleMapsScript = async () => {
            const googleMapsScript = document.createElement('script');
            googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&libraries=drawing`;
            googleMapsScript.async = true; // Ensure script is loaded asynchronously

            // googleMapsScript.onload = onLoad;
            document.body.appendChild(googleMapsScript);
        };

        try { 
            if (!window.google) {
                loadGoogleMapsScript();
                setApiLoaded(true);
                onMapLoad(map);
            } 
        } catch {
            console.error('Error loading Google Maps API script');
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
            setDefaultLocation({ lat: 29.6516, lng: -82.3248 }); // Gainesville
        }

        const onMapLoad = (map) => {

            if (!window.google || !window.google.maps) {
                console.error('Google Maps API not loaded yet');
                return;
            }
    
            const drawingManager = new window.google.maps.drawing.DrawingManager({
                drawingControlOptions: {
                    position: window.google.maps.ControlPosition.TOP_CENTER,
                    drawingModes: [window.google.maps.drawing.OverlayType.POLYGON]
                },
                polygonOptions: {
                    fillColor: '#ffff00',
                    fillOpacity: 0.5,
                    strokeWeight: 5,
                    clickable: true,
                    editable: true,
                    zIndex: 1,
                },
                keyboardShortcuts: false
    
            });
    
            //setMap(map);
            setDrawingManager(drawingManager);
            console.log("DRAWING MANAGER SET:", drawingManager);
        };
    }, [map]);

    const onPolygonComplete = (polygon) => {
        // Do something with the completed polygon, e.g., save its coordinates
        const polygonCoordinates = polygon.getPath().getArray().map(latLng => ({
            lat: latLng.lat(),
            lng: latLng.lng()
        }));
        console.log("POLYGON COORDINATES:", polygonCoordinates);
        setPolygonCoordinates(polygonCoordinates);
    };

    return (
        <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
            {apiLoaded && (
                <GoogleMap
                    mapContainerStyle={{ width: '100%', height: '400px', maxWidth: '800px'}}
                    zoom={15}
                    yesIWantToUseGoogleMapApiInternals
                    center={defaultLocation}
                    onMapLoad={map => setMap(map)}
                >
                    {drawingManager && <DrawingManager
                        drawingMode={window.google.maps.drawing.OverlayType.POLYGON}
                        drawingControl={true}
                        keyboardShortcuts={false}

                        drawingControlOptions={{
                            position: window.google.maps.ControlPosition.TOP_CENTER,
                            drawingModes: [window.google.maps.drawing.OverlayType.POLYGON]}}
                        polygonOptions={{
                            fillColor: '#ffff00',
                            fillOpacity: 0.5,
                            strokeWeight: 5,
                            clickable: true,
                            editable: true,
                            zIndex: 1
                        }}
                        onPolygonComplete={onPolygonComplete}
                    />}
                    
                </GoogleMap>
            )}
        </LoadScript>
    );
};

export default AddCatMap;
