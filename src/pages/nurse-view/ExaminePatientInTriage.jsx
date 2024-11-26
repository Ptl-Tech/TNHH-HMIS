import { Card, Col, Row, Tabs, Typography } from 'antd'
import React from 'react'

const EvaluatePatientInTriage = () => {
  return (
    <Card style={{ padding: '24px 10px 10px 10px' }}>
        <Typography.Title level={4}>Triage Examination</Typography.Title>
          <Row>
              <Col span={6}>
                <div style={{ display: 'flex', flexDirection: 'column'}}>
                    <Typography.Text style={{ fontSize: '14px', fontWeight: 'bold'}}>Patient Name</Typography.Text>
                    <Typography.Text style={{ fontSize: '12px', color:'gray', fontWeight: 'bold'}}>Derick Martin</Typography.Text>
                </div>
              </Col>
              <Col span={4}>
                <div style={{ display: 'flex', flexDirection: 'column'}}>
                    <Typography.Text style={{ fontSize: '14px', fontWeight: 'bold'}}>Gender</Typography.Text>
                    <Typography.Text style={{ fontSize: '12px', color:'gray', fontWeight: 'bold'}}>
                      Male
                    </Typography.Text>
                </div>
              </Col>
              <Col span={4}>
                <div style={{ display: 'flex', flexDirection: 'column'}}>
                    <Typography.Text style={{ fontSize: '14px', fontWeight: 'bold'}}>DOB</Typography.Text>
                    <Typography.Text style={{ fontSize: '12px', color:'gray', fontWeight: 'bold'}}>
                      12/03/1990
                    </Typography.Text>
                </div>
              </Col>
              <Col span={4}>
                <div style={{ display: 'flex', flexDirection: 'column'}}>
                    <Typography.Text style={{ fontSize: '14px', fontWeight: 'bold'}}>Age</Typography.Text>
                    <Typography.Text style={{ fontSize: '12px', color:'gray', fontWeight: 'bold'}}>
                      40
                    </Typography.Text>
                </div>
              </Col>
              <Col span={6}>
                <div style={{ display: 'flex', flexDirection: 'column'}}>
                    <Typography.Text style={{ fontSize: '14px', fontWeight: 'bold'}}>DOA</Typography.Text>
                    <Typography.Text style={{ fontSize: '12px', color:'gray', fontWeight: 'bold'}}>
                      12/03/2023
                    </Typography.Text>
                </div>
              </Col>
          </Row>

          <Tabs style={{ padding: '10px 10px' }}>
              <Tabs.TabPane tab="Triage" key="triage">
                <Card style={{ padding: '24px 10px 10px 10px' }}>
                  <p>content</p>
                </Card>
              </Tabs.TabPane>
              <Tabs.TabPane tab="Allergy and Medication" key="allergy">
                <Card style={{ padding: '24px 10px 10px 10px' }}>
                    <p>content</p>
                </Card>
              </Tabs.TabPane>
           </Tabs>
    </Card>
  )
}

export default EvaluatePatientInTriage