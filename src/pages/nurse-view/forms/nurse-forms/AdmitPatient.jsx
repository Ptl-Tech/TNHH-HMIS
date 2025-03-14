import { useLocation, useNavigate } from "react-router-dom";
import useSetTableCheckBoxHook from "../../../../hooks/useSetTableCheckBoxHook";
import { useGetWardManagementHook } from "../../../../hooks/useGetWardManagementHook";
import { useEffect, useState } from "react";
import NurseInnerHeader from "../../../../partials/nurse-partials/NurseInnerHeader";
import {
  Button,
  Card,
  Space,
  Typography,
  Row,
  Col,
  List,
  message,
  Form,
} from "antd";
import Loading from "../../../../partials/nurse-partials/Loading";
import FilterWardManagement from "../../../../partials/nurse-partials/FilterWardManagement";
import DisplayAlert from "../../../../partials/nurse-partials/DisplayAlert";
import WardManagementTable from "../../tables/nurse-tables/WardManagementTable";
import { BankOutlined, InsertRowLeftOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { postAdmissionFormDetailsSlice } from "../../../../actions/nurse-actions/postAdmissionFormDetailsSlice";
import {
  POST_ADMISSION_FORM_DETAILS_SUCCESS,
  POST_ADMISSION_FORM_DETAILS_FAILURE,
} from "../../../../actions/nurse-actions/postAdmissionFormDetailsSlice";

const AdmitPatientForm = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { patientDetails } = location.state || {};
  const { selectedRow, selectedRowKey, rowSelection } =
    useSetTableCheckBoxHook();
  const { getBeds, loadingWards, getWards, wardRooms } =
    useGetWardManagementHook();
    const patientNo = new URLSearchParams(location.search).get("PatientNo");


  const [selectedWard, setSelectedWard] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [filteredBeds, setFilteredBeds] = useState([]);
  const [loadingBeds, setLoadingBeds] = useState(false);
  const [alertType, setAlertType] = useState("info");
  const [alertMessage, setAlertMessage] = useState("");
  const [psychiatricCoding, setPsychiatricCoding] = useState(null);
  const [codingReason, setCodingReason] = useState(null);

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

  const handleOnFinish = async () => {
    //validate form fields
    form
      .validateFields()
      .then(() => {
        handleAssignBed();
      })
      .catch(() => {
        message.error("Please fill in all required fields");
      });
  };
  const handleAssignBed = async () => {
    if (!selectedRow[0]) {
      return message.warning("Please select bed to assign patient");
    }

    if (selectedRow[0]?.Occupied === true) {
      return message.warning(
        "Bed is already occupied, please select another bed"
      );
    }

    const formData = {
      myAction: "edit",
      recId: patientDetails?.SystemId,
      admissionNo: patientDetails?.Admission_No,
      wardRoom: selectedRow[0]?.Room_No,
      ward: selectedRow[0]?.WardNo,
      bed: selectedRow[0]?.BedNo,
      psychiatricCoding,
      codingReason,
      admissionType: "0",
    };

    try {
      const result = await dispatch(postAdmissionFormDetailsSlice(formData));
      if (result.type === POST_ADMISSION_FORM_DETAILS_SUCCESS) {
        message.success(
          result.payload.message ||
            "Ward, Room and Bed assigned successfully to patient"
        );
        navigate(`/Nurse/Inpatient`);
      } else if (result.type === POST_ADMISSION_FORM_DETAILS_FAILURE) {
        message.error(
          result.payload.message ||
            "Failed to assign ward, bed and room to patient"
        );
      }
    } catch (error) {
      message.error(
        error.message || "An internal error occurred, please try again"
      );
    }
  };

  const handleRoom = (room) => {
    setSelectedRoom(room);
  };

  return (
    <div>
      {alertMessage && (
        <DisplayAlert
          alertMessage={alertMessage}
          alertType={alertType}
          setAlertMessage={setAlertMessage}
        />
      )}

      <NurseInnerHeader
        title="Assign Ward, Room and Bed to Patient"
        icon={<BankOutlined />}
      />

      <Card className="admit-patient-card-container">
        <Space>
          <Button
            size="large"
            type="primary"
            disabled={!selectedRowKey}
            onClick={handleOnFinish}
          >
            <BankOutlined />
            Assign Bed
          </Button>
        </Space>
      </Card>

      <div
        style={{
          marginTop: "10px",
          paddingBottom: "10px",
          display: "flex",
          gap: "20px",
          alignItems: "center",
        }}
      >
        {selectedRoom && (
          <Typography.Text
            style={{ fontWeight: "bold", color: "#0f5689", fontSize: "14px" }}
          >
            Room Selected {selectedRoom ? `: ${selectedRoom}` : ""}
          </Typography.Text>
        )}
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
                    style={{ textAlign: "center", marginTop: "20px", marginBottom: "20px" }}
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

export default AdmitPatientForm;
