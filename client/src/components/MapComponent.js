import React, { useRef, useState } from 'react';
import { Autocomplete, DrawingManager, GoogleMap, Polygon, useJsApiLoader } from '@react-google-maps/api';

const libraries = ['places', 'drawing'];
const MapComponent = ({setPolygonCoordinates}) => {

    const mapRef = useRef();
    const polygonRefs = useRef([]);
    const activePolygonIndex = useRef();
    const autocompleteRef = useRef();
    const drawingManagerRef = useRef();
    //const [polygonCoordinates, setPolygonCoordinates] = useState([]);

    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries    
    });

    const [polygons, setPolygons] = useState([
        [
            { lat: 28.630818281028954, lng: 79.80954378826904 },
            { lat: 28.62362346815063, lng: 79.80272024853515 },
            { lat: 28.623585797675588, lng: 79.81490820629882 },
            { lat: 28.630818281028954, lng: 79.80954378826904 }
        ],
        [
            { lat: 28.63130796240949, lng: 79.8170110581665 },
            { lat: 28.623623468150655, lng: 79.81705397351074 },
            { lat: 28.623623468150655, lng: 79.82619494183349 },
            { lat: 28.6313832978037, lng: 79.82619494183349 },
            { lat: 28.63130796240949, lng: 79.8170110581665 }
        ]
    ]);

    const defaultCenter = {
        lat: 28.626137,
        lng: 79.821603,
    }
    const [center, setCenter] = useState(defaultCenter);

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
        top: '11px',
        marginLeft: '-120px',
    }

    const deleteIconStyle = {
        cursor: 'pointer',
        height: '24px',
        width: '24px',
        marginTop: '5px', 
        backgroundColor: '#fff',
        position: 'absolute',
        top: "2px",
        left: "52%",
        zIndex: 99999
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
            position: window.google?.maps?.ControlPosition?.TOP_CENTER,
            drawingModes: [
                window.google?.maps?.drawing?.OverlayType?.POLYGON
            ]
        }
    }

    const onLoadMap = (map) => {
        mapRef.current = map;
    }

    const onLoadPolygon = (polygon, index) => {
        polygonRefs.current[index] = polygon;
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
        const filtered = polygons.filter((polygon, index) => index !== activePolygonIndex.current) 
        setPolygons(filtered)
    }

    const onEditPolygon = (index) => {
        const polygonRef = polygonRefs.current[index];
        if (polygonRef) {
            const coordinates = polygonRef.getPath()
                .getArray()
                .map(latLng => ({ lat: latLng.lat(), lng: latLng.lng() }));

            const allPolygons = [...polygons];
            allPolygons[index] = coordinates;
            setPolygons(allPolygons)
        }
    }

    const onPolygonComplete = (polygon) => {
        // Do something with the completed polygon, e.g., save its coordinates
        const polygonCoordinates = polygon.getPath().getArray().map(latLng => ({
            lat: latLng.lat(),
            lng: latLng.lng()
        }));
        //console.log("POLYGON COORDINATES:", polygonCoordinates);
        setPolygonCoordinates(polygonCoordinates);
        console.log("Set polygon coordinates:", polygonCoordinates);

    };

    return (
        isLoaded
            ?
            <div className='map-container' style={{ position: 'relative' }}>
                {
                    drawingManagerRef.current
                    &&
                    <div
                        onClick={onDeleteDrawing}
                        title='Delete shape'
                        style={deleteIconStyle}>
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
                                onMouseUp={() => onEditPolygon(index)}
                                onDragEnd={() => onEditPolygon(index)}
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