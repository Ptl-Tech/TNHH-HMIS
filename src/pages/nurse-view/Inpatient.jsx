import { Card, Input, Space, Table, Typography } from "antd"
import { ProfileOutlined } from "@ant-design/icons"
import { useNavigate } from "react-router-dom";

const Impatient = () => {

  const dataSource = [
    {
        key: '1',
        admNo: 'ADM0001',
        patientNo: 'PAT0001',
        names: 'John Brown',
        admDate: '2023-01-01',
        ward: 'Ward 1',
        bed: 'B101',
        doctor: 'Dr. Smith',
    },
    {
        key: '2',
        admNo: 'ADM0002',
        patientNo: 'PAT0002',
        names: 'Jim Green',
        admDate: '2023-01-01',
        ward: 'Ward 2',
        bed: 'B102',
        doctor: 'Dr. Johnson',
    },
    {
        key: '3',
        admNo: 'ADM0003',
        patientNo: 'PAT0003',
        names: 'Joe Black',
        admDate: '2023-01-01',
        ward: 'Ward 1',
        bed: 'B103',
        doctor: 'Dr. Williams',
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
        title: 'Names',
        dataIndex: 'names',
        key: 'names',
        render: (_, record) => <a onClick={()=>handleNavigate(record?.patientNo, record?.admNo)} style={{ color: '#0f5689' }}>{record.names}</a>,
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
];

const navigate = useNavigate();

const handleNavigate = (patientNo, admNo) => {
  navigate(`/Nurse/Inpatient/Patient-card?PatientNo=${patientNo}&AdmNo=${admNo}`);
}
        
  return (
    <div style={{ margin: '20px 10px 10px 10px' }}>
        <Space style={{ color: '#0f5689', display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '10px'}}>
            <ProfileOutlined />
            <Typography.Text style={{ fontWeight: 'bold', color: '#0f5689', fontSize: '16px'}}>
                Current Inpatients
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

export default Impatient