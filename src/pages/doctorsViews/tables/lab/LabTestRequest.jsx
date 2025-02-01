import React from 'react';

import { FileTextOutlined } from '@ant-design/icons';
import { Typography, Table, Input, Button } from 'antd';

import { labLinesColumns as defaultColumns } from './utils';
import Loading from '../../../../partials/nurse-partials/Loading';

const LabTestRequest = ({ loading, data }) => {
  const columns = [
    ...defaultColumns,
    {
      title: 'Void Reason',
      render: (_, record) => {
        return <Input />;
      },
    },
    {
      title: 'Void Reason',
      render: (_, record) => {
        return <Button danger>Void Test</Button>;
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
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
        />
      )}
    </div>
  );
};

export default LabTestRequest;
