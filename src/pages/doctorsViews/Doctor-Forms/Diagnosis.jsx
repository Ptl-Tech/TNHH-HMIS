import React, { useState } from "react";
import { Table, Button, Form, Input, DatePicker, message, Modal, Typography } from "antd";
import axios from "axios";

const Diagnosis = () => {
  const [data, setData] = useState([]); // Stores the list of lab results
  const [isModalVisible, setIsModalVisible] = useState(false); // Controls visibility of modal for adding records
  const [form] = Form.useForm();

  // Function to handle form submission for adding a new record
  const handleAddRecord = (values) => {
    // Here you would typically call an API to save the data
    axios
      .post("/api/labResults", values)
      .then((response) => {
        message.success("Record added successfully");
        setData([...data, values]); // Update the table with the new data
        setIsModalVisible(false); // Close the modal
        form.resetFields(); // Reset the form fields
      })
      .catch((error) => {
        message.error("Error adding record");
        console.error(error);
      });
  };

  // Function to handle record deletion
  const handleDelete = (record) => {
    // Call an API to delete the record
    axios
      .delete(`/api/labResults/${record.treatmentNo}`)
      .then((response) => {
        message.success("Record deleted successfully");
        setData(data.filter((item) => item.treatmentNo !== record.treatmentNo)); // Remove deleted record from table
      })
      .catch((error) => {
        message.error("Error deleting record");
        console.error(error);
      });
  };

  // Column configuration for the table
  const columns = [
    {
      title: "Treatment No",
      dataIndex: "treatmentNo",
      key: "treatmentNo",
    },
    {
      title: "Line No",
      dataIndex: "lineNo",
      key: "lineNo",
    },
    {
      title: "Test Package Code",
      dataIndex: "testPackageCode",
      key: "testPackageCode",
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
      render: (dueDate) => `${dueDate.year}-${dueDate.month}-${dueDate.day}`,
    },
    {
      title: "Results",
      dataIndex: "results",
      key: "results",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Characteristics",
      dataIndex: "characteristics",
      key: "characteristics",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Button type="danger" onClick={() => handleDelete(record)}>
          Delete
        </Button>
      ),
    },
  ];

  // Function to show the modal form for adding a new record
  const showAddRecordModal = () => {
    setIsModalVisible(true);
  };

  // Close the modal
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  return (
    <div>
      <Typography.Title level={4}>Diagnosis</Typography.Title>
      <div className="d-flex justify-content-end align-items-center gap-3 my-3">
        {/* Button to open the form for adding a new record */}
      <Button type="primary" onClick={showAddRecordModal}>
        Add New Record
      </Button>
      <Button type="default" onClick={() => message.info("Viewing results")}>
        View Results
      </Button>
      <Button
        type="default"
        onClick={() => message.info("Requesting results from lab")}
      >
        Previous Diagnosis
      </Button>
      </div>
      {/* Table to display lab results */}
      <Table columns={columns} dataSource={data} rowKey="treatmentNo" />

      {/* Modal for adding new records */}
      <Modal
        title="Add New Lab Result"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleAddRecord}>
          <Form.Item
            name="treatmentNo"
            label="Treatment Number"
            rules={[
              { required: true, message: "Please input treatment number!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="lineNo"
            label="Line Number"
            rules={[{ required: true, message: "Please input line number!" }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            name="testPackageCode"
            label="Test Package Code"
            rules={[
              { required: true, message: "Please input test package code!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="dueDate"
            label="Due Date"
            rules={[{ required: true, message: "Please select due date!" }]}
          >
            <DatePicker />
          </Form.Item>

          <Form.Item
            name="results"
            label="Results"
            rules={[{ required: true, message: "Please input results!" }]}
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea />
          </Form.Item>

          <Form.Item name="characteristics" label="Characteristics">
            <Input.TextArea />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
            <Button onClick={handleCancel} style={{ marginLeft: "8px" }}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Diagnosis;
