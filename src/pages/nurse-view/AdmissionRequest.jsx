import { Button, Card, Col, DatePicker, Form, Input, Row, Select, Space, Table, TimePicker, Typography } from "antd"
import { ProfileOutlined } from "@ant-design/icons"

const AdmissionRequest = () => {

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
    <div style={{ margin: '20px 10px 10px 10px' }}>
        <Space style={{ color: '#b96000', display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '10px', position: 'relative'}}>
            <ProfileOutlined />
            <Typography.Text style={{ fontWeight: 'bold', color: '#b96000', fontSize: '16px'}}>
                Admission Request
            </Typography.Text>
        </Space>

        <Card style={{ padding: '10px 10px 10px 10px'}}>
            
            <Form layout="vertical">
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="Admission Number">
                        <Input placeholder="Admission Number" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Doctor">
                        <Input placeholder="Doctor" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="Admission Date">
                        <DatePicker placeholder="Admission Number" style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Patient Number">
                        <Input placeholder="Patient Number" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="Admission Time">
                        <TimePicker placeholder="Admission Time" style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Patient Name">
                        <Input placeholder="Patient Name" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="Admission Area">
                        <Input placeholder="Admission Area" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Branch">
                        <Select placeholder="Branch" 
                            options={[
                                { value: 'male', label: 'Male' },
                                { value: 'female', label: 'Female' },
                            ]}
                        />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="Admission Type">
                        <Select placeholder="Admission Type" 
                            options={[
                                { value: 'male', label: 'Male' },
                                { value: 'female', label: 'Female' },
                            ]}
                        />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Admission Reason">
                            <Input placeholder="Admission Reason" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16} style={{ marginBottom: '10px' }}>
                    <Col span={12}>
                        <Button type="primary" htmlType="submit">
                            Verify Patient Admission
                        </Button>
                    </Col>
                </Row>
            </Form>
 
          </Card>

          <Space style={{ color: '#b96000', display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '15px', position: 'relative'}}>
                <ProfileOutlined />
                <Typography.Text style={{ fontWeight: 'bold', color: '#b96000', fontSize: '16px'}}>
                    Past Admission Request
                </Typography.Text>
            </Space>

          <Table 
              columns={columns} 
              dataSource={dataSource} 
              className="admit-patient-table"
          />
    </div>
  )
}

export default AdmissionRequest