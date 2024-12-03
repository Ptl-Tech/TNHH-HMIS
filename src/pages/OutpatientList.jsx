import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { listPatients } from '../actions/patientActions';
import { listInsuranceOptions } from '../actions/DropdownListActions';
import {
  PlusOutlined,
  EyeOutlined,
  SendOutlined,
  FileAddOutlined,
  TeamOutlined,
  CheckSquareOutlined,
  UpOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { Button, Card, Col, Input, Row, Table, Tooltip, Typography } from 'antd';

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
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientId, setPatientId] = useState(null);
  const [dobError, setDobError] = useState(""); // State for DOB error message
  const [appointmentId, setAppointmentId] = useState(null);
  const [age, setAge] = useState(null); // State to hold calculated age
  const [isRowVisible, setIsRowVisible] = useState(true);

  useEffect(() => {
    dispatch(listPatients());
    dispatch(listInsuranceOptions());
  }, [dispatch]);


  useEffect(() => {
    if (patients.length) {
      handleFilterPatients();
    }
  }, [patients, searchParams]); // Re-run filtering on data or search params change

  const handleSearchChange = (e, field) => {
    const value = e.target.value;
    setSearchParams((prevState) => ({
      ...prevState,
      [field]: value,
    }));
    setShowList(true); // Show the list when typing starts
  };

  const handleFilterPatients = () => {
    const filtered = patients.filter((patient) => {
      return (
        patient.Names.toLowerCase().includes(
          searchParams.firstName.toLowerCase()
        ) &&
        patient.LastName.toLowerCase().includes(
          searchParams.lastName.toLowerCase()
        ) &&
        patient.IDNumber.includes(searchParams.patientId) &&
        patient.PatientNo.toString().includes(searchParams.patientNo)
      );
    });
    setFilteredPatients(filtered);
  };


  const columns = [
    {
      title: "Patient No",
      dataIndex: "PatientNo",
      key: "PatientNo",
      sorter: (a, b) => a.PatientNo - b.PatientNo,
    },
    {
      title: "First Name",
      dataIndex: "Names",
      key: "Names",
      sorter: (a, b) => a.Names.localeCompare(b.Names),
    },
    {
      title: "Last Name",
      dataIndex: "LastName",
      key: "LastName",
      sorter: (a, b) => a.LastName.localeCompare(b.LastName),
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
          <Tooltip title="Create Patient Visit"></Tooltip>
          <Button icon={<EyeOutlined />} onClick={() => showModal(record)}>
            View Details
          </Button>
        </div>
      ),
    },
  ];
  const handleselectedPatient = () => {
    navigate("/reception/Patient-Registration");
  };

  
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
              onSearch={handleFilterPatients} // Ensure Enter triggers filtering
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
      {
        showList && (
          <div className="mt-4">
            <Table
              columns={columns}
              dataSource={filteredPatients}
              pagination={{ pageSize: 10 }}
            />
          </div>
        )
      }
    </div>
  )
}

export default OutpatientList