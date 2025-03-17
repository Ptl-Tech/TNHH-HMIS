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
  Tag,
} from "antd";
import {
  DownloadOutlined,
  PrinterOutlined,
  EditOutlined,
  DeleteOutlined,
  DollarOutlined,
  StopOutlined,
  MinusCircleOutlined,
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
import { getUnpostedCharges } from "../../actions/Charges-Actions/getUnpostedCharges";
import { deletePatientCharges } from "../../actions/Charges-Actions/deleteCharges";
import ViewReceipt from "./ViewReceipt";
import LoadingSkeleton from "../../components/LoadingSkeleton";
import { IoReceiptOutline } from "react-icons/io5";
import SplitReceipt from "./SplitReceipt";
import { postReceiptHeader } from "../../actions/Charges-Actions/postReceiptHeader";
import { getReceiptPage } from "../../actions/Charges-Actions/getReceiptPage";

const { Title, Text } = Typography;

const ViewPatientsReceipts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const patientNo = new URLSearchParams(useLocation().search).get("PatientNo");
  const { userData } = useAuth();
  const { state } = useLocation();
  const { patientData } = state;

  const { loading: loadingChargesLines, data } = useSelector(
    (state) => state.getChargesLines
  );
  const { loading: printInvoiceLoading } = useSelector(
    (state) => state.printInvoice
  );

  const { data: receiptLines } = useSelector((state) => state.getReceiptLines);
  const { data: receiptHeader } = useSelector(
    (state) => state.getReceiptHeaderLines
  );
  const { loading: chargesLoading, data: chargesList } = useSelector(
    (state) => state.getUnpostedCharges
  );

  const { loading: deleteLoading } = useSelector(
    (state) => state.deletePatientCharges
  );
  const { data: lastreceiptHeader } = useSelector(
    (state) => state.getReceiptPage
  );
  const lastReceipt = lastreceiptHeader?.[lastreceiptHeader.length - 1]; // Get the last record

  const { loading } = useSelector((state) => state.postReceipt);
  const { loading:processReceiptLoading, error } = useSelector((state) => state.processReceipt);

  const branchName = localStorage.getItem("branchCode");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [appointmentNo, setAppointmentNo] = useState("");
  const [receiptNo, setReceiptNo] = useState(lastReceipt?.No || "");
  const [viewReceipts, setViewReceipts] = useState(false);
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
  const [balance, setBalance] = useState(patientData?.Balance || 0);
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState();
  const [record, setRecord] = useState(null);
  useEffect(() => {
    const appointmentNo = patientData?.ActiveVisitNo;
    if (appointmentNo) {
      dispatch(getUnpostedCharges(appointmentNo));
    }
  }, [dispatch, patientData?.ActiveVisitNo]);

  useEffect(() => {
    if (patientNo) {
      dispatch(getPatientReceiptLines(patientNo));
    }
  }, [dispatch, patientNo]);

  useEffect(() => {
    if (patientNo) {
      dispatch(getPatientReceiptHeader(patientNo));
    }
  }, [dispatch, patientNo]);
  useEffect(() => {
    if (chargesList && chargesList.length > 0) {
      // Recalculate balance from chargesList
      const newTotal = chargesList.reduce(
        (acc, charge) => acc + (charge.Total_Amount || 0),
        0
      );
      setBalance(newTotal);
    }
  }, [chargesList]); // Recalculate when chargesList changes

  // Also update balance when patientData changes
  useEffect(() => {
    if (patientData?.Balance !== undefined) {
      setBalance(patientData.Balance);
    }
  }, [patientData]);
  useEffect(() => {
    const appointmentNo = patientData?.ActiveVisitNo;
    console.log("appointmentNo", appointmentNo);
    if (appointmentNo) {
      dispatch(getReceiptPage(appointmentNo));
    }
  }, [dispatch, appointmentNo]);
  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGenerateReceipt = (patientNo) => {
    setIsGenerateReceiptModalVisible(true);
  };

  const handleViewReceipts = () => {
    setViewReceipts(true);
    setAppointmentNo(patientData?.ActiveVisitNo);
  };

  const handleClose = () => {
    setIsModalVisible(false);
    setShowPaymentModal(false);
    setReverseChargeModalVisible(false);
    setViewReceipts(false);
    setOpen(false);
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
    setAppointmentNo(patientData?.ActiveVisitNo);
    setSelectedPatientNo(patientData?.Patient_No);
    setTimeout(() => {
      setIsModalVisible(true);
    }, 0);
  };

  const showReverseModal = () => {
    setReverseChargeModalVisible(true);
    setSelectedRecId(receiptLines[0]?.SystemId);
    setAppointmentNo(patientData?.ActiveVisitNo);
  };
  const showLargeDrawer = async () => {
    try {
      if (!receiptNo) {  
        const formattedData = {
          myAction: "create",
          recId: "",
          patientNo: patientNo,
          receiptDate: new Date().toISOString().split("T")[0], 
          depositDate: new Date().toISOString().split("T")[0], 
          payMode: 0,
          transactionCode: "",
          splitAmount: false,
          amountReceived: 0,
          coPay: false,
        };
  
        const newReceiptNo = await dispatch(postReceiptHeader(formattedData));
  
        if (newReceiptNo) {
          setReceiptNo(newReceiptNo);  
        }
      }
  
      setOpen(true);
      setSize("large");
      setAppointmentNo(patientData?.ActiveVisitNo);
    } catch (error) {
      console.error("Validation or processing failed:", error);
    }
  };
  

  const handlePaymentModal = () => {
    setShowPaymentModal(true);
    setSelectedPatientNo(patientData?.PatientNo);
    setSelectedPatientAmount(patientData?.Balance || balance);
  };

  // When processing (posting) the receipt, update the state so printing is enabled.
  const handleProcessReceipt = async () => {
    const receipt = {
      recId: "",
      patientNo: patientData?.PatientNo,
      receiptNo: receiptNo,
    };

    await dispatch(postReceipt(receipt)).then((status) => {
      // Assuming a successful post returns data; adjust the check per your API response.
      if (status && status == "success") {
        setIsReceiptPosted(true);
        message.success("Receipt posted successfully");
      }else{
        message.error(error);
      }
    });
  };

  const handleRemoveCharge = (recId) => {
    const payload = {
      myAction: "delete",
      recId: recId,
      visitNo: "string",
      transactionType: "string",
      charge: "string",
      quantity: 0,
      remarks: "string",
    };

    dispatch(deletePatientCharges(payload)).then((status) => {
      if (status) {
        dispatch(getUnpostedCharges(patientData?.ActiveVisitNo));
      }
    });
  };

  const postedCharges =
    chargesList?.filter(
      (charge) => charge.Posted && charge.Transaction_Type !== "ZRECEIPT"
    ) || [];
  const unpostedCharges = chargesList?.filter((charge) => !charge.Posted) || [];

  const columns = [
    { title: "Patient No", dataIndex: "Patient_No", key: "Patient_No" },
    { title: "Date", dataIndex: "Date", key: "Date" },
    {
      title: "Transaction Type",
      dataIndex: "Transaction_Type",
      key: "Transaction_Type",
    },
    { title: "Code", dataIndex: "Code", key: "Code" },
    { title: "Description", dataIndex: "Description", key: "Description" },
    { title: "Quantity", dataIndex: "Quantity", key: "Quantity" },
    { title: "Amount", dataIndex: "Total_Amount", key: "Total_Amount" },
    {
      title: "Posted",
      dataIndex: "Posted",
      key: "Posted",
      render: (text) => (
        <Tag color={text ? "green" : "red"}>
          {text ? "Posted" : "Not Posted"}
        </Tag>
      ),
    },
  ];
  const unpostedColumns = [
    ...columns,
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="ghost"
            size="large"
            onClick={() => handleRemoveCharge(record.SystemId)}
          >
            <DeleteOutlined />
          </Button>
        </Space>
      ),
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
              icon={<FaCoins />}
              onClick={showModal}
            >
              Add Charges
            </Button>
            <Button type="default" onClick={() => handlePaymentModal()}>
              <DollarOutlined /> Initiate Payment
            </Button>
            <Button
              type="primary"
              size="medium"
              icon={<FaReceipt />}
              onClick={() => handleProcessReceipt()}
            >
              Post Receipt
            </Button>
            <Button
              icon={<PrinterOutlined style={{ color: "green" }} />}
              onClick={handleViewReceipts}
              size="medium"
              // disabled={!isReceiptPosted} // Only enable if receipt has been posted
            >
              View Receipts
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
            <Space justify="end" align="end">
              <Button
                type="default"
                size="medium"
                icon={<IoReceiptOutline />}
                onClick={showLargeDrawer}
              >
                Split Receipt
              </Button>
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
            <Title level={4}>Cash Billing </Title>
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
              {patientData.Names}

              <Text strong>Patient No:</Text>
              <p style={{ fontWeight: "bold", color: "brown" }}>
                {patientData.PatientNo}
              </p>
            </div>

            <div className="d-flex justify-content-start gap-4">
              <Text strong>Appointment No:</Text>
              <p
                style={{ fontWeight: "bold", color: "green" }}
                className="text-primary fw-bold"
              >
                {patientData.ActiveVisitNo}
              </p>

              <Text strong>Balance:</Text>
              <p>
                {balance.toLocaleString("en-KE", {
                  style: "currency",
                  currency: "KES",
                })}
              </p>
              <Text strong>Receipt No:</Text>
              <p style={{ fontWeight: "bold", color: "green" }}>{receiptNo}</p>
            </div>
          </Col>
        </Row>

        <Divider />
        <div className="d-flex  flex-column">
          <div className="d-flex flex-column text-start">
            <Title level={4}>Unposted Charges </Title>
            <Table
              dataSource={unpostedCharges}
              columns={unpostedColumns}
              rowKey="Code"
              pagination={{ pageSize: 5 }}
              loading={chargesLoading}
            />
          </div>
          <div className="d-flex flex-column text-start">
            <Title level={4}>Posted Charges </Title>
            <Table
              dataSource={postedCharges}
              columns={columns}
              rowKey="Code"
              pagination={{ pageSize: 5 }}
              loading={chargesLoading}
            />
          </div>
        </div>
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
          {/* <Col span={10}>
            <Row justify="space-between">
              <Col span={12}>
                <Text strong>Total Amount:</Text>
              </Col>
              <Col span={12}>
                <Text style={{ color: "green" }} strong>
                  {patientData?.totalAmount?.toLocaleString("en-KE", {
                    style: "currency",
                    currency: "KES",
                  })}
                </Text>
              </Col>
            </Row>
          </Col> */}
        </Row>
      </Card>

      <AddCharges
        visible={isModalVisible}
        onClose={handleClose}
        visitNo={appointmentNo}
        refreshTable={() => dispatch(getUnpostedCharges(appointmentNo))}
      />
      <ProcessPayment
        visible={showPaymentModal}
        onClose={handleClose}
        patientNo={selectedpatientNo}
        amount={balance}
        onReceiptedNo={setReceiptNo}
      />
      <ReversCharge
        visible={ReverseChargeModalVisible}
        onClose={handleClose}
        patientNo={receiptHeader[0]?.Patient_No}
        amount={receiptHeader[0]?.Total_Amount}
        recId={selectedRecId}
      />
      <ViewReceipt
        visible={viewReceipts}
        onClose={() => setViewReceipts(false)}
        visitNo={appointmentNo}
      />
      <SplitReceipt
        open={open}
        receiptNo={receiptNo}
        visitNo={appointmentNo}
        onClose={() => setOpen(false)}
        amount={balance}
        size={size}
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
