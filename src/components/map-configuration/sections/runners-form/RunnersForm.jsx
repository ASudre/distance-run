import React from 'react';
import PropTypes from 'prop-types';
import styles from './runners-form.module.scss';
import FormSection from '../../../../core/form-section/FormSection';
import Speed from './Speed';

function RunnersForm({ runners, setRunners }) {
  const addRunner = () => {
    setRunners([...runners, {
      id: runners.length, name: `Runner ${runners.length + 1}`, speedMinutes: 4 + runners.length, speedSeconds: 0,
    }]);
  };

  const updateRunnerSpeedMinutes = (index) => (speed) => {
    const updatedRunners = runners
      .map((runner, i) => (i === index ? { ...runner, speedMinutes: parseFloat(speed) } : runner));
    setRunners(updatedRunners);
  };

  const updateRunnerSpeedSeconds = (index) => (speed) => {
    const updatedRunners = runners
      .map((runner, i) => (i === index ? { ...runner, speedSeconds: parseFloat(speed) } : runner));
    setRunners(updatedRunners);
  };

  const updateRunnerName = (index, name) => {
    const updatedRunners = runners.map((runner, i) => (i === index ? { ...runner, name } : runner));
    setRunners(updatedRunners);
  };

  return (
    <FormSection
      title="Runners' Speeds"
    >
      {runners.map((runner, index) => (
        <div
          className={styles.runner}
          key={runner.id}
        >
          <div>
            <input
              className={styles['input-name']}
              onChange={(e) => updateRunnerName(index, e.target.value)}
              type="text"
              value={runner.name}
            />
            <Speed
              runner={runner}
              updateRunnerSpeedMinutes={updateRunnerSpeedMinutes(index)}
              updateRunnerSpeedSeconds={updateRunnerSpeedSeconds(index)}
            />
          </div>
          <button
            className={styles.delete}
            onClick={() => setRunners(runners.filter((_, i) => i !== index))}
            type="button"
          >
            x
          </button>
        </div>
      ))}
      <button
        onClick={addRunner}
        type="button"
      >
        Add Runner
      </button>
    </FormSection>
  );
}

RunnersForm.propTypes = {
  runners: PropTypes.array,
  setRunners: PropTypes.func,
};

export default RunnersForm;
