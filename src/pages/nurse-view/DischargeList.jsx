import { Card, Input, Space, Table, Typography } from "antd"
import { ProfileOutlined } from "@ant-design/icons"
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getDischargeList } from "../../actions/Doc-actions/Admission/getdischargeList";


const DischargeList = () => {
    const dispatch=useDispatch();
    const { loading, data } = useSelector(
        (state) => state.getDischargeList
      );


      useEffect(() => {
        dispatch(getDischargeList());
        }, [dispatch]);
    

const columns = [
    {
        title: 'Adm No',
        dataIndex: 'AdmissionNo',
        key: 'AdmissionNo',
    },
    {
        title: 'Patient No',
        dataIndex: 'PatientNo',
        key: 'PatientNo',
    },
    {
        title: 'Names',
        dataIndex: 'Search_Names',
        key: 'Search_Names',
        render: (_, record) => <a onClick={()=>handleNavigate(record?.patientNo, record?.admNo)} style={{ color: '#0f5689' }}>{record.Search_Names}</a>,
    },
    {
        title: 'Adm Date',
        dataIndex: 'DateofAdmission',
        key: 'DateofAdmission',
    },
    {
        title: 'Ward',
        dataIndex: 'WardNo',
        key: 'WardNo',
    },
    {
        title: 'Bed',
        dataIndex: 'BedNo',
        key: 'BedNo',
    },
    {
        title: 'Action',
        dataIndex: 'Action',
        key: 'Action',
        render: () => (
            <Space size="middle">
                <a style={{ color: '#0f5689' }}>Discharge</a>
            </Space>
        ),
    },
];

const navigate = useNavigate();

const handleNavigate = (patientNo, admNo) => {
  navigate(`/Nurse/Discharge-list/Discharge-card?PatientNo=${patientNo}&AdmNo=${admNo}`);
}
  return (
    <div style={{ margin: '20px 10px 10px 10px' }}>
        <Space style={{ color: '#0f5689', display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '10px'}}>
            <ProfileOutlined />
            <Typography.Text style={{ fontWeight: 'bold', color: '#0f5689', fontSize: '16px'}}>
                Discharge List
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
              dataSource={data} 
              loading={loading} 
              className="admit-patient-table"
          />
    </div>
  )
}

export default DischargeList