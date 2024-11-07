import { TileLayer } from 'react-leaflet';
import PropTypes from 'prop-types';

import MouseMarker from './elements/mouse-marker/MouseMarker';
import useGPXTrack from '../../hooks/use-gpx-track';

function MapContent({
  gpxData,
  runners,
  startDate,
}) {
  const routePoints = useGPXTrack(gpxData);

  return (
    <>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
      <MouseMarker startDate={startDate} routePoints={routePoints} runners={runners} />
    </>
  );
}

MapContent.propTypes = {
  gpxData: PropTypes.string,
  runners: PropTypes.array,
  startDate: PropTypes.string,
};

export default MapContent;
