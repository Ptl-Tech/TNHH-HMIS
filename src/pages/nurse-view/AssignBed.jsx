import { useLocation } from "react-router-dom";
import { useGetWardManagementHook } from "../../hooks/useGetWardManagementHook";
import { useEffect, useState } from "react";
import { Space, Typography, Row, Col, List } from "antd";
import Loading from "../../partials/nurse-partials/Loading";
import FilterWardManagement from "../../partials/nurse-partials/FilterWardManagement";
import WardManagementTable from "./tables/nurse-tables/WardManagementTable";
import { InsertRowLeftOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";

const AssignBed = ({
  rowSelection,
  handleOnFinish,
  form,
  setPsychiatricCoding,
  setCodingReason,
}) => {
  const location = useLocation();
  const { getBeds, loadingWards, getWards, wardRooms } =
    useGetWardManagementHook();
  const patientNo = new URLSearchParams(location.search).get("PatientNo");

  const [selectedWard, setSelectedWard] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [filteredBeds, setFilteredBeds] = useState([]);
  const [loadingBeds, setLoadingBeds] = useState(false);

  const psychiatricCodingOptions = [
    { label: "Red", value: 1 },
    { label: "Amber", value: 2 },
    { label: "Yellow", value: 3 },
    { label: "Green", value: 4 },
  ];

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
        setFilteredBeds(getBeds.filter((bed) => bed.Room_No === selectedRoom));
        setLoadingBeds(false);
      }, 200);
      return () => clearTimeout(timeout); // Cleanup timeout on ward change
    } else {
      setFilteredBeds([]); // Clear rooms if no ward selected
    }
  }, [selectedRoom, getBeds]);

  function handleWardChange(value) {
    setSelectedWard(value);
  }

  const handleRoom = (room) => {
    setSelectedRoom(room);
  };

  return (
    <div>
      <div
        style={{
          marginTop: "10px",
          paddingBottom: "10px",
          display: "flex",
          gap: "20px",
          alignItems: "center",
        }}
      >
      </div>

      <FilterWardManagement
        setPsychiatricCoding={setPsychiatricCoding}
        setCodingReason={setCodingReason}
        psychiatricCodingOptions={psychiatricCodingOptions}
        getWards={getWards}
        handleWardChange={handleWardChange}
        loadingWards={loadingWards}
        form={form}
        handleOnFinish={handleOnFinish}
        patientNo={patientNo}
      />

      <Row gutter={[16, 16]} style={{ marginTop: "20px", overflowX: "hidden" }}>
        <Col xs={24} md={24} lg={8}>
        {
            selectedRoom ? (
                <Typography.Title level={5} style={{ paddingBottom: '10px' }}>Ward Room Selected - {selectedRoom}</Typography.Title>
            ) : (
                <Typography.Title level={5} style={{ paddingBottom: '10px' }}>Ward Rooms</Typography.Title>
            )
        }
         
          {loadingRooms ? (
            <Loading />
          ) : (
            <List
              style={{ cursor: "pointer" }}
              dataSource={filteredRooms.map((room) => ({
                value: room.Room_No, // The unique identifier for the room
                label: room.Room_Name, // The display name for the room
              }))}
              locale={{
                emptyText: (
                  <Space
                    direction="vertical"
                    size={2} // Adjust vertical spacing between items
                    style={{
                      textAlign: "center",
                      marginTop: "20px",
                      marginBottom: "20px",
                    }}
                  >
                    <InsertRowLeftOutlined
                      style={{
                        fontSize: 48,
                        color: "#0f5689",
                        marginBottom: 20,
                        fontWeight: "normal",
                      }}
                    />
                    <Typography.Text type="secondary" style={{ fontSize: 16 }}>
                      Please select ward.
                    </Typography.Text>
                  </Space>
                ),
              }}
              renderItem={(item) => (
                <List.Item
                  onClick={() => handleRoom(item.value)}
                  style={{ color: "#0f5689" }}
                >
                  {item.label}
                </List.Item>
              )}
              bordered
            />
          )}
        </Col>
        <Col xs={24} md={24} lg={16} style={{ overflowX: "hidden" }}>
          <Typography.Title level={5} style={{ paddingBottom: '10px' }}>Room Beds</Typography.Title>
          <WardManagementTable
            rowSelection={rowSelection}
            filteredBeds={filteredBeds}
            loadingBeds={loadingBeds}
          />
        </Col>
      </Row>
    </div>
  );
};

export default AssignBed;
// props validation
AssignBed.propTypes = {
  rowSelection: PropTypes.object,
  handleOnFinish: PropTypes.func,
  form: PropTypes.object,
  setPsychiatricCoding: PropTypes.string,
  setCodingReason: PropTypes.string,
};
