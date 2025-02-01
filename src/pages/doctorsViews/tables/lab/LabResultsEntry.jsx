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
      <ResultsTable
        data={data}
        error={error}
        loading={loading}
        closeDrawer={handleCancel}
      />
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
  handleEdit,
  ...props
}) => {
  const { Item } = Form;

  const inputNode =
    inputType === 'number' ? (
      <InputNumber
        defaultValue={parseFloat(children) || 0}
        onChange={(value) => (record[dataIndex] = value)} // Update record
      />
    ) : (
      <Input
        defaultValue={children || ''}
        onChange={(e) => (record[dataIndex] = e.target.value)} // Update record
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

const ResultsTable = ({ data: tableData, error, loading, closeDrawer }) => {
  const { useForm } = Form;
  const [form] = useForm();
  const dispatch = useDispatch();

  // state
  const [editingKey, setEditingKey] = useState(null);
  const [results, setResults] = useState(tableData);

  useEffect(() => {
    console.log({ editableData: results });
  }, [results]);

  const isEditing = (record) => record.Specimen_Code === editingKey;

  const {
    data: labResultsData,
    loading: labResultsLoading,
    error: labResultsError,
  } = useSelector((state) => state.postLabTestResults);

  useEffect(() => {
    setResults(tableData);
  }, [tableData]);

  const edit = (record) => {
    if (!record) return;
    form.setFieldsValue(record);
    setEditingKey(record.Specimen_Code);
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      console.log({ row });

      const newData = [...results];
      const index = newData.findIndex((item) => key === item.Specimen_Code);
      console.log({ index });

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setResults(() => newData);
        setEditingKey(null);
      } else {
        newData.push(row);
        setResults(newData);
        setEditingKey(null);
      }
    } catch (errInfo) {
      message.error('Plase try again');
    }
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
        handleEdit: edit,
        handleSave: save,
      }),
    };
  });

  useEffect(() => {
    if (labResultsData && labResultsData.success)
      message.success('Results submitted successfully!');

    if (labResultsError) {
      message.error('Something went wrong!');
    }
  }, [labResultsData, labResultsError]);

  const handleSubmit = () => {
    if (editingKey) {
      save(editingKey);
    } else {
      try {
        dispatch(postLabTestResults(results));
      } catch (error) {
        message.error('Please try again');
      }
    }
  };

  return (
    <Form
      form={form}
      component={false}
    >
      {loading || labResultsLoading ? (
        <SkeletonLoading />
      ) : (
        <Table
          onRow={(record) => ({
            onClick: () => edit(record),
            onBlur: () =>
              useMemo(() => save(record.Specimen_Code), [editingKey]),
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
      )}
    </Form>
  );
};

export default LabResultsEntry;
