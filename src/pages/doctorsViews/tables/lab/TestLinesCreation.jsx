import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  Form,
  Space,
  Table,
  Button,
  Drawer,
  Select,
  message,
  Typography,
} from "antd";
import { IoIosTrash } from "react-icons/io";
import { FileTextOutlined } from "@ant-design/icons";

import {
  postLabTest,
  POST_LAB_TEST_RESET,
} from "../../../../actions/lab-actions/postLabTest";
import { labLinesColumns as defaultColumns } from "./utils";
import { getLabTestCodes } from "../../../../actions/lab-actions/getLabTestCodes";
import { getLabDetails } from "../../../../actions/Doc-actions/getLabRequestDetails";

const TestLinesCreation = ({ data: labLines }) => {
  const dispatch = useDispatch();
  const location = useLocation();

  const laboratoryNo = new URLSearchParams(location.search).get("LaboratoryNo");

  const [open, setOpen] = useState(false);

  const { data } = useSelector((state) => state.getLabTestCodes);

  const {
    data: postLabTestData,
    error: postLabTestError,
    loading: postLabTestLoading,
  } = useSelector((state) => state.postLabTest);

  useEffect(() => {
    dispatch(getLabTestCodes());
  }, []);

  useEffect(() => {
    if (postLabTestData) {
      postLabTestData.status === "success"
        ? message.success("Action completed successfully")
        : message.error("Test action could not complete");
      dispatch(getLabDetails(laboratoryNo));
    }

    if (postLabTestLoading) message.info("Action in progress");

    if (postLabTestError) message.error(postLabTestError);

    if (postLabTestData || postLabTestError)
      dispatch({ type: POST_LAB_TEST_RESET });
  }, [postLabTestData, postLabTestError, postLabTestLoading]);

  const handleDeleteLine = (record) => {
    const { LaboratoryTestCode: labTestCode, SystemId: recId } = record;

    const data = {
      recId,
      labTestCode,
      laboratoryNo,
      myAction: "delete",
    };

    dispatch(postLabTest(data));
  };

  const columns = [
    ...defaultColumns,
    {
      key: "actions",
      title: "Actions",
      render: (_, record) => {
        return (
          <Button
            type="primary"
            disabled={record.Sample_Collected}
            onClick={() => handleDeleteLine(record)}
          >
            <IoIosTrash />
            Delete
          </Button>
        );
      },
    },
  ];

  const handleOk = (code) => {
    const { test } = code;

    const data = {
      laboratoryNo,
      myAction: "create",
      labTestCode: test,
    };

    dispatch(postLabTest(data));
    setOpen(false);
  };
  const handleOpen = () => setOpen(true);
  const handleCancel = () => setOpen(false);

  return (
    <div className="">
      <Space
        style={{
          width: "100%", // Make Space full width
          paddingTop: "4px",
          paddingBottom: "4px",
          justifyContent: "space-between",
        }}
        align="baseline"
      >
        <Typography.Title
          level={5}
          style={{ color: "#0F5689", marginBottom: "12px" }}
        >
          <FileTextOutlined style={{ marginRight: "8px" }} />
          Laboratory Test Creation
        </Typography.Title>
        <Button type="primary" onClick={handleOpen}>
          New Test
        </Button>
      </Space>
      <Table columns={columns} dataSource={labLines} pagination={false} />
      <LabTestDrawer
        data={data}
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
      />
    </div>
  );
};

const LabTestDrawer = ({ open, data: testData, onOk, onCancel }) => {
  return (
    <Drawer open={open} size="large" footer={null} title={"Add Test"}>
      <Form name="basic" onFinish={onOk} autoComplete="off">
        <Form.Item
          label="Test"
          name="test"
          layout="vertical"
          rules={[{ required: true, message: "Please choose a Test!" }]}
        >
          <Select
            showSearch
            optionFilterProp="label"
            placeholder="Select a test"
            options={testData
              .sort(
                (a, b) =>
                  a.Description.toLowerCase() - b.Description.toLowerCase()
              )
              .map((test) => ({
                value: test.Code,
                label: test.Description,
              }))}
          />
        </Form.Item>
        <Space
          style={{
            width: "100%",
            justifyContent: "end",
            paddingTop: "20px",
          }}
        >
          <Form.Item label={null}>
            <Button htmlType="button" onClick={onCancel}>
              Cancel
            </Button>
          </Form.Item>
          <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Space>
      </Form>
    </Drawer>
  );
};

export default TestLinesCreation;
