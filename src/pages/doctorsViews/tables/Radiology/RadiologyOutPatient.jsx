import { Space, Typography, Row } from 'antd';
import { DiffOutlined } from '@ant-design/icons';

import RadiologyContentCard from './RadiologyContentCard';

const RadiologyOutPatient = () => {
  return (
    <div className="">
      <Space className="inpatient-header">
        <DiffOutlined />
        <Typography.Text className="inpatient-header-text">
          Radiology Evaluation Form
        </Typography.Text>
      </Space>
      <RadiologyContentCard />
    </div>
  );
};

export default RadiologyOutPatient;
