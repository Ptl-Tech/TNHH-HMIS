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
  Pagination,
  Tooltip,
  Modal,
  Form,
  InputNumber,
} from "antd";
import { EyeOutlined, TeamOutlined } from "@ant-design/icons";
import { appmntList, listPatients } from "../actions/patientActions";
import { useNavigate } from "react-router-dom";

const InsurancePatients = () => {
  const {
    loading: patientsLoading,
    error: patientsError,
    patients,
  } = useSelector((state) => state.patientList);
  const { loading, patients: visitData } = useSelector((state) => state.appmntList);

  const [filteredPatients, setFilteredPatients] = useState([]);
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

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(listPatients());
  }, [dispatch]);

  useEffect(() => {
    dispatch(appmntList());
  }, [dispatch]);

  useEffect(() => {
    // Filter only "Corporate" patients and those with isActivated: true from visitData
    const InsurancePatients = visitData.filter(
      (patient) => patient.PatientType === "Corporate" && patient.Activated === true
    );
    setFilteredPatients(InsurancePatients);
  }, [visitData]); // Dependency on visitData

  const handleSearchChange = (e, key) => {
    const value = e.target.value;
    setSearchParams((prev) => ({ ...prev, [key]: value }));

    const filtered = visitData.filter((patient) => {
      const matchesName = patient.Names.toLowerCase().includes(searchParams.SearchNames.toLowerCase());
      const matchesAppointmentNo = patient.AppointmentNo.toLowerCase().includes(searchParams.AppointmentNo.toLowerCase());

      return (
        matchesName &&
        matchesAppointmentNo &&
        patient.PatientType === "Corporate" 
      );
    });

    setFilteredPatients(filtered);
  };

  const handlePaginationChange = (page, pageSize) => {
    setPagination({ current: page, pageSize });
  };

  const showModal = (patient) => {
    setSelectedPatient(patient);
    setBillingModalVisible(true);
  };

  const handleBillingSubmit = () => {
    setBillingModalVisible(false);
  };

  const columns = [
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
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Tooltip title="View Details">
            <Button icon={<EyeOutlined />} onClick={() => showModal(record)}>
              View Details
            </Button>
          </Tooltip>
          <Tooltip title="Bill and Clear">
            <Button
              type="primary"
              onClick={() => showModal(record)}
            >
              Bill & Clear
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ];

  const startIdx = (pagination.current - 1) * pagination.pageSize;
  const endIdx = startIdx + pagination.pageSize;
  const paginatedData = filteredPatients.slice(startIdx, endIdx);

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
        <Table
          columns={columns}
          loading={loading}
          dataSource={visitData.map((patient) => ({
            ...patient,
            key: patient.AppointmentNo,
          }))}
          rowSelection={{
            selectedRowKeys,
            onChange: (keys) => setSelectedRowKeys(keys),
          }}
          pagination={false}
          bordered
          size="small"
        />
        <Pagination
          total={filteredPatients.length}
          showTotal={(total, range) =>
            `${range[0]}-${range[1]} of ${total} items`
          }
          defaultPageSize={20}
          current={pagination.current}
          onChange={handlePaginationChange}
          style={{ float: "right", margin: "16px" }}
        />
      </div>

      <Modal
        title="Billing Details"
        visible={billingModalVisible}
        onCancel={() => setBillingModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setBillingModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleBillingSubmit}>
            Print Invoice
          </Button>,
        ]}
      >
        {selectedPatient && (
          <Form layout="vertical">
            <Form.Item label="Patient Name">
              <Input value={selectedPatient.Names} disabled  style={{fontWeight: 'bold', color: '#0f5689'}}/>
            </Form.Item>
            <Form.Item label="Appointment No">
              <Input value={selectedPatient.AppointmentNo} disabled />
            </Form.Item>
            <Form.Item label="Amount">
              <InputNumber
                min={0}
                defaultValue={selectedPatient.BillAmount || 0}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Form>
        )}
      </Modal>

      <style jsx>{`
        .row-warning {
          background-color: #faad14 !important;
        }
      `}</style>
    </div>
  );
};

export default InsurancePatients;
