import { Card, Divider, Spin, Typography } from 'antd'
import PropTypes from 'prop-types'
import { LoadingOutlined } from '@ant-design/icons'


const InpatientCardInfo = ({ patientDetails, filterAllergies, loadingTriageList, loadingAllergies }) => {
    console.log('patient details', patientDetails)
      
  return (
    <div style={{ display: 'flex', alignContent: 'center', gap: '20px', paddingBottom: '20px' }}>
        <Card className="card" style={{ width: '100%', borderTop: '3px solid #0f5689' }}>
            <div className="inpatient-details-container-1">
                <Typography.Text className="patient-name">
                    {patientDetails?.SearchName|| patientDetails?.Names || 'N/A' }
                </Typography.Text>
                <Typography.Text className="patient-id">
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
                        {patientDetails?.CurrentAdmNo||'N/A' }
                    </Typography.Text>
                </div>
                
                <Divider type="vertical" style={{ height: '40px' }} />

                <div className="patient-age-gender-container">
                    <Typography.Text className="age-and-gender-header">
                    Age and Gender
                    </Typography.Text>
                    <Typography.Text className="age-and-gender">
                       {patientDetails?.AgeinYears} years, {patientDetails?.Gender}
                    </Typography.Text>
                </div>
            </div>
        </Card>

        <Card className="card" style={{ width: '100%', backgroundColor: '#e5e3e3', border: 'none', borderTop: '3px solid #0f5689' }}>

        <div className="inpatient-details-container-1">
                <Typography.Text className="patient-name" style={{ fontWeight: 'bold' }}>
                    Allergies and Medications
                </Typography.Text>
            </div>

            <Divider/>
            
        <div className="inpatient-details-container-2">
                <div className="patient-hospital-number-container" style={{ paddingTop: '10px'}}>
                    <Typography.Text style={{ fontWeight: 'bold', color: 'red' }}>
                        Food Allergies
                    </Typography.Text>
                    {
                        loadingTriageList || loadingAllergies ? (
                        <Spin indicator={<LoadingOutlined spin />} />
                        ) : filterAllergies.length > 0 ? (
                        filterAllergies.map(allergy => (
                        <Typography.Text key={allergy?.FoodAllergy}>
                        {allergy?.FoodAllergy}
                        </Typography.Text>
                        ))
                        ) : (
                        <Typography.Text>No Allergies</Typography.Text>
                        )
                    }

                </div>
                
                <Divider type="vertical" style={{ height: '40px' }} />

                <div className="patient-age-gender-container" style={{ paddingTop: '10px'}}>
                    <Typography.Text style={{ fontWeight: 'bold', color: 'red' }}>
                        Drug and Medication Allergies
                    </Typography.Text>
                    {
                        loadingTriageList || loadingAllergies ? (
                        <Spin indicator={<LoadingOutlined spin />} />
                        ) : filterAllergies.length > 0 ? (
                        filterAllergies.map(allergy => (
                        <Typography.Text key={allergy?.DrugAllergy}>
                        {allergy?.DrugAllergy}
                        </Typography.Text>
                        ))
                        ) : (
                        <Typography.Text>No Allergies</Typography.Text>
                        )
                    }
                </div>
            </div>
            
        </Card>
    </div>
  )
}

export default InpatientCardInfo

// props validation
InpatientCardInfo.propTypes = {
    patientDetails: PropTypes.object.isRequired,
    filterAllergies: PropTypes.array.isRequired,
    loadingTriageList: PropTypes.bool.isRequired,
    loadingAllergies: PropTypes.bool.isRequired,
  };