import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import {
  FileSearchOutlined,
  ContainerOutlined,
  EditOutlined,
  FileAddOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import { Button, Card, Tabs } from 'antd';

import LabTestRequest from './LabTestRequest';
import LabResultsEntry from './LabResultsEntry';
import SampleCollection from './SampleCollection';
import ExternalLabResults from './ExternalLabResults';
import Charges from '../../../nurse-view/nurse-patient-file/Charges';

import { getLabDetails } from '../../../../actions/Doc-actions/getLabRequestDetails';

const LabContentCard = () => {
  // hooks
  const location = useLocation();
  const dispatch = useDispatch();

  // search params
  const labNo = new URLSearchParams(location.search).get('LaboratoryNo');

  // state
  const { loading: labTestsLoading, data: labTestsData } = useSelector(
    (state) => state.labDetails,
  );

  useEffect(() => {
    console.log({ labNo });
    dispatch(getLabDetails(labNo));
  }, [labNo]);

  return (
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
              Lab Test Lines
            </Button>
          }
          key="1"
        >
          <LabTestRequest
            data={labTestsData}
            loading={labTestsLoading}
          />
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={
            <Button
              type="primary"
              style={{ borderRadius: '4px' }}
            >
              <ContainerOutlined style={{ marginRight: '8px' }} />
              Sample Collection
            </Button>
          }
          key="2"
        >
          <SampleCollection
            data={labTestsData}
            loading={labTestsLoading}
          />
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={
            <Button
              type="primary"
              style={{ borderRadius: '4px' }}
            >
              <EditOutlined style={{ marginRight: '8px' }} />
              Lab Results Entry
            </Button>
          }
          key="3"
        >
          <LabResultsEntry
            data={labTestsData}
            loading={labTestsLoading}
          />
        </Tabs.TabPane>
        {/* <Tabs.TabPane
          tab={
            <Button
              type="primary"
              style={{ borderRadius: '4px' }}
            >
              <FileAddOutlined style={{ marginRight: '8px' }} />
              Lab External Orders
            </Button>
          }
          key="4"
        >
          <ExternalLabResults />
        </Tabs.TabPane> */}
        <Tabs.TabPane
          tab={
            <Button
              type="primary"
              style={{ borderRadius: '4px' }}
            >
              <DollarOutlined style={{ marginRight: '8px' }} />
              Charges
            </Button>
          }
          key="5"
        >
          <Charges />
        </Tabs.TabPane>
      </Tabs>
    </Card>
  );
};

export default LabContentCard;
