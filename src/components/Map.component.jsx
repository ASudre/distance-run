// MapComponent.js
import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap, Marker, Popup, useMapEvent } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-gpx';
import L from 'leaflet';

const DEFAULT_SPEED = 4;

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
      const route = e.target.getLayers()[0].getLayers()[0];
      setRoutePoints(route.getLatLngs());
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

  const startPoint = routePoints[0];
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

const formatRunnerTime = (timeInSeconds) => {
  const hours = Math.floor(timeInSeconds / 3600);
  const minutes = Math.floor((timeInSeconds % 3600) / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

const MouseMarker = ({ routePoints, runners, startDate }) => {
  const [markerPosition, setMarkerPosition] = useState(null);
  const [distanceInMeters, setDistanceInMeters] = useState(0);
  const markerRef = useRef(null);

  useEffect(() => {
    if (markerRef?.current) {
      markerRef.current.openPopup();
    }
  }, [markerPosition]);

  const handleMouseMove = (e) => {
    if (!routePoints.length) return;

    const closestPoint = routePoints.reduce((closest, point) => {
      const distance = e.latlng.distanceTo(point);
      return distance < closest.distance ? { point, distance } : closest;
    }, { point: null, distance: Infinity }).point;

    if (closestPoint) {
      const distanceInMeters = calculateDistanceFromStart(routePoints, closestPoint);
      setDistanceInMeters(Math.round(distanceInMeters * 100) / 100);
      setMarkerPosition(closestPoint);
    }
  };

  useMapEvent('mousemove', handleMouseMove);

  if (!markerPosition) return null;

  return (
    <Marker position={markerPosition} ref={markerRef}>
      <Popup autoClose={false} keepInView closeButton={false}>
        <div>
          <p>Distance: {distanceInMeters}m</p>
          {runners.map((runner, index) => {
            const timeInSeconds = (distanceInMeters * runner.speed) / 1000 * 60;
            const date = startDate && new Date(startDate + timeInSeconds * 1000);
            return (
              <div key={index}>
                {runner.name} ({runner.speed} min/km): {formatRunnerTime(timeInSeconds)}
                {date ? ` (${date.toLocaleTimeString()})` : ''}
              </div>
            );
          })}
        </div>
      </Popup>
    </Marker>
  );
};

const MapComponent = () => {
  const [gpxData, setGpxData] = useState(null);
  const [routePoints, setRoutePoints] = useState([]);
  const [startTimeHours, setStartTimeHours] = useState();
  const [startTimeMinutes, setStartTimeMinutes] = useState();
  const [runners, setRunners] = useState([{ name: 'Runner 1', speed: DEFAULT_SPEED }]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && (file.name.endsWith('.gpx') || file.type === 'application/gpx+xml')) {
      const reader = new FileReader();
      reader.onload = (e) => setGpxData(e.target.result);
      reader.readAsText(file);
    } else {
      alert("Please upload a valid GPX file.");
    }
  };

  const addRunner = () => {
    setRunners([...runners, { name: `Runner ${runners.length + 1}`, speed: DEFAULT_SPEED }]);
  };

  const updateRunnerSpeed = (index, speed) => {
    const updatedRunners = runners.map((runner, i) =>
      i === index ? { ...runner, speed: parseFloat(speed) } : runner
    );
    setRunners(updatedRunners);
  };

  const updateRunnerName = (index, name) => {
    const updatedRunners = runners.map((runner, i) =>
      i === index ? { ...runner, name } : runner
    );
    setRunners(updatedRunners);
  };

  const startDate = startTimeHours != null && startTimeMinutes != null
    ? new Date().setHours(startTimeHours, startTimeMinutes, 0, 0)
    : null;

  return (
    <div className="map-wrapper">
      <div className="map-configuration">
        <div className="configuration-section">
          <div className="configuration-title">Upload a GPX file</div>
          <input type="file" accept=".gpx" onChange={handleFileUpload} />
        </div>
        <div className="configuration-section">
          <div className="configuration-title">Runners' Speeds</div>
          {runners.map((runner, index) => (
            <div className='runner' key={index}>
              <label>
                <input
                  className='runner-input-name'
                  type="text"
                  value={runner.name}
                  onChange={(e) => updateRunnerName(index, e.target.value)}
                /> speed:
                <input
                  className='runner-input-number'
                  type="number"
                  value={runner.speed}
                  onChange={(e) => updateRunnerSpeed(index, e.target.value)}
                /> (min/km)
              </label>
              <button
                className='delete-runner'
                onClick={() => setRunners(runners.filter((_, i) => i !== index))}
              >x</button>
            </div>
          ))}
          <button onClick={addRunner}>Add Runner</button>
        </div>
        <div className="configuration-section">
          <div className="configuration-title">Start time</div>
          <input
            className='runner-input-number'
            type="number"
            value={startTimeHours}
            onChange={(e) => setStartTimeHours(parseInt(e.target.value))}
            placeholder="HH"
          />h
          <input
            className='runner-input-number'
            type="number"
            value={startTimeMinutes}
            onChange={(e) => setStartTimeMinutes(parseInt(e.target.value))}
            placeholder="MM"
          />m
        </div>
      </div>

      <MapContainer center={[51.505, -0.09]} zoom={13} className="map-container">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
        {gpxData && <GPXTrack gpxData={gpxData} setRoutePoints={setRoutePoints} />}
        <MouseMarker startDate={startDate} routePoints={routePoints} runners={runners} />
      </MapContainer>
    </div>
  );
};

export default MapComponent;
