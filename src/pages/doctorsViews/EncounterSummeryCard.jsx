import { Card, Divider, Typography } from "antd"
import PropTypes from "prop-types"
import Loading from "../../partials/nurse-partials/Loading"

const EncounterSummeryCard = ({ patientDetails, loadingTriageWaitingList}) => {
 if(loadingTriageWaitingList){
    return (
        <Loading />
    )
 }
  return (
    <div style={{ display: 'flex', alignContent: 'center', gap: '20px', paddingBottom: '20px' }}>
        <Card className="card" style={{ width: '100%', borderTop: '3px solid #0f5689' }}>
            <div className="inpatient-details-container-1">
                <Typography.Text className="patient-name" style={{ fontWeight: 'bold', color: '#0f5689' }}>
                Patient Name: {patientDetails?.SearchName ||'N/A' }
                </Typography.Text>
                <Typography.Text className="patient-id" style={{ fontWeight: 'bold', color: '#0f5689' }}>
                    Patient Number : {patientDetails?.PatientNo||'N/A' }
                </Typography.Text>
            </div>

            <Divider/>

            <div className="inpatient-details-container-2">
                <div className="patient-hospital-number-container">
                    <Typography.Text className="hospital-number-header">
                    Doctor Name
                    </Typography.Text>
                    <Typography.Text className="hospital-number">
                        {patientDetails?.DoctorsName ||'N/A' }
                    </Typography.Text>
                </div>

                <div className="patient-hospital-number-container">
                    <Typography.Text className="hospital-number-header">
                    Treatment Date
                    </Typography.Text>
                    <Typography.Text className="hospital-number">
                        {patientDetails?.TreatmentDate ||'N/A' }
                    </Typography.Text>
                </div>
                
                <Divider type="vertical" style={{ height: '40px' }} />

                <div className="patient-age-gender-container">
                    <Typography.Text className="age-and-gender-header">
                    Treatment Type & Patient Type
                    </Typography.Text>
                    <Typography.Text className="age-and-gender">
                    {patientDetails?.TreatmentType || 'N/A' }, {patientDetails?.PatientType || 'N/A' }
                    </Typography.Text>
                </div>
                <div className="patient-age-gender-container">
                    <Typography.Text className="age-and-gender-header">
                    Observation Number
                    </Typography.Text>
                    <Typography.Text className="age-and-gender">
                    {patientDetails?.ObservationNo|| 'N/A' }
                    </Typography.Text>
                </div>
            </div>
        </Card>
    </div>
  )
}

export default EncounterSummeryCard
// props validation
EncounterSummeryCard.propTypes = {
  patientDetails: PropTypes.object,
  loadingTriageWaitingList: PropTypes.bool
}