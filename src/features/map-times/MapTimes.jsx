import React, { useState } from 'react';

import styles from './map-times.module.scss';
import MapConfiguration from '../../components/map-configuration/MapConfiguration';
import Map from '../../components/map/Map';

function MapTimes() {
  const [gpxData, setGpxData] = useState(null);
  const [startTimeHours, setStartTimeHours] = useState();
  const [startTimeMinutes, setStartTimeMinutes] = useState();
  const [runners, setRunners] = useState([{
    id: 1, name: 'Runner 1', speedMinutes: 4, speedSeconds: 0,
  }]);

  const startDate = startTimeHours != null && startTimeMinutes != null
    ? new Date().setHours(startTimeHours, startTimeMinutes, 0, 0)
    : null;

  return (
    <div className={styles['map-wrapper']}>
      <MapConfiguration
        runners={runners}
        setGpxData={setGpxData}
        setStartTimeHours={setStartTimeHours}
        setStartTimeMinutes={setStartTimeMinutes}
        setRunners={setRunners}
      />
      <Map
        gpxData={gpxData}
        runners={runners}
        startDate={startDate}
      />
    </div>
  );
}

export default MapTimes;
