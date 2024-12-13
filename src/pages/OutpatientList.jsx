import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  createTriageVisit,
  listPatients,
  postTriageVisit,
} from "../actions/patientActions";
import {
  listClinics,
  listDoctors,
  listInsuranceOptions,
} from "../actions/DropdownListActions";
import {
  PlusOutlined,
  EyeOutlined,
  TeamOutlined,
  EditOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Input,
  Row,
  Table,
  Tooltip,
  Typography,
  Modal,
  Form,
  Select,
  message,
} from "antd";
import moment from "moment";
import dayjs from "dayjs";

const { Search } = Input;

const OutpatientList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, patients } = useSelector(
    (state) => state.patientList
  );

  const [searchParams, setSearchParams] = useState({
    firstName: "",
    lastName: "",
    patientId: "",
    patientNo: "",
  });

  const [showList, setShowList] = useState(false);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [isVisitCreated, setIsVisitCreated] = useState(false);
  const currentDate = dayjs().format("YYYY-MM-DD");

  const [form] = Form.useForm();
  useEffect(() => {
    // Filter only "Cash" patients and those with isActivated: true
    const filteredPatients = patients.filter(
      (patient) => patient.Inpatient === false
    );
    setFilteredPatients(filteredPatients);
  }, [patients]);

  const handleSearchChange = (e, field) => {
    const value = e.target.value;
    setSearchParams((prevState) => ({
      ...prevState,
      [field]: value,
    }));
    setShowList(true);
  };

  const handleFilterPatients = () => {
    const filtered = patients.filter((patient) => {
      return (
        patient.Names.toLowerCase().includes(searchParams.firstName.toLowerCase()) &&
        patient.LastName.toLowerCase().includes(searchParams.lastName.toLowerCase()) &&
        patient.IDNumber.includes(searchParams.patientId) &&
        patient.PatientNo.toString().includes(searchParams.patientNo)
      );
    });
    setFilteredPatients(filtered);
  };
  
  const handleselectedPatient = () => {
    if(record.Activated) {
      navigate("/reception/Patient-Registration");
    }else{
      navigate(`/reception/Patient-Registration/${record.PatientNo}`);
    }

  };

  const columns = [
    {
      title: "Patient No",
      dataIndex: "PatientNo",
      key: "PatientNo",
      sorter: (a, b) => a.PatientNo - b.PatientNo,
    },
    {
      title: "Patient Name",
      dataIndex: "SearchName",
      key: "SearchName",
      sorter: (a, b) => a.Names.localeCompare(b.SearchName),
    },
    { title: "Gender", dataIndex: "Gender", key: "Gender" },
    { title: "Patient Type", dataIndex: "PatientType", key: "PatientType" },
    { title: "ID Number", dataIndex: "IDNumber", key: "IDNumber" },
    {
      title: "Date Registered",
      dataIndex: "DateRegistered",
      key: "DateRegistered",
      render: (text) => new Date(text).toLocaleDateString(),
      sorter: (a, b) => new Date(a.DateRegistered) - new Date(b.DateRegistered),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "8px" }}>
          {record.Activated ? (
            // If the patient is active, show "View Details"
            <Tooltip title="View Details">
              <Button
                icon={<EyeOutlined />}
                onClick={() =>
                  navigate("/reception/Patient-Registration", {
                    state: { patientDet: record }, // Correctly passing the patient record
                  })
                }
              >
                View Details
              </Button>
            </Tooltip>
          ) : (
            // If the patient is not active, show "Create Visit"
            <Tooltip title="Create Visit">
              <Button
                icon={<PlusOutlined />}
                onClick={() =>
                  // Handle creating a visit for this patient
                  navigate(`/reception/Add-Appointment/${record.PatientNo}`, {
                    state: { patientDet: record }, // Pass patient data to the create visit page
                  })
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
        Patient List
      </h4>
      <div className="d-flex justify-content-between">
        <Button
          type="primary"
          onClick={handleselectedPatient}
          style={{ marginBottom: "20px" }}
        >
          Register New Patient
        </Button>
        {/* <Button style={{ marginBottom: "20px" }} type="primary">
          <FileAddOutlined />
          Admit Patient
        </Button> */}
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
              placeholder="First Name"
              value={searchParams.firstName}
              onChange={(e) => handleSearchChange(e, "firstName")}
              allowClear
            />
          </Col>
          <Col span={6}>
            <Input
              placeholder="Last Name"
              value={searchParams.lastName}
              onChange={(e) => handleSearchChange(e, "lastName")}
              allowClear
            />
          </Col>
          <Col span={6}>
            <Search
              placeholder="Patient ID"
              value={searchParams.patientId}
              onChange={(e) => handleSearchChange(e, "patientId")}
              allowClear
              onSearch={handleFilterPatients}
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
          <Table
            columns={columns}
            dataSource={filteredPatients}
            pagination={{ pageSize: 10 }}
          />
        </div>
      )}
    </div>
  );
};

export default OutpatientList;
