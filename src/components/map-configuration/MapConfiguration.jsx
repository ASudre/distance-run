import PropTypes from 'prop-types';
import GpxInput from './sections/gpx-input/GpxInput';
import RunnersForm from './sections/runners-form/RunnersForm';
import StartTimeForm from './sections/start-time-form/StartTimeForm';

import styles from './map-configuration.module.scss';

function MapConfiguration({
  runners,
  setGpxData,
  setRunners,
  setStartTimeHours,
  setStartTimeMinutes,
}) {
  return (
    <div className={styles['map-configuration']}>
      <GpxInput
        setGpxData={setGpxData}
      />
      <RunnersForm
        runners={runners}
        setRunners={setRunners}
      />
      <StartTimeForm
        setStartTimeHours={setStartTimeHours}
        setStartTimeMinutes={setStartTimeMinutes}
      />
    </div>
  );
}

MapConfiguration.propTypes = {
  runners: PropTypes.array,
  setGpxData: PropTypes.func,
  setRunners: PropTypes.func,
  setStartTimeHours: PropTypes.func,
  setStartTimeMinutes: PropTypes.func,
};

export default MapConfiguration;
