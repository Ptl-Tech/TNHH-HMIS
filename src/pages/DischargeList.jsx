import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listPatients } from "../actions/patientActions";
import {
  Table,
  Button,
  Input,
  Pagination,
  Modal,
  Form,
  Select,
  DatePicker,
  TimePicker,
} from "antd";
import { useNavigate } from "react-router-dom"; // Use useNavigate instead of useHistory
import * as XLSX from "xlsx"; // Import XLSX for Excel download
import jsPDF from "jspdf";
import "jspdf-autotable"; // Import the autotable plugin
import dayjs from "dayjs";
import { GiCancel } from "react-icons/gi";
import { EyeOutlined, FileAddOutlined } from "@ant-design/icons";
import { FaFileExcel, FaList } from "react-icons/fa";
import { FaFilePdf } from "react-icons/fa6";
const { Search } = Input;
const { Option } = Select;

const DischargeList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, patients } = useSelector(
    (state) => state.patientList
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [admissionNumber, setAdmissionNumber] = useState("ADM001");
  const [isConfirmCancelVisible, setIsConfirmCancelVisible] = useState(false); // State for confirmation modal

  useEffect(() => {
    setAdmissionNumber(
      (prev) => `ADM${String(parseInt(prev.slice(3)) + 1).padStart(3, "0")}`
    );
  }, [selectedPatient]);

  const columns = [
    {
      title: "Patient No",
      dataIndex: "patientNo",
      key: "patientNo",
      render: (_, record, index) => (
        <span>{(currentPage - 1) * pageSize + index + 1}</span>
      ),
    },
    { title: "Adm No", dataIndex: "AdmNo", key: "AdmNo" },
    { title: "First Name", dataIndex: "firstName", key: "firstName" },
    { title: "Last Name", dataIndex: "lastName", key: "lastName" },
    { title: "ID Number", dataIndex: "idNumber", key: "idNumber" },
    { title: "Gender", dataIndex: "gender", key: "gender" },
    { title: "phone ", dataIndex: "phone", key: "phone" },
    { title: "Admission Date", dataIndex: "admissionDate", key: "admissionDate" },
    { title: "Admission Time", dataIndex: "admissionTime", key: "admissionTime" },
    
    { title: "Discharge Date", dataIndex: "dischargeDate", key: "dischargeDate" },
    { title: "Discharge Time", dataIndex: "dischargeTime", key: "dischargeTime" },
    {title:"Nurse ",dataIndex:"Nurse",key:"Nurse"},
    {title:"NurseId ",dataIndex:"nurseId",key:"nurseId"},
    {title:"Treatment No",dataIndex:"treatmentNo",key:"treatmentNo"},
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <>
          <Button
            type="primary"
            onClick={() => showModal(record)}
            style={{ marginRight: "10px" }}
          >
            <EyeOutlined />
           View Details
          </Button>
          {/* <Button
            type="primary"
            onClick={() => handleCancelAdmission(record)}
            danger
          >
            <GiCancel />
           
          </Button> */}
        </>
      ),
    },
  ];

  useEffect(() => {
    dispatch(listPatients());
  }, [dispatch]);

  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  const showModal = (patient) => {
    setSelectedPatient(patient);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    console.log("Patient admitted with details:", selectedPatient);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Show confirmation modal for cancellation
  const handleCancelAdmission = (patient) => {
    setSelectedPatient(patient); // Set the selected patient for cancellation
    setIsConfirmCancelVisible(true); // Show confirmation modal
  };

  // Handle the actual cancellation
  const confirmCancelAdmission = () => {
    console.log("Admission canceled for patient:", selectedPatient);
    setIsConfirmCancelVisible(false); // Hide confirmation modal
    // Add logic to handle admission cancellation here (e.g., API call to cancel admission)
  };

  const handleNewPatient = () => {
    navigate("/Doctor/Outpatient-list"); // Redirect to new patient registration page
  };

  // Function to download data as Excel
  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(patients);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Patients");
    XLSX.writeFile(workbook, "patients.xlsx");
  };

  // Function to download data as PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Patients List", 14, 16);

    // Generate table
    const tableData = patients.map((patient, index) => [
      index + 1,
      patient.firstName,
      patient.lastName,
      patient.gender,
      patient.patientType,
      patient.insurance,
      patient.idNumber,
      new Date(patient.createdAt).toLocaleString(),
    ]);

    // Define columns
    const columns = [
      "Patient No",
      "First Name",
      "Last Name",
      "Gender",
      "Patient Type",
      "Insurance",
      "ID Number",
      "Date Registered",
    ];
    doc.autoTable({
      head: [columns],
      body: tableData,
      startY: 20,
    });

    doc.save("patients.pdf");
    console.log("PDF downloaded");
  };

  const filteredPatients = patients.filter(
    (patient) =>
      patient.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.idNumber.includes(searchQuery)
  );

  const totalPatients = filteredPatients.length;
  const startRecord = (currentPage - 1) * pageSize + 1;
  const endRecord = Math.min(currentPage * pageSize, totalPatients);
  const patientsToDisplay = filteredPatients.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="container">
      <h4 className="text-center p-3">Discharge List</h4>
      <Search
        placeholder="Search by Name or ID Number"
        onSearch={handleSearch}
        style={{ marginBottom: "20px" }}
      />
      <div className="d-flex justify-content-between">
        <Button
          type="primary"
          onClick={handleNewPatient}
          style={{ marginBottom: "20px" }} // Add some spacing below the button
        >
          <FaList />
          Patient List
        </Button>
        <div className="d-flex justify-content-end align-items-center">
          <Button
            type="default"
            onClick={downloadPDF}
            style={{
              marginBottom: "20px",
              backgroundColor: "brown",
              color: "white",
              border: "none",
            }} // Add some spacing
          >
            <FaFilePdf />
            Download PDF
          </Button>
          <Button
            type="default"
            onClick={downloadExcel}
            style={{
              marginBottom: "20px",
              marginLeft: "10px",
              backgroundColor: "green",
              color: "white",
              border: "none",
            }} // Add some spacing
          >
            <FaFileExcel />
            Download Excel
          </Button>
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={patientsToDisplay}
        loading={loading}
        pagination={false}
        rowKey={(record) => record.id}
        size="small"
        scroll={{ x: true }}
      />
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={totalPatients}
        onChange={(page) => setCurrentPage(page)}
        style={{
          margin: "20px",
          textAlign: "right",
          display: "flex",
          justifyContent: "flex-end",
        }}
      />

      <Modal
        title="Admit Patient"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={800}
        style={{ top: 10 }}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            Admit
          </Button>,
        ]}
      >
        <div className="card">
          <div className="card-header d-block">
            <p>
              <strong className="text-primary pr-3">Patient Names:</strong>
              {selectedPatient?.firstName?.charAt(0).toUpperCase() +
                selectedPatient?.firstName?.slice(1).toLowerCase()}{" "}
              {selectedPatient?.lastName?.charAt(0).toUpperCase() +
                selectedPatient?.lastName?.slice(1).toLowerCase()}
            </p>
            <p>
              {" "}
              <strong className="text-primary pr-3"> Gender:</strong>{" "}
              {selectedPatient?.gender?.charAt(0).toUpperCase() +
                selectedPatient?.gender?.slice(1).toLowerCase()}
            </p>
            <strong className="text-primary pr-3"> Patient Type:</strong>{" "}
            {selectedPatient?.patientType}
          </div>
          <Form layout="vertical" className="pt-3 px-3">
            <Form.Item label="Admission Number">
              <Input
                value={admissionNumber}
                disabled
                className="form-control bg-light text-danger"
              />
            </Form.Item>
            <div className="d-flex justify-content-between align-items-center gap-3">
           <Form.Item label="Date of Admission" className="w-100">
              <DatePicker defaultValue={dayjs()} className="w-100" disabled />
            </Form.Item>
            <Form.Item label="Time of Admission" className="w-100">
              <TimePicker defaultValue={dayjs()} className="w-100" disabled />
            </Form.Item>
           </div>
            <Form.Item label="Area">
              <Select defaultValue="Referral">
                <Option value="Referral">Referral</Option>
                <Option value="Inpatient">Inpatient</Option>
              </Select>
            </Form.Item>
            <Form.Item label="Ward">
              <Select>
                <Option value="Ward 1">Ward 1</Option>
                <Option value="Ward 2">Ward 2</Option>
                <Option value="Ward 3">Ward 3</Option>
                <Option value="Ward 4">Ward 4</Option>
                <Option value="Ward 5">Ward 5</Option>
              </Select>
            </Form.Item>
            <Form.Item label="Bed Number">
              <Input placeholder="Enter Bed Number" />
            </Form.Item>
            <Form.Item label="Doctor">
              <Select>
                <Option value="Dr. Smith">Dr. Smith</Option>
                <Option value="Dr. Adams">Dr. Adams</Option>
                <Option value="Dr. Lee">Dr. Lee</Option>
                <Option value="Dr. Patel">Dr. Patel</Option>
                <Option value="Dr. Johnson">Dr. Johnson</Option>
              </Select>
            </Form.Item>
          </Form>
        </div>
      </Modal>
      
      {/* Confirmation Modal for Cancel Admission */}
      <Modal
        title="Confirm Cancellation"
        visible={isConfirmCancelVisible}
        onOk={confirmCancelAdmission}
        onCancel={() => setIsConfirmCancelVisible(false)}
        okText="Yes, Cancel"
        cancelText="No, Go Back"
      >
        <p>Are you sure you want to cancel the admission for {selectedPatient?.firstName} {selectedPatient?.lastName}?</p>
      </Modal>
    </div>
  );
};

export default DischargeList;
