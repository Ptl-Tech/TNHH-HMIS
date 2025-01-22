import React from 'react';
import { Button, Card, Tabs } from 'antd';

import { FileSearchOutlined } from '@ant-design/icons'; // Importing icons

import RadiologyTestRequest from './RadiologyTestRequest';

const RadiologyContentCard = () => {
  return (
    <div>
      <Card
        className="card"
        style={{ padding: '10px 16px', marginTop: '20px' }}
      >
        <Tabs
          defaultActiveKey="1"
          tabBarStyle={{
            display: 'flex',
            justifyContent: 'space-around',
            borderBottom: 'none', // Remove the default underline
          }}
          tabBarGutter={16} // Adjust spacing between tabs
        >
          <Tabs.TabPane
            tab={
              <Button
                type="primary"
                style={{ borderRadius: '4px' }}
              >
                <FileSearchOutlined style={{ marginRight: '8px' }} />
                Radiology Requests
              </Button>
            }
            key="1"
          >
            <RadiologyTestRequest />
          </Tabs.TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default RadiologyContentCard;
