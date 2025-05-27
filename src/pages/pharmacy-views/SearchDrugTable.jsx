import { useState } from 'react';

import { Input, Space, Table, Typography } from 'antd';
import { MedicineBoxOutlined } from '@ant-design/icons';

export const SearchDrugTable = ({ items, loading, columns }) => {
  const { Title } = Typography;
  const [filter, setFilter] = useState({ specificName: '', genericName: '' });

  return (
    <div style={{ display: 'grid', gap: '16px' }}>
      <div>
        <Title
          level={5}
          style={{
            gap: '8px',
            display: 'flex',
            color: '#0f5689',
            alignItems: 'center',
          }}
        >
          <MedicineBoxOutlined />
          Search Items
        </Title>
      </div>
      <Space
        style={{
          width: '100%',
          gap: '16px',
        }}
      >
        <Input
          addonBefore="Specific Name"
          style={{ width: '100%' }}
          value={filter.specificName}
          onChange={(e) =>
            setFilter({ ...filter, specificName: e.currentTarget.value })
          }
          placeholder="Search Specific Name"
        />
        <Input
          addonBefore="Generic Name"
          style={{ width: '100%' }}
          value={filter.genericName}
          onChange={(e) =>
            setFilter({ ...filter, genericName: e.currentTarget.value })
          }
          placeholder="Search Generic Name"
        />
      </Space>
      <Table
        bordered
        size="small"
        columns={columns}
        loading={loading}
        dataSource={
          filter.specificName || filter.genericName
            ? items
                .filter(
                  (drug) =>
                    drug.Description.toLowerCase().includes(
                      filter.specificName.toLowerCase(),
                    ) &&
                    drug.Description.toLowerCase().includes(
                      filter.genericName.toLowerCase(),
                    ),
                )
                .map(({ No, ...item }) => ({ ...item, No, key: No }))
            : []
        }
      />
    </div>
  );
};
