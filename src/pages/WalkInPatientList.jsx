import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PlusOutlined, EyeOutlined, TeamOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Input,
  Row,
  Space,
  Table,
  Tooltip,
  Typography,
} from "antd";
import moment from "moment";
import dayjs from "dayjs";
import useSetTableCheckBoxHook from "../hooks/useSetTableCheckBoxHook";
import { listPatients } from "../actions/patientActions";

const WalkInPatientList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { patients } = useSelector((state) => state.patientList);
  const { selectedRow, selectedRowKey, rowSelection } = useSetTableCheckBoxHook();

  const [searchParams, setSearchParams] = useState({
    SearchName: "",
    patientId: "",
    patientNo: "",
  });
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    dispatch(listPatients());
  }, [dispatch]);

  // Initial filtering: show only non-inpatients whose PatientNo starts with "WLK_"
  useEffect(() => {
    if (patients.length > 0) {
      setFilteredPatients(
        patients.filter(
          (patient) =>
            !patient.Inpatient && patient.PatientNo.startsWith("WLK_")
        )
      );
    }
  }, [patients]);

  const handleSearchChange = (e, field) => {
    const value = e.target.value;
    setSearchParams((prevState) => ({
      ...prevState,
      [field]: value,
    }));
    setShowList(true);
    filterPatients({ ...searchParams, [field]: value });
  };

  // This filtering always enforces that only walk-in patients (WLK_ prefix) are returned.
  const filterPatients = (params) => {
    const { SearchName, patientId, patientNo } = params;
    const filtered = patients.filter((patient) => {
      return (
        !patient.Inpatient &&
        patient.PatientNo.startsWith("WLK_") && // Always include only walk-in patients
        patient.SearchName.toLowerCase().includes(SearchName.toLowerCase()) &&
        patient.IDNumber.includes(patientId) &&
        patient.PatientNo.includes(patientNo)
      );
    });
    setFilteredPatients(filtered);
  };

  const handleDispatch = () => {
    // Implement dispatch functionality as needed.
  };

  const columns = [
    {
      title: "Patient No",
      dataIndex: "PatientNo",
      key: "PatientNo",
      sorter: (a, b) => a.PatientNo.localeCompare(b.PatientNo),
    },
    {
      title: "Patient Name",
      dataIndex: "SearchName",
      key: "SearchName",
      sorter: (a, b) => a.SearchName.localeCompare(b.SearchName),
    },
    { title: "Gender", dataIndex: "Gender", key: "Gender" },
    { title: "Patient Type", dataIndex: "PatientType", key: "PatientType" },
    { title: "ID Number", dataIndex: "IDNumber", key: "IDNumber" },
    {
      title: "Date Registered",
      dataIndex: "DateRegistered",
      key: "DateRegistered",
      render: (text) => new Date(text).toLocaleDateString(),
      sorter: (a, b) =>
        new Date(a.DateRegistered) - new Date(b.DateRegistered),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "8px" }}>
          {record.Activated ? (
            <Tooltip title="View Details">
              <Button
                icon={<EyeOutlined />}
                onClick={() =>
                  navigate("/reception/Register-walkin", {
                    state: { patientDet: record },
                  })
                }
              >
                View Details
              </Button>
            </Tooltip>
          ) : (
            <Tooltip title="Create Visit">
              <Button
                icon={<PlusOutlined />}
                onClick={() =>
                  navigate(
                    `/reception/Add-Appointment/Patient?PatientNo=${record.PatientNo}`,
                    {
                      state: {
                        existingPatient: record,
                        previousPath: location.pathname,
                      },
                    }
                  )
                }
              >
                Create Visit
              </Button>
            </Tooltip>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <h4 className="text-center p-3 text-dark">
        <TeamOutlined style={{ marginRight: "8px", fontSize: "24px" }} />
        Walk-in Patient List
      </h4>
      <div className="d-flex justify-content-between">
        <Button
          type="primary"
          onClick={() => navigate("/reception/Register-walkin")}
          style={{ marginBottom: "20px" }}
        >
          Register New Walk-in Patient
        </Button>
      </div>
      <Card className="card-header mb-4 mt-4 p-4">
        <Typography.Text
          style={{
            color: "#003F6D",
            fontWeight: "bold",
            marginBottom: "16px",
          }}
        >
          Find Patient Details by:
        </Typography.Text>
        <Row gutter={16} className="mt-2">
          <Col span={6}>
            <Input
              placeholder="Patient Name"
              value={searchParams.SearchName}
              onChange={(e) => handleSearchChange(e, "SearchName")}
              allowClear
            />
          </Col>
          <Col span={6}>
            <Input
              placeholder="Patient ID"
              value={searchParams.patientId}
              onChange={(e) => handleSearchChange(e, "patientId")}
              allowClear
            />
          </Col>
          <Col span={6}>
            <Input
              placeholder="Patient No"
              value={searchParams.patientNo}
              onChange={(e) => handleSearchChange(e, "patientNo")}
              allowClear
            />
          </Col>
        </Row>
      </Card>
      {showList && (
        <div className="mt-4">
          <Space
            className="admit-patient-button-container"
            style={{ marginBottom: 16 }}
          >
            <Button
              type="primary"
              disabled={!selectedRowKey}
              onClick={handleDispatch}
            >
              <PlusOutlined /> Dispatch to Pharmacy
            </Button>
            <Button
              type="primary"
              disabled={!selectedRowKey}
              onClick={handleDispatch}
            >
              <PlusOutlined /> Dispatch to Lab
            </Button>
            <Button
              type="primary"
              disabled={!selectedRowKey}
              onClick={handleDispatch}
            >
              <PlusOutlined /> Dispatch to Radiology
            </Button>
          </Space>
          <Table
            rowKey="PatientNo"
            columns={columns}
            rowSelection={rowSelection}
            dataSource={filteredPatients}
            pagination={{ pageSize: 10 }}
          />
        </div>
      )}
    </div>
  );
};

export default WalkInPatientList;
