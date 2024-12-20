import { Card, Col, Row, Space, Typography, Button, Table } from "antd"
import { ProfileOutlined, PlusOutlined, CloseOutlined, PayCircleOutlined, PrinterOutlined, FileExclamationOutlined } from "@ant-design/icons"
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchFilters from "./SearchFilters";
import { useSelector } from "react-redux";
import { exportToExcel, printToPDF } from "../../utils/helpers";


const AdmitPatients = () => {

    const [selectedRowKey, setSelectedRowKey] = useState(null);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [selectedRow, setSelectedRow] = useState([]);
    const navigate = useNavigate();
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

    const rowSelection = {
        selectedRowKeys: selectedRowKey ? [selectedRowKey] : [], // Controlled selection
        onChange: (selectedRowKeys, selectedRows) => {
          if (selectedRowKeys.length > 1) {
            setSelectedRowKey(selectedRowKeys[selectedRowKeys.length - 1]); // Keep the most recently selected row
            setSelectedRow([selectedRows[selectedRows.length - 1]]); // Update the selected row
          } else {
            setSelectedRowKey(selectedRowKeys[0]); // Update the selected row key
            setSelectedRow(selectedRows); // Update the selected row
          }
          setIsButtonDisabled(selectedRowKeys.length === 0); // Enable or disable buttons
        },
        getCheckboxProps: (record) => ({
          disabled: record.name === 'Disabled User', // Disable specific rows if needed
        }),
      };
      
      

      const handleAdmitPatient = () => {
        selectedRow[0]?.patientNo &&  navigate(`/Nurse/Admit-patient/Patient?PatientNo=${selectedRow[0].patientNo}`);
      }

      const handlePatientCharges = () => {
        selectedRow[0]?.patientNo &&  navigate(`/Nurse/Admit-patient/Charges?PatientNo=${selectedRow[0].patientNo}`);
      }


      const { loading, error, patients } = useSelector(
        (state) => state.patientList
      );


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
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Space className="admit-patient-button-container">
                            <Button type="primary" disabled={!selectedRowKey} onClick={handleAdmitPatient}><PlusOutlined /> Admit Patient</Button>
                            <Button color="danger" variant="outlined" disabled={!selectedRowKey}><CloseOutlined /> Cancel Admission</Button>
                            <Button type="primary" disabled={!selectedRowKey} onClick={handlePatientCharges}><PayCircleOutlined /> Charges</Button>
                        </Space>
                        <Space className="admit-patient-button-container">
                            <Button type="primary" onClick={()=>exportToExcel(dataSource, 'Admission request success list', 'admission-request-success-list.xlsx')}><FileExclamationOutlined /> Export Excel</Button>
                            <Button type="primary" onClick={()=>printToPDF(dataSource, 'Admission request success list')}><PrinterOutlined /> Print PDF</Button>
                        </Space>
                    </div>
                </Card>

               <SearchFilters />

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