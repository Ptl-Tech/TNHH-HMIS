import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import {
  ContainerOutlined,
  EditOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import { Button, Card, Tabs } from 'antd';

import LabResultsEntry from './LabResultsEntry';
import SampleCollection from './SampleCollection';
import Charges from '../../../nurse-view/nurse-patient-file/Charges';

import { getLabDetails } from '../../../../actions/Doc-actions/getLabRequestDetails';
import TestLinesCreation from './TestLinesCreation';

const LabContentCard = () => {
  // hooks
  const location = useLocation();
  const dispatch = useDispatch();

  // search params
  const labNo = new URLSearchParams(location.search).get('LaboratoryNo');
  const { walkIn } = location.state;

  console.log({ walkIn });

  // state
  const { loading: labTestsLoading, data: labTestsData } = useSelector(
    (state) => state.labDetails,
  );

  // when we update the sample, we need to update the data
  const { data } = useSelector((state) => state.postLabSample);

  useEffect(() => {
    dispatch(getLabDetails(labNo));
  }, [labNo, data]);

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
        {walkIn ? (
          <Tabs.TabPane
            tab={
              <Button
                type="primary"
                style={{ borderRadius: '4px' }}
              >
                <ContainerOutlined style={{ marginRight: '8px' }} />
                Create Test Lines
              </Button>
            }
            key="1"
          >
            <TestLinesCreation />
          </Tabs.TabPane>
        ) : null}
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
          key="4"
        >
          <Charges />
        </Tabs.TabPane>
      </Tabs>
    </Card>
  );
};

export default LabContentCard;
