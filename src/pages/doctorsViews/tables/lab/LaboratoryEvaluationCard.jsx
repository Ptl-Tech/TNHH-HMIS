import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Col, Row, Skeleton } from "antd";

import LabHeader from "./LabHeader";
import LabContentCard from "./LabContentCard";
import { getLabRequest } from "../../../../actions/lab-actions/getLabRequest";
import { getPatientDetails } from "../../../../actions/Doc-actions/OutPatientAction";

const LaboratoryEvaluationCard = () => {
  // hooks
  const location = useLocation();
  const dispatch = useDispatch();

  // getting the state values from the state
  const { patientNo, labObservationNo } = location.state || {};

  // state
  const { loading: patientLoading, data: patientData } = useSelector(
    (state) => state.getPatientDetails
  );
  const { data: labRequestData, loading: labRequestLoading } = useSelector(
    (state) => state.getLabRequest
  );
  const { data: postLabRequestToDoctor } = useSelector(
    (state) => state.postLabRequestToDoctor
  );

  useEffect(() => {
    dispatch(getPatientDetails(patientNo));
  }, [dispatch, patientNo, postLabRequestToDoctor]);

  useEffect(() => {
    console.log({ postLabRequestToDoctor });

    if (
      labObservationNo !== labRequestData?.LaboratoryNo ||
      postLabRequestToDoctor?.status === "success"
    ) {
      dispatch(getLabRequest("LaboratoryNo", labObservationNo));
    }
  }, [labRequestData, postLabRequestToDoctor, labObservationNo]);

  return (
    <div style={{ margin: "16px 10px" }}>
      <Row gutter={[0, 18]}>
        <Col
          xs={24}
          md={24}
          lg={24}
          xl={24}
          className="inpatient-card-left-col"
        >
          <Skeleton loading={patientLoading || labRequestLoading}>
            <LabHeader
              patientData={patientData}
              patientLabRecord={labRequestData}
            />
          </Skeleton>
        </Col>
        <Col
          xs={24}
          md={24}
          lg={24}
          xl={24}
          className="inpatient-card-right-col"
        >
          <Skeleton loading={patientLoading}>
            <LabContentCard />
          </Skeleton>
        </Col>
      </Row>
    </div>
  );
};

export default LaboratoryEvaluationCard;
