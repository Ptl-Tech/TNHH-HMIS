import { Card, Col, Row, Select, Typography, Button, Table, Space } from "antd"
import { hospitalBranchesTotalWards } from "../../constants/nurse-constants"
import { useNavigate } from "react-router-dom";
import { BankOutlined, CopyOutlined, AppstoreOutlined } from "@ant-design/icons"
import { useState } from "react";

const WardManagement = () => {

    const navigate = useNavigate();

    function handleWardClick(){
        
    }

    const [selectedRowKey, setSelectedRowKey] = useState(null);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [selectedRow, setSelectedRow] = useState([]);
    
    const dataSource = [
        {
            key: '1',
            roomName: 'Room 1',
            totalNoOfBeds: 10,
            bedsAvailable: 5,
            bedsOccupied: 3,
        },
        {
            key: '2',
            roomName: 'Room 2',
            totalNoOfBeds: 10,
            bedsAvailable: 5,
            bedsOccupied: 3,
        },
        {
            key: '3',
            roomName: 'Room 3',
            totalNoOfBeds: 10,
            bedsAvailable: 5,
            bedsOccupied: 3,
        },
    
    ];
    const columns = [
        {
            title: 'Room Name',
            dataIndex: 'roomName',
            key: 'roomName',
        },
        {
            title: 'Total No. of Beds',
            dataIndex: 'totalNoOfBeds',
            key: 'totalNoOfBeds',
        },
        {
            title: 'Beds Available',
            dataIndex: 'bedsAvailable',
            key: 'bedsAvailable',
        },
        {
            title: 'Beds Occupied',
            dataIndex: 'bedsOccupied',
            key: 'bedsOccupied',
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
      
      

      const handleReleaseBed = () => {
        selectedRow[0]?.key &&  navigate(`/Nurse/Ward-management/Release-Bed?WardNo=${selectedRow[0].key}`);
      }

      const handleBedTransfer = () => {
        selectedRow[0]?.key &&  navigate(`/Nurse/Ward-management/Transfer-Bed?WardNo=${selectedRow[0].key}`);
      }

      const handleAdmissionList = () => {
        navigate('/Nurse/Admit-patient');
      }


  return (
    <div>
        <Row style={{ margin: '20px 10px 10px 10px' }}>
            <Col span={24}>

                <Space style={{ color: '#0f5689', display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '10px'}}>
                    <BankOutlined />
                    <Typography.Text style={{ fontWeight: 'bold', color: '#0f5689', fontSize: '16px'}}>
                        Ward Management
                    </Typography.Text>
                </Space>

                <Card className="admit-patient-card-container">
                    <Space className="admit-patient-button-container">
                        <Button type="primary" onClick={handleAdmissionList}><CopyOutlined /> Admission List</Button>
                        <Button color="default" variant="outlined" disabled={!selectedRowKey} onClick={handleReleaseBed}> 
                            <BankOutlined /> 
                            Release Bed
                        </Button>
                        <Button type="primary" disabled={!selectedRowKey} onClick={handleBedTransfer}><AppstoreOutlined /> Bed Transfer</Button>
                    </Space>
                </Card>

                <Card style={{ padding: '24px 10px 10px 10px', marginTop: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <label htmlFor='selectWard'style={{ marginRight: '20px', fontWeight: 'bold'}}>Select Ward</label>
                        <Select 
                            options={hospitalBranchesTotalWards} 
                            showSearch
                            onChange={handleWardClick} 
                            placeholder="Search to Select ward"
                            optionFilterProp="label"
                            style={{ width: '300px' }}
                            filterSort={(optionA, optionB) =>
                            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                            }
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

    </div>
  )
}

export default WardManagement


