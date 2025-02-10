import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { DiffOutlined } from '@ant-design/icons';
import { Row, Space, Typography, Col } from 'antd';

import LabHeader from './LabHeader';
import LabContentCard from './LabContentCard';
import SkeletonLoading from '../../../../partials/nurse-partials/Skeleton';
import { getPatientDetails } from '../../../../actions/Doc-actions/OutPatientAction';
import { getLabRequest } from '../../../../actions/lab-actions/getLabRequest';
import Loading from '../../../../partials/nurse-partials/Loading';

const LaboratoryEvaluationCard = () => {
  // hooks
  const location = useLocation();
  const dispatch = useDispatch();

  // getting the state values from the state
  const { patientNo, labObservationNo, walkIn } = location.state || {};

  // state
  const { loading: patientLoading, data: patientData } = useSelector(
    (state) => state.getPatientDetails,
  );
  const { data: labRequestData, loading: labRequestLoading } = useSelector(
    (state) => state.getLabRequest,
  );
  const { data: postLabRequestToDoctor } = useSelector(
    (state) => state.postLabRequestToDoctor,
  );

  useEffect(() => {
    dispatch(getPatientDetails(patientNo));
  }, [dispatch, patientNo, postLabRequestToDoctor]);

  useEffect(() => {
    if (labObservationNo !== labRequestData?.LaboratoryNo) {
      dispatch(getLabRequest(labObservationNo));
    }
  }, [labRequestData, postLabRequestToDoctor, labObservationNo]);

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
            <>
              {labRequestLoading ? (
                <Loading />
              ) : (
                <LabHeader
                  walkIn={walkIn}
                  patientData={patientData}
                  patientLabRecord={labRequestData}
                />
              )}
            </>
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
