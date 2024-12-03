
import { Avatar, Button, Card, Col, Divider, Row, Space, Typography} from "antd"; 
import { UserOutlined, AlignCenterOutlined, BorderlessTableOutlined, BlockOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";
import { Line } from "@ant-design/charts";
import { lastSixMonthsTotalPatientsLineGraphConfig } from '../../constants/nurse-constants';

const DashboardStatistics = () => {
  return (
    
    <div style={{ marginTop: '16px' }}>
           <Row>
  
              <Col span={8}>
                  <Card style={{ padding: '10px 16px', marginRight: '10px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <Avatar icon={<UserOutlined />} size={64}/>
                        <div style={{ marginTop: '10px', textAlign: 'center' }}>
                              <Typography.Title level={5} style={{color: 'black'}}>Alex Thompson</Typography.Title>
                              <Typography.Text style={{ fontSize: '14px', color:'gray' }}>Registered Nurse</Typography.Text>
                        </div>
                      </div>
                      <Divider />
                      <Space style={{ display: 'flex', alignItems: 'baseline' }}>
                          <AlignCenterOutlined />
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography.Title level={5} style={{ fontSize: '14px', color:'black', fontWeight: 'bold' }}>Department</Typography.Title>
                            <Typography.Text style={{ fontSize: '12px', color:'gray', fontWeight: 'bold'}}>Nursing and Clinical Department</Typography.Text>
                          </div>
                      </Space>
                      <Space style={{ display: 'flex', alignItems: 'baseline', marginTop: '10px' }}>
                          <BlockOutlined />
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography.Title level={5} style={{ fontSize: '14px', color:'black', fontWeight: 'bold' }}>Branch</Typography.Title>
                            <Typography.Text style={{ fontSize: '12px', color:'gray', fontWeight: 'bold'}}>Bustani Branch</Typography.Text>
                          </div>
                      </Space>
                      <Space style={{ display: 'flex', alignItems: 'baseline', marginTop: '10px', marginBottom: '10px' }}>
                        <BorderlessTableOutlined />
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography.Title level={5} style={{ fontSize: '14px', color:'black', fontWeight: 'bold' }}>Ward</Typography.Title>
                            <Typography.Text style={{ fontSize: '12px', color:'gray', fontWeight: 'bold'}}>Simon Wing Ward</Typography.Text>
                          </div>
                      </Space>
                  </Card>
              </Col>
              <Col span={16}>
                <Card style={{ padding: '10px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ width: '10px', height: '10px', backgroundColor: '#0060a3', borderRadius: '50%', display: 'inline-block' }}></span>
                          <Typography.Text style={{ fontSize: '14px', color:'gray', fontWeight: 'bold' }}>Active Patients</Typography.Text>
                        </div>
                        <div>
                          <Button type="link" style={{ fontSize: '12px', color:'gray', }}>
                            <Link to="/nurse/patients" style={{ color: 'gray' }}>
                              View details
                              <ArrowRightOutlined size={12} style={{ marginLeft: '8px' }} />
                            </Link>
                          </Button>
                        </div>
                    </div>
                    <Divider/>
                    <div>
                      <Line {...lastSixMonthsTotalPatientsLineGraphConfig}/>
                    </div>
                  </Card>
              </Col>
           </Row>
    </div>

  )
}

export default DashboardStatistics