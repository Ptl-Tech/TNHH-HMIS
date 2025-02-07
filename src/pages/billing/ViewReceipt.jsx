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

const { Title, Text } = Typography;

const ViewReceipt = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const receiptNo = new URLSearchParams(useLocation().search).get("ReceiptNo");

  const { userData } = useAuth();
  const { state } = useLocation();
  const { patientData } = state;
  const { lines } = state.patientData; // Extract header and lines

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
  const receiptHeaderState = useSelector(
    (state) => state.getReceiptHeaderLines
  );
  console.log("Redux Receipt Header State:", receiptHeaderState);

  const { loading: printReceiptLoading } = useSelector(
    (state) => state.printReceipt
  );
  const { loading: processReceiptLoading } = useSelector(
    (state) => state.processReceipt
  )

  const branchName = localStorage.getItem("branchCode");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [appointmentNo, setAppointmentNo] = useState("");
  const [isInvoiceModalVisible, setIsInvoiceModalVisible] = useState(false);
  const [selectedpatientNo, setSelectedPatientNo] = useState("");
    const[selectedPatientAmount, setSelectedPatientAmount]=useState("");
  
  const [pdfBase64, setPdfBase64] = useState("");
  const [showPDFModal, setShowPDFModal] = useState(false);
  const [isGenerateReceiptModalVisible, setIsGenerateReceiptModalVisible] =
    useState(false);
const [showPaymentModal, setShowPaymentModal]=useState(false);
  useEffect(() => {
    if (receiptNo) {
      dispatch(getReceiptLines(receiptNo));
      console.log("receipt lines", receiptLines);
    }
  }, [dispatch, receiptNo]);
  useEffect(() => {
    if (receiptNo) {
      dispatch(getReceiptHeader(receiptNo));
    }
  }, [dispatch, receiptNo]);

  const handleGoBack = () => {
    navigate("/reception/Billing/Outpatients", );
  };

  const handleGenerateReceipt = (patientNo) => {
    setIsGenerateReceiptModalVisible(true);
  };

  const handleClose = () => {
    setIsModalVisible(false);
    setIsInvoiceModalVisible(false);
    setShowPaymentModal(false);
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

  const handlePaymentModal=()=>{
    setShowPaymentModal(true);
    setSelectedPatientNo(receiptHeader[0]?.Patient_No);
    setSelectedPatientAmount(receiptHeader[0]?.Total_Amount);
    }

  const handleProcessReceipt = () => {
    const receipt = {
      recId: "",
      patientNo: receiptHeader[0]?.Patient_No,
      receiptNo: receiptHeader[0]?.No,
    };

    dispatch(postReceipt(receipt));
  };

  const tableData = receiptLines?.map((line, index) => ({
    key: index,
    code:line?.AccountNo,
    transactionName: line.TransactionType,
    chargeName: line.TransactionName,
    // quantity: line.Quantity,
    billType: line.PayMode,
    amount: line.Amount?.toLocaleString("en-KE", {
      style: "currency",
      currency: "KES",
    }),
  }));

  const columns = [
    {
      title: "Code",
      dataIndex:"code",
      key:"code"
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
    // {
    //   title: "Quantity",
    //   dataIndex: "quantity",
    //   key: "quantity",
    // },
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
          <Col>
            <Space>
              {/* <Button icon={<DownloadOutlined />}>Download</Button> */}

              {patientData?.PatientType === "Corporate" ? (
                <>
                  <Button
                    type="primary"
                    size="medium"
                    icon={<FaCoins />}
                    onClick={() => handlePrintInvoice(patientData?.PatientNo)}
                  >
                    Print Receipt
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    type="primary"
                    size="medium"
                    icon={<FaReceipt />}
                    onClick={() =>
                      handleProcessReceipt(receiptHeader[0]?.Patient_No)
                    }
                  >
                    Post Receipt
                  </Button>

                  <Button
                    icon={
                      <PrinterOutlined
                        style={{ color: "green", size: "29px" }}
                      />
                    }
                    onClick={() => {
                      console.log("Printing Receipt:", receiptNo);
                      handlePrintReceipt(receiptNo);
                    }}
                    size="medium"
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
              <p>
                {userData.firstName.charAt(0).toUpperCase() +
                  userData.firstName.slice(1).toLowerCase()}
              </p>
            </div>
          </Col>
          <Col span={12} className="mt-3 text-end">
            <Space align="end">
              {/* <Button
                type="primary"
                size="medium"
                icon={<FaCoins />}
                onClick={showModal}
              >
                Add Charges
              </Button>
              <Button
                type="primary"
                size="medium"
                icon={<FaCoins />}
                onClick={handlePaymentModal}
              >
               Initiate Payment
              </Button> */}
              <Button
                type="default"
                size="medium"
                icon={<DeleteOutlined />}
                danger
                onClick={() =>
                  message.info("Feature Coming Soon!")
                }
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
              <p>{receiptHeader[0]?.Received_From}</p>

              <Text strong>Patient No:</Text>
              <p style={{ fontWeight: "bold", color: "brown" }}>
                {receiptHeader[0]?.Patient_No}
              </p>
              <Text strong>Receipt No:</Text>
              <p style={{ fontWeight: "bold", color: "brown" }}>
                {receiptHeader[0]?.No}
              </p>
            </div>

            <div className="d-flex justify-content-start gap-4">
              <Text strong>Appointment No:</Text>
              <p
                style={{ fontWeight: "bold", color: "green" }}
                className="text-primary fw-bold"
              >
                {receiptHeader[0]?.Patient_Appointment_No}{" "}
              </p>

              <Text strong>Date:</Text>
              <p>
                {receiptHeader[0]?.Date_Posted
                  ? moment(patientData?.Date_Posted).format("Do MMM YYYY")
                  : ""}
              </p>

              <Text strong>Amount Received:</Text>
              <p style={{ fontWeight: "bold", color: "green" }}>
                {receiptHeader[0]?.Amount_Recieved.toLocaleString("en-KE", {
                  style: "currency",
                  currency: "KES",
                }).replace(".00", "")}
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
              <Col span={12}>
                <Text strong>Total Received:</Text>
              </Col>
              <Col span={12}>
                <Text style={{ color: "green" }} strong>
                  {receiptHeader[0]?.Total_Amount.toLocaleString("en-KE", {
                    style: "currency",
                    currency: "KES",
                  }).replace(".00", "")}
                </Text>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>

      <AddCharges
        visible={isModalVisible}
        onClose={handleClose}
        visitNo= {receiptHeader[0]?.Patient_Appointment_No}
      />
      <ProcessPayment
        visible={showPaymentModal}
        onClose={handleClose}
        patientNo={receiptHeader[0]?.Patient_No}
        amount={receiptHeader[0]?.Total_Amount}
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

export default ViewReceipt;
