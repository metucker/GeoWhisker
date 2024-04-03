import React, { useEffect, useState } from 'react';
import { LoadScript, GoogleMap, DrawingManager } from '@react-google-maps/api'; 

const AddCatMap = ({setPolygonCoordinates}) => {
    const [map, setMap] = useState(null);
    const [drawingManager, setDrawingManager] = useState(null);
    const [defaultLocation, setDefaultLocation] = useState({ lat: 0, lng: 0 });
    const [apiLoaded, setApiLoaded] = useState(false);

   
    // useEffect(() => {
    //     const onLoad = () => {
            
    //         setApiLoaded(true);
    //         const drawingManager = new window.google.maps.drawing.DrawingManager({
    //             // drawingMode: window.google.maps.drawing.OverlayType.POLYGON,
    //             // drawingControl: true,
    //             drawingControlOptions: {
    //                 position: window.google.maps.ControlPosition.TOP_CENTER,
    //                 drawingModes: [window.google.maps.drawing.OverlayType.POLYGON]
    //             },
    //             polygonOptions: {
    //                 fillColor: '#ffff00',
    //                 fillOpacity: 0.5,
    //                 strokeWeight: 5,
    //                 clickable: true,
    //                 editable: true,
    //                 zIndex: 1,
    //                 draggable: false,
    //             }
    //         });
    //         setDrawingManager(drawingManager);
    //         // drawingManager.setMap(map);
    //     };

    //     const loadGoogleMapsScript = () => {
    //         const googleMapsScript = document.createElement('script');
    //         googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&libraries=drawing`;
    //         googleMapsScript.onload = onLoad;
    //         document.body.appendChild(googleMapsScript);
    //     };

    //     if (!window.google) {
    //         loadGoogleMapsScript();
    //     } else {
    //         onLoad();
    //     }
        
    //     if (!map) {
    //         onLoad();
    //     } else {
    //         // Load the Google Maps API script
    //         const googleMapsScript = document.createElement('script');
    //         console.log("TEST: ", process.env.REACT_APP_KEY1);
    //         googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&libraries=drawing`;
    //         window.document.body.appendChild(googleMapsScript);
    //         googleMapsScript.addEventListener('load', onLoad);
    //     }

    //     // Get default location using Geolocation API
    //     if (!map) {
    //         if (navigator.geolocation) {
    //             navigator.geolocation.getCurrentPosition(position => {
    //                 setDefaultLocation({
    //                     lat: position.coords.latitude,
    //                     lng: position.coords.longitude
    //                 });
    //             }, error => {
    //                 console.error('Error getting default location:', error);
    //             });
    //         } else {
    //             console.error('Geolocation is not supported by this browser.');
    //             setDefaultLocation({ lat: 29.6516, lng: -82.3248 }); // Gainesville

    //         }
    //     }

    //     return () => {
    //         if (drawingManager) {
    //             drawingManager.setMap(null);
    //         }
    //     };
    // }, [map, drawingManager]);

    useEffect(() => {
        const onLoad = () => {
            setApiLoaded(true);
            onMapLoad(map);
        };

        const loadGoogleMapsScript = () => {
            const googleMapsScript = document.createElement('script');
            googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&libraries=drawing`;
            googleMapsScript.onload = onLoad;
            document.body.appendChild(googleMapsScript);
        };

        if (!window.google) {
            loadGoogleMapsScript();
        } else {
            onLoad();
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
    }, []);

    const onMapLoad = (map) => {
        setMap(map);

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
                zIndex: 1
            }
        });

        setDrawingManager(drawingManager);
    };


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
                    zoom={8}
                    center={defaultLocation}
                    onLoad={map => setMap(map)}
                >
                    {drawingManager && <DrawingManager
                        drawingMode={window.google.maps.drawing.OverlayType.POLYGON}
                        drawingControl={true}
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
