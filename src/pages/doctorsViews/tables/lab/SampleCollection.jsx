import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { Typography, Table, Button, Modal, Form, Input, message } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';

import { labLinesColumns as defaultColumns } from './utils';
import Loading from '../../../../partials/nurse-partials/Loading';
import { postLabSample } from '../../../../actions/lab-actions/postLabSample';

const SampleCollection = ({ data, loading }) => {
  const [open, setOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);

  const showModal = (record) => {
    setCurrentRecord(record);
    setOpen(true);
  };

  const handleOk = () => {
    setCurrentRecord(null);
    setOpen(false);
  };

  const handleCancel = () => {
    setCurrentRecord(null);
    setOpen(false);
  };

  const columns = [
    ...defaultColumns,
    {
      title: 'Create Sample',
      render: (_, record) => {
        return (
          <Button
            type="primary"
            onClick={() => showModal(record)}
            disabled={record.Sample_Collected}
          >
            {record.Sample_Collected ? 'Sample Collected' : 'Add Sample'}
          </Button>
        );
      },
    },
  ];

  return (
    <div>
      <Typography.Title
        level={5}
        style={{ color: '#0F5689', marginBottom: '12px' }}
      >
        <FileTextOutlined style={{ marginRight: '8px' }} />
        Laboratory Request
      </Typography.Title>
      {loading ? (
        <Loading />
      ) : (
        <>
          <Table
            columns={columns}
            dataSource={data}
            pagination={false}
          />
          <SampleModal
            open={open}
            test={currentRecord}
            handleOk={handleOk}
            handleCancel={handleCancel}
          />
        </>
      )}
    </div>
  );
};

const SampleModal = ({ open, test, handleOk, handleCancel }) => {
  const { LaboratoryTestName } = test || {};

  return (
    <Modal
      open={open}
      title={`Collect ${LaboratoryTestName} Sample`}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={[
        <Button
          key="back"
          onClick={handleCancel}
        >
          Cancel
        </Button>,
      ]}
    >
      <SampleForm closeModal={handleCancel} />
    </Modal>
  );
};

const SampleForm = ({ closeModal }) => {
  // destructor
  const { TextArea } = Input;
  const { Item, useForm } = Form;

  // hooks
  const [form] = useForm();
  const dispatch = useDispatch();
  const { data, error, loading } = useSelector((state) => state.postLabSample);

  useEffect(() => {
    if (data && data.success) {
      message.success('Sample submitted successfully');
    }

    if (error) {
      message.error('Could not submit the sample');
    }
  }, [data, error]);

  // handling pushing code
  const onFinish = (sample) => {
    // publishing the data to the backend
    dispatch(postLabSample(sample));
    form.resetFields();
    closeModal();
  };

  return (
    <Form
      form={form}
      name="sampleForm"
      layout="vertical"
      autoComplete="off"
      onFinish={onFinish}
    >
      <Item
        name="description"
        label="Sample Description"
        rules={[
          {
            required: true,
            message: 'Please add a description for your sample',
          },
        ]}
      >
        <TextArea />
      </Item>
      <Item label={null}>
        <Button
          type="primary"
          htmlType="submit"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Submit Sample'}
        </Button>
      </Item>
    </Form>
  );
};

export default SampleCollection;
