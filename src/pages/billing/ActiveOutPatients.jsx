import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { appmntList } from "../../actions/patientActions";
import { getBillingList } from "../../actions/Charges-Actions/getBillingList";
import {
  Tabs,
  Table,
  Dropdown,
  Menu,
  Button,
  Input,
  Row,
  Col,
  Typography,
  Modal,
} from "antd";
import {
  EditOutlined,
  EyeOutlined,
  FilePdfOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { FaFileInvoice } from "react-icons/fa";
import ProcessPayment from "./ProcessPayment";
import { postGenerateInvoice } from "../../actions/Charges-Actions/postGenerateInvoice";
import { postInterimInvoice } from "../../actions/Charges-Actions/printInterimInvoice";
import useAuth from "../../hooks/useAuth";

const { TabPane } = Tabs;
const { Search } = Input;

const ActiveOutPatients = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const staffNo = useAuth().userData.no;
  const { loading, patients: visitData } = useSelector(
    (state) => state.appmntList
  );
  const { patients: billingData } = useSelector(
    (state) => state.getBillingList
  );
  const { loading: generateInvoiceLoading } = useSelector(
    (state) => state.generateInvoice
  );
    const { loading: invoiceProcessingLoading, error: invoiceProcessingError } =
      useSelector((state) => state.postInterimInvoice);

  const [searchParams, setSearchParams] = useState({
    SearchNames: "",
    AppointmentNo: "",
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isInvoiceModalVisible, setIsInvoiceModalVisible] = useState(false);
  const [billingModalVisible, setBillingModalVisible] = useState(false);
  const [selectedpatientNo, setSelectedPatientNo] = useState("");
  const [cashPatients, setCashPatients] = useState([]);
  const [corporatePatients, setCorporatePatients] = useState([]);
  const [filteredCashPatients, setFilteredCashPatients] = useState([]);
  const [filteredCorporatePatients, setFilteredCorporatePatients] = useState(
    []
  );
    const [pdfBlob, setPdfBlob] = useState(null);
  

  useEffect(() => {
    dispatch(appmntList());
    dispatch(getBillingList());
  }, [dispatch]);

  useEffect(() => {
    if (visitData && billingData) {
      const formattedBillingList = visitData.map((patient) => {
        const matchingPatient = billingData.find(
          (p) => p.PatientNo === patient.PatientNo
        );
        return {
          ...patient,
          Balance: matchingPatient?.Balance || 0,
          OpenInsuranceBalance: matchingPatient?.Open_Insurance_Amount || 0,
          Inpatient: matchingPatient?.Inpatient || false,
        };
      });

      const sortedList = formattedBillingList.sort(
        (a, b) => new Date(b.AppointmentDate) - new Date(a.AppointmentDate)
      );

      const cash = sortedList.filter(
        (patient) => patient.PatientType === "Cash"
      );
      const corporate = sortedList.filter(
        (patient) => patient.PatientType === "Corporate"
      );

      setCashPatients(cash);
      setCorporatePatients(corporate);

      setFilteredCashPatients(cash);
      setFilteredCorporatePatients(corporate);
    }
  }, [visitData, billingData]);

  const handleSearch = (e, field) => {
    const value = e.target.value.toLowerCase();
    const updatedSearchParams = {
      ...searchParams,
      [field]: value,
    };
    setSearchParams(updatedSearchParams);

    const filteredCash = cashPatients.filter(
      (patient) =>
        (!updatedSearchParams.SearchNames ||
          patient.Names.toLowerCase().includes(
            updatedSearchParams.SearchNames
          )) &&
        (!updatedSearchParams.AppointmentNo ||
          patient.AppointmentNo.toLowerCase().includes(
            updatedSearchParams.AppointmentNo
          ))
    );

    const filteredCorporate = corporatePatients.filter(
      (patient) =>
        (!updatedSearchParams.SearchNames ||
          patient.Names.toLowerCase().includes(
            updatedSearchParams.SearchNames
          )) &&
        (!updatedSearchParams.AppointmentNo ||
          patient.AppointmentNo.toLowerCase().includes(
            updatedSearchParams.AppointmentNo
          ))
    );

    setFilteredCashPatients(filteredCash);
    setFilteredCorporatePatients(filteredCorporate);
  };

  const showModal = (patientNo) => {
    setIsModalVisible(true);
    setSelectedPatientNo(patientNo);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedPatientNo(null);
  };

  const confirmGenerateInvoice = (patientNo) => {
    setSelectedPatientNo(patientNo);
    setIsInvoiceModalVisible(true);
  };

  const handleConfirmGenerateInvoice = () => {
    dispatch(postGenerateInvoice(selectedpatientNo));
    setIsInvoiceModalVisible(false);
  };
 const handleBillingSubmit = (record) => {
 
    const invoiceData = {
      PatientNo: record.PatientNo,
      visitNo: record.AppointmentNo,
      staffNo:staffNo,
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
        setSelectedPatientNo(patient);
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
  const patientColumns = [
    {
      title: "Patient No",
      dataIndex: "PatientNo",
      key: "PatientNo",
    },
    {
      title: "Patient Name",
      dataIndex: "Names",
      key: "Names",
    },
    {
      title: "Appointment No",
      dataIndex: "AppointmentNo",
      key: "AppointmentNo",
    },
    {
      title: "Patient Type",
      dataIndex: "PatientType",
      key: "PatientType",
    },
    {
      title: "Gender",
      dataIndex: "Gender",
      key: "Gender",
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
      title: "Balance",
      dataIndex: "Balance",
      key: "Balance",
      render: (text) => `KSh ${text.toFixed(2)}`,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => {
        const menu = (
          <Menu>
            {/* <Menu.Item
              key="view"
              icon={<EyeOutlined />}
              onClick={() =>
                navigate(`/reception/invoice/Patient?PatientNo=${record.PatientNo}`, {
                  state: { patientData: record },
                })
              }
            >
              View
            </Menu.Item> */}
            {record.PatientType === "Cash" ? (
              <Menu.Item
                key="invoice"
                icon={<FilePdfOutlined />}
                onClick={() => showModal(record.PatientNo)}
              >
                Generate Receipt
              </Menu.Item>
            ) : (
              <Menu.Item
                key="invoice"
                icon={<FilePdfOutlined />}
                onClick={() => confirmGenerateInvoice(record.PatientNo)}
              >
                Generate Invoice
              </Menu.Item>
            )}

            <Menu.Item
              key="edit"
              icon={<EditOutlined />}
              onClick={() => console.log("Editing", record)}
            >
              View
            </Menu.Item>
            {
              record.PatientType === "Corporate" && (
                <Menu.Item
                  key="invoice"
                  icon={<FilePdfOutlined />}
                  onClick={() => handleBillingSubmit(record)}
                >
                  Print Interim Invoice
                </Menu.Item>
              )
            }
          </Menu>
        );

        return (
          <Dropdown overlay={menu} trigger={["click"]}>
            <Button type="primary" size="small">
              <span
                className="fw-bold text-white"
                style={{ cursor: "pointer", fontSize: "16px" }}
              >
                ...
              </span>
              <DownOutlined />
            </Button>
          </Dropdown>
        );
      },
    },
  ];

  return (
    <div>
      <h4 className="text-center p-3 text-dark">Outpatient Billing List</h4>
      <Typography.Text
        style={{
          color: "#003F6D",
          fontWeight: "bold",
          marginBottom: "16px",
        }}
      >
        Search by:
      </Typography.Text>
      <Row gutter={16} className="mt-2">
        <Col span={12}>
          <Typography.Text
            style={{
              color: "#003F6D",
              fontWeight: "bold",
              marginBottom: "16px",
            }}
          >
            Patient Names
          </Typography.Text>
          <Input
            placeholder="Patient Names"
            value={searchParams.SearchNames}
            onChange={(e) => handleSearch(e, "SearchNames")}
          />
        </Col>
        <Col span={12}>
          <Typography.Text
            style={{
              color: "#003F6D",
              fontWeight: "bold",
              marginBottom: "16px",
            }}
          >
            Appointment Number:
          </Typography.Text>
          <Input
            placeholder="Appointment Number"
            value={searchParams.AppointmentNo}
            onChange={(e) => handleSearch(e, "AppointmentNo")}
          />
        </Col>
      </Row>

      <Tabs defaultActiveKey="1">
        <TabPane tab="Cash Patients" key="1">
          <Table
            columns={patientColumns}
            dataSource={filteredCashPatients.map((patient) => ({
              ...patient,
              key: patient.PatientNo,
            }))}
            pagination={{ pageSize: 25 }}
            size="small"
          />
        </TabPane>
        <TabPane tab="Corporate Patients" key="2">
          <Table
            columns={patientColumns}
            dataSource={filteredCorporatePatients.map((patient) => ({
              ...patient,
              key: patient.PatientNo,
            }))}
            pagination={{ pageSize: 25 }}
            size="small"
          />
        </TabPane>
      </Tabs>
      <ProcessPayment
        visible={isModalVisible}
        onClose={handleModalClose}
        patientNo={selectedpatientNo}
      />
      <Modal
        title="Confirm Invoice Generation"
        visible={isInvoiceModalVisible}
        onOk={handleConfirmGenerateInvoice}
        onCancel={() => setIsInvoiceModalVisible(false)}
        okText="Yes"
        cancelText="No"
      >
        <p>
          Are you sure you want to generate an invoice for Patient No:{" "}
          <strong>{selectedpatientNo}</strong>?
        </p>
      </Modal>
         {/* Modal for previewing and printing/downloading the PDF */}
            <Modal
              title={`Invoice for ${selectedpatientNo?.PatientNo}`}
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
    </div>
  );
};

export default ActiveOutPatients;
