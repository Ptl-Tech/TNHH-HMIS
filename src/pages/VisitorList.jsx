import React from "react";
import { Table, Button, Modal, Form, Select, TimePicker, Input, Radio } from "antd";
import { TeamOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const VisitorList = () => {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [editingVisitor, setEditingVisitor] = React.useState(null);
  const [statusForm] = Form.useForm();
  const [searchType, setSearchType] = React.useState("visitorNumber");
  const [searchValue, setSearchValue] = React.useState("");
  const [visitors, setVisitors] = React.useState([
    {
      key: 1,
      visitorNumber: "V001",
      visitorName: "John Doe",
      phoneNumber: "123-456-7890",
      status: "arrived",
      timeIn: "08:00",
      timeOut: "10:00",
    },
    {
      key: 2,
      visitorNumber: "V002",
      visitorName: "Jane Smith",
      phoneNumber: "987-654-3210",
      status: "pending",
      timeIn: "09:30",
      timeOut: null,
    },
    {
      key: 3,
      visitorNumber: "V003",
      visitorName: "Alice Johnson",
      phoneNumber: "555-555-5555",
      status: "left",
      timeIn: "10:00",
      timeOut: "12:00",
    },
    {
      key: 4,
      visitorNumber: "V004",
      visitorName: "Bob Brown",
      phoneNumber: "444-444-4444",
      status: "arrived",
      timeIn: "11:00",
      timeOut: null,
    },
  ]);

  const [filteredVisitors, setFilteredVisitors] = React.useState(visitors);

  const handleUpdateStatus = () => {
    statusForm.validateFields().then((values) => {
      setVisitors((prevVisitors) =>
        prevVisitors.map((visitor) =>
          visitor.key === editingVisitor.key
            ? { ...visitor, ...values, timeIn: values.timeIn?.format("HH:mm"), timeOut: values.timeOut?.format("HH:mm") }
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
      status: visitor.status,
      timeIn: visitor.timeIn ? dayjs(visitor.timeIn, "HH:mm") : null,
      timeOut: visitor.timeOut ? dayjs(visitor.timeOut, "HH:mm") : null,
    });
    setModalVisible(true);
  };

  const handleSearch = () => {
    const filtered = visitors.filter((visitor) =>
      visitor[searchType].toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredVisitors(filtered);
  };

  const columns = [
    {
      title: "Visitor Number",
      dataIndex: "visitorNumber",
      key: "visitorNumber",
    },
    {
      title: "Name",
      dataIndex: "visitorName",
      key: "visitorName",
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Time In",
      dataIndex: "timeIn",
      key: "timeIn",
    },
    {
      title: "Time Out",
      dataIndex: "timeOut",
      key: "timeOut",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button type="primary" onClick={() => handleEditStatus(record)} ghost>
          Update Status
        </Button>
      ),
    },
  ];

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="card-title" style={{ color: "#ac8342", display: "flex", alignItems: "center" }}>
          <TeamOutlined style={{ marginRight: 8, fontSize: "40px" }} />
          Visitor List
        </h5>

       
      </div>
      <div className="card-body">
      <div className="my-4">
          <Radio.Group
            onChange={(e) => setSearchType(e.target.value)}
            value={searchType}
            style={{ marginRight: 16 }}
          >
            <Radio value="visitorNumber">ID Number</Radio>
            <Radio value="visitorName">First Name</Radio>
            <Radio value="phoneNumber">Last Name</Radio>
          </Radio.Group>
          <Input.Search
            placeholder="Search..."
            onChange={(e) => setSearchValue(e.target.value)}
            onSearch={handleSearch}
            style={{ width: 300 }}
          />
        </div>
        
        <Table columns={columns} dataSource={filteredVisitors} />
      </div>

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
              <Select.Option value="arrived">Arrived</Select.Option>
              <Select.Option value="pending">Pending</Select.Option>
              <Select.Option value="left">Left</Select.Option>
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
          >
            <TimePicker format="HH:mm" style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default VisitorList;
