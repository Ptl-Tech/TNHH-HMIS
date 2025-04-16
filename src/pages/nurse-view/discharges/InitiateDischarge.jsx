import {
  Card,
  List,
  Checkbox,
  Button,
  Alert,
  Typography,
  Space,
  Row,
  Col,
} from "antd";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSingleInpatientAllergiesSlice } from "../../../actions/nurse-actions/getInpatientAllergiesSlice";
import { useLocation } from "react-router-dom";
import { getDiagnosisLines } from "../../../actions/Doc-actions/getDiagnosisLines";
import { getAdmittedSinglePatient } from "../../../actions/Doc-actions/Admission/getAdmittedPatients";

const { Title, Text } = Typography;

const InitiateDischarge = ({ handleInitiateDischarge }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { loadingAllergies, allergies } = useSelector(
    (state) => state.getSinglePatientAllergies
  );
  const { loading: loadingDiagnosisLines, data: diagnosisLines } = useSelector(
    (state) => state.getDiagnosisLines
  );

  const { loading: loadingPatient, admissions: admittedPatient } = useSelector(
    (state) => state.getSingleAdmittedPatient
  );

  console.log(diagnosisLines, "DiagnosisLines");
  console.log(admittedPatient, "admittedPatient");
  const admissionNo = new URLSearchParams(location.search).get("AdmNo");
  const medicalInfo = [
    { label: "Primary Diagnosis", value: "Pneumonia" },
    { label: "Reason for Admission", value: "Acute respiratory distress" },
    { label: "Treatment Plan", value: "IV antibiotics, nebulization" },
    { label: "Pending Procedures/Tests", value: "None" },
    { label: "Attending Doctor", value: "Dr. John Doe" },
  ];

  const checklistItems = [
    { label: "All lab results received", checked: true },
    { label: "Discharge medications prepared", checked: true },
    { label: "Discharge summary written", checked: false },
    { label: "Sick off letter prepared", checked: false },
    { label: "Patient family informed", checked: true },
  ];

  const [allergiesList, setAllergiesList] = useState([]);
  useEffect(() => {
    const foodAllergies = allergies
      .filter((item) => item.DrugAllergy)
      .map((item) => item.DrugAllergy);
    setAllergiesList(foodAllergies);
  }, [allergies]);

  useEffect(() => {
    dispatch(getSingleInpatientAllergiesSlice(admissionNo));
    dispatch(getDiagnosisLines(admissionNo));
    dispatch(getAdmittedSinglePatient(admissionNo));
  }, [dispatch, admissionNo]);

  return (
    <div>
      {allergiesList.length > 0 && <Title level={5}>Drug Allergies</Title>}
      {allergiesList.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          {allergiesList.map((alert, index) => (
            <Alert key={index} message={alert} type="warning" showIcon />
          ))}
        </div>
      )}
      <Card style={{ padding: "20px" }}>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Title level={4}>Medical Information</Title>
              <List
                size="small"
                bordered
                dataSource={medicalInfo}
                renderItem={(item) => (
                  <List.Item key={item.label}>
                    <Text strong>{item.label}:</Text> <Text> {item.value}</Text>
                  </List.Item>
                )}
              />
            </Col>

            <Col xs={24} md={12}>
              <Title level={4}>Discharge Checklist</Title>
              <List
                dataSource={checklistItems}
                bordered
                size="small"
                renderItem={(item) => (
                  <List.Item key={item.label}>
                    <Checkbox checked={item.checked} disabled>
                      {item.label}
                    </Checkbox>
                  </List.Item>
                )}
              />
            </Col>
          </Row>

          <Button type="primary" onClick={handleInitiateDischarge}>
            Proceed to Initiate Discharge
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default InitiateDischarge;
//props validation
InitiateDischarge.propTypes = {
  handleInitiateDischarge: PropTypes.func,
};
