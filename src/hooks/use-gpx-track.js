import { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-gpx';

// eslint-disable-next-line no-underscore-dangle
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const useGPXTrack = (gpxData) => {
  const map = useMap();
  const [routePoints, setRoutePoints] = useState([]);

  useEffect(() => {
    if (!gpxData) {
      return () => { };
    }

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
  }, [gpxData, map]);

  return routePoints;
};

export default useGPXTrack;
