import { Button, Card, Divider, List, Typography } from 'antd'
import { PrinterOutlined } from '@ant-design/icons'
import PropTypes from 'prop-types'


const InpatientCardInfo = ({ patientDetails }) => {
    const allergyItems = [
        {
          title: 'Food Allergies',
          description: 'Penicillin, Sulphur, Penicillin, Penicillin',
        },
        {
          title: 'Medications Allergies',
          description: 'Paracetamol, Aspirin, Penicillin, Penicillin',
        },
      ]
      
  return (
    <div style={{ display: 'flex', alignContent: 'center', gap: '20px', paddingBottom: '20px' }}>
        <Card className="card" style={{ width: '100%' }}>
            <div className="inpatient-details-container-1">
                <Typography.Text className="patient-name">
                    {patientDetails?.SearchName||'N/A' }
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

            <Divider />

            <div className="print-button-container">

                <Button type="primary" style={{ width: '100%' }}><PrinterOutlined /> Interim invoice</Button>
                <Button color="default" variant="outlined" style={{ width: '100%' }}><PrinterOutlined /> Treatment form</Button>

            </div>

        </Card>

        <Card className="card" style={{ width: '100%', backgroundColor: '#e5e3e3', border: 'none' }}>
        
            <List header={<div style={{ fontSize: '14px', fontWeight: 'bold', color: 'red' }}>Allergies and Chronics</div>}
            itemLayout="horizontal"
            dataSource={allergyItems}
            renderItem={(item) => (
            <List.Item style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <Typography.Text className="allergies-item-list-title">{item.title}</Typography.Text>
                <Typography.Text>{item.description}</Typography.Text>
            </List.Item>
            )}
            >
            </List>

        </Card>
    </div>
  )
}

export default InpatientCardInfo

// props validation
InpatientCardInfo.propTypes = {
    patientDetails: PropTypes.object.isRequired,
  };