import { Col, Row, Typography } from 'antd'
import PropTypes from 'prop-types'

const PatientDetailPage = ({ patientDetails }) => {
    const patientName = patientDetails?.SearchName || `${patientDetails?.Surname} ${patientDetails?.FirstName} ${patientDetails?.MiddleName}`;
  return (
    <>
        <Typography.Title level={4}>Triage Examination</Typography.Title>
          <Row style={{ backgroundColor: '#f2f4f4', padding: '10px 10px', marginTop: '20px', borderRadius: '5px'}}>
              <Col span={4}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px'}}>
                    <Typography.Text style={{ fontSize: '14px', fontWeight: 'bold'}}>Patient Name</Typography.Text>
                    <Typography.Text style={{ fontSize: '12px', color:'gray', fontWeight: 'bold'}}>{patientName}</Typography.Text>
                </div>
              </Col>
              <Col span={4}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px'}}>
                    <Typography.Text style={{ fontSize: '14px', fontWeight: 'bold'}}>Patient No</Typography.Text>
                    <Typography.Text style={{ fontSize: '12px', color:'gray', fontWeight: 'bold'}}>{patientDetails?.PatientNo}</Typography.Text>
                </div>
              </Col>
              <Col span={4}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px'}}>
                    <Typography.Text style={{ fontSize: '14px', fontWeight: 'bold'}}>Gender</Typography.Text>
                    <Typography.Text style={{ fontSize: '12px', color:'gray', fontWeight: 'bold'}}>
                      {patientDetails?.Gender}
                    </Typography.Text>
                </div>
              </Col>
              <Col span={4}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px'}}>
                    <Typography.Text style={{ fontSize: '14px', fontWeight: 'bold'}}>DOB</Typography.Text>
                    <Typography.Text style={{ fontSize: '12px', color:'gray', fontWeight: 'bold'}}>
                      12/03/1990
                    </Typography.Text>
                </div>
              </Col>
              <Col span={4}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px'}}>
                    <Typography.Text style={{ fontSize: '14px', fontWeight: 'bold'}}>Age</Typography.Text>
                    <Typography.Text style={{ fontSize: '12px', color:'gray', fontWeight: 'bold'}}>
                      {patientDetails?.AgeinYears}
                    </Typography.Text>
                </div>
              </Col>
              <Col span={4}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px'}}>
                    <Typography.Text style={{ fontSize: '14px', fontWeight: 'bold'}}>File No</Typography.Text>
                    <Typography.Text style={{ fontSize: '12px', color:'gray', fontWeight: 'bold'}}>
                      {patientDetails?.FileNo}
                    </Typography.Text>
                </div>
              </Col>
          </Row>
    </>
  )
}

export default PatientDetailPage


//props validation
PatientDetailPage.propTypes = {
    patientDetails: PropTypes.object.isRequired,
}