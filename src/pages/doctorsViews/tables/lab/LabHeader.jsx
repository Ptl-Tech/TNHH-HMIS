import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import moment from 'moment';

import { UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Typography, Row, Col, message } from 'antd';
import {
  POST_LAB_TO_DOCTOR_RESET,
  submitLabRequestToDoctor,
} from '../../../../actions/lab-actions/postLabRequestToDoctor';

const LabHeader = ({ walkIn, patientData, patientLabRecord }) => {
  const dispatch = useDispatch();

  const { data, loading, error } = useSelector(
    (state) => state.postLabRequestToDoctor,
  );

  useEffect(() => {
    if (data) {
      const { status } = data;
      status === 'success'
        ? message.success('Lab request submitted to the doctor')
        : message.error('Could not send the lab request to the doctor');

      dispatch({ type: POST_LAB_TO_DOCTOR_RESET });
    }

    if (error) {
      message.error('Something went wrong');
      dispatch({ type: POST_LAB_TO_DOCTOR_RESET });
    }

    if (loading) message.info('Submitting the request to the doctor');
  }, [data, loading, error]);

  const capitalizeWords = (name) =>
    name
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

  const patientName = patientData?.SearchName
    ? capitalizeWords(patientData.SearchName)
    : capitalizeWords(
        [patientData?.Surname, patientData?.FirstName, patientData?.MiddleName]
          .filter(Boolean)
          .join(' '),
      );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'green';
      case 'New':
        return 'orange';
      case 'Cancelled':
        return 'red';
      case 'Forwaded':
        return 'blue';
      default:
        return 'gray';
    }
  };

  const handleMarkAsCompleted = (labNo) => {
    // TODO: Do this varibaly based on the walk in status
    if (walkIn) {
      // do something
    } else {
      dispatch(submitLabRequestToDoctor(labNo));
    }
  };

  return (
    <Row
      gutter={[16, 16]}
      style={{ margin: 0 }}
    >
      <Col
        xs={24}
        md={8}
      >
        <Card
          style={{
            padding: '10px 16px',
            background: '#e5e3e3',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            minHeight: '250px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '16px',
            }}
          >
            <Avatar
              icon={<UserOutlined />}
              size={48}
            />
            <div>
              <Typography.Title
                level={5}
                style={{ margin: 0 }}
              >
                {patientName}
              </Typography.Title>
              <Typography.Text style={{ color: 'gray', fontSize: '12px' }}>
                DOB: {patientData?.DateOfBirth}
              </Typography.Text>
            </div>
          </div>
          <Typography.Title
            level={5}
            style={{ color: '#0F5689', marginBottom: '12px' }}
          >
            Patient Information
          </Typography.Title>
          <InfoRow
            label="Patient Number"
            value={patientData?.PatientNo}
          />
          <InfoRow
            label="Lab Observation Number"
            value={patientLabRecord?.LaboratoryNo}
          />
          <InfoRow
            label="Age"
            value={`${moment().diff(patientData?.DateOfBirth, 'years')} Years`}
          />
          <InfoRow
            label="Gender"
            value={patientData?.Gender}
          />
        </Card>
      </Col>
      <Col
        xs={24}
        md={8}
      >
        <Card
          style={{
            padding: '10px 16px',
            background: '#e5e3e3',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            minHeight: '250px',
          }}
        >
          <Typography.Title
            level={5}
            style={{ color: '#0F5689', marginBottom: '12px' }}
          >
            Lab Information
          </Typography.Title>
          <InfoRow
            label="Laboratory Type"
            value={patientLabRecord?.LinkType}
          />
          <InfoRow
            label="Lab Test Date"
            value={patientLabRecord?.LaboratoryDate}
          />
          <InfoRow
            label="Lab Test Time"
            value={patientLabRecord?.LaboratoryTime}
          />
          <InfoRow
            label="Lab Request Area/Location"
            value={patientLabRecord?.Request_Area}
          />
          <InfoRow
            label="Lab Test Status"
            value={
              <span style={{ color: getStatusColor(patientLabRecord?.Status) }}>
                {patientLabRecord?.Status || 'N/A'}
              </span>
            }
          />
        </Card>
      </Col>
      <Col
        xs={24}
        md={8}
      >
        <Card
          style={{
            padding: '10px 16px',
            background: '#e5e3e3',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            minHeight: '250px',
          }}
        >
          <Typography.Title
            level={5}
            style={{ color: '#0f5689', marginBottom: '12px' }}
          >
            Settlement Information
          </Typography.Title>
          <InfoRow
            label="Settlement Type"
            value={patientData?.PatientType}
          />
          <InfoRow
            label="Insurance"
            value={patientData?.Insurance_Name || 'N/A'}
          />
          <InfoRow
            label="Patient Bill Balance"
            value={`KSH. ${patientData?.Balance || '0.00'}`}
          />
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
              marginTop: '16px',
            }}
          >
            <Button
              type="primary"
              disabled={patientLabRecord?.Status === 'Completed' || loading}
              style={{ flex: '1 1 calc(50% - 5px)' }}
              onClick={() =>
                handleMarkAsCompleted(patientLabRecord?.LaboratoryNo)
              }
            >
              {patientLabRecord?.Status === 'Completed'
                ? 'Lab Request Submitted'
                : loading
                ? 'Loading...'
                : 'Mark as Completed'}
            </Button>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

const InfoRow = ({ label, value }) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '8px',
    }}
  >
    <Typography.Title
      level={5}
      style={{ fontSize: '14px', margin: 0, color: 'black' }}
    >
      {label}
    </Typography.Title>
    <Typography.Text
      style={{
        fontSize: '14px',
        color: 'gray',
        fontWeight: 'bold',
      }}
    >
      {value || 'N/A'}
    </Typography.Text>
  </div>
);

export default LabHeader;
