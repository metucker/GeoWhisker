import React, { useEffect, useState } from 'react';

const MapComponent = () => {
  const [map, setMap] = useState(null);
  const [drawingManager, setDrawingManager] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);

  useEffect(() => {
    // Load Google Maps API script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=drawing`;
    script.async = true;
    script.onload = initMap;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const initMap = () => {
    const mapInstance = new window.google.maps.Map(document.getElementById('map'), {
      center: { lat: 0, lng: 0 },
      zoom: 8,
    });

    setMap(mapInstance);

    const manager = new window.google.maps.drawing.DrawingManager({
      drawingMode: window.google.maps.drawing.OverlayType.POLYGON,
      drawingControl: true,
      drawingControlOptions: {
        position: window.google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [window.google.maps.drawing.OverlayType.POLYGON],
      },
    });

    manager.setMap(mapInstance);
    setDrawingManager(manager);

    window.google.maps.event.addListener(manager, 'overlaycomplete', (event) => {
      if (event.type === 'polygon') {
        const polygon = event.overlay;
        const area = window.google.maps.geometry.spherical.computeArea(polygon.getPath());

        // Do something with the selected area (e.g., save to state)
        setSelectedArea(area);
      }
    });
  };

  return <div id="map" style={{ width: '100%', height: '400px' }}></div>;
};

export default MapComponent;
