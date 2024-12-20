import React, { useState } from "react";
import { Table, Button, Form, Input, DatePicker, Select, Typography, message } from "antd";
import axios from "axios";

const { TextArea } = Input;
const { Option } = Select;

const Diagnosis = () => {
  const [data, setData] = useState([]); // Stores the list of lab results
  const [form] = Form.useForm();

  // Function to handle form submission for adding a new record
  const handleAddRecord = (values) => {
    axios
      .post("/api/labResults", values)
      .then(() => {
        message.success("Record added successfully");
        setData([...data, values]); // Update the table with the new data
        form.resetFields(); // Reset the form fields
      })
      .catch((error) => {
        message.error("Error adding record");
        console.error(error);
      });
  };

  // Function to handle record deletion
  const handleDelete = (record) => {
    axios
      .delete(`/api/labResults/${record.treatmentNo}`)
      .then(() => {
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
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Button type="danger" onClick={() => handleDelete(record)}>
          Delete
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Typography.Title level={4}>Diagnosis</Typography.Title>
      <div className="d-flex justify-content-end align-items-center gap-3 my-3">
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

      {/* Form for adding new records */}
      <Form
        form={form}
        onFinish={handleAddRecord}
        layout="vertical"
        className="mt-4"
      >
      

        <Form.Item
          name="diagnosis"
          label="Search Diagnosis or ICD-10-CM code"
          rules={[
            { required: true, message: "Please select a diagnosis!" },
          ]}
        >
          <Select placeholder="Select diagnosis">
            <Option value="diagnosis1">Diagnosis 1</Option>
            <Option value="diagnosis2">Diagnosis 2</Option>
            <Option value="diagnosis3">Diagnosis 3</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[
            { required: true, message: "Please input description!" },
          ]}
        >
          <TextArea rows={3} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Diagnosis;
