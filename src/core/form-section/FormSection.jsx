import PropTypes from 'prop-types';
import styles from './form-section.module.scss';

function FormSection({
  children,
  title,
}) {
  return (
    <div className={styles['configuration-section']}>
      <div className={styles['configuration-title']}>{title}</div>
      {children}
    </div>
  );
}

FormSection.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
};

export default FormSection;
