import { Typography, Table } from 'antd';

import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { FileTextOutlined } from '@ant-design/icons';

import SkeletonLoading from '../../../../partials/nurse-partials/Skeleton';
import { getRadiologyDetails } from '../../../../actions/Doc-actions/getRadiologyDetails';

const RadiologyTestRequest = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const radiologyNo = queryParams.get('radiologyNo');

  const { loading, data } = useSelector((state) => state.getRadiologyDetails);

  useEffect(() => {
    dispatch(getRadiologyDetails(radiologyNo));
  }, [dispatch]);

  console.log({ radiologyNo, data });

  const columns = [
    {
      title: 'Radiology Number',
      dataIndex: 'Radiology_no',
      key: 'Radiology_no',
    },
    {
      title: 'Radiology Type Code',
      dataIndex: 'Radiology_Type_Code',
      key: 'Radiology_Type_Code',
    },
    {
      title: 'Radiology Type Name',
      dataIndex: 'Radiology_Type_Name',
      key: 'Radiology_Type_Name',
    },
    {
      title: 'Performed Date',
      dataIndex: 'Performed_Date',
      key: 'Performed_Date',
      render: (_, record) => {
        return record.Performed_Date === '0001-01-01'
          ? 'N/A'
          : record.Performed_Date;
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
        Radiology Request
      </Typography.Title>
      {loading ? (
        <SkeletonLoading />
      ) : (
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
        />
      )}
    </div>
  );
};

export default RadiologyTestRequest;
