import React, { useState, useEffect } from "react";
import { ReloadOutlined, TeamOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Card,
  Typography,
  Input,
  Row,
  Col,
  Table,
  Tag,
  message,
  Spin,
  Skeleton,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  admitVisitor,
  clearVisitor,
  getVisitorsList,
} from "../../actions/visitorsActions";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { ClearVisitorModal, AdmitVisitModal } from "./VisitorActionModals";

const SecVisitorList = () => {
  const [form] = Form.useForm();
  const [filteredVisitors, setFilteredVisitors] = useState([]);
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [admitModalVisible, setAdmitModalVisible] = useState(false);
  const [clearModalVisible, setClearModalVisible] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [admitError, setAdmitError] = useState(null);
  const [clearError, setClearError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false); // New state to track search

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    loading,
    visitors = [],
    error,
  } = useSelector((state) => state.visitorsList);

  useEffect(() => {
    dispatch(getVisitorsList());
  }, [dispatch]);

  useEffect(() => {
    if (visitors.length) {
      setFilteredVisitors(
        visitors.filter((v) => v.Status !== "Convert to Patient")
      );
    }
  }, [visitors]);
  const handleAdmitVisitor = async () => {
    if (!selectedVisitor) return;
    setLoadingStatus(true);
    setAdmitError(null); // Reset error before attempting

    try {
      await dispatch(admitVisitor(selectedVisitor.No));
      dispatch(getVisitorsList());
      setAdmitModalVisible(false);
      setSelectedVisitor(null);
      message.success("Visitor admitted successfully.");
      setHasSearched(false);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "An unexpected error occurred.";
      setAdmitError(errorMsg);
      message.error(`Failed to admit visitor: ${errorMsg}`);
    } finally {
      setLoadingStatus(false);
    }
  };

  const handleClearVisitor = async () => {
    if (!selectedVisitor) return;
    setLoadingStatus(true);
    setClearError(null); // Reset error before attempting

    try {
      const updatedStatus =
      selectedVisitor.Status === "Cleared" ? "Entered" : "Converted to Patient";
      await dispatch(clearVisitor(selectedVisitor.No, updatedStatus));
      dispatch(getVisitorsList());
      setClearModalVisible(false);
      setSelectedVisitor(null);
      message.success(`Visitor ${updatedStatus} successfully.`);
      setHasSearched(false);

    } catch (err) {
      const errorMsg =
        err.response?.data?.errors || "Failed to update visitor status.";
      setClearError(errorMsg);
      message.error(errorMsg);
    } finally {
      setLoadingStatus(false);
    }
  };
 
  const handleSearch = () => {
    
    const values = form.getFieldsValue();
    if(!values.IdNumber && !values.VisitorName && !values.VisitorPhone) {
      setFilteredVisitors(visitors.filter((v) => v.Status !== "Convert to Patient"));
      setHasSearched(false);
      return;
    }
    const results = visitors.filter(
      (v) =>
        (!values.IdNumber || v.IDNumber.includes(values.IdNumber)) &&
        (!values.VisitorName ||
          (v.VisitorName &&
            v.VisitorName.toLowerCase().includes(
              values.VisitorName.toLowerCase()
            ))) &&
        (!values.VisitorPhone || v.PhoneNumber.includes(values.VisitorPhone)) &&
        v.Status !== "Convert to Patient"
    );

    setFilteredVisitors(results);
    setHasSearched(true); 
  };

  const handleActionClick = (visitor) => {
    setSelectedVisitor(visitor);

    if (visitor.Status === "Open") {
      setAdmitModalVisible(true);
    } else if (visitor.Status === "Entered") {
      setClearModalVisible(true);
    } else if (visitor.Status === "Cleared") {
      navigate(`/Security/visitor-form/${visitor.No}`, {
        replace: true,
        state: { visitorData: visitor },
      });

      
    }
  };

  const columns = [
    {
      title: "Index",
      dataIndex: "index",
      key: "index",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Visitor No",
      dataIndex: "No",
      key: "No",
      render: (no) => <a href={`/visitor/${no}`}>{no}</a>,
    },
    {
      title: "Visitor Name",
      dataIndex: "VisitorName",
      key: "VisitorName",
      render: (name) => (name ? name.toUpperCase() : "N/A"),
    },
    { title: "ID Number", dataIndex: "IDNumber", key: "IDNumber" },
    {
      title: "Purpose of Visit",
      dataIndex: "PurposeofVisit",
      key: "PurposeofVisit",
    },
    { title: "Phone Number", dataIndex: "PhoneNumber", key: "PhoneNumber" },
    {
      title: "Date of Visit",
      dataIndex: "CreatedDate",
      key: "CreatedDate",
      render: (date) => (date ? dayjs(date).format("DD/MM/YYYY") : "N/A"),
    },
    {
      title: "Time In",
      dataIndex: "InitiatedByTime",
      key: "InitiatedByTime",
      render: (time) =>
        time
          ? new Date(`1970-01-01T${time}`).toLocaleTimeString()
          : "Invalid Time",
    },
    {
      title: "Status",
      dataIndex: "Status",
      key: "Status",
      render: (status) => {
        const statusColors = {
          Arrived: "orange",
          Entered: "red",
          Received: "blue",
          Cleared: "green",
          Open: "purple",
        };
        return <Tag color={statusColors[status] || "default"}>{status}</Tag>;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, visitor) => (
        <Button
          onClick={() => handleActionClick(visitor)}
          type="primary"
          disabled={loadingStatus}
        >
          {visitor.Status === "Cleared" ? "Create New Visit" : "Manage Visit"}
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center w-100">
        <h5
          style={{
            color: "#003F6D",
            textAlign: "center",
            padding: "10px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <TeamOutlined style={{ marginRight: 8 }} /> Visitors List
        </h5>
        <Button
          icon={<ReloadOutlined />}
          type="primary"
          onClick={() => dispatch(getVisitorsList())}
        >
          Refresh
        </Button>
      </div>

      {error && <Typography.Text type="danger">Error: {error}</Typography.Text>}

      <Card className="card-header mb-4 p-4">
        <Form layout="vertical" form={form} onValuesChange={handleSearch}>
          <Row gutter={16} className="mt-2">
            <Col span={6}>
              <Form.Item name="IdNumber">
                <Input placeholder="ID Number" allowClear />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="VisitorName">
                <Input placeholder="Visitor Name" allowClear />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="VisitorPhone">
                <Input placeholder="Visitor Phone" allowClear />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

       {hasSearched && (
        <div className="card-header mb-4 p-4">
          {loading ? (
            <Skeleton active paragraph={{ rows: 10 }} />
          ) : (
            <Table
              columns={columns}
              dataSource={filteredVisitors}
              rowKey="No"
              loading={loadingStatus}
              size="middle"
              pagination={{
                showSizeChanger: true,
                pageSizeOptions: ["10", "20"],
                defaultPageSize: 10,
              }}
            />
          )}
        </div>
      )}

      {selectedVisitor && (
        <AdmitVisitModal
          visible={admitModalVisible}
          visitor={selectedVisitor}
          onClose={() => {
            setAdmitModalVisible(false);
            setSelectedVisitor(null);
            setAdmitError(null);
          }}
          confirmAdmitVisitor={handleAdmitVisitor}
          admitVisitorLoading={loadingStatus}
          errorMessage={admitError}
        />
      )}

      {selectedVisitor && (
        <ClearVisitorModal
          modalVisible={clearModalVisible}
          setModalVisible={(visible) => {
            setClearModalVisible(visible);
            if (!visible) {
              setSelectedVisitor(null);
              setClearError(null);
            }
          }}
          confirmClearVisitor={handleClearVisitor}
          clearVisitorLoading={loadingStatus}
          visitor={selectedVisitor}
          errorMessage={clearError}
        />
      )}
    </div>
  );
};

export default SecVisitorList;
