import { Card, Typography } from 'antd'
import { HourglassOutlined, ClockCircleOutlined, StopOutlined } from '@ant-design/icons'
import PropTypes from 'prop-types'
import CountUp from 'react-countup'

const TriageSummeryCard = ({ waitingPatient }) => {
  return (

    <div  style={{display: 'flex', marginBottom: '10px', gap: '10px'}}>
          <Card style={{ flex: 1, padding: '10px 16px'}} >
                <div style={{ display: 'flex', alignItems: 'center' }}>

                    <div style={{display: 'grid', placeItems: 'center', backgroundColor: 'green', borderRadius: '4px', width: '30px', height: '30px', color: 'white'}}>
                        <HourglassOutlined/>
                    </div>
                    
                    <div style={{ marginLeft: '20px' }}>
                        <Typography.Title level={5} style={{color: 'gray'}}>
                            Waiting Patients
                        </Typography.Title>
                        <Typography.Text style={{ fontSize: '12px', fontWeight: 'bold', }}>
                            <CountUp start={0} end={waitingPatient?.length} duration={1} />
                        </Typography.Text>
                    </div>
                    
                </div>
            </Card>

            <Card style={{ flex: 1, padding: '10px 16px'}} >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    
                <div style={{display: 'grid', placeItems: 'center', backgroundColor: 'gray', borderRadius: '4px', width: '30px', height: '30px', color: 'white'}}>
                    <ClockCircleOutlined />
                    </div>
                    
                    <div style={{ marginLeft: '20px' }}>
                        <Typography.Title level={5} style={{color: 'gray'}}>
                            Inpatient in Triage
                        </Typography.Title>
                        <Typography.Text style={{ fontSize: '12px', fontWeight: 'bold', }}>
                            20
                        </Typography.Text>
                    </div>
                    
                </div>
            </Card>

            <Card style={{ flex: 1, padding: '10px 16px'}} >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    
                <div style={{display: 'grid', placeItems: 'center', backgroundColor: '#002329', borderRadius: '4px', width: '30px', height: '30px', color: 'white'}}>
                    <StopOutlined />
                    </div>
                    
                    <div style={{ marginLeft: '20px' }}>
                        <Typography.Title level={5} style={{color: 'gray'}}>
                            Dispatched to Doctors
                        </Typography.Title>
                        <Typography.Text style={{ fontSize: '12px', fontWeight: 'bold', }}>
                            30
                        </Typography.Text>
                    </div>
                    
                </div>
            </Card>
    </div>
  )
}

export default TriageSummeryCard

//props validation
TriageSummeryCard.propTypes = {
    waitingPatient: PropTypes.array.isRequired,
}