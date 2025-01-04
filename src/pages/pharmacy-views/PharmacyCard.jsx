import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Button,
  Table,
  Typography,
  Modal,
  Form,
  Input,
  message,
} from "antd";
import {
  MedicineBoxOutlined,
  PlusOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { FaFolderClosed, FaTablets } from "react-icons/fa6";
import { IoListOutline } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import {
  postArchivePrescription,
  postDrugIssuance,
} from "../../actions/pharmacy-actions/postPharmacyAction";
import { useDispatch, useSelector } from "react-redux";
import { getPharmacyLineReturnbyPharmacyNo } from "../../actions/pharmacy-actions/getPharmacyLineReturns";

const { Title, Text } = Typography;

const PharmacyCard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const pharmacyNo = queryParams.get("PharmacyNo");

  const { loading: loadingDrugIssuance } = useSelector(
    (state) => state.postDrugIssuance
  );
  const { loading: loadingArchivePrescription } = useSelector(
    (state) => state.postArchivePrescription
  );
  const { loading: loadingPatientReturnLines, data: patientReturnLines } =
    useSelector((state) => state.getPatientPharmacyReturnLine);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  useEffect(() => {
    if (pharmacyNo) {
      dispatch(getPharmacyLineReturnbyPharmacyNo(pharmacyNo));
    }
  }, [dispatch, pharmacyNo]);

  const columns = [
    { title: "No", dataIndex: "no", key: "no" },
    { title: "Drug Name", dataIndex: "drugName", key: "drugName" },
    { title: "Unit Price", dataIndex: "unitPrice", key: "unitPrice" },
    { title: "Total Price", dataIndex: "totalPrice", key: "totalPrice" },
    { title: "Actual Qty", dataIndex: "actualQty", key: "actualQty" },
    { title: "Dosage", dataIndex: "dosage", key: "dosage" },
    { title: "Frequency", dataIndex: "frequency", key: "frequency" },
    { title: "Take", dataIndex: "take", key: "take" },
    { title: "Route", dataIndex: "route", key: "route" },
    { title: "Days", dataIndex: "days", key: "days" },
    { title: "Remarks", dataIndex: "remarks", key: "remarks" },
  ];

  const dataSource = [
    {
      key: patientReturnLines?.PharmacyReturnLineNo,
      no: patientReturnLines?.PharmacyReturnLineNo,
      drugName: patientReturnLines?.DrugName,
      unitPrice: patientReturnLines?.UnitPrice,
      totalPrice: patientReturnLines?.TotalPrice,
      actualQty: patientReturnLines?.ActualQty,
      dosage: patientReturnLines?.Dosage,
      frequency: patientReturnLines?.Frequency,
      take: patientReturnLines?.Take,
      route: patientReturnLines?.Route,
      days: patientReturnLines?.Days,
      remarks: patientReturnLines?.Remarks,
    },
  ];

  const openModal = () => setIsModalOpen(true);

  const closeModal = () => {
    form.resetFields();
    setIsModalOpen(false);
  };

  const handleFormSubmit = (values) => {
    console.log("Prescription Data:", values);
    closeModal();
  };

  const handleDrugIssuance = () => {
    dispatch(postDrugIssuance(pharmacyNo));
  };

  const handleArchivePrescription = () => {
    dispatch(postArchivePrescription(pharmacyNo)).then((data) => {
      if (data.status === "success") {
        message.success("Prescription archived successfully");
      } else {
        message.error("An error occurred, please try again");
      }
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <Title
        level={3}
        style={{
          color: "#0F5689",
          marginBottom: "12px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <MedicineBoxOutlined style={{ marginRight: "8px" }} />
        Pharmacy Card
      </Title>

      <Row justify="space-between" style={{ marginBottom: "20px" }}>
        <Button
          type="primary"
          onClick={() => navigate("/Doctor/Pharmacy-OutPatient")}
          icon={<IoListOutline />}
        >
          Pharmacy List
        </Button>

        <Row justify="space-between" className="gap-2">
          <Button
            type="primary"
            onClick={handleDrugIssuance}
            icon={<PlusOutlined />}
          >
            Post Drug Issuance
          </Button>
          <Button
            type="primary"
            onClick={handleArchivePrescription}
            icon={<FaFolderClosed />}
          >
            Archive Prescription
          </Button>
        </Row>
      </Row>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "5px",
          padding: "10px",
          backgroundColor: "#f5f5f5",
          color: "#0F5689",
          fontWeight: "semibold",
        }}
      >
        {/* <Typography.Title level={5} style={{ color: "#0F5689", fontSize: "16px", marginBottom: "12px", display: "flex", alignItems: "center", }}>
          <UserOutlined style={{ marginRight: "8px" }} />
            Patient Details
        </Typography.Title> */}
        <Row style={{ borderBottom: "1px solid #ddd", padding: "10px 0" }}>
          <Col span={12}>
            <Text strong>Number :</Text> PHA-00025
          </Col>
          <Col span={12}>
            <Text strong>Patient No. :</Text> P00140
          </Col>
        </Row>
        <Row style={{ borderBottom: "1px solid #ddd", padding: "10px 0" }}>
          <Col span={12}>
            <Text strong>Names :</Text> JOE HULU WANYAMA
          </Col>
          <Col span={12}>
            <Text strong>Date :</Text> 7/30/2024
          </Col>
        </Row>
        <Row style={{ borderBottom: "1px solid #ddd", padding: "10px 0" }}>
          <Col span={12}>
            <Text strong>Patient Type :</Text> Corporate
          </Col>
          <Col span={12}>
            <Text strong>Cash Sale :</Text>
          </Col>
        </Row>
        <Row style={{ borderBottom: "1px solid #ddd", padding: "10px 0" }}>
          <Col span={12}>
            <Text strong>Location :</Text>
          </Col>
          <Col span={12}>
            <Text strong>Transaction Type :</Text>
          </Col>
        </Row>
        <Row style={{ borderBottom: "1px solid #ddd", padding: "10px 0" }}>
          <Col span={12}>
            <Text strong>Request Area :</Text> Doctor
          </Col>
          <Col span={12}>
            <Text strong>Insurance :</Text>
          </Col>
        </Row>
        <Row style={{ borderBottom: "1px solid #ddd", padding: "10px 0" }}>
          <Col span={12}>
            <Text strong>Remarks :</Text>
          </Col>
          <Col span={12}>
            <Text strong>Status :</Text> New
          </Col>
        </Row>
        <Row style={{ padding: "10px 0" }}>
          <Col span={24}>
            <Text strong>Total Price :</Text>{" "}
            <span style={{ color: "blue" }}>KShs. 20.00</span>
          </Col>
        </Row>
      </div>

      <Button
        type="primary"
        icon={<PlusOutlined />}
        style={{
          marginTop: "20px",
          marginBottom: "10px",
          border: "1px solid #ddd",
        }}
        onClick={openModal}
      >
        Add
      </Button>

      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        bordered
      />

      <Modal
        title="Add Prescription"
        visible={isModalOpen}
        onCancel={closeModal}
        footer={null}
      >
        <Form layout="vertical" form={form} onFinish={handleFormSubmit}>
          <Form.Item
            label="Drug Name"
            name="drugName"
            rules={[{ required: true, message: "Please enter the drug name!" }]}
          >
            <Input placeholder="Enter drug name" />
          </Form.Item>
          <Form.Item
            label="Dosage"
            name="dosage"
            rules={[{ required: true, message: "Please enter the dosage!" }]}
          >
            <Input placeholder="Enter dosage" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PharmacyCard;
