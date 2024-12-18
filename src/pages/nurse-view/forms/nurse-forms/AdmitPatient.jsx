import { Button, Card, Col, DatePicker, Form, Input, Row, Select, Space, TimePicker, Table, Typography } from "antd"
import { hospitalBranchesTotalWards, selectBed } from "../../../../constants/nurse-constants"
import { ProfileOutlined } from "@ant-design/icons"

const AdmitPatientForm = () => {
  const dataSource = [
      {
          key: '1',
          admNo: 'ADM0001',
          patientNo: 'PAT0001',
          admDate: '2023-01-01',
          ward: 'Ward 1',
          bed: 'B101',
          doctor: 'Dr. Smith',
          status: 'Admitted',
      },
      {
          key: '2',
          admNo: 'ADM0002',
          patientNo: 'PAT0002',
          admDate: '2023-01-01',
          ward: 'Ward 2',
          bed: 'B102',
          doctor: 'Dr. Johnson',
          status: 'Pending',
      },
      {
          key: '3',
          admNo: 'ADM0003',
          patientNo: 'PAT0003',
          admDate: '2023-01-01',
          ward: 'Ward 1',
          bed: 'B103',
          doctor: 'Dr. Williams',
          status: 'Pending',
      },
  ];
  const columns = [
      {
          title: 'Adm No',
          dataIndex: 'admNo',
          key: 'admNo',
      },
      {
          title: 'Patient No',
          dataIndex: 'patientNo',
          key: 'patientNo',
      },
    
      {
          title: 'Adm Date',
          dataIndex: 'admDate',
          key: 'admDate',
      },
      {
          title: 'Ward',
          dataIndex: 'ward',
          key: 'ward',
      },
      {
          title: 'Bed',
          dataIndex: 'bed',
          key: 'bed',
      },
      {
          title: 'Doctor',
          dataIndex: 'doctor',
          key: 'doctor',
      },
      {
          title: 'Status',
          dataIndex: 'status',
          key: 'status',
      },
  ];
  return (
    <>
    <Card style={{ margin: '20px 10px 10px 10px' }}>
        <Form layout="vertical" className="admit-patient-card-container">
        <Row gutter={16}>
          <Col span={8}>
                <Form.Item 
                  label="Admission Number"
                  name='admissionNumber' 
                  
                >
                  <Input type='text' 
                    disabled
                  />
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item 
                  label="Select Ward"
                  name='selectWard' 
                 
                >
                <Select 
                  optionFilterProp="label"
                  options={hospitalBranchesTotalWards} 
                  placeholder="Select ward"
                  showSearch
                
                >
                </Select>
                </Form.Item>
            </Col>
            <Col span={8}>
            <Form.Item label="Admission Date" name="admissionDate" >
                <DatePicker placeholder="Admission Date" style={{ width: '100%' }} />
            </Form.Item>
            </Col>  
        </Row>
        <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Admission Time" name='admissionTime'>
                  <TimePicker placeholder="Admission Time" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Select Bed" name='Select Bed' >
                <Select 
                      options={selectBed} 
                      placeholder="Select bed"
                      showSearch
                    >
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Doctor" name='Doctor'>
                  <Input  />
              </Form.Item>
            </Col>
        </Row>
        <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Admission Area" name='admissionArea'>
                  <Input  />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Patient Name" name='patientName' >
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Admission Type" name='AdmissionType'>
                  <Select 
                    options={
                      [
                        {
                          value: 'Inpatient',
                          label: 'Inpatient',
                        },
                        {
                          value: 'Outpatient',
                          label: 'Outpatient',
                        },
                      ]
                    }
                  />
              </Form.Item>
            </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
              <Form.Item label="Admission Reason" name='admissionReason'>
                  <Input />
              </Form.Item>
          </Col>
          <Col span={8}>
              <Form.Item label="Patient Number" name='patientNumber'>
                  <Input />
              </Form.Item>
          </Col>
          <Col span={8}>
              <Form.Item label="Diagnosis Code" name='diagnosisCode'>
                  <Input />
              </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
              <Form.Item label="Branch" name='branch'>
                  <Input />
              </Form.Item>
          </Col>
          <Col span={8}>
              <Form.Item label="Expected Date of Discharge" name='expectedDateOfDischarge'>
                  <DatePicker placeholder="Expected Date of Discharge" style={{ width: '100%' }} />
              </Form.Item>
          </Col>
        </Row>
        <Space>
            <Form.Item >
                <Button type="primary" htmlType="submit">Save Admission</Button>
            </Form.Item>
            <Form.Item >
                <Button color="danger" variant="outlined">Cancel Admission</Button>
            </Form.Item>
        </Space>
        </Form>
        </Card>

        <div style={{ margin: '20px 10px 10px 10px' }}>
          <Space style={{ color: '#0f5689', display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '15px', position: 'relative'}}>
          <ProfileOutlined />
          <Typography.Text style={{ fontWeight: 'bold', color: '#0f5689', fontSize: '16px'}}>
              Past Admissions
          </Typography.Text>
          </Space>
          <Table 
          columns={columns} 
          dataSource={dataSource} 
          className="admit-patient-table"
          />
        </div>
    </>
    
  )
}

export default AdmitPatientForm