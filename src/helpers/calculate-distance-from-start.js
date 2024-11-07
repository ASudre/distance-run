const calculateDistanceFromStart = (routePoints, currentLatLng) => {
  if (!routePoints.length) return 0;

  const startPoint = routePoints[0];
  let totalDistance = 0;
  let prevPoint = startPoint;

  for (let i = 1; i < routePoints.length; i += 1) {
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

export default calculateDistanceFromStart;
