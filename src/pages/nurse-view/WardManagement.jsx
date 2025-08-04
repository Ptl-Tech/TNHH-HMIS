import {
  Card,
  Col,
  Row,
  Typography,
  Button,
  Space,
  List,
  message,
  Modal,
  Table,
} from "antd";
import { useNavigate } from "react-router-dom";
import { BankOutlined, AppstoreOutlined } from "@ant-design/icons";
import useSetTableCheckBoxHook from "../../hooks/useSetTableCheckBoxHook";
import WardManagementTable from "./tables/nurse-tables/WardManagementTable";
import { useGetWardManagementHook } from "../../hooks/useGetWardManagementHook";
import { useEffect, useState } from "react";
import Loading from "../../partials/nurse-partials/Loading";
import DisplayAlert from "../../partials/nurse-partials/DisplayAlert";
import NurseInnerHeader from "../../partials/nurse-partials/NurseInnerHeader";
import FilterWardManagement from "../../partials/nurse-partials/FilterWardManagement";
import { InsertRowLeftOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { getPgAdmissionsAdmittedSlice } from "../../actions/nurse-actions/getPgAdmissionsAdmittedSlice";
import { POST_RELEASE_BED_FAILURE, POST_RELEASE_BED_SUCCESS, postReleaseBedSlice } from "../../actions/nurse-actions/postReleaseBedSlice";

const WardManagement = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const patientNo = queryParams.get("PatientNo");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loadingAdmittedPatients, admittedPatients } =
    useSelector((state) => state.getPgAdmissionsAdmitted) || {};

  const { selectedRow, selectedRowKey, rowSelection } =
    useSetTableCheckBoxHook();
  const { getBeds, loadingWards, getWards, wardRooms } =
    useGetWardManagementHook();
  const { confirm } = Modal;
  const [selectedWard, setSelectedWard] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [filteredBeds, setFilteredBeds] = useState([]);
  const [loadingBeds, setLoadingBeds] = useState(false);
  const [alertType, setAlertType] = useState("info");
  const [alertMessage, setAlertMessage] = useState("");
  

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
        setFilteredBeds(getBeds.filter((bed) => bed.Room_No === selectedRoom));
        setLoadingBeds(false);
      }, 200);
      return () => clearTimeout(timeout); // Cleanup timeout on ward change
    } else {
      setFilteredBeds([]); // Clear rooms if no ward selected
    }
  }, [selectedRoom, getBeds]);

  const filterPatientBed = admittedPatients.filter(
    (patient) =>
      patient?.Bed === selectedRow[0]?.BedNo &&
      patient?.Ward_Room === selectedRow[0]?.Room_No &&
      patient?.Ward === selectedRow[0]?.WardNo
  );

  function handleWardChange(value) {
    setSelectedWard(value);
  }
  const handleReleaseBedAction = async () => {
    if (selectedRow[0]?.Occupied == false) {
      return message.info("This bed is already empty");
    }

    if(!filterPatientBed?.Admission_No){
      return message.info("Patient not admitted in this bed")
    }

    try{
      const result = await dispatch(postReleaseBedSlice(filterPatientBed?.Admission_No));
      if(result.type === POST_RELEASE_BED_SUCCESS){
        message.success(result.payload.message || "Bed released successfully");
        dispatch(getPgAdmissionsAdmittedSlice());
        return Promise.resolve();
      }else if(result.type === POST_RELEASE_BED_FAILURE){
        message.error(result.payload.message || "Failed to release bed");
        return Promise.reject();
      }
    }catch(error){
      message.error(error.message || "An error occurred");
    }
  };

  const handleReleaseBed = async () => {

    confirm({
      title: `Please confirm before leasing bed ${selectedRow[0]?.BedNo}`,
      content: (
        <div>
          <Typography.Text>
            {`Patient Information Admitted in Bed ${selectedRow[0]?.BedNo}`}
          </Typography.Text>
          <Table
            dataSource={filterPatientBed}
            columns={[
              {
                title: "Patient No",
                dataIndex: "Patient_No",
                key: "Patient_No",
              },
              {
                title: "Patient Name",
                dataIndex: "PatientName",
                key: "PatientName",
              },
            ]}
            style={{ marginTop: "15px" }}
            pagination={false}
            bordered
            rowKey="PatientNo"
            loading={loadingAdmittedPatients}
            size={"small"}
          />
        </div>
      ),
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        return new Promise((resolve, reject) => {
          handleReleaseBedAction()
            .then(resolve) // Resolve the modal when successful
            .catch(reject); // Reject on failure
        });
      },
    });
  };

  const handleBedTransfer = () => {
    if (selectedRow[0]?.Occupied == false) {
      setAlertMessage("This bed is already free");
      setAlertType("info");
      return;
    } else {
      selectedRow[0] &&
        navigate(
          `/Dashboard/Ward-management/Transfer-Bed?WardNo=${selectedRow[0].key}`
        );
      setAlertMessage("");
    }
  };

  const handleRoom = (room) => {
    setSelectedRoom(room);
  };

  useEffect(() => {
    dispatch(getPgAdmissionsAdmittedSlice());
  }, [dispatch]);

  return (
    <div>
      {alertMessage && (
        <DisplayAlert
          alertMessage={alertMessage}
          alertType={alertType}
          setAlertMessage={setAlertMessage}
        />
      )}

      <NurseInnerHeader title="Ward Management" icon={<AppstoreOutlined />} />

      <Card className="admit-patient-card-container">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Space>
            <Button
              color="default"
              variant="outlined"
              disabled={!selectedRowKey}
              onClick={handleReleaseBed}
              size="large"
            >
              <BankOutlined />
              Release Bed
            </Button>
            <Button
              type="primary"
              disabled={!selectedRowKey}
              onClick={handleBedTransfer}
              size="large"
            >
              <AppstoreOutlined /> Bed Transfer
            </Button>
          </Space>

          <Space>
            <Button
              type="primary"
              size="large"
              onClick={() => navigate("/Dashboard/Ward-management/Bed-occupancy")}
            >
              Bed Occupancy
            </Button>
          </Space>
        </div>
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
        {getBeds && (
          <Typography.Text
            style={{ fontWeight: "bold", color: "#0f5689", fontSize: "14px" }}
          >
            Total Beds {getBeds ? `: ${getBeds?.length}` : ""}
          </Typography.Text>
        )}
        {getBeds && (
          <Typography.Text
            style={{ fontWeight: "bold", color: "#0f5689", fontSize: "14px" }}
          >
            Free Beds {freeBeds ? `: ${freeBeds?.length}` : ""}
          </Typography.Text>
        )}
        {getBeds && (
          <Typography.Text
            style={{ fontWeight: "bold", color: "#f50", fontSize: "14px" }}
          >
            Bed Occupied {occupiedBeds ? `: ${occupiedBeds?.length}` : ""}
          </Typography.Text>
        )}
        {selectedRoom && (
          <Typography.Text
            style={{ fontWeight: "bold", color: "#0f5689", fontSize: "14px" }}
          >
            Room Selected {selectedRoom ? `: ${selectedRoom}` : ""}
          </Typography.Text>
        )}
      </div>

      <FilterWardManagement
        getWards={getWards}
        handleWardChange={handleWardChange}
        loadingWards={loadingWards}
        patientNo={patientNo}
      />

      <Row gutter={16} style={{ marginTop: "20px", overflowX: "hidden" }}>
        <Col span={8}>
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
                      Please select ward to show rooms
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
        <Col span={16} style={{ overflowX: "hidden" }}>
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

export default WardManagement;
``