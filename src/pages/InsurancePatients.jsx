import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Card,
  Col,
  Input,
  Row,
  Table,
  Typography,
  Tooltip,
  Modal,
  Tabs,
  Dropdown, Menu
} from "antd";
import { EditOutlined, EyeOutlined, FilePdfOutlined, TeamOutlined,DownOutlined  } from "@ant-design/icons";
import { appmntList, listPatients } from "../actions/patientActions";
import { useNavigate } from "react-router-dom";
import { getPatientDetails } from "../actions/triage-actions/getPatientDetailsSlice";
import useAuth from "../hooks/useAuth";
import { postInterimInvoice } from "../actions/Charges-Actions/printInterimInvoice";
import TabPane from "antd/es/tabs/TabPane";
import { getBillingList } from "../actions/Charges-Actions/getBillingList";
import { saveAs } from "file-saver";
import ViewInvoice from "./billing/ViewInvoice";

const InsurancePatients = () => {
  const { loading, patients: visitData } = useSelector(
    (state) => state.appmntList
  );
  const { loading: billingLoading, patients: billingData } = useSelector(
    (state) => state.getBillingList
  );
  const {
    loading: patientDetailsLoading,
    error: patientDetailsError,
    patientDetails,
  } = useSelector((state) => state.getPatientDetails);
  const { loading: invoiceProcessingLoading, error: invoiceProcessingError } =
    useSelector((state) => state.postInterimInvoice);

  const [filteredPatients, setFilteredPatients] = useState([]);
  const [filteredOutpatients, setFilteredOutpatients] = useState([]);
  const [filteredInpatients, setFilteredInpatients] = useState([]);
  const [formattedBillingTable, setFormattedBillingTable] = useState([]);

  const [searchParams, setSearchParams] = useState({
    SearchNames: "",
    AppointmentNo: "",
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
  });
  const [billingModalVisible, setBillingModalVisible] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientBalanceDetails, setPatientBalanceDetails] = useState(null);
  const [pdfBlob, setPdfBlob] = useState(null);

  const staffNo = useAuth().userData.No;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(appmntList());
    dispatch(getBillingList());
  }, [dispatch]);

  const formattedBillingList = visitData.map((patient) => {
    const matchingPatient = billingData.find(
      (p) => p.PatientNo === patient.PatientNo
    );
    return {
      ...patient,
      PatientNo: patient.PatientNo,
      Balance: matchingPatient?.Balance ?? 0, // Default to 0 if Balance is undefined
      OpenInsuranceBalance: matchingPatient?.Open_Insurance_Amount ?? 0,
      Inpatient: matchingPatient?.Inpatient ?? false,
    };
  });
  console.log("Formatted Billing List:", formattedBillingList);

  useEffect(() => {
    if (selectedPatient) {
      dispatch(getPatientDetails(selectedPatient.PatientNo));
    }
  }, [selectedPatient]);

  // Update patientBalanceDetails when patientDetails changes
  useEffect(() => {
    if (
      patientDetails &&
      selectedPatient?.PatientNo === patientDetails.PatientNo
    ) {
      setPatientBalanceDetails(patientDetails);
    }
  }, [patientDetails, selectedPatient]);

  useEffect(() => {
    if (formattedBillingList) {
      // Sort the list based on the AppointmentDate (latest first)
      const sortedList = [...formattedBillingList].sort((a, b) => {
        const dateA = new Date(a.AppointmentDate);
        const dateB = new Date(b.AppointmentDate);
        return dateB - dateA; // For descending order
      });

      setFilteredOutpatients(
        sortedList.filter(
          (patient) => patient.PatientType === "Corporate" && !patient.Inpatient
        )
      );
      setFilteredInpatients(
        sortedList.filter(
          (patient) => patient.PatientType === "Corporate" && patient.Inpatient
        )
      );
    }
  }, [formattedBillingList]);

  const handleSearchChange = (e, key) => {
    const value = e.target.value.toLowerCase();
    setSearchParams((prev) => ({ ...prev, [key]: value }));

    const filtered = formattedBillingTable.filter((patient) => {
      const matchesName = patient.Names?.toLowerCase().includes(
        searchParams.SearchNames.toLowerCase()
      );
      const matchesAppointmentNo =
        patient.AppointmentNo?.toLowerCase().includes(
          searchParams.AppointmentNo.toLowerCase()
        );

      return matchesName && matchesAppointmentNo;
    });

    setFormattedBillingTable(filtered);
  };
  const handlePaginationChange = (page, pageSize) => {
    setPagination({ current: page, pageSize });
  };

  const handleBillingSubmit = (patient) => {
    const invoiceData = {
      PatientNo: patient.PatientNo,
      visitNo: patient.AppointmentNo,
      staffNo,
    };

    dispatch(postInterimInvoice(invoiceData)).then((response) => {
      if (response?.base64) {
        const byteCharacters = atob(response.base64);
        const byteArrays = [];
        for (let offset = 0; offset < byteCharacters.length; offset += 512) {
          const slice = byteCharacters.slice(offset, offset + 512);
          const byteNumbers = Array.from(slice).map((char) =>
            char.charCodeAt(0)
          );
          byteArrays.push(new Uint8Array(byteNumbers));
        }
        const blob = new Blob(byteArrays, { type: "application/pdf" });
        const blobUrl = URL.createObjectURL(blob);
        setPdfBlob(blobUrl);
        setSelectedPatient(patient);
        setBillingModalVisible(true);
      }
    });
  };
  const handleDownload = () => {
    if (pdfBlob && selectedPatient) {
      // Use the patient's name or fallback to a default name if unavailable
      const patientName = selectedPatient?.Names || "Unknown_Patient";
      const fileName = `${patientName}_Invoice.pdf`.replace(/\s+/g, "_"); // Replace spaces with underscores for a valid filename

      // Trigger the download
      saveAs(pdfBlob, fileName);
    }
  };

  const handlePrint = () => {
    if (pdfBlob) {
      const printWindow = window.open("", "_blank"); // Open a blank window
      const htmlContent = `
        <html>
          <head><title>Invoice</title></head>
          <body>
            <embed src="${pdfBlob}" width="100%" height="100%" />
          </body>
        </html>`;
      printWindow.document.write(htmlContent); // Write the content
      printWindow.document.close(); // Close the document to ensure it renders
      printWindow.print(); // Trigger the print
    }
  };
  const outpatientColumns = [
    {
      title: "Patient No",
      dataIndex: "PatientNo",
      key: "PatientNo",
    },
    {
      title: "Patient Name",
      dataIndex: "Names", // Corrected key to match patient object
      key: "Names",
    },
    {
      title: "Appointment No",
      dataIndex: "AppointmentNo",
      key: "AppointmentNo",
    },
    {
      title: "Appointment Date",
      dataIndex: "AppointmentDate",
      key: "AppointmentDate",
      render: (text) => {
        const date = new Date(text);
        return date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      },
    },
    {
      title: "Appointment Time",
      dataIndex: "AppointmentTime",
      key: "AppointmentTime",
      render: (text, record) => {
        const dateTimeString = `${record.AppointmentDate}T${record.AppointmentTime}`;
        const dateTime = new Date(dateTimeString);
        return dateTime.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
      },
    },
    {
      title: "Gender",
      dataIndex: "Gender",
      key: "Gender",
    },
    {
      title: "Patient Type",
      dataIndex: "PatientType",
      key: "PatientType",
    },
    {
      title: "Balance",
      dataIndex: "Balance",
      key: "Balance",
      render: (text) => {
        const balance = text !== undefined && text !== null ? text : 0; // Default to 0 if undefined or null
        return `KSh ${balance.toFixed(2)}`;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => {
        const menu = (
          <Menu>
           <Menu.Item
          key="view"
          icon={<EyeOutlined />}
          onClick={() => navigate(`/reception/invoice/PatientNo=${record.PatientNo}`, { state: { patientData: record } })}
        >
          View
        </Menu.Item>
            <Menu.Item
              key="edit"
              icon={<EditOutlined />}
              onClick={() => console.log("Editing", record)}
            >
              Edit
            </Menu.Item>
            <Menu.Item
              key="print"
              icon={<FilePdfOutlined />}
              onClick={() => handleBillingSubmit(record)}
            >
              Print Invoice
            </Menu.Item>
          </Menu>
        );
  
        return (
          <Dropdown overlay={menu} trigger={["click"]}>
            <Button>
             <span className="fw-bold text-primary" style={{ cursor: "pointer", fontSize: "16px"}}> ... </span><DownOutlined />
            </Button>
          </Dropdown>
        );
      },
    },
  ];
  const inpatientColumns = [
    {
      title: "Patient No",
      dataIndex: "PatientNo",
      key: "PatientNo",
    },
    {
      title: "Patient Name",
      dataIndex: "Names", // Corrected key to match patient object
      key: "Names",
    },
    {
      title: "Appointment No",
      dataIndex: "AppointmentNo",
      key: "AppointmentNo",
    },
    {
      title: "Appointment Date",
      dataIndex: "AppointmentDate",
      key: "AppointmentDate",
      render: (text) => {
        const date = new Date(text);
        return date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      },
    },
    {
      title: "Appointment Time",
      dataIndex: "AppointmentTime",
      key: "AppointmentTime",
      render: (text, record) => {
        const dateTimeString = `${record.AppointmentDate}T${record.AppointmentTime}`;
        const dateTime = new Date(dateTimeString);
        return dateTime.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
      },
    },
    {
      title: "Gender",
      dataIndex: "Gender",
      key: "Gender",
    },
    {
      title: "Patient Type",
      dataIndex: "PatientType",
      key: "PatientType",
    },
    {
      title: "Balance",
      dataIndex: "Balance",
      key: "Balance",
      render: (text) => {
        const balance = text !== undefined && text !== null ? text : 0; // Default to 0 if undefined or null
        return `KSh ${balance.toFixed(2)}`;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => {
        const menu = (
          <Menu>
           <Menu.Item
          key="view"
          icon={<EyeOutlined />}
          onClick={() => navigate(`/reception/invoice/PatientNo=${record.PatientNo}`, { state: { patientData: record } })}
        >
          View
        </Menu.Item>
            <Menu.Item
              key="edit"
              icon={<EditOutlined />}
              onClick={() => console.log("Editing", record)}
            >
              Edit
            </Menu.Item>
            <Menu.Item
              key="print"
              icon={<FilePdfOutlined />}
              onClick={() => handleBillingSubmit(record)}
            >
              Print Invoice
            </Menu.Item>
          </Menu>
        );
  
        return (
          <Dropdown overlay={menu} trigger={["click"]}>
            <Button>
             <span className="fw-bold text-primary" style={{ cursor: "pointer", fontSize: "16px"}}> ... </span><DownOutlined />
            </Button>
          </Dropdown>
        );
      },
    },
  ];

  const startIdx = (pagination.current - 1) * pagination.pageSize;
  const endIdx = startIdx + pagination.pageSize;
  const paginatedData = filteredPatients.slice(startIdx, endIdx);

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  return (
    <div>
      <h4 className="text-center p-3 text-dark">
        <TeamOutlined style={{ marginRight: "8px", fontSize: "24px" }} />
        Insurance Patient List
      </h4>

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
          <Col span={12}>
            <Input
              placeholder="Patient Names"
              value={searchParams.SearchNames}
              onChange={(e) => handleSearchChange(e, "SearchNames")}
            />
          </Col>
          <Col span={12}>
            <Input
              placeholder="Appointment Number"
              value={searchParams.AppointmentNo}
              onChange={(e) => handleSearchChange(e, "AppointmentNo")}
            />
          </Col>
        </Row>
      </Card>

      <div className="mt-4">
        <Tabs defaultActiveKey="1" size="large" type="card">
          <TabPane tab="Outpatients list" key="1">
            <Table
              rowSelection={rowSelection}
              columns={outpatientColumns}
              dataSource={filteredOutpatients.map((patient) => ({
                ...patient,
                key: patient.AppointmentNo,
              }))}
              pagination={{
                total: filteredOutpatients.length,
                current: pagination.current,
                pageSize: pagination.pageSize,
                onChange: handlePaginationChange,
              }}
              bordered
              size="small"
            />
          </TabPane>
          <TabPane tab="Inpatients list" key="2">
            <Table
              rowSelection={rowSelection}
              columns={inpatientColumns}
              dataSource={filteredInpatients.map((patient) => ({
                ...patient,
                key: patient.AppointmentNo,
              }))}
              pagination={{
                total: filteredInpatients.length,
                current: pagination.current,
                pageSize: pagination.pageSize,
                onChange: handlePaginationChange,
              }}
              bordered
              size="small"
            />
          </TabPane>
        </Tabs>
      </div>

      {/* Modal for previewing and printing/downloading the PDF */}
      <Modal
        title={`Invoice for ${selectedPatient?.Names}`}
        visible={billingModalVisible}
        onCancel={() => setBillingModalVisible(false)}
        footer={[
          <Button type="primary" key="download" onClick={handleDownload}>
            Download
          </Button>,
          <Button type="default" key="print" onClick={handlePrint}>
            Print
          </Button>,
          <Button
            type="primary"
            key="close"
            onClick={() => setBillingModalVisible(false)}
          >
            Close
          </Button>,
        ]}
        width={800}
        style={{ top: 20 }}
      >
        <iframe
          src={pdfBlob}
          width="100%"
          height="600px"
          style={{ border: "none" }}
          className="iframe-scrollbar"
        ></iframe>
      </Modal>
      <style jsx>{`
        .row-warning {
          background-color: #faad14 !important;
        }
      `}</style>
    </div>
  );
};
{
  /* <style jsx>{`
  .patient-info-card {
    margin-top: 20px;
    background-color: #f9f9f9;
    padding: 16px;
    border-radius: 8px;
  }
  .card-header {
    background-color: #f0f2f5;
    border-radius: 8px;
  }
  .ant-card-body {
    padding: 16px;
  }
`}</style>; */
}
export default InsurancePatients;
