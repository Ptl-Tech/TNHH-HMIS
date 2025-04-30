import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  notification,
  Row,
  Space,
} from "antd";
import PropTypes from "prop-types";
import { SaveOutlined, CloseOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import {
  POST_PATIENT_SICK_OFF_FAIL,
  postSickOff,
} from "../../../actions/Doc-actions/Admission/postInitiateDischarge";
import { getAdmittedSinglePatient } from "../../../actions/Doc-actions/Admission/getAdmittedPatients";

const SickOffFormData = ({
  isViewing,
  setIsFormVisible,
  admissionNo,
  treatmentNo,
}) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const { loading: loadingSickOff } = useSelector((state) => state.postSickOff);

  const handleOnFinish = async (values) => {
    const { sickOffDays, startDate, remarks } = values;
    const sickOffData = {
      myAction: "create",
      inPatient: !!admissionNo,
      documentNo: admissionNo ?? treatmentNo,
      offDutyDays: parseInt(sickOffDays),
      startDate: startDate.format("YYYY-MM-DD"),
      offDutyComments: remarks,
    };

    // console.log("Sick Off Data", sickOffData);

    await dispatch(postSickOff(sickOffData))
      .then((response) => {
        if (response.status === "success") {
          form.resetFields();
          setIsFormVisible(false);
          notification.success({
            message: "Sick Off Created Successfully",
          });
          dispatch(getAdmittedSinglePatient(admissionNo));
        } else if (response.type === POST_PATIENT_SICK_OFF_FAIL) {
          form.resetFields();
          setIsFormVisible(false);
          notification.error({
            message: "Sick Off Creation Failed",
          });
        }
      })
      .then(() => {
        form.resetFields();
        setIsFormVisible(false);
      })
      .catch((error) => {
        notification.error({
          message: error.message || "An error occurred",
        });
      });
  };
  const handleResetForm = () => {
    form.resetFields();
    setIsFormVisible(false);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      style={{ paddingTop: "10px" }}
      onFinish={handleOnFinish}
      initialValues={{
        startDate: "",
        sickOffDays: "",
        remarks: "",
      }}
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Form.Item
            label="Sick off Start Date"
            name="startDate"
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please select sick off start date!",
              },
            ]}
          >
            <DatePicker
              placeholder="Sick off Start Date"
              style={{ width: "100%" }}
              disabledDate={(current) => {
                // Disable dates before today
                return current && current < dayjs().startOf("day");
              }}
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            label="Sick off Number of Days"
            name="sickOffDays"
            rules={[
              {
                required: true,
                message: "Please enter number of sick off days!",
              },
            ]}
            hasFeedback
          >
            <Input
              placeholder="Sick off number of days"
              type="number"
              min={0}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Form.Item
            label="Remarks"
            name="remarks"
            rules={[
              {
                validator: (_, value) => {
                  if (value && value.length > 500) {
                    return Promise.reject(
                      new Error("Remarks cannot exceed 500 characters!")
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <TextArea placeholder="Enter remarks" rows={2} />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item>
        <Space>
          {isViewing ? null : (
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={loadingSickOff}
              disabled={loadingSickOff}
            >
              Save Sick Off
            </Button>
          )}
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

export default SickOffFormData;
// props validation
SickOffFormData.propTypes = {
  isViewing: PropTypes.bool,
  setIsFormVisible: PropTypes.func,
  setIsViewing: PropTypes.func,
  admissionNo: PropTypes.string,
  treatmentNo: PropTypes.string,
};
