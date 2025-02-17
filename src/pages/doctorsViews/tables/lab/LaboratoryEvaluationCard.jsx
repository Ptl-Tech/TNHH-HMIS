import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Row, Col } from 'antd';

import LabHeader from './LabHeader';
import LabContentCard from './LabContentCard';
import Loading from '../../../../partials/nurse-partials/Loading';
import SkeletonLoading from '../../../../partials/nurse-partials/Skeleton';
import { getLabRequest } from '../../../../actions/lab-actions/getLabRequest';
import { getPatientDetails } from '../../../../actions/Doc-actions/OutPatientAction';

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
    console.log({ postLabRequestToDoctor });

    if (
      labObservationNo !== labRequestData?.LaboratoryNo ||
      postLabRequestToDoctor?.status === 'success'
    ) {
      dispatch(getLabRequest(labObservationNo));
    }
  }, [labRequestData, postLabRequestToDoctor, labObservationNo]);

  return (
    <div style={{ margin: '16px 10px' }}>
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
