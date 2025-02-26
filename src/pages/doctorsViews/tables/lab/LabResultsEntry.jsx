import React, { useEffect, useMemo, useState } from 'react';

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
} from 'antd';

import { labLinesColumns, labResultsColumns } from './utils';

import Loading from '../../../../partials/nurse-partials/Loading';
import SkeletonLoading from '../../../../partials/nurse-partials/Skeleton';

import { getLabTestResults } from '../../../../actions/lab-actions/getLabTestResults';
import { postLabTestResults } from '../../../../actions/lab-actions/postLabTestResults';

const LabResultsEntry = ({ data, loading }) => {
  // state
  const [open, setOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);

  const showDrawer = (record) => {
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

  const { Title } = Typography;

  const columns = [
    ...labLinesColumns,
    {
      title: 'Add results',
      render: (_, record) => {
        return (
          <Button
            type="primary"
            onClick={() => showDrawer(record)}
          >
            Add Test Results
          </Button>
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
            columns={columns}
            dataSource={data}
            pagination={false}
          />
          <ResultsDrawer
            open={open}
            record={currentRecord}
            handleOk={handleOk}
            handleCancel={handleCancel}
          />
        </>
      )}
    </div>
  );
};

const ResultsDrawer = ({ record, open, handleOk, handleCancel }) => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.getLabTestResults);
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
    inputType === 'number' ? parseFloat(children) || 0 : children || ''
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
  const [results, setResults] = useState([...initialData].map(item => ({...item})));
  
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
    }
  }, [labResultsData, labResultsError]);

  const isEditing = (record) => record.Specimen_Code === editingKey;
  
  const handleSave = (key, dataIndex, value) => {
    setResults(prevResults => 
      prevResults.map(item => 
        item.Specimen_Code === key 
          ? { ...item, [dataIndex]: value }
          : item
      )
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
    <Form
      form={form}
      component={false}
    >
      <Table
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
        rowClassName="editable-row"
      />
    </Form>
  );
};

export default LabResultsEntry;