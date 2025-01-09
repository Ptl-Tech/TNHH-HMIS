import { Card, Col, Row, Select, Typography, Button, Space, List } from "antd"
import { useNavigate } from "react-router-dom";
import { BankOutlined, AppstoreOutlined } from "@ant-design/icons"
import useSetTableCheckBoxHook  from "../../hooks/useSetTableCheckBoxHook";
import WardManagementTable from "./tables/nurse-tables/WardManagementTable";
import { useGetWardManagementHook } from "../../hooks/useGetWardManagementHook";
import { useEffect, useState } from "react";
import Loading from "../../partials/nurse-partials/Loading";
import DisplayAlert from "../../partials/nurse-partials/DisplayAlert";
import NurseInnerHeader from "../../partials/nurse-partials/NurseInnerHeader";
import FilterWardManagement from "../../partials/nurse-partials/FilterWardManagement";

const WardManagement = () => {

    
    const navigate = useNavigate();
    const { selectedRow, selectedRowKey, rowSelection } = useSetTableCheckBoxHook();
    const {getBeds, loadingWards, getWards, wardRooms } = useGetWardManagementHook();

    const [ selectedWard, setSelectedWard] = useState(null);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [filteredRooms, setFilteredRooms] = useState([]);
    const [loadingRooms, setLoadingRooms] = useState(false);
    const [filteredBeds, setFilteredBeds] = useState([]);
    const [loadingBeds, setLoadingBeds] = useState(false);
    const [alertType, setAlertType] = useState('info');
    const [alertMessage, setAlertMessage] = useState('');

    const freeBeds = getBeds.filter((bed) => bed.Occupied === false);
    const occupiedBeds = getBeds.filter((bed) => bed.Occupied === true);

    useEffect(() => {
        if (selectedWard) {
          setLoadingRooms(true); 
          setFilteredBeds([]);
          const timeout = setTimeout(() => {
            setFilteredRooms(
              wardRooms.filter((room) => room.Ward_No === selectedWard)
            );
            setLoadingRooms(false); 
          }, 200); 
          return () => clearTimeout(timeout); // Cleanup timeout on ward change
        } else {
          setFilteredRooms([]); // Clear rooms if no ward selected
        }
      }, [selectedWard, wardRooms]);

      useEffect(() => {
        if (selectedRoom) {
            setLoadingBeds(true); 
          const timeout = setTimeout(() => {
            setFilteredBeds(
                getBeds.filter((bed) => bed.Room_No === selectedRoom)
            );
            setLoadingBeds(false); 
          }, 200); 
          return () => clearTimeout(timeout); // Cleanup timeout on ward change
        } else {
          setFilteredBeds([]); // Clear rooms if no ward selected
        }
      }, [selectedRoom, getBeds]);

    function handleWardChange(value){
        setSelectedWard(value)
    }
      const handleReleaseBed = () => {
        if (selectedRow[0]?.Occupied == false){
            setAlertMessage('This bed is already free');
            setAlertType('info');
            return;
        }else{
            selectedRow[0] &&  navigate(`/Nurse/Ward-management/Release-Bed?WardNo=${selectedRow[0].key}`);
            setAlertMessage('');
        }
      }

      const handleBedTransfer = () => {
        if(selectedRow[0]?.Occupied == false){
            setAlertMessage('This bed is already free');
            setAlertType('info');
            return;
        }else{
            selectedRow[0] &&  navigate(`/Nurse/Ward-management/Transfer-Bed?WardNo=${selectedRow[0].key}`);
            setAlertMessage('');
        }
      }

     const handleRoom = (room) => {
       setSelectedRoom(room)
      }

      

  return (
    <div>
        {
        alertMessage && (
            <DisplayAlert alertMessage={alertMessage} alertType={alertType} setAlertMessage={setAlertMessage}/>
        )
        
        }

        <NurseInnerHeader title="Ward Management" />

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

        <div style={{ marginTop: '10px', paddingBottom: '10px', display: 'flex', gap: '20px', alignItems: 'center' }}>
            {
                getBeds && (
                    <Typography.Text style={{ fontWeight: 'bold', color: '#0f5689', fontSize: '14px'}}>
                        Total Beds { getBeds ? `: ${getBeds?.length}` : ''}
                    </Typography.Text>
                )
            }
            {
                getBeds && (
                    <Typography.Text style={{ fontWeight: 'bold', color: '#0f5689', fontSize: '14px'}}>
                        Free Beds { freeBeds ? `: ${freeBeds?.length}` : ''}
                    </Typography.Text>
                )
            }
            {
                getBeds && (
                    <Typography.Text style={{ fontWeight: 'bold', color: '#f50', fontSize: '14px'}}>
                        Bed Occupied { occupiedBeds ? `: ${occupiedBeds?.length}` : ''}
                    </Typography.Text>
                )
            }
            {
                selectedRoom && (
                    <Typography.Text style={{ fontWeight: 'bold', color: '#0f5689', fontSize: '14px'}}>
                        Room Selected { selectedRoom ? `: ${selectedRoom}` : ''}
                    </Typography.Text>
                )
            }

        </div>
        
        <FilterWardManagement getWards={getWards} handleWardChange={handleWardChange} loadingWards={loadingWards}/>

        <Row gutter={16} style={{ marginTop: '20px', overflowX: 'hidden' }}>
            <Col  span={8}>
            
            {
                loadingRooms ? (
                    <Loading />
                ): (
                    <List
                    style={{ cursor: 'pointer' }}
                    dataSource={filteredRooms.map((room) => ({
                    value: room.Room_No, // The unique identifier for the room
                    label: room.Room_Name, // The display name for the room
                    }))}
                    renderItem={(item) => (
                    <List.Item onClick={() => handleRoom(item.value)} style={{ color:  '#0f5689' }}>
                    {item.label}
                    </List.Item>
                    )}
                    bordered
                    />
                )
            }    
            </Col>
            <Col  span={16} style={{ overflowX: 'hidden' }}>
                <WardManagementTable rowSelection={rowSelection} filteredBeds={filteredBeds} loadingBeds={loadingBeds} />
            </Col>
        </Row>         
    </div>
  )
}

export default WardManagement


