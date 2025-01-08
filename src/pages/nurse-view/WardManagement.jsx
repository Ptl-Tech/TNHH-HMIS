import { Card, Col, Row, Select, Typography, Button, Table, Space, List, Tag } from "antd"
import { hospitalBranchesTotalWards } from "../../constants/nurse-constants"
import { useNavigate } from "react-router-dom";
import { BankOutlined, AppstoreOutlined } from "@ant-design/icons"
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
            bedName: 'Bed 1',
            bedNumber: 10,
            roomName: 5,
            status: 'occupied',
        },
        {
            key: '2',
            bedName: 'Bed 2',
            bedNumber: 10,
            roomName: 5,
            status: 'free bed',
        },
        {
            key: '3',
            bedName: 'Bed 3',
            bedNumber: 10,
            roomName: 5,
            status: 'occupied',
        },
    
    ];
    const columns = [
        {
            title: 'Bed Name',
            dataIndex: 'bedName',
            key: 'bedName',
        },
        {
            title: 'Bed Number',
            dataIndex: 'bedNumber',
            key: 'bedNumber',
        },
        {
            title: 'Room Number',
            dataIndex: 'roomName',
            key: 'roomName',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (text) => {
                if (text === 'occupied') {
                  return <Tag color="#f50">{text}</Tag>;
                } else if (text === 'free bed') {
                  return <Tag color="#108ee9">{text}</Tag>;
                }
                return text; 
              }          
            
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

     const handleRoom = (item) => {
       console.log("Room Clicked", item);
      }

  return (
    <div>
        <Space style={{ color: '#0f5689', display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '10px'}}>
            <BankOutlined />
            <Typography.Text style={{ fontWeight: 'bold', color: '#0f5689', fontSize: '16px'}}>
                Ward Management
            </Typography.Text>
        </Space>

        <Card className="admit-patient-card-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Space>
                    <Button color="default" variant="outlined" disabled={!selectedRowKey} onClick={handleReleaseBed}> 
                        <BankOutlined /> 
                        Release Bed
                    </Button>
                    <Button type="primary" disabled={!selectedRowKey} onClick={handleBedTransfer}><AppstoreOutlined /> Bed Transfer</Button>
                </Space>
            
                <Space>
                    <Button type="primary" onClick={() => navigate('/Nurse/Ward-management/Bed-occupancy')}>
                        Bed Occupancy
                    </Button>
                </Space>
            </div>
        </Card>

        <Card style={{ padding: '24px 10px 10px 10px', marginTop: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <label htmlFor='selectWard'style={{ marginRight: '20px', fontWeight: 'bold'}}>Search to Select Ward</label>
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

        <Row gutter={16} style={{ marginTop: '20px', overflowX: 'hidden' }}>
            <Col  span={8}>
                
                <List
                    style={{ cursor: 'pointer',  }}
                    dataSource={['Item 1', 'Item 2', 'Item 3']}
                    renderItem={(item) => 
                    <List.Item onClick={()=> handleRoom(item)}>
                        {item}
                    </List.Item>}
                    bordered
                />
                
            </Col>
            <Col  span={16} style={{ overflowX: 'hidden' }}>
                <Table 
                    columns={columns} 
                    dataSource={dataSource} 
                    rowSelection={rowSelection}
                />  
            </Col>
        </Row>         
    </div>
  )
}

export default WardManagement


