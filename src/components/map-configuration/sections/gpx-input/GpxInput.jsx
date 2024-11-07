import PropTypes from 'prop-types';

import FormSection from '../../../../core/form-section/FormSection';

function GpxInput({ setGpxData }) {
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && (file.name.endsWith('.gpx') || file.type === 'application/gpx+xml')) {
      const reader = new FileReader();
      reader.onload = (e) => setGpxData(e.target.result);
      reader.readAsText(file);
    } else {
      // eslint-disable-next-line no-alert
      alert('Please upload a valid GPX file.');
    }
  };

  return (
    <FormSection
      title="Upload a GPX file"
    >
      <input
        accept=".gpx"
        onChange={handleFileUpload}
        type="file"
      />
    </FormSection>
  );
}

GpxInput.propTypes = {
  setGpxData: PropTypes.func,
};

export default GpxInput;
