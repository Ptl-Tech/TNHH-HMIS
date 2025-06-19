import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  Col,
  Row,
  Form,
  Space,
  Input,
  Button,
  DatePicker,
  notification,
} from "antd";
import dayjs from "dayjs";
import { SaveOutlined, CloseOutlined } from "@ant-design/icons";

import {
  postSickOff,
  POST_PATIENT_SICK_OFF_FAIL,
} from "../../../actions/Doc-actions/Admission/postInitiateDischarge";
import { getAdmittedSinglePatient } from "../../../actions/Doc-actions/Admission/getAdmittedPatients";

const SickOffFormData = ({ currentInpatient }) => {
  const { TextArea } = Input;
  const [form] = Form.useForm();

  const dispatch = useDispatch();
  const searchParams = new URLSearchParams(useLocation().search);

  const admissionNo = searchParams.get("AdmNo");
  const treatmentNo = searchParams.get("TreatmentNo");

  const isInpatient = Boolean(admissionNo) || false;

  const { loading: loadingSickOff } = useSelector((state) => state.postSickOff);

  const handleResetForm = () => {
    form.resetFields();
  };

  const handleOnFinish = async (values) => {
    const { sickOffDays, startDate, remarks } = values;
    const sickOffData = {
      myAction: "create",
      inPatient: isInpatient,
      offDutyComments: remarks,
      offDutyDays: parseInt(sickOffDays),
      documentNo: admissionNo ?? treatmentNo,
      startDate: startDate.format("YYYY-MM-DD"),
    };

    await dispatch(postSickOff(sickOffData))
      .then((response) => {
        if (response.status === "success") {
          form.resetFields();
          notification.success({
            message: "Sick Off Created Successfully",
          });
          dispatch(getAdmittedSinglePatient(admissionNo, treatmentNo));
        } else if (response.type === POST_PATIENT_SICK_OFF_FAIL) {
          form.resetFields();
          notification.error({
            message: "Sick Off Creation Failed",
          });
        }
      })
      .then(() => {
        form.resetFields();
      })
      .catch((error) => {
        notification.error({
          message: error.message || "An error occurred",
        });
      });
  };

  return (
    <div>
      <Form
        form={form}
        layout="vertical"
        style={{ paddingTop: "10px" }}
        onFinish={handleOnFinish}
        initialValues={{
          inPatient: isInpatient,
          remarks: currentInpatient?.OffDutyComments,
          sickOffDays: currentInpatient?.OffDutyDays,
          startDate:
            currentInpatient?.SickOffStartDate &&
            currentInpatient?.SickOffStartDate !== "0001-01-01"
              ? dayjs(currentInpatient?.SickOffStartDate)
              : undefined,
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
                format="DD/MM/YYYY"
                disabledDate={(current) => {
                  // Disable dates before today
                  return current && current < dayjs().startOf("day");
                }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Sick off Days"
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
          <Col span={12}>
            <Form.Item
              label="Off Duty Remarks"
              hasFeedback
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
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={loadingSickOff}
              disabled={loadingSickOff}
            >
              Save Sick Off
            </Button>
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
    </div>
  );
};

export default SickOffFormData;
