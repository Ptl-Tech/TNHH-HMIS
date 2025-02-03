import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Table,
  Button,
  Divider,
  Space,
  Modal,
  message,
} from "antd";
import {
  DownloadOutlined,
  PrinterOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCoins, FaReceipt } from "react-icons/fa";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { postReceipt } from "../../actions/Charges-Actions/postReceipt";
import AddCharges from "./AddCharges";
import useAuth from "../../hooks/useAuth";
import { getChargesLines } from "../../actions/Charges-Actions/getChargesLines";
import { postGenerateInvoice } from "../../actions/Charges-Actions/postGenerateInvoice";
import { postPrintInvoice } from "../../actions/Charges-Actions/postprintInvoice";
import PDFViewer from "../../components/PDFView";
import { postInterimInvoice } from "../../actions/Charges-Actions/printInterimInvoice";
import ProcessPayment from "./ProcessPayment";
import { ContactDetails } from "../../constants/reception-constants/receptionConstants";

const { Title, Text } = Typography;

const ViewInvoice = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userData } = useAuth();
  const { state } = useLocation();
  const { patientData } = state;
  // const { header, lines } = state.patientData; // Extract header and lines
  const { loading } = useSelector((state) => state.printReceipt);
  const { loading: loadingChargesLines, data } = useSelector(
    (state) => state.getChargesLines
  );
  const patientNo = new URLSearchParams(useLocation().search).get("PatientNo");
const branchName = localStorage.getItem("branchCode");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [appointmentNo, setAppointmentNo] = useState("");
  const [isInvoiceModalVisible, setIsInvoiceModalVisible] = useState(false);
  const [selectedpatientNo, setSelectedPatientNo] = useState("");
  const [pdfBase64, setPdfBase64] = useState("");
  const [showPDFModal, setShowPDFModal] = useState(false);
  const[isGenerateReceiptModalVisible, setIsGenerateReceiptModalVisible] = useState(false);
  
  const { loading: printInvoiceLoading } = useSelector(
    (state) => state.printInvoice
  );
   const { loading: invoiceProcessingLoading, error: invoiceProcessingError } =
        useSelector((state) => state.postInterimInvoice);
        

  console.log("patientData", patientData);

  useEffect(() => {
    if (patientNo) {
      dispatch(getChargesLines(patientNo));
    }
    console.log("patientNo", data);
  }, [dispatch, patientNo]);

  const handleGoBack = () => {
    navigate(-1);
  };

const handleGenerateReceipt = (patientNo) => {
  setIsGenerateReceiptModalVisible(true);
};

  const handleClose = () => {
    setIsModalVisible(false);
    setIsInvoiceModalVisible(false);
    setIsGenerateReceiptModalVisible(false);
  };

  const handlePrintInvoice = (patientNo) => {
    if (!patientNo) {
      message.info("Please select a patient to generate an invoice for.");
      return;
    }
    dispatch(postPrintInvoice(patientNo)).then((response) => {
      if (response?.data.base64) {
        setPdfBase64(response.data.base64);
        setShowPDFModal(true); // Open modal to show PDF
      }
    });
  };

  const handlePrintInterimInvoice = (patientData) => {
    if (!patientData) {
      message.info("Please select a patient to generate an invoice for.");
      return;
    }
    console.log("patientData", patientData);
const invoiceData = {
  PatientNo: patientData.PatientNo,
      visitNo: patientData.AppointmentNo,
    };


    dispatch(postInterimInvoice(invoiceData)).then((response) => {
      if (response?.data.base64) {
        setPdfBase64(response.data.base64);
        setShowPDFModal(true); // Open modal to show PDF
      }
    });
  };
  const showModal = () => {
    setAppointmentNo(patientData?.PatientNo);
    setTimeout(() => {
      setIsModalVisible(true);
    }, 0);
  };

  const confirmGenerateInvoice = (patientNo) => {
    if (!patientNo) {
      message.info("Please select a patient to generate an invoice for.");
      return;
    }
    setSelectedPatientNo(patientNo);
    setIsInvoiceModalVisible(true);
  };

  const handleConfirmGenerateInvoice = () => {
    if (!selectedpatientNo) {
      message.error("No patient selected for invoice generation.");
      return;
    }
    dispatch(postGenerateInvoice(selectedpatientNo)).then((status) => {
      if (status) {
        dispatch(getChargesLines(selectedpatientNo));
      }
    });

    setIsInvoiceModalVisible(false);
  };

  // const handlePrintReceipt = () => {
  //   const receipt = {
  //     recId: "",
  //     patientNo: header[0].Patient_No,
  //     receiptNo: header[0].No,
  //   };
  //   console.log(receipt);

  //   dispatch(postReceipt(receipt));
  // };

  const grandTotal = data
    ?.reduce((total, line) => total + line.Amount, 0)
    .toLocaleString("en-KE", {
      style: "currency",
      currency: "KES",
    });

  const tableData = data?.map((line, index) => ({
    key: index,
    transactionName: line.TransactionType,
    chargeName: line.Description,
    quantity: line.Quantity,
    billType: line.BillingType,
    amount: line.Amount.toLocaleString("en-KE", {
      style: "currency",
      currency: "KES",
    }),
  }));

  const columns = [
    {
      title: "Transaction Name",
      dataIndex: "transactionName",
      key: "transactionName",
    },
    {
      title: "Charge Name",
      dataIndex: "chargeName",
      key: "chargeName",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Bill Type",
      dataIndex: "billType",
      key: "billType",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
  ];

  return (
    <div>
      <Card style={{ padding: "20px" }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={3}>Chiromo Hospital Group</Title>
            <Text>Email: info@chiromohg.co.ke</Text>
            <br />
            <Text>Phone:   {ContactDetails.map((contact) => contact.title===branchName ? contact.value : null)}</Text>
          </Col>
        </Row>
        <Row justify="end">
          <Col>
            <Space>
              {/* <Button icon={<DownloadOutlined />}>Download</Button> */}

              {patientData?.PatientType === "Corporate" ? (
                <>
                  <Button
                    type="default"
                    size="medium"
                    icon={
                      <PrinterOutlined
                        style={{ color: "green", size: "29px" }}
                      />
                    }
                    onClick={() =>
                      confirmGenerateInvoice(patientData?.PatientNo)
                    } // Ensure patientNo is passed
                  >
                   Post Charges
                  </Button>
                  <Button
                    type="primary"
                    size="medium"
                    icon={<FaCoins />}
                    onClick={() => handlePrintInvoice(patientData?.PatientNo)}
                  >
                    Print Invoice
                  </Button>
                  <Button
                    type="primary"
                    size="medium"
                    icon={<FaCoins />}
                    onClick={() => handlePrintInterimInvoice(patientData)}
                  >
                    Print Interim Invoice
                  </Button>
                </>
              ) : (
               <>
               <Button
                  type="primary"
                  size="medium"
                  icon={<FaReceipt />}
                  onClick={() => handleGenerateReceipt(patientData?.PatientNo)}
                >
                  Generate Payment 
                </Button>
                
                <Button
                  icon={
                    <PrinterOutlined style={{ color: "green", size: "29px" }} />
                  }
                  loading={loading}
                  // onClick={handlePrintReceipt}
                  size="medium"
                  // onclick show msg infor of feature not available
                  onClick={() => message.info("Feature not available at the moment")}
                >
                  Print Receipt
                </Button>
               </>
              )}
            </Space>
          </Col>
        </Row>
        <Row align="middle" justify="space-between">
        <Col span={12}>
            <div className="d-flex justify-content-start gap-2">
            <Text strong>Cashier:</Text>
            {/* Capitalize the first letter only since the api returns uppercase */}
            <p>{userData.firstName.charAt(0).toUpperCase() + userData.firstName.slice(1).toLowerCase()}</p>

           
            </div>
          </Col>
          <Col span={12} className="mt-3 text-end">
            <Space align="end">
              <Button
                type="primary"
                size="medium"
                icon={<FaCoins />}
                onClick={showModal}
              >
                Add Charges
              </Button>
              <Button
                type="default"
                size="medium"
                icon={<DeleteOutlined />}
                danger
                onClick={() => message.info("Feature not available at the moment")}

              >
                Waive Charges
              </Button>
            </Space>
          </Col>
        </Row>

        <Divider />
        <Row justify="space-between">
          <Col>
            <Title level={4}>
              {patientData?.PatientType === "Corporate"
                ? "Invoice"
                : " Receipt"}
            </Title>
          </Col>
          <Col>
            <Button type="primary" onClick={handleGoBack}>
              Go Back
            </Button>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
           <div className="d-flex justify-content-start gap-4">
           <Text strong>Receiving From:</Text>
            <p>{patientData.Names}</p>

            <Text strong>Patient No:</Text>
            <p style={{ fontWeight: "bold", color: "brown" }}>{patientData.PatientNo}</p>
             
           </div>

           <div className="d-flex justify-content-start gap-4">
           <Text strong>Appointment No:</Text>
            <p style={{ fontWeight: "bold", color: "green" }} className="text-primary fw-bold">{patientData?.AppointmentNo}</p>

            <Text strong>Date:</Text>
            <p>
              {patientData?.AppointmentDate
                ? moment(patientData?.AppointmentDate).format("Do MMM YYYY")
                : ""}
            </p>
           
           <Text strong>Amount Received:</Text>
           <p style={{ fontWeight: "bold", color: "green" }}>
  {patientData?.PatientType === "Corporate"
    ? grandTotal?.toLocaleString("en-KE", {
        style: "currency",
        currency: "KES",
      })
    : data?.Receipt_Amount
        ?.toLocaleString("en-KE", {
          style: "currency",
          currency: "KES",
        })
        .replace(".00", "")}
</p>


           {/* <Text strong>Document Date:</Text>
           <p>{data?.Date ? moment(data?.Date).format("Do MMM YYYY") : ""}</p> */}
           </div>
          </Col>

        
        </Row>

        <Divider />

        <Table
          dataSource={tableData}
          columns={columns}
          pagination={true}
          loading={loadingChargesLines}
        />

        <Divider />

        <Row gutter={16}>
          <Col span={14}>
            <Text strong>Note:</Text>
            <p style={{ fontSize: "12px", fontStyle: "italic" }}>
              Thank you for choosing Chiromo Hospital. For any inquiries, reach
              out at{" "}
              <a href="mailto:info@chiromohg.co.ke">info@chiromohg.co.ke</a>.
            </p>
          </Col>
          <Col span={10}>
            <Row justify="space-between">
              {/* hide total received for corporate */}
              {patientData?.PatientType !== "Corporate" && (
                <Col span={12}>
                <Text strong>Total Received:</Text>
              </Col>
              )}
              <Col span={12}>
                <Text style={{ color: "green" }}>
                  {data?.Receipt_Amount?.toLocaleString("en-KE", {
                    style: "currency",
                    currency: "KES",
                  })}
                </Text>
              </Col>
            </Row>

            <Row justify="space-between">
              <Col span={12}>
                <Text strong>Grand Total:</Text>
              </Col>
              <Col span={12}>
                <Text style={{ color: "green" }} strong>{grandTotal}</Text>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>
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
      <AddCharges
        visible={isModalVisible}
        onClose={handleClose}
        visitNo={patientData?.AppointmentNo}
      />
      <ProcessPayment
        visible={isGenerateReceiptModalVisible}
        onClose={handleClose}
        patientNo={patientData?.PatientNo}
        />
      <Modal
        title="Invoice Preview"
        open={showPDFModal}
        onCancel={() => setShowPDFModal(false)}
        footer={null}
        width={800}
        style={{ top: 2 }}
      >
        {pdfBase64 && <PDFViewer base64String={pdfBase64} />}
      </Modal>
    </div>
  );
};

export default ViewInvoice;
