import { Card, Divider, Typography } from "antd"
import PropTypes from "prop-types"

const InpatientConsumablesCard = ({ patientDetails}) => {
  return (
    <div style={{ display: 'flex', alignContent: 'center', gap: '20px', paddingBottom: '20px' }}>
        <Card className="card" style={{ width: '100%', borderTop: '3px solid #b96000' }}>
            <div className="inpatient-details-container-1">
                <Typography.Text className="patient-name" style={{ fontWeight: 'bold', color: '#b96000' }}>
                    {patientDetails?.Search_Names||'N/A' }
                </Typography.Text>
                <Typography.Text className="patient-id" style={{ fontWeight: 'bold', color: '#b96000' }}>
                    Patient Number : {patientDetails?.PatientNo||'N/A' }
                </Typography.Text>
            </div>

            <Divider/>

            <div className="inpatient-details-container-2">
                <div className="patient-hospital-number-container">
                    <Typography.Text className="hospital-number-header">
                    Admission No
                    </Typography.Text>
                    <Typography.Text className="hospital-number">
                        {patientDetails?.AdmissionNo||'N/A' }
                    </Typography.Text>
                </div>
                
                <Divider type="vertical" style={{ height: '40px' }} />

                <div className="patient-age-gender-container">
                    <Typography.Text className="age-and-gender-header">
                    Ward and Bed
                    </Typography.Text>
                    <Typography.Text className="age-and-gender">
                    {patientDetails?.WardNo || 'N/A' }, {patientDetails?.BedNo || 'N/A' }
                    </Typography.Text>
                </div>
            </div>
        </Card>
    </div>
  )
}

export default InpatientConsumablesCard
// props validation
InpatientConsumablesCard.propTypes = {
  patientDetails: PropTypes.object
}