import { Button, Col, Form, Input, message, Row, Space } from "antd";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllergiesAndMedicationsSlice } from "../../../../actions/triage-actions/getAllergiesAndMedicationsSlice";
import { postAllergiesMedicationSlice } from "../../../../actions/triage-actions/postAllergiesMedicationSlice";
import { SaveOutlined, CloseOutlined } from "@ant-design/icons";
// import useAuth from "../../../../hooks/useAuth";
import TextArea from "antd/es/input/TextArea";
import { useLocation, useSearchParams } from "react-router-dom";

const AllergyAndMedication = ({
  observationNumber,
  setIsFormVisible,
}) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const config = null.userData;
  const location = useLocation()
  const admissionNo = new useSearchParams(location.search)[0].get("AdmNo");

  const { postAllergyMedicationLoading } = useSelector(
    (state) => state.postAllergiesMedication
  );

  useEffect(() => {
    dispatch(getAllergiesAndMedicationsSlice(observationNumber));
  }, [dispatch, observationNumber]);

  const onFinish = (values) => {
    const { complains, foodAllergy, drugAllergy } = values.allergy;
    const createAllergyAndMedicationData = {
      complaints: complains,
      foodAllergy,
      drugAllergy,
      staffNo: config.no,
      observationNo: observationNumber ?? admissionNo,
      assessedBy: config.no,
      myAction: "create",
    };
    dispatch(postAllergiesMedicationSlice(createAllergyAndMedicationData)).then(
      (data) => {
        if (data?.status === "success") {
          message.success("Successfully saved allergy and medication");
          dispatch(getAllergiesAndMedicationsSlice(observationNumber ?? admissionNo));
          setIsFormVisible(false);
        } else if (data?.status === "error") {
          message.error(
            data?.status || "Failed to save allergy and medication"
          );
        } else {
          message.warning("Found allergies and medication for this patient");
        }
      }
    );
  };
  return (
    <div>
      <div>
        <Form
          layout="vertical"
          onFinish={onFinish}
          form={form}
          initialValues={{
            allergy: {
              complains: "",
              foodAllergy: "",
              drugAllergy: "",
            },
          }}
          autoComplete="off"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Food Allergy"
                name={["allergy", "foodAllergy"]}
                hasFeedback
              >
                <Input
                  type="text"
                  name="foodAllergy"
                  placeholder="Food Allergy"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Drug Allergy"
                name={["allergy", "drugAllergy"]}
                hasFeedback
              >
                <Input
                  type="text"
                  name="drugAllergy"
                  placeholder="`Drug Allergy"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Complains"
                name={["allergy", "complains"]}
                hasFeedback
              >
                <TextArea
                  type="text"
                  name="complains"
                  placeholder="Enter complains"
                  autoSize={{ minRows: 4, maxRows: 6 }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Col span={12}>
            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={postAllergyMedicationLoading}
                  disabled={postAllergyMedicationLoading}
                >
                  <SaveOutlined />
                  Add allergies and medication
                </Button>
                {setIsFormVisible && (
                  <Button
                    variant="outlined"
                    color="danger"
                    onClick={() => setIsFormVisible(false)}
                  >
                    <CloseOutlined />
                    Cancel
                  </Button>
                )}
              </Space>
            </Form.Item>
          </Col>
        </Form>
      </div>
    </div>
  );
};

export default AllergyAndMedication;

AllergyAndMedication.propTypes = {
  observationNumber: PropTypes.string.isRequired,
  patientNumber: PropTypes.string.isRequired,
  staffNo: PropTypes.string.isRequired,
  setIsFormVisible: PropTypes.bool,
};
