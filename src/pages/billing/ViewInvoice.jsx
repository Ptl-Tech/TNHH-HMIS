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
  Menu,
  Dropdown,
  notification,
} from "antd";
import {
  DownloadOutlined,
  PrinterOutlined,
  EditOutlined,
  DeleteOutlined,
  DollarOutlined,
  StopOutlined,
  MinusCircleOutlined,
  UndoOutlined,
  FileDoneOutlined,
  CreditCardOutlined,
  TransactionOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCoins, FaFileInvoice, FaReceipt } from "react-icons/fa";
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
import { postsalesInvoice } from "../../actions/Charges-Actions/postSalesInvoice";
import ViewReceipt from "./ViewReceipt";
import { reopensalesInvoice } from "../../actions/Charges-Actions/postReopenInvoice";
import InvoicePayment from "./InvoicePayment";
import AllocateRebates from "./AllocateRebates";

const { Title, Text } = Typography;

const ViewInvoice = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const patientNo = new URLSearchParams(useLocation().search).get("PatientNo");
  const { userData } = useAuth();
  const { state } = useLocation();
  const { patientData } = state;

  const { loading: chargesLoading, data: chargesList } = useSelector(
    (state) => state.getUnpostedCharges
  );

  const { data: patientHeader } = useSelector(
    (state) => state.getPatientReceiptHeader
  );

  const { loading: postSalesInvoiceLoading } = useSelector(
    (state) => state.postSalesInvoice
  );

  const { loading: reopenPostedChargesLoading } = useSelector(
    (state) => state.reopenPostedCharges
  );

  const { loading } = useSelector((state) => state.deletePatientCharges);
  const { loading: postReceiptLoading } = useSelector(
    (state) => state.postReceipt
  );

  const branchName = localStorage.getItem("branchCode");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [appointmentNo, setAppointmentNo] = useState("");
  const [invoiceNo, setinvoiceNo] = useState("");
  const [viewInvoice, setViewInvoice] = useState(false);
  const [selectedpatientNo, setSelectedPatientNo] = useState("");
  const [selectedPatientAmount, setSelectedPatientAmount] = useState("");
  const [selectedRecId, setSelectedRecId] = useState("");
  const [ReverseChargeModalVisible, setReverseChargeModalVisible] =
    useState(false);
  const [pdfBase64, setPdfBase64] = useState("");
  const [showPDFModal, setShowPDFModal] = useState(false);
  const [isInvoiceModalVisible, setIsInvoiceModalVisible] = useState(false);
  const [receiptNo, setReceiptNo] = useState("");

  const [isPostInvoiceModal, setIsPostInvoiceModal] = useState(false);
  const [isReopenInvoiceModal, setIsReopenInvoiceModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showRebatesModal, setshowRebatesModal] = useState(false);
  // NEW: Track whether the Invoice has been posted.
  const [isInvoicePosted, setIsInvoicePosted] = useState(false);
  const [balance, setBalance] = useState(patientData?.Balance || 0);

  useEffect(() => {
    const appointmentNo = patientData?.ActiveVisitNo;
    if (appointmentNo) {
      dispatch(getUnpostedCharges(appointmentNo));
    }
  }, [dispatch, patientData?.ActiveVisitNo]);

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

  const postedCharges = chargesList?.filter((charge) => charge.Posted) || [];
  const unpostedCharges = chargesList?.filter((charge) => !charge.Posted) || [];

  const handleGoBack = () => {
    navigate(-1);
  };

  const confirmGenerateInvoice = () => {
    setSelectedPatientNo(patientData.PatientNo);
    setIsInvoiceModalVisible(true);
  };

  const postSalesInvoice = () => {
    setSelectedPatientNo(patientData.PatientNo);
    setinvoiceNo(postedCharges[0]?.Invoice_Number);
    setIsPostInvoiceModal(true);
  };

  const reopenSalesInvoice = () => {
    setSelectedPatientNo(patientData.PatientNo);
    setAppointmentNo(patientData.ActiveVisitNo);
    setIsReopenInvoiceModal(true);
  };

  const handleConfirmGenerateInvoice = () => {
    dispatch(postGenerateInvoice(selectedpatientNo)).then((status) => {
      if (status) {
        dispatch(getUnpostedCharges(patientData?.ActiveVisitNo));
      }
    });

    setIsInvoiceModalVisible(false);
  };
  const handleProcessInvoice = async () => {
    try {
      const Invoice = {
        patientNo: patientData?.PatientNo,
        invoiceNo: invoiceNo,
      };

      // Dispatch the action and wait for its response
      const status = await dispatch(postsalesInvoice(Invoice));

      setIsPostInvoiceModal(false);

      if (status === "success") {
        setIsInvoicePosted(true);
        notification.success({
          message: "Invoice Posted",
          description: "Invoice posted successfully!",
          duration: 5,
        });
      }
    } catch (error) {
      console.error("Error posting invoice:", error);
      notification.error({
        message: "Error",
        description: error.response?.data?.errors || "Something went wrong.",
        duration: 5,
      });
      setIsPostInvoiceModal(false);
    }
  };

  const handleReversePostedInvoice = async () => {
    try {
      const Invoice = {
        patientNo: patientData?.PatientNo,
        appointmentNo: patientData?.ActiveVisitNo,
      };

      console.log(Invoice);

      // Dispatch the action and wait for its response
      const status = await dispatch(reopensalesInvoice(Invoice));

      setIsReopenInvoiceModal(false);

      if (status === "success") {
        setIsReopenInvoiceModal(true);
        notification.success({
          message: "Reverse Invoice",
          description: "Invoice reversed successfully!",
          duration: 5,
        });

        dispatch(getUnpostedCharges(patientData?.ActiveVisitNo));
      }
    } catch (error) {
      console.error("Error posting invoice:", error);
      notification.error({
        message: "Error",
        description: error.response?.data?.errors || "Something went wrong.",
        duration: 5,
      });
      setIsReopenInvoiceModal(false);
    }
  };

  const handleClose = () => {
    setIsModalVisible(false);
    setShowPaymentModal(false);
    setReverseChargeModalVisible(false);
    setViewInvoice(false);
    setshowRebatesModal(false);
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
    setSelectedRecId(postedCharges[0]?.SystemId);
  };

  const handlePrintInterimInvoice = () => {
    const invoiceData = {
      PatientNo: patientData?.PatientNo,
      visitNo: patientData?.ActiveVisitNo,
    };

    dispatch(postInterimInvoice(invoiceData)).then((response) => {
      if (response?.data.base64) {
        setPdfBase64(response.data.base64);
        setShowPDFModal(true); // Open modal to show PDF
      }
    });
  };
  const handlePrintInvoice = () => {
    // Ensure there are posted charges before allowing printing
    if (postedCharges.length === 0) {
      return message.error("Please post Final Invoice before printing invoice");
    }

    const patientNo = patientData?.PatientNo;

    dispatch(postPrintInvoice(patientNo)).then((response) => {
      if (response?.data.base64) {
        setPdfBase64(response.data.base64);
        setShowPDFModal(true); // Open modal to show PDF
      }
    });
  };

  // When processing (posting) the Invoice, update the state so printing is enabled.

  const handlePaymentModal = () => {
    setShowPaymentModal(true);
    setSelectedPatientNo(patientData?.PatientNo);
    setSelectedPatientAmount(patientData?.Balance || balance);
  };

  const handleRebatesModal = () => {
    setshowRebatesModal(true);
    setSelectedPatientNo(patientData?.PatientNo);
    // setSelectedPatientAmount(patientData?.Balance || balance);
  };
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
  const handleReverseCharge = () => {
    setSelectedPatientNo(patientData?.PatientNo);
    setReverseChargeModalVisible(true);
    setSelectedRecId(unpostedCharges[0]?.SystemId);
    setSelectedPatientAmount(patientData?.Balance || balance);
  };

  // const totalReceived =
  //   patientInvoice?.reduce((acc, line) => acc + line.Amount, 0) || 0;

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
  const menu = (
    <Menu className="text-start">
      <Menu.Item key="0">
        <Button
          type="text"
          icon={<PrinterOutlined style={{ color: "green" }} />}
          onClick={handlePrintInterimInvoice}
        >
          Print Interim Invoice
        </Button>
      </Menu.Item>
      <Menu.Item key="1">
        <Button
          type="text"
          icon={<FileDoneOutlined style={{ color: "green" }} />}
          onClick={postSalesInvoice}
        >
          Post Invoice
        </Button>
      </Menu.Item>
      <Menu.Item key="2">
        <Button
          type="text"
          icon={<PrinterOutlined style={{ color: "blue" }} />}
          onClick={handlePrintInvoice}
        >
          Print Invoice
        </Button>
      </Menu.Item>
      <Menu.Item key="3">
        <Button
          type="text"
          icon={<CreditCardOutlined style={{ color: "gold" }} />}
          onClick={handlePaymentModal}
        >
          Co-Pay
        </Button>
      </Menu.Item>
      <Menu.Item key="4">
        <Button
          type="text"
          icon={<TransactionOutlined style={{ color: "blue" }} />}
          onClick={handleRebatesModal}
        >
          Allocate SHIF Rebates
        </Button>
      </Menu.Item>
      <Menu.Item key="5">
        <Button
          type="text"
          icon={<DeleteOutlined style={{ color: "red" }} />}
          onClick={handleReverseCharge}
          danger
        >
          Waive Charges
        </Button>
      </Menu.Item>
    </Menu>
  );
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

            <Button
              type="default"
              size="medium"
              icon={<FaReceipt />}
              onClick={() => confirmGenerateInvoice()}
            >
              Generate Invoice
            </Button>
            <Space>
              <Dropdown overlay={menu} trigger={["click"]}>
                <Button type="dashed">
                  More Actions <MinusCircleOutlined />
                </Button>
              </Dropdown>
            </Space>
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
                icon={<UndoOutlined />}
                style={{ color: "red" }}
                onClick={() => reopenSalesInvoice()}
              >
                Re-open Posted Charges
              </Button>
            </Space>
          </Col>
        </Row>

        <Divider />
        <Row justify="space-between">
          <Col>
            <Title level={4}>Insurance Billing </Title>
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

              <Text strong>Invoice No:</Text>
              <p style={{ fontWeight: "bold", color: "green" }}>
                {postedCharges[0]?.Invoice_Number}
              </p>
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
      <Modal
        title="Post Sales Invoice"
        visible={isPostInvoiceModal}
        onOk={handleProcessInvoice}
        onCancel={() => setIsPostInvoiceModal(false)}
        okText="Yes"
        cancelText="No"
      >
        <p>
          Are you sure you want to post sale's invoice for Patient No:{" "}
          <strong>{selectedpatientNo}</strong>?
        </p>
      </Modal>
      <Modal
        title="Reverse Invoice"
        visible={isReopenInvoiceModal}
        onOk={handleReversePostedInvoice}
        onCancel={() => setIsReopenInvoiceModal(false)}
        okText="Yes"
        cancelText="No"
      >
        <p>
          Are you sure you want to reopen invoice for Patient No:{" "}
          <strong>{selectedpatientNo}</strong>?
        </p>
      </Modal>
      <AddCharges
        visible={isModalVisible}
        onClose={handleClose}
        visitNo={appointmentNo}
        refreshTable={() =>
          dispatch(getUnpostedCharges(patientData?.ActiveVisitNo))
        }
      />
      <AllocateRebates
        visible={showRebatesModal}
        onClose={handleClose}
        patientNo={patientData.PatientNo}
      />
      <InvoicePayment
        visible={showPaymentModal}
        onClose={handleClose}
        patientNo={selectedpatientNo}
        amount={selectedPatientAmount}
        onReceiptedNo={setReceiptNo}
      />
      <ReversCharge
        visible={ReverseChargeModalVisible}
        onClose={handleClose}
        patientNo={selectedpatientNo}
        amount={selectedPatientAmount}
        recId={selectedRecId}
      />
      <ViewReceipt
        visible={viewInvoice}
        onClose={() => setViewInvoice(false)}
        visitNo={appointmentNo}
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
