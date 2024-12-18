import { Card, Input, Space, Table, Typography } from "antd"
import { ProfileOutlined } from "@ant-design/icons"
import { Link } from "react-router-dom";

const AdmissionRequests = () => {

  const dataSource = [
    {
        key: '1',
        admissionNo: 'ADM0001',
        patientNo: 'PAT0001',
        names: 'John Brown',
        date: '2023-01-01',
        doctor: 'Dr Johnson',
        remarks: 'Remarks',
    },
];
const columns = [
    {
        title: 'Admission No',
        dataIndex: 'admissionNo',
        key: 'admissionNo',
        render: (_, record) => {
            return <Link to={`/Nurse/Admission-requests/${record.admissionNo}`} style={{ color: '#0f5689', textDecoration: 'none' }}>{record.admissionNo}</Link>
        }
    },
    {
        title: 'Patient No',
        dataIndex: 'patientNo',
        key: 'patientNo',
    },
    {
        title: 'Patient Names',
        dataIndex: 'names',
        key: 'names',
        render: (_, record) => {
            return <Link to={`/Nurse/Admission-requests/${record.admissionNo}`} style={{ color: '#0f5689', textDecoration: 'none' }}>{record.names}</Link>
        }
    },
    {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
    },
    {
        title: 'Doctor',
        dataIndex: 'doctor',
        key: 'doctor',
       
    },
    {
        title: 'Remarks',
        dataIndex: 'remarks',
        key: 'remarks',
    },
];
  return (
    <div style={{ margin: '20px 10px 10px 10px' }}>
        <Space style={{ color: '#0f5689', display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '10px', position: 'relative'}}>
            <ProfileOutlined />
            <Typography.Text style={{ fontWeight: 'bold', color: '#0f5689', fontSize: '16px'}}>
                Admission Requests
            </Typography.Text>
          </Space>

          <Card style={{ padding: '10px 10px 10px 10px'}}>
            
              <div className='admit-patient-filter-container'>
                  <Input placeholder="search by name" 
                      allowClear
                      showCount
                      showSearch
                  />
                  <span style={{ color: 'gray', fontSize: '14px', fontWeight: 'bold'}}>or</span>
                  <Input placeholder="search by patient no" 
                      allowClear
                      showCount
                      showSearch
                  />
                  <span style={{ color: 'gray', fontSize: '14px', fontWeight: 'bold'}}>or</span>
                  <Input placeholder="search by id number" 
                      allowClear
                      showCount
                      showSearch
                  />
              </div>
          </Card>

          <Table 
              columns={columns} 
              dataSource={dataSource} 
              className="admit-patient-table"
          />
    </div>
  )
}

export default AdmissionRequests