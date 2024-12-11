import { Button, Card, Divider, List, Typography } from 'antd'
import { PrinterOutlined } from '@ant-design/icons'

const InpatientCardInfo = () => {
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
    <>
        <Card className="card">
            <div className="inpatient-details-container-1">
                <Typography.Text className="patient-name">
                    Patrick Mwakasila Mwakasila
                </Typography.Text>
                <Typography.Text className="patient-id">
                    Patient ID : 123456789
                </Typography.Text>
            </div>

            <Divider/>

            <div className="inpatient-details-container-2">
            <div className="patient-hospital-number-container">
                <Typography.Text className="hospital-number-header">
                Hospital No
                </Typography.Text>
                <Typography.Text className="hospital-number">
                    123456789 
                </Typography.Text>
            </div>
            <Divider type="vertical" style={{ height: '40px' }} />
            <div className="patient-age-gender-container">
                <Typography.Text className="age-and-gender-header">
                Age and Gender
                </Typography.Text>
                <Typography.Text className="age-and-gender">
                    25 years, Male
                </Typography.Text>
            </div>
            </div>

            <Divider />

            <div className="print-button-container">

                <Button type="primary" style={{ width: '100%' }}><PrinterOutlined /> Interim invoice</Button>
                <Button color="default" variant="outlined" style={{ width: '100%' }}><PrinterOutlined /> Treatment form</Button>

            </div>

        </Card>

        <Card className="allergies-card">
        
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
    </>
  )
}

export default InpatientCardInfo