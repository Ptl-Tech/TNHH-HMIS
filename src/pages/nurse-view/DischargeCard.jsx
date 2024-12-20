import { Col, Row, Space, Table, Typography } from "antd"
import InpatientCardInfo from "./InpatientCardInfo"
import {DiffOutlined } from "@ant-design/icons"
import DischargeCardContent from "./DischargeCardContent"
import { ProfileOutlined } from "@ant-design/icons"

const DischargeCard = () => {

  const dataSource = [
    {
        key: '1',
        admNo: 'ADM0001',
        patientNo: 'PAT0001',
        dischargeDate: '2023-01-01',
        ward: 'Ward 1',
        bed: 'B101',
        doctor: 'Dr. Smith',
        status: 'Discharged',
    },
    {
        key: '2',
        admNo: 'ADM0002',
        patientNo: 'PAT0002',
        dischargeDate: '2023-01-01',
        ward: 'Ward 2',
        bed: 'B102',
        doctor: 'Dr. Johnson',
        status: 'Discharged',
    },
    {
        key: '3',
        admNo: 'ADM0003',
        patientNo: 'PAT0003',
        dischargeDate: '2023-01-01',
        ward: 'Ward 1',
        bed: 'B103',
        doctor: 'Dr. Williams',
        status: 'Discharged',
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
        title: 'Discharge Date',
        dataIndex: 'dischargeDate',
        key: 'dischargeDate',
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
          <Space className="inpatient-header">
          <DiffOutlined />
            <Typography.Text className="inpatient-header-text">
                Discharge Card
            </Typography.Text>
          </Space>
          <Row gutter={8}
          className="inpatient-card-container">
              <Col xs={24} md={24} lg={16} xl={16} className="inpatient-card-left-col">
                <DischargeCardContent />
              </Col>
              <Col xs={24} md={24} lg={8} xl={8} className="inpatient-card-right-col">
                <InpatientCardInfo />
              </Col>
          </Row>

          <div style={{ margin: '20px 10px 10px 10px' }}>
          <Space style={{ color: '#0f5689', display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '15px', position: 'relative'}}>
          <ProfileOutlined />
          <Typography.Text style={{ fontWeight: 'bold', color: '#0f5689', fontSize: '16px'}}>
              Past Discharges
          </Typography.Text>
          </Space>
          <Table 
          columns={columns} 
          dataSource={dataSource} 
          className="admit-patient-table"
          />
        </div>
    </div>
  )
}

export default DischargeCard