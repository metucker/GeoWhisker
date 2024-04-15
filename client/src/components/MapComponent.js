import React, { useRef, useState, useEffect } from 'react';
import { Autocomplete, DrawingManager, GoogleMap, Polygon, useJsApiLoader } from '@react-google-maps/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan } from '@fortawesome/free-solid-svg-icons'

const libraries = ['places', 'drawing'];
const MapComponent = ({setPolygonCoordinates}) => {

    const mapRef = useRef();
    const polygonRefs = useRef([]);
    const activePolygonIndex = useRef();
    const autocompleteRef = useRef();
    const drawingManagerRef = useRef();
    // const [polygonCoordinates, setPolygonCoordinates] = useState([]);

    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries    
    });

    const [polygons, setPolygons] = useState([]);

    const defaultCenter = {
        lat: 29.6516, 
        lng: -82.3248
    }
    const [center, setCenter] = useState(defaultCenter);

    useEffect(() => {
    if (navigator.permissions) {
        // Check for geolocation permission
        navigator.permissions.query({name:'geolocation'})
        .then(function(permissionStatus) {
            if (permissionStatus.state === 'granted') {
                // If granted, get the location
                navigator.geolocation.getCurrentPosition((position) => {
                    setCenter({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                });
            } else if (permissionStatus.state === 'prompt') {
                console.log('Permission to access location is being asked');
            } else if (permissionStatus.state === 'denied') {
                console.log('Permission to access location was denied');
            }
            // Listen for changes to the permission state
            permissionStatus.onchange = function() {
                console.log('Permission state has changed to ' + this.state);
            };
        });
    } else {
        // If permissions API not supported, fall back to getting location
        navigator.geolocation.getCurrentPosition((position) => {
            setCenter({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            });
        });
    }
}, []);

    const containerStyle = {
        width: '100%',
        height: '400px',
    }

    const autocompleteStyle = {
        boxSizing: 'border-box',
        border: '1px solid transparent',
        width: '240px',
        height: '38px',
        padding: '0 12px',
        borderRadius: '3px',
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
        fontSize: '14px',
        outline: 'none',
        textOverflow: 'ellipses',
        position: 'absolute',
        right: '8%',
        top: '2%px',
        marginLeft: '-120px',
    }

    const deleteIconStyle = {
        cursor: 'pointer',
        height: '30px',
        width: '30pxpx',
        marginTop: '5px', 
        backgroundColor: '#fff',
        position: 'absolute',
        top: "20%",
        left: "5%",
        zIndex: 99999,
        padding: '6px',
    }

    const polygonOptions = {
        fillOpacity: 0.3,
        fillColor: '#3f7c7c',
        strokeColor: '#000000',
        strokeWeight: 2,
        draggable: true,
        editable: true
    }

    const drawingManagerOptions = {
        polygonOptions: polygonOptions,
        drawingControl: true,
        drawingControlOptions: {
            position: window.google?.maps?.ControlPosition?.BLOCK_START_INLINE_CENTER,
            drawingModes: [
                window.google?.maps?.drawing?.OverlayType?.POLYGON
            ]
        }
    }

    const onLoadMap = (map) => {
        mapRef.current = map;
    }

    const onLoadPolygon = (polygon, index) => {
        //polygonRefs.current[index] = polygon;
    }

    const onClickPolygon = (index) => {
        activePolygonIndex.current = index; 
    }

    const onLoadAutocomplete = (autocomplete) => {
        autocompleteRef.current = autocomplete;
    }

    const onPlaceChanged = () => {
        const { geometry } = autocompleteRef.current.getPlace();
        const bounds = new window.google.maps.LatLngBounds();
        if (geometry.viewport) {
            bounds.union(geometry.viewport);
        } else {
            bounds.extend(geometry.location);
        }
        mapRef.current.fitBounds(bounds);
    }

    const onLoadDrawingManager = drawingManager => {
        drawingManagerRef.current = drawingManager;
        drawingManagerRef.current.setMap(null)

    }

    const onOverlayComplete = ($overlayEvent) => {
        drawingManagerRef.current.setDrawingMode(null);
        if ($overlayEvent.type === window.google.maps.drawing.OverlayType.POLYGON) {
            const newPolygon = $overlayEvent.overlay.getPath()
                .getArray()
                .map(latLng => ({ lat: latLng.lat(), lng: latLng.lng() }))

            // start and end point should be same for valid geojson
            const startPoint = newPolygon[0];
            newPolygon.push(startPoint);
            $overlayEvent.overlay?.setMap(null);
            setPolygons([...polygons, newPolygon]);
        }
    }

    const onDeleteDrawing = () => {  
        
        setPolygons([]);
        drawingManagerRef.current.setMap(null)
        onLoadMap(mapRef.current);

    }

    // const onEditPolygon = (index) => {
    //     const polygonRef = polygonRefs.current[index];
    //     if (polygonRef) {
    //         const coordinates = polygonRef.getPath()
    //             .getArray()
    //             .map(latLng => ({ lat: latLng.lat(), lng: latLng.lng() }));

    //         const allPolygons = [...polygons];
    //         allPolygons[index] = coordinates;
    //         setPolygons(allPolygons)
    //     }
    // }

    const onPolygonComplete = (polygon) => {
        // Do something with the completed polygon, e.g., save its coordinates
        const polygonCoordinates = polygon.getPath().getArray().map(latLng => ({
            lat: latLng.lat(),
            lng: latLng.lng()
        }));
        setPolygonCoordinates(polygonCoordinates);
        console.log("Set polygon coordinates:", polygonCoordinates);

    };

    return (
        isLoaded
            ?
            <div className='add-cat-map-container' style={{ position: 'relative' }}>
                {
                    drawingManagerRef.current
                    &&
                    <div
                        onClick={onDeleteDrawing}
                        title='Delete shape'
                        style={deleteIconStyle}>
                        <FontAwesomeIcon icon={faTrashCan} />
                    </div>
                    
                }
                <GoogleMap
                    zoom={15}
                    center={center}
                    onLoad={onLoadMap}
                    mapContainerStyle={containerStyle}
                    onTilesLoaded={() => setCenter(null)}
                >
                    <DrawingManager
                        onLoad={onLoadDrawingManager}
                        onOverlayComplete={onOverlayComplete}
                        options={drawingManagerOptions}
                        onPolygonComplete={onPolygonComplete}
                    />
                    {
                        polygons.map((iterator, index) => (
                            <Polygon
                                key={index}
                                onLoad={(event) => onLoadPolygon(event, index)}
                                onMouseDown={() => onClickPolygon(index)}
                                // onMouseUp={() => onEditPolygon(index)}
                                // onDragEnd={() => onEditPolygon(index)}
                                options={polygonOptions}
                                paths={iterator}
                                draggable
                                editable
                                // onPolygonComplete={onPolygonComplete}
                            />
                        ))
                    }
                   
                    <Autocomplete
                        onLoad={onLoadAutocomplete}
                        onPlaceChanged={onPlaceChanged}
                    >
                        <input
                            type='text'
                            placeholder='Search Location'
                            style={autocompleteStyle}
                        />
                    </Autocomplete>
                </GoogleMap>
            </div>
            :
            null
    );
}

export default MapComponent; 