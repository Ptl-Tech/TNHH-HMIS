import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { FileTextOutlined } from '@ant-design/icons';
import { labLinesColumns as defaultColumns } from './utils';
import {
  Button,
  Form,
  message,
  Modal,
  Select,
  Space,
  Table,
  Typography,
} from 'antd';

import { getLabTestCodes } from '../../../../actions/lab-actions/getLabTestCodes';
import {
  postLabTest,
  POST_LAB_TEST_RESET,
} from '../../../../actions/lab-actions/postLabTest';

const TestLinesCreation = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const { data, loading, error } = useSelector(
    (state) => state.getLabTestCodes,
  );

  const {
    data: postLabTestData,
    loading: postLabTestLoading,
    error: postLabTestError,
  } = useSelector((state) => state.postLabTest);

  useEffect(() => {
    dispatch(getLabTestCodes());
  }, []);

  useEffect(() => {
    if (postLabTestData) {
      postLabTestData.status === 'success'
        ? message.success('Test created successfully')
        : message.error("Couldn't create test");

      dispatch({ type: POST_LAB_TEST_RESET });
    }

    if (postLabTestLoading) {
      message.info('Submitting the test');
    }

    if (postLabTestError) {
      message.error('Something went wrong');
      dispatch({ type: POST_LAB_TEST_RESET });
    }
  }, [postLabTestData, postLabTestError]);

  const columns = defaultColumns;

  const handleOpen = () => {
    setOpen(true);
  };

  const handleOk = async (data) => {
    // TODO dispatch the data to the backend
    await dispatch(postLabTest(data));
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <div className="">
      <Space
        style={{
          width: '100%', // Make Space full width
          paddingTop: '4px',
          paddingBottom: '4px',
          justifyContent: 'space-between',
        }}
        align="baseline"
      >
        <Typography.Title
          level={5}
          style={{ color: '#0F5689', marginBottom: '12px' }}
        >
          <FileTextOutlined style={{ marginRight: '8px' }} />
          Laboratory Test Creation
        </Typography.Title>
        <Button
          type="primary"
          onClick={handleOpen}
        >
          New Test
        </Button>
      </Space>
      <Table
        columns={columns}
        dataSource={[]}
        pagination={false}
      />
      <LabTestModal
        data={data}
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
      />
    </div>
  );
};

const LabTestModal = ({ open, data: testData, onOk, onCancel }) => {
  return (
    <Modal
      open={open}
      footer={null}
      title={'Add Test'}
    >
      <Form
        name="basic"
        onFinish={onOk}
        autoComplete="off"
      >
        <Form.Item
          label="Test"
          name="test"
          layout="vertical"
          rules={[{ required: true, message: 'Please choose a Test!' }]}
        >
          <Select
            placeholder="Select a test"
            options={testData
              .sort(
                (a, b) =>
                  a.Description.toLowerCase() - b.Description.toLowerCase(),
              )
              .map((test) => ({
                value: test.Code,
                label: test.Description,
              }))}
          />
        </Form.Item>
        <Space
          style={{
            width: '100%',
            justifyContent: 'end',
            paddingTop: '20px',
          }}
        >
          <Form.Item label={null}>
            <Button
              htmlType="button"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </Form.Item>
          <Form.Item label={null}>
            <Button
              type="primary"
              htmlType="submit"
            >
              Submit
            </Button>
          </Form.Item>
        </Space>
      </Form>
    </Modal>
  );
};

export default TestLinesCreation;
