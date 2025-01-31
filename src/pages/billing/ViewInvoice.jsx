import React, { useState } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Table,
  Button,
  Divider,
  Space,
} from "antd";
import {
  DownloadOutlined,
  PrinterOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCoins } from "react-icons/fa";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { postReceipt } from "../../actions/Charges-Actions/postReceipt";
import AddCharges from "./AddCharges";

const { Title, Text } = Typography;

const ViewInvoice = () => {
  const dispatch = useDispatch();
  const navigate= useNavigate();
  const { state } = useLocation();
  const { header, lines } = state.patientData; // Extract header and lines
  const { loading } = useSelector((state) => state.printReceipt);

  const [isModalVisible, setIsModalVisible] = useState(false);
const[appointmentNo, setAppointmentNo] = useState('')

 const handleGoBack = () => {
    navigate(-1);
  };

  const handleClose = () => {
    setIsModalVisible(false);
  
  };

  const showModal = () => {
    setAppointmentNo(header[0]?.Patient_Appointment_No); 
    setTimeout(() => {
      setIsModalVisible(true);
    }, 0); 
  };
  

  const handlePrintReceipt = () => {
    const receipt = {
      recId: "",
      patientNo: header[0].Patient_No,
      receiptNo: header[0].No,
    };
    console.log(receipt);

    dispatch(postReceipt(receipt));
  };

  const grandTotal = lines
    ?.reduce((total, line) => total + line.Amount, 0)
    .toLocaleString("en-KE", {
      style: "currency",
      currency: "KES",
    });

  const tableData = lines?.map((line, index) => ({
    key: index,
    transactionName: line.TransactionName,
    payMode: line.PayMode,
    amount: line.Amount.toLocaleString("en-KE", {
      style: "currency",
      currency: "KES",
    }),
    transactionType: line.TransactionType,
  }));

  const columns = [
    {
      title: "Transaction Name",
      dataIndex: "transactionName",
      key: "transactionName",
    },
    {
      title: "Payment Mode",
      dataIndex: "payMode",
      key: "payMode",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Transaction Type",
      dataIndex: "transactionType",
      key: "transactionType",
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
            <Text>Phone: +254 700 000 000</Text>
          </Col>

          <Col>
            <Space>
              {/* <Button icon={<DownloadOutlined />}>Download</Button> */}
              <Button
                icon={<PrinterOutlined style={{ color: "green", size: "29px" }} />}
                loading={loading}
                onClick={handlePrintReceipt}
                size="large"
              >
                Print Receipt
              </Button>
              {/* <Button icon={<EditOutlined />}>Edit</Button> */}
              <Button type="primary" size="large" icon={<FaCoins />} onClick={showModal}>
                Add Charges
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

        <Row>
          <Col span={12}>
            <Text strong>Received From:</Text>
            <p>{header[0]?.Received_From}</p>

            <Text strong>Patient No:</Text>
            <p>{header[0]?.Patient_No}</p>

            <Text strong>Appointment No:</Text>
            <p>{header[0]?.Patient_Appointment_No}</p>

            <Text strong>Date:</Text>
            <p>
              {header[0]?.Date
                ? moment(header[0]?.Date).format("Do MMM YYYY")
                : ""}
            </p>
          </Col>

          <Col span={12}>
            <Text strong>Cashier:</Text>
            <p>{header[0]?.Cashier}</p>

            <Text strong>Amount Received:</Text>
            <p>
              {header[0]?.Amount_Recieved?.toLocaleString("en-KE", {
                style: "currency",
                currency: "KES",
              })}
            </p>

            <Text strong>Document Date:</Text>
            <p>
              {header[0]?.Document_Date
                ? moment(header[0]?.Document_Date).format("Do MMM YYYY")
                : ""}
            </p>
          </Col>
        </Row>

        <Divider />

        <Table dataSource={tableData} columns={columns} pagination={false} />

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
                <Text style={{ color: "green" }}>
                  {header[0]?.Total_Amount.toLocaleString("en-KE", {
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
                <Text style={{ color: "green" }}>{grandTotal}</Text>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>

      <AddCharges visible={isModalVisible} onClose={handleClose} visitNo={appointmentNo} />
    </div>
  );
};

export default ViewInvoice;
