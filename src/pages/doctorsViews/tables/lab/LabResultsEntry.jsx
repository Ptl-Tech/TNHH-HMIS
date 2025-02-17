import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import {
  Form,
  Input,
  Table,
  Drawer,
  Button,
  message,
  Typography,
  InputNumber,
  Flex,
  Dropdown,
  Modal,
  Space,
} from 'antd';

import { labLinesColumns, labResultsColumns } from './utils';

import { AiOutlineMore } from 'react-icons/ai';
import Loading from '../../../../partials/nurse-partials/Loading';
import SkeletonLoading from '../../../../partials/nurse-partials/Skeleton';

import {
  POST_LAB_TEST_REMARKS_RESET,
  postTestRemarks,
} from '../../../../actions/lab-actions/postTestRemarks';
import { getLabTestResults } from '../../../../actions/lab-actions/getLabTestResults';
import {
  POST_LAB_TEST_RESULTS_RESET,
  postLabTestResults,
} from '../../../../actions/lab-actions/postLabTestResults';

const LabResultsEntry = ({ data, loading }) => {
  // state
  const [openResults, setOpenResults] = useState(false);
  const [openRemarks, setOpenRemarks] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);

  const showResultsDrawer = (record) => {
    setCurrentRecord(record);
    setOpenResults(true);
  };

  const handleResultsOk = () => {
    setCurrentRecord(null);
    setOpenResults(false);
  };

  const handleResultsCancel = () => {
    setCurrentRecord(null);
    setOpenResults(false);
  };

  const showRemarksDrawer = (record) => {
    setCurrentRecord(record);
    setOpenRemarks(true);
  };

  const handleRemarksCancel = () => {
    setCurrentRecord(null);
    setOpenRemarks(false);
  };

  const { Title } = Typography;

  const columns = [
    ...labLinesColumns,
    {
      align: 'right',
      title: 'Add results',
      render: (_, record) => {
        return (
          <TestMenu
            record={record}
            handleOpenResults={showResultsDrawer}
            handleOpenRemarks={showRemarksDrawer}
          />
        );
      },
    },
  ];

  return (
    <div>
      <Title
        level={5}
        style={{ color: '#0F5689', marginBottom: '12px' }}
      >
        Results Recording
      </Title>
      {loading ? (
        <Loading />
      ) : (
        <>
          <Table
            rowClassName={(record) =>
              !record.Sample_Collected ? 'disabled-row' : 'editable-row'
            }
            columns={columns}
            dataSource={data}
            pagination={false}
          />
          <ResultsDrawer
            open={openResults}
            record={currentRecord}
            handleOk={handleResultsOk}
            handleCancel={handleResultsCancel}
          />
          <RemarksModal
            open={openRemarks}
            record={currentRecord}
            handleCancel={handleRemarksCancel}
          />
        </>
      )}
    </div>
  );
};

const TestMenu = ({ record, handleOpenResults, handleOpenRemarks }) => {
  console.log({ record });

  const items = [
    {
      key: '1',
      label: (
        <div onClick={() => handleOpenResults(record)}>Add Test Results</div>
      ),
    },
    {
      key: '2',
      label: (
        <div onClick={() => handleOpenRemarks(record)}>
          {record.Remarks ? 'View Final Remarks' : 'Add Final Remarks'}
        </div>
      ),
    },
  ];

  return (
    <Dropdown
      menu={{ items }}
      placement="bottomRight"
      arrow={{ pointAtCenter: true }}
    >
      <AiOutlineMore size={28} />
    </Dropdown>
  );
};

const ResultsDrawer = ({ record, open, handleOk, handleCancel }) => {
  console.log({ record });

  const dispatch = useDispatch();
  const { data, loading, error } = useSelector(
    (state) => state.getLabTestResults,
  );
  const { LaboratoryTestName } = record || {};

  useEffect(() => {
    if (!record) return;
    dispatch(
      getLabTestResults({
        labNo: record.Laboratory_No,
        testCode: record.LaboratoryTestCode,
      }),
    );
  }, [record]);

  return (
    <Drawer
      open={open}
      size="large"
      title={`Results for ${LaboratoryTestName}`}
      onOk={handleOk}
      onCancel={handleCancel}
      extra={<Button onClick={handleCancel}>Cancel</Button>}
    >
      {loading ? (
        <SkeletonLoading />
      ) : (
        <ResultsTable
          initialData={data}
          error={error}
          loading={loading}
        />
      )}
    </Drawer>
  );
};

const RemarksModal = ({ record, open, handleCancel }) => {
  const dispatch = useDispatch();

  const { data, loading, error } = useSelector(
    (state) => state.postTestRemarks,
  );

  useEffect(() => {
    if (data) {
      const { status } = data;
      status === 'success'
        ? message.success('Remarks posted successfully')
        : message.error('Something went wrong');

      dispatch({ type: POST_LAB_TEST_REMARKS_RESET });
    }

    if (error) {
      message.info('Something went wrong');
      dispatch({ type: POST_LAB_TEST_REMARKS_RESET });
    }

    if (loading) message.info('Submitting remarks');
  }, [data, loading]);

  return (
    <Modal
      open={open}
      size="large"
      title={`Final Test Remarks`}
      footer={null}
    >
      {loading ? (
        <SkeletonLoading />
      ) : (
        <RemarkForm
          record={record}
          handleCancel={handleCancel}
        />
      )}
    </Modal>
  );
};

const RemarkForm = ({ record, handleCancel }) => {
  // destructor
  const { TextArea } = Input;
  const { Item, useForm } = Form;

  // hooks
  const [form] = useForm();
  const dispatch = useDispatch();

  const { data, error, loading } = useSelector(
    (state) => state.postTestRemarks,
  );

  // handling pushing code
  const onFinish = async (data) => {
    const { remarks } = data;
    const { SystemId, Laboratory_No, Positive } = record;

    console.log({ remarks });

    const finalData = {
      remarks,
      recId: SystemId,
      myAction: 'edit',
      positive: Positive,
      laboratoryNo: Laboratory_No,
    };

    await dispatch(postTestRemarks(finalData));
    form.resetFields();
    handleCancel();
  };

  return (
    <>
      {loading ? (
        <SkeletonLoading />
      ) : (
        <Form
          form={form}
          name="sampleForm"
          layout="vertical"
          autoComplete="off"
          onFinish={onFinish}
        >
          <Item
            name="remarks"
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
          <Space
            style={{
              justifyContent: 'flex-end',
              display: 'flex',
              width: '100%',
            }}
          >
            <Item label={null}>
              <Button
                onClick={handleCancel}
                htmlType="button"
                disabled={loading}
              >
                Cancel
              </Button>
            </Item>
            <Item label={null}>
              <Button
                type="primary"
                htmlType="submit"
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Submit Remark'}
              </Button>
            </Item>
          </Space>
        </Form>
      )}
    </>
  );
};

const EditableCell = ({
  dataIndex,
  inputType,
  editing,
  children,
  record,
  handleSave,
  ...props
}) => {
  const { Item } = Form;
  const [value, setValue] = useState(
    inputType === 'number' ? parseFloat(children) || 0 : children || '',
  );

  const handleChange = (newValue) => {
    setValue(newValue);
    handleSave(record.Specimen_Code, dataIndex, newValue);
  };

  const inputNode =
    inputType === 'number' ? (
      <InputNumber
        value={value}
        onChange={handleChange}
      />
    ) : (
      <Input
        value={value}
        onChange={(e) => handleChange(e.target.value)}
      />
    );

  return (
    <td {...props}>
      {editing ? (
        <Item
          name={dataIndex}
          style={{ margin: 0 }}
        >
          {inputNode}
        </Item>
      ) : (
        children
      )}
    </td>
  );
};

const ResultsTable = ({ initialData, error, loading }) => {
  const { useForm } = Form;
  const [form] = useForm();
  const dispatch = useDispatch();

  const [editingKey, setEditingKey] = useState(null);

  const [results, setResults] = useState(
    [...initialData].map((item) => ({ ...item })),
  );

  const {
    data: labResultsData,
    loading: labResultsLoading,
    error: labResultsError,
  } = useSelector((state) => state.postLabTestResults);

  useEffect(() => {
    if (labResultsData) {
      const { status } = labResultsData;
      status === 'success'
        ? message.success('Results submitted successfully!')
        : message.error('Something went wrong!');

      dispatch({ type: POST_LAB_TEST_RESULTS_RESET });
    }

    if (labResultsError) {
      message.error('Something went wrong');
      dispatch({ type: POST_LAB_TEST_RESULTS_RESET });
    }

    if (labResultsLoading) message.info('Submitting the results');
  }, [labResultsData, labResultsLoading, labResultsError]);

  const isEditing = (record) => record.Specimen_Code === editingKey;

  const handleSave = (key, dataIndex, value) => {
    setResults((prevResults) =>
      prevResults.map((item) =>
        item.Specimen_Code === key ? { ...item, [dataIndex]: value } : item,
      ),
    );
  };

  const columns = labResultsColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'Results' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        editing: isEditing(record),
        handleSave,
      }),
    };
  });

  const edit = (record) => {
    if (!record) return;
    form.setFieldsValue(record);
    setEditingKey(record.Specimen_Code);
  };

  const handleSubmit = () => {
    if (editingKey) {
      setEditingKey(null);
    } else {
      dispatch(postLabTestResults([...results]));
    }
  };

  return (
    <>
      {loading ? (
        <SkeletonLoading />
      ) : (
        <Form
          form={form}
          component={false}
        >
          <Table
            rowClassName={'editable-row'}
            onRow={(record) => ({
              onClick: () => edit(record),
            })}
            footer={() => (
              <Flex
                justify="end"
                onClick={handleSubmit}
              >
                <Button
                  type="primary"
                  disabled={labResultsLoading}
                >
                  {labResultsLoading
                    ? 'Loading...'
                    : editingKey
                    ? 'Preview'
                    : 'Submit'}
                </Button>
              </Flex>
            )}
            columns={columns}
            components={{ body: { cell: EditableCell } }}
            dataSource={results}
            pagination={false}
          />
        </Form>
      )}
    </>
  );
};

export default LabResultsEntry;
