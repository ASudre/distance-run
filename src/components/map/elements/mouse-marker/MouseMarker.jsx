import React, { useState, useEffect, useRef } from 'react';
import { Marker, Popup, useMapEvent } from 'react-leaflet';
import PropTypes from 'prop-types';
import calculateDistanceFromStart from '../../../../helpers/calculate-distance-from-start';
import formatRunnerTime from '../../../../helpers/format-runner-time';

function MouseMarker({
  routePoints,
  runners,
  startDate,
}) {
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
      const distanceFromStart = calculateDistanceFromStart(routePoints, closestPoint);
      setDistanceInMeters(Math.round(distanceFromStart * 100) / 100);
      setMarkerPosition(closestPoint);
    }
  };

  useMapEvent('mousemove', handleMouseMove);

  if (!markerPosition) return null;

  return (
    <Marker position={markerPosition} ref={markerRef}>
      <Popup>
        <div>
          <p>
            Distance:
            {' '}
            {distanceInMeters}
            m
          </p>
          {runners.map((runner) => {
            const timeInSeconds = (distanceInMeters / 1000)
              * (runner.speedMinutes + runner.speedSeconds / 60) * 60;
            const date = startDate && new Date(startDate + timeInSeconds * 1000);
            return (
              <div key={runner.id}>
                {runner.name}
                {' '}
                (
                {runner.speedMinutes.toString()}
                :
                {runner.speedSeconds.toString().padStart(2, '0')}
                min/km):
                {' '}
                {formatRunnerTime(timeInSeconds)}
                {date ? ` (${date.toLocaleTimeString()})` : ''}
              </div>
            );
          })}
        </div>
      </Popup>
    </Marker>
  );
}

MouseMarker.propTypes = {
  routePoints: PropTypes.array,
  runners: PropTypes.array,
  startDate: PropTypes.string,
};

export default MouseMarker;
