import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { DiffOutlined } from '@ant-design/icons';
import { Row, Space, Typography, Col } from 'antd';

import LabHeader from './LabHeader';
import LabContentCard from './LabContentCard';
import SkeletonLoading from '../../../../partials/nurse-partials/Skeleton';
import { getLabDetails } from '../../../../actions/Doc-actions/getLabRequestDetails';
import { getPatientDetails } from '../../../../actions/Doc-actions/OutPatientAction';

const LaboratoryEvaluationCard = () => {
  // hooks
  const location = useLocation();
  const dispatch = useDispatch();

  // getting the labNo from the query params and the state values from the state
  const labNo = new URLSearchParams(location.search).get('LaboratoryNo');
  const { patientNo, patientLabRecord } = location.state || {};

  // state
  const { loading: labLoading, data: labData } = useSelector(
    (state) => state.labDetails,
  );
  const { loading: patientLoading, data: patientData } = useSelector(
    (state) => state.getPatientDetails,
  );

  useEffect(() => {
    if (!labData.length) dispatch(getLabDetails(labNo));
    if (!patientData) dispatch(getPatientDetails(patientNo));
  }, [dispatch, labNo, patientNo]);

  console.log({ labData, patientData, patientLabRecord });

  return (
    <div style={{ margin: '16px 10px' }}>
      <Space className="inpatient-header">
        <DiffOutlined />
        <Typography.Text className="inpatient-header-text">
          Laboratory Evaluation Form
        </Typography.Text>
      </Space>
      <Row
        gutter={8}
        className="inpatient-card-container"
      >
        <Col
          xs={24}
          md={24}
          lg={24}
          xl={24}
          className="inpatient-card-left-col"
        >
          {patientLoading ? (
            <SkeletonLoading />
          ) : (
            <LabHeader
              patientData={patientData}
              patientLabRecord={patientLabRecord}
            />
          )}
        </Col>
        <Col
          xs={24}
          md={24}
          lg={24}
          xl={24}
          className="inpatient-card-right-col"
        >
          {patientLoading ? <SkeletonLoading /> : <LabContentCard />}
        </Col>
      </Row>
    </div>
  );
};

export default LaboratoryEvaluationCard;
