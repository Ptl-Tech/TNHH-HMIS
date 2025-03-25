import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Button, Drawer, Input, Space, Table, Tag } from 'antd';
import { CloseOutlined, SearchOutlined } from '@ant-design/icons';

import { getLabTestCodes } from '../../../actions/lab-actions/getLabTestCodes';
import { getLabDetails } from '../../../actions/Doc-actions/getLabRequestDetails';

const LaboratoryDispatchDrawer = ({
  open,
  title,
  onEdit,
  onClose,
  onSubmit,
  currentLabRecord,
}) => {
  const dispatch = useDispatch();

  const searchInput = useRef(null);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const { data, loading, error } = useSelector(
    (state) => state.getLabTestCodes,
  );
  // These are the lab test lines, and they are for a particular header
  const { data: labDetailsData } = useSelector((state) => state.labDetails);

  // handles updating the selected keys if the lab test lines are more than 0
  useEffect(() => {
    if (labDetailsData.length)
      setSelectedRowKeys(
        labDetailsData.map((dataItem) => dataItem.LaboratoryTestCode),
      );
  }, [labDetailsData]);

  // handles getting the current lab test lines, setting the selected keys and getting all the lab test codes
  useEffect(() => {
    // we need to get the current lab request
    if (currentLabRecord && open) {
      dispatch(getLabDetails(currentLabRecord));
    } else {
      setSelectedRowKeys([]);
    }
    dispatch(getLabTestCodes());
  }, [currentLabRecord, open]);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters, confirm) => {
    clearFilters();
    setSearchText('');
    setSearchedColumn('');
    confirm();
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{ padding: 8 }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters, confirm)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            Close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    filterDropdownProps: {
      onOpenChange(open) {
        if (open) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    },
  });

  const columns = [
    {
      title: 'Code',
      key: 'Code',
      dataIndex: 'Code',
      ...getColumnSearchProps('Code'),
    },
    {
      title: 'Test Name',
      key: 'Description',
      dataIndex: 'Description',
      ...getColumnSearchProps('Description'),
    },
    {
      title: 'Amount',
      key: 'Amount',
      dataIndex: 'Amount',
    },
    {
      title: 'Measurement Proc',
      key: 'MeasurementProc',
      dataIndex: 'MeasurementProc',
      render: (item) => (item ? item : 'N/A'),
      ...getColumnSearchProps('MeasurementProc'),
    },
  ];

  const onSelectChange = (newSelectedRowKeys) => {
    console.log({ newSelectedRowKeys });
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const handleRemoveKey = (key) => {
    const newSelectedKeys = Array.from(selectedRowKeys);
    const indexToRemove = selectedRowKeys.findIndex((item) => item === key);
    newSelectedKeys.splice(indexToRemove, 1);
    setSelectedRowKeys(newSelectedKeys);
  };

  const rowSelection = { selectedRowKeys, onChange: onSelectChange };

  return (
    <Drawer
      size="large"
      open={open}
      title={title}
      onClose={onClose}
      extra={
        <Space>
          <Button
            type="primary"
            onClick={() =>
              currentLabRecord
                ? onEdit(
                    labDetailsData,
                    selectedRowKeys.map((selectedRowKey) =>
                      data.find((dataItem) => dataItem.Code === selectedRowKey),
                    ),
                  )
                : onSubmit(
                    selectedRowKeys.map((selectedRowKey) =>
                      data.find((dataItem) => dataItem.Code === selectedRowKey),
                    ),
                  )
            }
          >
            {currentLabRecord ? 'Update Request' : 'Submit Request'}
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </Space>
      }
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          justifyContent: 'start',
        }}
      >
        <Space>
          <span style={{ whiteSpace: 'nowrap' }}>Selected tests:</span>
          {!!selectedRowKeys.length && (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
              }}
            >
              {selectedRowKeys.map((selectedRowKey) => (
                <Tag
                  key={selectedRowKey}
                  onClick={() => handleRemoveKey(selectedRowKey)}
                  style={{ cursor: 'pointer' }}
                >
                  <Space>
                    {
                      data.find((item) => item.Code === selectedRowKey)
                        ?.Description
                    }
                    <CloseOutlined style={{ color: 'orangered' }} />
                  </Space>
                </Tag>
              ))}
            </div>
          )}
        </Space>
        <Table
          bordered
          dataSource={data.map((dataItem) => ({
            key: dataItem.Code,
            ...dataItem,
          }))}
          loading={loading}
          columns={columns}
          pagination={false}
          rowSelection={rowSelection}
        />
      </div>
    </Drawer>
  );
};

export default LaboratoryDispatchDrawer;
