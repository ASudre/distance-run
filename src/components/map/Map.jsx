import PropTypes from 'prop-types';
import { MapContainer } from 'react-leaflet';
import MapContent from './MapContent';
import 'leaflet/dist/leaflet.css';

import styles from './map.module.scss';

function Map({
  gpxData,
  runners,
  startDate,
}) {
  return (
    <MapContainer
      center={[51.505, -0.09]}
      className={styles['map-container']}
      zoom={13}
    >
      <MapContent
        gpxData={gpxData}
        runners={runners}
        startDate={startDate}
      />
    </MapContainer>
  );
}

Map.propTypes = {
  gpxData: PropTypes.string,
  runners: PropTypes.array,
  startDate: PropTypes.string,
};

export default Map;
