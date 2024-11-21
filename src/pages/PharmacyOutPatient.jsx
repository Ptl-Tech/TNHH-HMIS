import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listPatients, triageList } from "../actions/patientActions";
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
  Tabs,
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
import TabPane from "antd/es/tabs/TabPane";
import TextArea from "antd/es/input/TextArea";
const { Search } = Input;
const { Option } = Select;

const PharmacyOutPatient = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, patients } = useSelector(state => state.triageList);
  
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
    // { title: "Adm No", dataIndex: "AdmNo", key: "AdmNo" },
    { title: "First Name", dataIndex: ['patient', 'firstName'], key: "firstName" },
    { title: "Last Name", dataIndex: ['patient', 'lastName'], key: "lastName" },
    { title: "ID Number", dataIndex: ['patient', 'idNumber'], key: "idNumber" },
    { title: "Gender", dataIndex: ['patient', 'gender'], key: "gender" },
    { title: "phone ", dataIndex: ['patient', 'phoneNumber'], key: "phone" },
    // { title: "Admission Date", dataIndex: "admissionDate", key: "admissionDate" },
    // { title: "Admission Time", dataIndex: "admissionTime", key: "admissionTime" },
        
    {title:"Transaction Type ",dataIndex:"transactionType",key:"transactionType"},
    {title:"Issuing Counter ",dataIndex:"issuingCounter",key:"issuingCounter"},
    {title:"Patient Type",dataIndex:['patient', 'patientType'],key:"patientType"},
    { title: "Request Area", dataIndex: "requestArea", key: "requestArea" },
    { title: "Cash Sale", dataIndex: "cashSale", key: "cashSale" },
{ title: "Status", dataIndex: "status", key: "status" },
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
           View Prescription
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
    dispatch(triageList());
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

  const filteredPatients = patients.filter((patient) => {
    const firstName = patient.firstName || ''; // Default to empty string if undefined
    const lastName = patient.lastName || ''; // Default to empty string if undefined
    const idNumber = patient.idNumber || ''; // Default to empty string if undefined
  
    return (
      firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idNumber.includes(searchQuery)
    );
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
      <h4 className="text-center p-3">Pharmacy Out-Patient List</h4>
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

    {/* Modal for viewing patient details */}
            <Modal
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                
                width={800}
                destroyOnClose
                maskClosable
                style={{ top: 5 }}
                footer={null}
                title={`${selectedPatient?.patient?.firstName} ${selectedPatient?.patient?.lastName}`}
            >
                {selectedPatient && (
                    <div>
                        <label>Patient Type:</label>
                        <Input value={selectedPatient.patient.patientType} readOnly style={{ marginBottom: '10px' }} />
                        
                        <label>Date Registered:</label>
                        <Input value={new Date(selectedPatient.createdAt).toLocaleString()} readOnly style={{ marginBottom: '10px' }} />

                        <Tabs defaultActiveKey="1">
                        <TabPane tab="Vitals & Symptoms" key="1">
        <label>Height:</label>
        <Input value={`${selectedPatient.vitals?.height || 'N/A'} cm`} readOnly style={{ marginBottom: '10px' }} />
        
        <label>Weight:</label>
        <Input value={`${selectedPatient.vitals?.weight || 'N/A'} kg`} readOnly style={{ marginBottom: '10px' }} />
        
        <label>Heart Rate:</label>
        <Input value={`${selectedPatient.vitals?.heartRate || 'N/A'} bpm`} readOnly style={{ marginBottom: '10px' }} />
        
        <label>Temperature:</label>
        <Input value={`${selectedPatient.vitals?.temperature || 'N/A'} °C`} readOnly style={{ marginBottom: '10px' }} />
        
        <label>Blood Pressure:</label>
    <Input value={`${selectedPatient.vitals?.bloodPressure || 'N/A'} mmHg`} readOnly style={{ marginBottom: '10px' }} />
        
        <label>Respiratory Rate:</label>
        <Input value={`${selectedPatient.vitals?.respiratoryRate || 'N/A'} breaths/min`} readOnly style={{ marginBottom: '10px' }} />
    </TabPane>

                            <TabPane tab="Doctor Treatment" key="2">
                            <label>Symptoms:</label>
                                <TextArea value={selectedPatient.symptoms || 'N/A'} readOnly rows={2} style={{ marginBottom: '10px' }} />
                                
                                <label>Notes:</label>
                                <TextArea value={selectedPatient.doctorNotes || 'N/A'} readOnly rows={2} style={{ marginBottom: '10px' }} />
                                
                                <label>Diagnosis:</label>
                                <TextArea value={selectedPatient.diagnosis || 'N/A'} readOnly rows={2} style={{ marginBottom: '10px' }} />
                                
                                <label>Treatment:</label>
                                <TextArea value={selectedPatient.recommendedTreatment || 'N/A'} readOnly rows={2} style={{ marginBottom: '10px' }} />
                                
                                <label>Additional Notes:</label>
                                <TextArea value={selectedPatient.additionalNotes || 'N/A'} readOnly rows={2} style={{ marginBottom: '10px' }} />                            </TabPane>
                        </Tabs>
                    </div>
                )}
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

export default PharmacyOutPatient;
