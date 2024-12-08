import { Card, Input, Space, Table, Typography } from "antd"
import { ProfileOutlined } from "@ant-design/icons"
import { useNavigate } from "react-router-dom";


const PastDoctorVisit = () => {
  
  const dataSource = [
    {
        key: '1',
        admNo: 'ADM0001',
        patientNo: 'PAT0001',
        names: 'John Brown',
        admDate: '2023-01-01',
        patientType: 'cash',
        appointmentNo: 'A00032',
        scheme: 'Jubilee',
        membershipNo: 'ABC123',
    },
    {
        key: '2',
        admNo: 'ADM0002',
        patientNo: 'PAT0002',
        names: 'Jim Green',
        admDate: '2023-01-01',
        patientType: 'cash',
        appointmentNo: 'A00032',
        scheme: 'Bupa',
        membershipNo: 'ABC123',
    },
    {
        key: '3',
        admNo: 'ADM0003',
        patientNo: 'PAT0003',
        names: 'Joe Black',
        admDate: '2023-01-01',
        patientType: 'cash',
        appointmentNo: 'A00032',
        scheme: 'NHIF',
        membershipNo: 'ABC123',
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
        title: 'Date',
        dataIndex: 'admDate',
        key: 'admDate',
    },
    {
        title: 'Patient Type',
        dataIndex: 'patientType',
        key: 'patientType',
    },
    {
        title: 'Appointment No',
        dataIndex: 'appointmentNo',
        key: 'appointmentNo',
    },
    {
      title: 'Scheme',
      dataIndex: 'scheme',
      key: 'scheme',
  },
  {
    title: 'Membership No',
    dataIndex: 'membershipNo',
    key: 'membershipNo',
},
];

const navigate = useNavigate();

const handleNavigate = (patientNo, admNo) => {
  navigate(`/Nurse/Past-doctor-visit/Patient?PatientNo=${patientNo}&AdmNo=${admNo}`);
}
  
  return (
    <div style={{ margin: '20px 10px 10px 10px' }}>
    <Space style={{ color: '#0f5689', display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '10px'}}>
        <ProfileOutlined />
        <Typography.Text style={{ fontWeight: 'bold', color: '#0f5689', fontSize: '16px'}}>
            Past Doctor Visit
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

export default PastDoctorVisit