import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  Modal,
  Table,
  Row,
  Col,
  Divider,
} from "antd";
import moment from "moment";
import Title from "antd/es/skeleton/Title";
import logoLogin from "../assets/images/logoLogin.png";
import { useLocation } from "react-router-dom";

const { Option } = Select;

const CreateVisitForm = () => {
  const [dispatchToModalVisible, setDispatchToModalVisible] = useState(false);
  const [billingModalVisible, setBillingModalVisible] = useState(false);
  const [postedChargesModalVisible, setPostedChargesModalVisible] =
    useState(false);
  const [form] = Form.useForm();
  const { state } = useLocation();
  const patient = state?.patient; // Get the patient object passed through navigate

  const handleDispatchTo = () => {
    setDispatchToModalVisible(true);
  };

  const handleBilling = () => {
    setBillingModalVisible(true);
  };

  const handlePostedCharges = () => {
    setPostedChargesModalVisible(true);
  };

  const handleModalClose = () => {
    setDispatchToModalVisible(false);
    setBillingModalVisible(false);
    setPostedChargesModalVisible(false);
  };
  useEffect(() => {
    if (patient) {
      form.setFieldsValue({
        patientNo: patient?.PatientNo || "",
        patientNames: `${patient?.Names || ""} ${patient?.LastName || ""} ${patient?.MiddleName || ""}`.trim(),
        branch: patient?.GlobalDimension1Code || "",
        clinic: patient?.GlobalDimension2Code || "",
        SettlementType: patient?.PatientType || "",
        insuranceNo: patient?.InsuranceNo || "",
        insuranceName: patient?.InsuranceName || "",
      });
    } else {
      // Set default values if no patient is provided
      form.setFieldsValue({
        patientNo: "",
        patientNames: "",
        branch: "",
        clinic: "",
        SettlementType: "",
        insuranceNo: "",
        insuranceName: "",
      });
    }
  
    // Set current date and time by default
    form.setFieldsValue({
      date: moment(),
      time: moment(),
    });
  }, [form, patient]);
  
  // Sample billing data
  const billingData = {
    VisitNo: "APP_00009",
    TransactionType: "Insurance",
    Code: "12345",
    Date: moment().format("MM/DD/YYYY"),
    Description: "Consultation Fee",
    Amount: 100.0,
    Quantity: 1,
    BillSection: "General",
    BillType: 1, // 0 = Normal, 1 = Recurring, 2 = Once
    RecurringType: "Monthly",
    DoctorName: "Dr. John Doe",
    InvoiceId: "INV_123456",
    ReceiptAmount: 100.0,
    BranchCode: "BR001",
    CustomerCode: "CUST001",
    CorporateExcluded: 0.0,
    InsurancePaidAmount: 0.0,
  };

  // Table columns for billing items
  const columns = [
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (text) => `$${text.toFixed(2)}`,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (text, record) =>
        `$${(record.amount * record.quantity).toFixed(2)}`,
    },
  ];

  const lineItems = [
    {
      key: "1",
      description: billingData.Description,
      amount: billingData.Amount,
      quantity: billingData.Quantity,
    },
  ];

  const totalAmount = lineItems.reduce(
    (acc, item) => acc + item.amount * item.quantity,
    0
  );

  return (
    <Form form={form} layout="vertical" style={{ padding: "1rem" }}>
      <div className="card">
        <div className="card-header" style={{ backgroundColor: "#f5f5dc" }}>
          <h3>Visit Card</h3>
          <p>Check In Date: {moment().format("MM/DD/YYYY")}</p>
          <p>Check In Time: {moment().format("hh:mm A")}</p>
        </div>

        <div className="card-body">
          {/* Action Bar */}
          <div className="d-flex justify-content-end py-1 gap-2">
            <Button type="primary" onClick={handleDispatchTo} className="mr-2">
              Dispatch To
            </Button>
            <Button type="primary" onClick={handleBilling} className="mr-2">
              Billing Action
            </Button>
            <Button type="primary" onClick={handlePostedCharges}>
              Posted Charges
            </Button>
          </div>

          {/* Form Fields for Visit Details */}
          {/* Other fields... */}
          <div className="row pt-1">
            <div className="col-md-6 col-sm-12">
            <Form.Item label="Patient No" name="patientNo">
            <Input placeholder="Enter Patient No" size="large" disabled  style={{ color: '#28a745', fontWeight: 'bold' }} />
          </Form.Item>
            </div>
            <div className="col-md-6 col-sm-12">
              <Form.Item label="Patient Names" name="patientNames">
                <Input placeholder="Enter Patient Names" size="large" disabled  style={{ color: '#28a745', fontWeight: 'bold' }} />
              </Form.Item>
            </div>
          </div>
          <div className="row pt-1">
            <div className="col-md-6 col-sm-12">
              <Form.Item label="Branch" name={"branch"}>
                <Select placeholder="Select Branch" size="large">
                  <Option value="braeside">BRAESIDE</Option>
                </Select>
              </Form.Item>
            </div>
            <div className="col-md-6 col-sm-12">
              <Form.Item label="Special Clinics">
                <Input placeholder="Enter Clinic Name" size="large" />
              </Form.Item>
            </div>
          </div>

          <div className="row pt-1">
            <div className="col-md-6 col-sm-12">
              <Form.Item label="Settlement Type" name={"SettlementType"}>
                <Select placeholder="Select Settlement Type" size="large">
                  <Option value="insurance">Insurance</Option>
                  <Option value="corporate">Corporate</Option>
                </Select>
              </Form.Item>
            </div>
            <div className="col-md-6 col-sm-12">
              <Form.Item label="Doctor Type" name={"doctorType"}>
                <Select placeholder="Choose Doctor" size="large">
                  <Option value="general">General</Option>
                  <Option value="special">Special</Option>
                </Select>
              </Form.Item>
            </div>
          </div>

          <div className="row pt-1">
            <div className="col-md-6 col-sm-12">
              <Form.Item label="Appointment Type" name={"appointmentType"}>
                <Select placeholder="Select Appointment Type" size="large">
                  <Option value="revisit">Revisit</Option>
                  <Option value="review">Review</Option>
                </Select>
              </Form.Item>
            </div>
            <div className="col-md-6 col-sm-12">
              <Form.Item label="Doctor Name" name={"doctorName"}>
                <Select placeholder="Select Doctor" size="large">
                  <Option value="john">John</Option>
                  <Option value="jane">Jane</Option>
                </Select>
              </Form.Item>
            </div>
          </div>
          <div className="row pt-1">
            <div className="col-md-6 col-sm-12">
              <Form.Item label="Patient Type" name={"SettlementType"}>
                <Select placeholder="Select Patient Type" size="large">
                  <Option value="corporate">Corporate</Option>
                  <Option value="cash">Cash</Option>
                </Select>
              </Form.Item>
            </div>
            <div className="col-md-6 col-sm-12">
              <Form.Item label="Insurance No" name={"insuranceNo"}>
                <Input placeholder="Enter Insurance No" size="large" />
              </Form.Item>
            </div>
          </div>
        </div>
      </div>

      {/* Dispatch To Modal */}
      <Modal
        title="Dispatch To"
        visible={dispatchToModalVisible}
        onCancel={handleModalClose}
        onOk={handleModalClose}
      >
        <Form layout="vertical">
          <Form.Item label="Room ID">
            <Input placeholder="Enter Room ID" />
          </Form.Item>
          <Form.Item label="Doctor">
            <Input placeholder="Enter Doctor Name" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Billing Modal with Patient Details in Header */}
      {/* Billing Modal with Patient Details in Header */}
      <Modal
        title={
          <div className="modal-title-content">
            <div className="modal-logo-container">
              <img src={logoLogin} alt="Logo" className="modal-logo" />
            </div>
            {/* <h3>Invoice Details</h3> */}
            <div className="d-flex justify-content-between my-2">
              <div>
                <p>Patient No: {billingData.CustomerCode}</p>
                <p>Visitor: John Doe</p>
              </div>
              <div>
                <p>Invoice ID: {billingData.InvoiceId}</p>
                <p>Date: {billingData.Date}</p>
              </div>
              <div>
                <p>Payment Mode: {billingData.TransactionType}</p>
              </div>
            </div>
          </div>
        }
        visible={billingModalVisible}
        onCancel={handleModalClose}
        onOk={handleModalClose}
        width={800}
      >
        <Form layout="vertical">
          <Divider />
          <div className="mb-4">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Doctor Name">
                  <Input value={billingData.DoctorName} readOnly />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Transaction Type">
                  <Input value={billingData.TransactionType} readOnly />
                </Form.Item>
              </Col>
            </Row>
          </div>

          <Table
            columns={columns}
            dataSource={lineItems}
            pagination={false}
            rowKey="key"
          />

          <Row gutter={16} className="mt-4">
            <Col span={12}>
              <Form.Item label="Total">
                <Input value={`$${totalAmount.toFixed(2)}`} readOnly />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* Posted Charges Modal */}
      <Modal
        title="Posted Charges"
        visible={postedChargesModalVisible}
        onCancel={handleModalClose}
        onOk={handleModalClose}
      >
        <div>Details of Posted Charges go here...</div>
      </Modal>
    </Form>
  );
};

export default CreateVisitForm;
