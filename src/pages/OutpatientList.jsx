import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listPatients } from "../actions/patientActions";
import { Table, Button, Input, Pagination, Modal, Tooltip, Radio } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import {
  PlusOutlined,
  EyeOutlined,
  SendOutlined,
  FileAddOutlined,
  TeamOutlined,
} from "@ant-design/icons";

const { Search } = Input;

const OutpatientList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, patients } = useSelector(
    (state) => state.patientList
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [searchCriterion, setSearchCriterion] = useState("IDNumber"); // Default search criterion
  const [showList, setShowList] = useState(false); // Initially hide the patient list
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

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
          <Tooltip title="Create Patient Visit">
            <Button
              icon={<SendOutlined />}
              onClick={() => handleDispatch(record)}
            >
              Create Visit
            </Button>
          </Tooltip>

          <Button icon={<EyeOutlined />} onClick={() => showModal(record)}>
            View Details
          </Button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    dispatch(listPatients());
  }, [dispatch]);

  const handleSearch = (value) => {
    setSearchQuery(value);
    setShowList(true); // Show the list once a search is performed
  };

  const handleDispatch = (record) => {
    navigate(`/reception/create-visit/${record.PatientNo}`, { state: { patient: record } });
    console.log(`Dispatching visit for patient ${record.PatientNo}`);
  };
  


  const showModal = (record) => {
    setSelectedPatient(record);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    setSelectedPatient(null);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedPatient(null);
  };

  const handleNewPatient = () => {
    navigate("/reception/Patient-Registration");
  };

  const filteredPatients = patients.filter((patient) => {
    if (searchCriterion === "IDNumber") {
      return patient.IDNumber.includes(searchQuery);
    } else if (searchCriterion === "PatientNo") {
      return patient.PatientNo.toString().includes(searchQuery);
    } else if (searchCriterion === "Names") {
      return patient.Names.toLowerCase().includes(searchQuery.toLowerCase());
    } else if (searchCriterion === "LastName") {
      return patient.LastName.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return false;
  });

  const totalPatients = filteredPatients.length;
  const startRecord = (currentPage - 1) * pageSize + 1;
  const endRecord = Math.min(currentPage * pageSize, totalPatients);
  const patientsToDisplay = filteredPatients.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="container">
     <h4 className="text-center p-3 text-dark">
    <TeamOutlined style={{ marginRight: "8px", fontSize: "24px" }} />
    Patient List
  </h4>
      <div className="d-flex justify-content-between">
        <Button
          type="primary"
          onClick={handleNewPatient}
          style={{ marginBottom: "20px" }}
        >
          Register New Patient
        </Button>
        <Button
          onClick={() => handleAdmit()}
          style={{ marginBottom: "20px" }}
          type="primary"
        >
          <FileAddOutlined />
          Admit Patient
        </Button>
      </div>
      <div style={{ marginBottom: "20px" }}>
        <Radio.Group
          value={searchCriterion}
          onChange={(e) => setSearchCriterion(e.target.value)}
          style={{ marginBottom: "10px" }}
        >
          <Radio value="IDNumber">ID Number</Radio>
          <Radio value="PatientNo">Patient No</Radio>
          <Radio value="Names">First Name</Radio>
          <Radio value="LastName">Last Name</Radio>
        </Radio.Group>
        <Search
          placeholder={`Search by ${searchCriterion}`}
          onSearch={handleSearch}
          style={{ width: "100%" }}
        />
      </div>

      {showList && (
        <>
          <p>
            Showing {startRecord} to {endRecord} of {totalPatients} records
          </p>
          <Table
            columns={columns}
            dataSource={patientsToDisplay}
            loading={loading}
            pagination={false}
            rowKey={(record) => record.id}
          />
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={totalPatients}
            onChange={(page) => setCurrentPage(page)}
            style={{ textAlign: "right" }}
          />
        </>
      )}

      <Modal
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        title="Patient Details"
      >
        {selectedPatient && (
          <div>
            <p>
              <strong>First Name:</strong> {selectedPatient.Names}
            </p>
            <p>
              <strong>Last Name:</strong> {selectedPatient.LastName}
            </p>
            <p>
              <strong>Gender:</strong> {selectedPatient.Gender}
            </p>
            <p>
              <strong>Patient Type:</strong> {selectedPatient.PatientType}
            </p>
            <p>
              <strong>ID Number:</strong> {selectedPatient.IDNumber}
            </p>
            <p>
              <strong>Date Registered:</strong>{" "}
              {new Date(selectedPatient.DateRegistered).toLocaleString()}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OutpatientList;
