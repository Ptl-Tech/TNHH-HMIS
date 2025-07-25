import { Button, Col, Form, message, Row, Space } from "antd";
import TextArea from "antd/es/input/TextArea";
import { SaveOutlined, CloseOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import {
  getNursingCarePlanSlice,
  POST_NURSING_CARE_PLAN_FAILURE,
  POST_NURSING_CARE_PLAN_SUCCESS,
  postNursingCarePlanSlice,
} from "../../../actions/nurse-actions/postNursingCarePlanFormSlice";

const CarePlanFormData = ({
  setIsFormVisible,
  form,
  patientDetails,
  isViewing,
}) => {
  const dispatch = useDispatch();
  const { loadingCarePlan } = useSelector((state) => state.postNursingCarePlan);

  const handleResetForm = () => {
    form.resetFields();
    setIsFormVisible(false);
  };

  const handleOnFinish = async (values) => {
    try {
      const formData = {
        myAction: "create",
        recId: "",
        admissionNo: patientDetails?.Admission_No,
        patientNo: patientDetails?.Patient_No,
        pysicalAssessment: values.Physical_Assessmet_MSA,
        nursingDiagnosis: values.Nursing_Diagnosis,
        plan: values.Plan,
        implementation: values.Implementation,
        rationale: values.Rationale,
        evaluation: values.Evaluation,
      };

      const dispatchFormData = async (data) => {
        await dispatch(postNursingCarePlanSlice(data))
          .then((result) => {
            if (result.type === POST_NURSING_CARE_PLAN_SUCCESS) {
              message.success(
                result.payload.msg || `Care plan saved successfully!`
              );
              dispatch(getNursingCarePlanSlice(patientDetails?.Admission_No));
              setIsFormVisible(false);
            } else if (result.type === POST_NURSING_CARE_PLAN_FAILURE) {
              message.error(
                result.payload.msg || "Error processing your request."
              );
            }
          })
          .then(() => {
            form.resetFields();
          })
          .catch((err) => {
            message.error(
              err.message || "Internal server error, please try again later."
            );
          });
      };

      // Call the function
      await dispatchFormData(formData);
    } catch (error) {
      message.error(error.message || "An unexpected error occurred.");
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      style={{ paddingTop: "10px" }}
      onFinish={handleOnFinish}
      initialValues={{
        Physical_Assessmet_MSA: "",
        Nursing_Diagnosis: "",
        Plan: "",
        Rationale: "",
        Evaluation: "",
        Implementation: "",
      }}
    >
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Form.Item
            label="Physical Assessment"
            name="Physical_Assessmet_MSA"
            style={{ width: "100%" }}
            rules={[
              {
                required: true,
                message: "Please enter the physical assessment!",
              },
            ]}
          >
            <TextArea
              placeholder="Physical Assessment"
              autoSize={{ minRows: 2, maxRows: 6 }}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Nursing Diagnosis"
            name="Nursing_Diagnosis"
            style={{ width: "100%" }}
            rules={[
              {
                required: true,
                message: "Please enter the nursing diagnosis!",
              },
            ]}
          >
            <TextArea
              placeholder="Nursing Diagnosis"
              autoSize={{ minRows: 2, maxRows: 6 }}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        
        <Col span={12}>
          <Form.Item
            label="Plan"
            name="Plan"
            style={{ width: "100%" }}
          >
            <TextArea
              placeholder="Nursing Plan"
              autoSize={{ minRows: 2, maxRows: 6 }}
            />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Implementation"
            name="Implementation"
            style={{ width: "100%" }}
          >
            <TextArea
              placeholder="Nursing Implementation"
              autoSize={{ minRows: 2, maxRows: 6 }}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Form.Item
            label="Rationale"
            name="Rationale"
            style={{ width: "100%" }}
          >
            <TextArea
              placeholder="Rationale"
              autoSize={{ minRows: 2, maxRows: 6 }}
            />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            label="Evaluation"
            name="Evaluation"
            style={{ width: "100%" }}
          >
            <TextArea
              placeholder="evaluation"
              autoSize={{ minRows: 2, maxRows: 6 }}
            />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item>
        <Space>
          {isViewing ? (
            null
          ) : (
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={loadingCarePlan}
              disabled={loadingCarePlan}
            >
              Save Care Plan
            </Button>
          )
          }
          <Button
            color="danger"
            variant="outlined"
            icon={<CloseOutlined />}
            onClick={() => handleResetForm()}
          >
            Cancel
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default CarePlanFormData;

//props validation
CarePlanFormData.propTypes = {
  setIsFormVisible: PropTypes.bool,
  form: PropTypes.array.isRequired,
  patientDetails: PropTypes.array.isRequired,
  isViewing: PropTypes.bool,
};
