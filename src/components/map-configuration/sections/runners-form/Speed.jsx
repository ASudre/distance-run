import PropTypes from 'prop-types';
import styles from './runners-form.module.scss';

function Speed({
  runner,
  updateRunnerSpeedMinutes,
  updateRunnerSpeedSeconds,
}) {
  return (
    <>
      speed:
      <input
        className={styles['input-number']}
        min={0}
        onChange={(e) => updateRunnerSpeedMinutes(e.target.value || 0)}
        type="number"
        value={runner.speedMinutes}
      />
      <input
        className={styles['input-number']}
        onChange={(e) => updateRunnerSpeedSeconds(e.target.value || 0)}
        max={59}
        min={0}
        type="number"
        value={runner.speedSeconds}
      />
      (min/km)
    </>
  );
}

Speed.propTypes = {
  runner: PropTypes.object,
  updateRunnerSpeedMinutes: PropTypes.func,
  updateRunnerSpeedSeconds: PropTypes.func,
};

export default Speed;
