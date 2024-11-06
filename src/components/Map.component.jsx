// MapComponent.js
import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap, Marker, Popup, useMapEvent } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-gpx';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const GPXTrack = ({ gpxData, setRoutePoints }) => {
  const map = useMap();

  useEffect(() => {
    if (!gpxData) return;

    // Load GPX file and add it to the map
    const gpx = new L.GPX(gpxData, {
      async: true,
      marker_options: {
        startIconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-green.png',
        endIconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-red.png',
        shadowUrl: 'https://leafletjs.com/examples/custom-icons/leaf-shadow.png',
      },
      polyline_options: {
        color: 'blue',
        weight: 3,
        opacity: 0.75,
      },
    });

    gpx.on('loaded', (e) => {
      var gpx = e.target;
      const route = gpx.getLayers()[0].getLayers()[0];

      setRoutePoints(route.getLatLngs()); // Save route points for cursor tracking
      map.fitBounds(route.getBounds());
    });

    gpx.addTo(map);

    return () => {
      map.removeLayer(gpx);
    };
  }, [gpxData, map, setRoutePoints]);

  return null;
};


const calculateDistanceFromStart = (routePoints, currentLatLng) => {
  if (!routePoints.length) return 0;

  const startPoint = routePoints[0]

  let totalDistance = 0;
  let prevPoint = startPoint;

  for (let i = 1; i < routePoints.length; i++) {
    const currentPoint = routePoints[i];
    totalDistance += prevPoint.distanceTo(currentPoint);
    prevPoint = currentPoint;

    const threshold = 5; // Threshold in meters
    if (currentPoint.distanceTo(currentLatLng) < threshold) {
      break;
    }
  }

  return totalDistance;
};

const MouseMarker = ({ routePoints }) => {
  const [markerPosition, setMarkerPosition] = useState(null);
  const [distanceInMeters, setDistanceInMeters] = useState(0);
  const [elapsedTimeInSeconds, setElapsedTimeInSeconds] = useState(0);
  const markerRef = useRef(null);

  const SPEED_MIN_BY_KM = 4;

  useEffect(() => {
    if (markerRef?.current) {
      markerRef.current.openPopup();
    }
  }, [markerPosition]);

  const handleMouseMove = (e) => {
    if (!routePoints.length) return;

    // Find the closest point on the route to the cursor
    const closestPoint = routePoints.reduce((closest, point) => {
      const distance = e.latlng.distanceTo(point);
      return distance < closest.distance ? { point, distance } : closest;
    }, { point: null, distance: Infinity }).point;

    if (closestPoint) {
      const distanceInMeters = calculateDistanceFromStart(routePoints, closestPoint);
      setDistanceInMeters(Math.round(distanceInMeters * 100) / 100);
      setElapsedTimeInSeconds(Math.round(SPEED_MIN_BY_KM * distanceInMeters / 1000))
      setMarkerPosition(closestPoint);  // Update marker position
    }
  };

  // Attach mousemove event using `useMapEvent`
  useMapEvent('mousemove', handleMouseMove);

  if (!markerPosition) {
    return null
  }

  return <Marker position={markerPosition} ref={markerRef}>
    <Popup autoClose={false} keepInView>
      <>
        distance: {distanceInMeters}m
        <br />
        time: {elapsedTimeInSeconds}min
      </>
    </Popup>
  </Marker >
}

const MapComponent = () => {
  const [gpxData, setGpxData] = useState(null);
  const [routePoints, setRoutePoints] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/gpx+xml') {
      const reader = new FileReader();
      reader.onload = (e) => setGpxData(e.target.result);
      reader.readAsText(file);
    } else {
      alert("Please upload a valid GPX file.");
    }
  };

  return (
    <div className="map-wrapper">
      <h2>Upload a GPX file</h2>
      <input type="file" accept=".gpx" onChange={handleFileUpload} />

      <MapContainer
        center={[51.505, -0.09]}
        zoom={13}
        className="map-container"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {gpxData && <GPXTrack
          gpxData={gpxData}
          setRoutePoints={setRoutePoints}
        />}

        <MouseMarker
          routePoints={routePoints}
        />
      </MapContainer>
    </div>
  );
};

export default MapComponent;
