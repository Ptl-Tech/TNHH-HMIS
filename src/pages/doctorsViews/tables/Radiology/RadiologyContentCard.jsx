import React, { useEffect, useState } from 'react';
import { Button, Card, Skeleton, Tabs } from 'antd';

import { FileSearchOutlined } from '@ant-design/icons'; // Importing icons

import RadiologyTestRequest from './RadiologyTestRequest';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { getSingleRadiologyDetails } from '../../../../actions/radiology-actions/radiologyActions';
import RadiologyTopSection from './RadiologyTopSection';

const RadiologyContentCard = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const radiologyNo = queryParams.get("radiologyNo");
  useEffect(() => {
    // fetch the radiology details
    radiologyNo && dispatch(getSingleRadiologyDetails(radiologyNo))
  }, [dispatch, radiologyNo]);

  const { loading, radiologyDetails } = useSelector((state) => state.getSingleRadiologyDetails);
  console.log({ radiologyDetails });

  if (loading) return <Skeleton />;
  const gridStyle = {
    width: '50%',
    height: "10px",
    textAlign: 'center',
    display: "flex",
    // alignItems: 'center',
    columnGap: "0.75rem"
  };

  return (
    <div>
      {radiologyDetails && <RadiologyTopSection
        radiologyDetails={radiologyDetails}
      />}
      {
        // radiologyDetails && <Card title="Radiology Details" bordered={false} style={{ minWidth: "40vw", maxWidth: "50vw" }}>
        //   <Card.Grid hoverable={false} style={gridStyle}>
        //     <p style={{ color: "gray", fontWeight: "400" }}>Patient no : </p>
        //     <p>{radiologyDetails.PatientNo}</p>
        //   </Card.Grid>
        //   <Card.Grid hoverable={false} style={gridStyle}>
        //     <p style={{ color: "gray", fontWeight: "400" }}>Patient Name : </p>
        //     <p>{radiologyDetails.Surname}&nbsp;{radiologyDetails.LastName}</p>
        //   </Card.Grid>
        //   <Card.Grid hoverable={false} style={gridStyle}>
        //     <p style={{ color: "gray", fontWeight: "400" }}>Status : </p>
        //     <p>{radiologyDetails.Status}</p>
        //   </Card.Grid>
        //   <Card.Grid hoverable={false} style={gridStyle}>
        //     <p style={{ color: "gray", fontWeight: "400" }}>Treatment No : </p>
        //     <p>{radiologyDetails.Treatment_No}</p>
        //   </Card.Grid>
        //   <Card.Grid hoverable={false} style={gridStyle}>
        //     <p style={{ color: "gray", fontWeight: "400" }}>Link No : </p>
        //     {/* <p>{radiologyDetails.Treatment_No}</p> */}
        //   </Card.Grid>
        // </Card>
      }
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
    </div >
  );
};

export default RadiologyContentCard;
