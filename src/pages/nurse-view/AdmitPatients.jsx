import { Card, Col, Row, Space, Typography, Button, Input, Table } from "antd"
import { ProfileOutlined, PlusOutlined, CloseOutlined, PayCircleOutlined } from "@ant-design/icons"

const AdmitPatients = () => {


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

    const rowSelection = () =>{
        return {
            onChange: (selectedRowKeys, selectedRows) => {
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            },
            getCheckboxProps: (record) => ({
                disabled: record.name === 'Disabled User', // Column configuration not to be checked
                name: record.name,
            }),
        };
    }

  return (
        <Row style={{ margin: '20px 10px 10px 10px' }}>
            <Col span={24}>
                <Space style={{ color: '#0f5689', display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '10px'}}>
                    <ProfileOutlined />
                    <Typography.Text style={{ fontWeight: 'bold', color: '#0f5689', fontSize: '16px'}}>
                        Patient Admissions
                    </Typography.Text>
                </Space>
                    
                <Card className="admit-patient-card-container">
                    <Space className="admit-patient-button-container">
                        <Button type="primary"><PlusOutlined /> Admit Patient</Button>
                        <Button color="danger" variant="outlined" ><CloseOutlined /> Cancel Admission</Button>
                        <Button type="primary"><PayCircleOutlined /> Charges</Button>
                    </Space>

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
                    rowSelection={rowSelection}
                />
    
            </Col>
        </Row>
  )
}

export default AdmitPatients