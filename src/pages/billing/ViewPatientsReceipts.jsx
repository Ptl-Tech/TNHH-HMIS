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
import { getReceiptHeader } from "../../actions/Charges-Actions/getReceiptHeader";
import { getReceiptLines } from "../../actions/Charges-Actions/getReceiptLines";
import { printReceipt } from "../../actions/Charges-Actions/printReceipt";
import ReversCharge from "./ReversCharge";
import {
  getPatientReceiptHeader,
  getPatientReceiptLines,
} from "../../actions/Charges-Actions/getPatientReceipts";

const { Title, Text } = Typography;

const ViewPatientsReceipts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const receiptNo = new URLSearchParams(useLocation().search).get("ReceiptNo");
  const visitNo = new URLSearchParams(useLocation().search).get("VisitNo");
  const { userData } = useAuth();
  //   const { state } = useLocation();
  //   const { patientData } = state;
  //   const { lines } = state.patientData; // Extract header and lines

  const { loading: loadingChargesLines, data } = useSelector(
    (state) => state.getChargesLines
  );
  const { loading: printInvoiceLoading } = useSelector(
    (state) => state.printInvoice
  );
  const { loading: invoiceProcessingLoading, error: invoiceProcessingError } =
    useSelector((state) => state.postInterimInvoice);
  const { data: receiptLines } = useSelector((state) => state.getReceiptLines);
  const { data: receiptHeader } = useSelector(
    (state) => state.getReceiptHeaderLines
  );
  // For corporate printing we already have a printInvoice action.
  const { loading: printReceiptLoading } = useSelector(
    (state) => state.printReceipt
  );
  const { loading: processReceiptLoading } = useSelector(
    (state) => state.processReceipt
  );
  const { data: patientReceipts } = useSelector(
    (state) => state.getPatientReceipt
  );
  const { data: patientHeader } = useSelector(
    (state) => state.getPatientReceiptHeader
  );

  const branchName = localStorage.getItem("branchCode");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [appointmentNo, setAppointmentNo] = useState("");
  const [isInvoiceModalVisible, setIsInvoiceModalVisible] = useState(false);
  const [selectedpatientNo, setSelectedPatientNo] = useState("");
  const [selectedPatientAmount, setSelectedPatientAmount] = useState("");
  const [selectedRecId, setSelectedRecId] = useState("");
  const [ReverseChargeModalVisible, setReverseChargeModalVisible] =
    useState(false);
  const [pdfBase64, setPdfBase64] = useState("");
  const [showPDFModal, setShowPDFModal] = useState(false);
  const [isGenerateReceiptModalVisible, setIsGenerateReceiptModalVisible] =
    useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  // NEW: Track whether the receipt has been posted.
  const [isReceiptPosted, setIsReceiptPosted] = useState(false);

  useEffect(() => {
    if (visitNo) {
      dispatch(getPatientReceiptLines(visitNo));
    }
  }, [dispatch, visitNo]);

  useEffect(() => {
    if (visitNo) {
      dispatch(getPatientReceiptHeader(visitNo));
    }
  }, [dispatch, visitNo]);

  const handleGoBack = () => {
    navigate("/reception/Billing/Outpatients");
  };

  const handleGenerateReceipt = (patientNo) => {
    setIsGenerateReceiptModalVisible(true);
  };

  const handleClose = () => {
    setIsModalVisible(false);
    setIsInvoiceModalVisible(false);
    setShowPaymentModal(false);
    setReverseChargeModalVisible(false);
  };

  const handlePrintReceipt = () => {
    const invoiceData = {
      receiptNo: receiptNo,
    };

    dispatch(printReceipt(invoiceData)).then((response) => {
      if (response?.data.base64) {
        setPdfBase64(response.data.base64);
        setShowPDFModal(true);
      }
    });
  };

  const showModal = () => {
    setAppointmentNo(patientData?.PatientNo);
    setTimeout(() => {
      setIsModalVisible(true);
    }, 0);
  };

  const showReverseModal = () => {
    setReverseChargeModalVisible(true);
    setSelectedRecId(receiptLines[0]?.SystemId);
  };

  const handlePaymentModal = () => {
    setShowPaymentModal(true);
    setSelectedPatientNo(patientHeader[0]?.Patient_No);
    setSelectedPatientAmount(patientHeader[0]?.Total_Amount);
  };

  // When processing (posting) the receipt, update the state so printing is enabled.
  const handleProcessReceipt = () => {
    const receipt = {
      recId: "",
      patientNo: patientHeader[0]?.Patient_No,
      receiptNo: patientHeader[0]?.No,
    };

    dispatch(postReceipt(receipt)).then((status) => {
      // Assuming a successful post returns data; adjust the check per your API response.
      if (status && status == "success") {
        setIsReceiptPosted(true);
        message.success("Receipt posted successfully");
      } else {
        message.error("Failed to post receipt");
      }
    });
  };
  const totalReceived = patientReceipts?.reduce((acc, line) => acc + line.Amount, 0) || 0;

  const tableData = patientReceipts?.map((line, index) => ({
    key: index,
    receiptNo: line?.No,
    code: line?.AccountNo,
    transactionName: line.TransactionType,
    chargeName: line.TransactionName,
    billType: line.PayMode,
    amount: line.Amount?.toLocaleString("en-KE", {
      style: "currency",
      currency: "KES",
    }),
  }));

  const columns = [
    {
      title: "Receipt No",
      dataIndex: "receiptNo",
      key: "receiptNo",
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
    },
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
            <Text>
              Phone:{" "}
              {ContactDetails.map((contact) =>
                contact.title === branchName ? contact.value : null
              )}
            </Text>
          </Col>
        </Row>
        <Row justify="end">
         
          <div className="d-flex flex-md-row gap-2">
            <Button
              type="primary"
              size="medium"
              icon={<FaReceipt />}
              onClick={() => handleProcessReceipt(patientHeader[0]?.Patient_No)}
            >
              Post Receipt
            </Button>
            <Button
              icon={<PrinterOutlined style={{ color: "green" }} />}
              onClick={() => {
                console.log("Printing Receipt:", receiptNo);
                handlePrintReceipt(receiptNo);
              }}
              size="medium"
              disabled={!isReceiptPosted} // Only enable if receipt has been posted
            >
              Print Receipt
            </Button>
          </div>
        </Row>

        <Row align="middle" justify="space-between">
          <Col span={12}>
            <div className="d-flex justify-content-start gap-2">
              <Text strong>Cashier:</Text>
              <p>
                {userData.firstName.charAt(0).toUpperCase() +
                  userData.firstName.slice(1).toLowerCase()}
              </p>
            </div>
          </Col>
          <Col span={12} className="mt-3 text-end">
            <Space align="end">
              <Button
                type="default"
                size="medium"
                icon={<DeleteOutlined />}
                danger
                onClick={showReverseModal}
              >
                Waive Charges
              </Button>
            </Space>
          </Col>
        </Row>

        <Divider />
        <Row justify="space-between">
          <Col>
            <Title level={4}>Receipt</Title>
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
              <p>{patientHeader[0]?.Received_From}</p>

              <Text strong>Patient No:</Text>
              <p style={{ fontWeight: "bold", color: "brown" }}>
                {patientHeader[0]?.Patient_No}
              </p>
              {/* <Text strong>Receipt No:</Text>
              <p style={{ fontWeight: "bold", color: "brown" }}>
                {receiptHeader[0]?.No}
              </p> */}
            </div>

            <div className="d-flex justify-content-start gap-4">
              <Text strong>Appointment No:</Text>
              <p
                style={{ fontWeight: "bold", color: "green" }}
                className="text-primary fw-bold"
              >
                {patientHeader[0]?.Patient_Appointment_No}{" "}
              </p>

              <Text strong>Date:</Text>
              <p>
                {patientHeader[0]?.Date_Posted
                  ? moment(patientHeader[0]?.Date_Posted).format("Do MMM YYYY")
                  : ""}
              </p>

              {/* <Text strong>Amount Received:</Text>
              <p style={{ fontWeight: "bold", color: "green" }}>
                {patientHeader[0]?.Amount_Recieved.toLocaleString("en-KE", {
                  style: "currency",
                  currency: "KES",
                }).replace(".00", "")}
              </p> */}
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
              <Col span={12}>
                <Text strong>Total Amount:</Text>
              </Col>
              <Col span={12}>
                <Text style={{ color: "green" }} strong>
                {totalReceived.toLocaleString("en-KE", {
        style: "currency",
        currency: "KES",
      })}
                </Text>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>

      <AddCharges
        visible={isModalVisible}
        onClose={handleClose}
        visitNo={receiptHeader[0]?.Patient_Appointment_No}
      />
      <ProcessPayment
        visible={showPaymentModal}
        onClose={handleClose}
        patientNo={receiptHeader[0]?.Patient_No}
        amount={receiptHeader[0]?.Total_Amount}
      />
      <ReversCharge
        visible={ReverseChargeModalVisible}
        onClose={handleClose}
        patientNo={receiptHeader[0]?.Patient_No}
        amount={receiptHeader[0]?.Total_Amount}
        recId={selectedRecId}
      />

      <Modal
        title="Receipt Preview"
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

export default ViewPatientsReceipts;
