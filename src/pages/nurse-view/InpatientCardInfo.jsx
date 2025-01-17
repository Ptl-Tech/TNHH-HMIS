import { Card, Col, Divider, Row, Spin, Typography } from 'antd'
import PropTypes from 'prop-types'
import { LoadingOutlined } from '@ant-design/icons'
import { calculateAge } from '../../utils/helpers'
import useFetchAllPatientsHook from '../../hooks/useFetchAllPatientsHook'


const InpatientCardInfo = ({ patientDetails, filterAllergies, loadingTriageList, loadingAllergies }) => {

    const { loadingTriageWaitingList, triageWaitingList } = useFetchAllPatientsHook();
    const filteredPatient = triageWaitingList?.filter(patient => patient.PatientNo === patientDetails?.Patient_No);

  return (
    <>
        <div style={{ display: 'flex', alignContent: 'center', gap: '20px', paddingBottom: '20px' }}>
        <Card className="card" style={{ width: '100%', borderTop: '3px solid #0f5689' }}>
            <div className="inpatient-details-container-1">
                <Typography.Text className="patient-name" style={{ fontWeight: 'bold', color: '#0f5689' }}>
                    {patientDetails?.PatientName || 'N/A' }
                </Typography.Text>
                <Typography.Text className="patient-id" style={{ fontWeight: 'bold', color: '#0f5689' }}>
                    Patient Number : {patientDetails?.Patient_No||'N/A' }
                </Typography.Text>
            </div>

            <Divider/>

            <div className="inpatient-details-container-2">
                <div className="patient-hospital-number-container">
                    <Typography.Text className="hospital-number-header">
                    Admission No
                    </Typography.Text>
                    <Typography.Text className="hospital-number">
                        {patientDetails?.Admission_No ||'N/A' }
                    </Typography.Text>
                </div>
                
                <Divider type="vertical" style={{ height: '40px' }} />

                <div className="patient-age-gender-container">
                    <Typography.Text className="age-and-gender-header">
                    Age and Gender
                    </Typography.Text>
                    {
                        loadingTriageWaitingList ? (
                            <Spin indicator={<LoadingOutlined style={{ fontSize: 24, color: '#0f5689' }} spin />} />
                        ) : (
                            <Typography.Text className="age-and-gender">
                                {calculateAge(filteredPatient[0]?.DateOfBirth) || 'N/A'}, {filteredPatient[0]?.Gender || 'N/A'}
                            </Typography.Text>
                        )
                    }
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
                        Drug Allergies
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

    <Card className="card" style={{ width: '100%', borderTop: '3px solid #0f5689', marginBottom: '20px' }}>
        <Row gutter={16}>
        {[
        { label: 'Admitting Doctor', key: 'DoctorsName' },
        { label: 'Admission Date', key: 'Admission_Date' },
        { label: 'Expected Discharge Date', key: 'Expected_Date_of_Discharge' },
        { label: 'Ward Name', key: 'Ward' },
        { label: 'Bed Number', key: 'Bed' },
        { label: 'Discharge Coming In', key: '' }, // Special case without a key
        ].map((field, index) => (
        <Col span={4} key={index}>
        <Typography.Text
        className="patient-name"
        style={{ fontWeight: 'bold', color: '#0f5689', display: 'block' }}
        >
        {field.label}
        </Typography.Text>
        {field.key ? (
        <Typography.Text className="patient-name" style={{ marginTop: '10px', display: 'block' }}>
            {patientDetails?.[field.key] || 'N/A'}
        </Typography.Text>
        ) : null}
        
        </Col>
        ))}
        </Row>

    </Card>
    </>
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