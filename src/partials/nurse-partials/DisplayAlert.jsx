import { Alert } from "antd"
import PropTypes from "prop-types"

const DisplayAlert = ({ alertMessage, alertType, setAlertMessage }) => {
  return (
    <>
        <Alert
            message={alertMessage}
            style={{ marginTop: '10px', marginBottom: '10px' }}
            type={alertType}
            showIcon
            closable
            onClose={() => setAlertMessage('')}
        />
    </>
  )
}

export default DisplayAlert

//props validation
DisplayAlert.propTypes = {
    alertMessage: PropTypes.string.isRequired,
    alertType: PropTypes.string.isRequired,
    setAlertMessage: PropTypes.string.isRequired,
}