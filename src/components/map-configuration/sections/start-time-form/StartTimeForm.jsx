import PropTypes from 'prop-types';

import FormSection from '../../../../core/form-section/FormSection';

import styles from './start-time.module.scss';

function StartTimeForm({
  setStartTimeHours,
  setStartTimeMinutes,
}) {
  return (
    <FormSection
      title="Start time"
    >
      <input
        className={styles['input-number']}
        type="number"
        onChange={(e) => setStartTimeHours(parseInt(e.target.value, 10))}
        placeholder="HH"
        max={23}
        min={0}
      />
      h
      <input
        className={styles['input-number']}
        type="number"
        onChange={(e) => setStartTimeMinutes(parseInt(e.target.value, 10))}
        placeholder="MM"
        max={59}
        min={0}
      />
      m
    </FormSection>
  );
}

StartTimeForm.propTypes = {
  setStartTimeHours: PropTypes.func,
  setStartTimeMinutes: PropTypes.func,
};

export default StartTimeForm;
