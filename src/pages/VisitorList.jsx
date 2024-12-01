import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Select,
  TimePicker,
  Input,
  Tag,
  Row,
  Col,
  Card,
  Typography,
} from "antd";
import { TeamOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { getVisitorsList } from "../actions/visitorsActions";

const VisitorList = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingVisitor, setEditingVisitor] = useState(null);
  const [statusForm] = Form.useForm();
  const [searchType, setSearchType] = useState("VisitorNumber");
  const [searchValue, setSearchValue] = useState("");
  const [showTable, setShowTable] = useState(false); // Control visibility of the table
  const { loading, error, visitors } = useSelector(
    (state) => state.visitorsList
  );
  const [filteredVisitors, setFilteredVisitors] = useState([]);

  // Assuming logged-in user's info is stored in the Redux store or context
  const { userInfo } = useSelector((state) => state.otpVerify); // Replace with your actual user state path

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getVisitorsList());
  }, [dispatch]);

  useEffect(() => {
    setFilteredVisitors(visitors);
  }, [visitors]);

  const handleUpdateStatus = () => {
    statusForm.validateFields().then((values) => {
      setFilteredVisitors((prevVisitors) =>
        prevVisitors.map((visitor) =>
          visitor.key === editingVisitor.key
            ? {
                ...visitor,
                ...values,
                timeIn: values.timeIn?.format("HH:mm"),
                timeOut: values.timeOut?.format("HH:mm"),
              }
            : visitor
        )
      );
      setModalVisible(false);
      setEditingVisitor(null);
    });
  };

  const handleEditStatus = (visitor) => {
    setEditingVisitor(visitor);
    statusForm.setFieldsValue({
      status: visitor.Status,
      timeIn: visitor.timeIn ? dayjs(visitor.timeIn, "HH:mm") : null,
      timeOut: visitor.timeOut ? dayjs(visitor.timeOut, "HH:mm") : null,
    });
    setModalVisible(true);
  };

  const handleSearch = () => {
    const filtered = visitors.filter((visitor) =>
      visitor[searchType]?.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredVisitors(filtered);
    setShowTable(true); // Show the table after searching
  };

  const columns = [
    {
      title: "No",
      dataIndex: "No",
      key: "No",
    },
    {
      title: "Visitor Number",
      dataIndex: "VisitorNumber",
      key: "visitorNumber",
    },
    {
      title: "Visitor Name",
      dataIndex: "VisitorName",
      key: "visitorName",
    },
    {
      title: "Purpose of Visit",
      dataIndex: "PurposeofVisit",
      key: "PurposeofVisit",
    },
    {
      title: "Phone Number",
      dataIndex: "PhoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Date of Visit",
      dataIndex: "CreatedDate",
      key: "CreatedDate",
      render: (CreatedDate) => dayjs(CreatedDate).format("DD/MM/YYYY"),
    },
    {
      title: "Time In",
      dataIndex: "CreatedTime",
      key: "CreatedTime",
      render: (CreatedTime) => dayjs(CreatedTime).format("HH:mm"),
    },
    {
      title: "Time Out",
      dataIndex: "timeOut",
      key: "timeOut",
      render: (timeOut) => dayjs(timeOut).format("HH:mm"),
    },
    {
      title: "Status",
      dataIndex: "Status",
      key: "status",
      render: (status) => {
        const statusColors = {
          Arrived: "orange",
          Entered: "red",
          Received: "blue",
          Cleared: "green",
        };
        return <Tag color={statusColors[status] || "default"}>{status}</Tag>;
      },
    },
    {
      title: "Person to See",
      dataIndex: "PersonToSee",
      key: "personToSee",
    },
    {
      title: "Visitor Category",
      dataIndex: "VisitorCategory",
      key: "visitorCategory",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <>
          {userInfo.userData?.departmentName === "Security" ? (
            <Button
              type="primary"
              onClick={() => handleEditStatus(record)}
              ghost
            >
              Update Status
            </Button>
          ) : userInfo.userData?.departmentName === "Reception" ? (
            <Button
              type="primary"
              onClick={() => handleEditStatus(record)} // Opens modal for Reception with 'Convert to Patient' functionality
              ghost
            >
              Convert to Patient
            </Button>
          ) : null}
        </>
      ),
    },
  ];

  const mappedVisitors = filteredVisitors.map((visitor, index) => ({
    key: visitor.No,
    No: visitor.No,
    VisitorNumber: visitor.VisitorNumber,
    VisitorName: visitor.VisitorName,
    PurposeofVisit: visitor.PurposeofVisit,
    PhoneNumber: visitor.PhoneNumber,
    CreatedDate: visitor.CreatedDate,
    Status: visitor.Status,
    PersonToSee: visitor.PersonToSee,
    VisitorCategory: visitor.VisitorCategory,
    timeIn: visitor.CreatedTime,
    timeOut: visitor.ClearedTime,
  }));

  return (
    <div className="card">
      <div className="card-header">
        <h5
          className="card-title"
          style={{ color: "#ac8342", display: "flex", alignItems: "center" }}
        >
          <TeamOutlined style={{ marginRight: 8, fontSize: "40px" }} />
          Visitor List
        </h5>
      </div>
      <Card className="card-header mb-4 mt-4 p-4">
        <Typography.Text
          style={{
            color: "#003F6D",
            fontWeight: "bold",
            marginBottom: "16px",
          }}
        >
          Find Visitor Details by:
        </Typography.Text>
        <Row gutter={16} className="mt-2">
          <Col span={6}>
            <Input
              placeholder="Search"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              allowClear
            />
          </Col>
          <Col span={6}>
            <Select
              value={searchType}
              onChange={setSearchType}
              style={{ width: "100%" }}
            >
              <Select.Option value="VisitorNumber">
                Visitor Number
              </Select.Option>
              <Select.Option value="VisitorName">Visitor Name</Select.Option>
              <Select.Option value="PhoneNumber">Phone Number</Select.Option>
            </Select>
          </Col>
          <Col span={6}>
            <Button
              type="primary"
              onClick={handleSearch}
              style={{ width: "100%" }}
            >
              Search
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Show the table only if there are filtered visitors or search was performed */}

      <Table
        columns={columns}
        dataSource={
          showTable && filteredVisitors.length > 0 ? mappedVisitors : []
        } // Correct condition for showing data
        loading={loading}
        rowKey="key"
        pagination={false}
        bordered
        size="medium"
        style={{
          width: "100%",
          scrollbarColor: "#003F6D",
          scrollbarWidth: "thin",
        }}
        scroll={{ x: "max-content", y: 400 }}
      />

      <Modal
        title="Update Visitor Status"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleUpdateStatus}
      >
        <Form form={statusForm} layout="vertical">
          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: "Please select status" }]}
          >
            <Select placeholder="Select Status">
              <Select.Option value="Arrived">Arrived</Select.Option>
              <Select.Option value="Pending">Pending</Select.Option>
              <Select.Option value="Left">Left</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Time In"
            name="timeIn"
            rules={[{ required: true, message: "Please select time in" }]}
          >
            <TimePicker format="HH:mm" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Time Out"
            name="timeOut"
            rules={[{ required: true, message: "Please select time out" }]}
          >
            <TimePicker format="HH:mm" style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default VisitorList;
