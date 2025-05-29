import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  notification,
  Row,
  Space,
  Switch,
} from "antd";
import PropTypes from "prop-types";
import { SaveOutlined, CloseOutlined, PrinterOutlined, UserAddOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import {
  POST_PATIENT_SICK_OFF_FAIL,
  postSickOff,
} from "../../../actions/Doc-actions/Admission/postInitiateDischarge";
import { getAdmittedSinglePatient } from "../../../actions/Doc-actions/Admission/getAdmittedPatients";
import NurseInnerHeader from "../../../partials/nurse-partials/NurseInnerHeader";

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
    const { sickOffDays, startDate, remarks, inPatient } = values;
    const sickOffData = {
      myAction: "create",
      inPatient: inPatient,
      documentNo: admissionNo ?? treatmentNo,
      offDutyDays: parseInt(sickOffDays),
      startDate: startDate.format("YYYY-MM-DD"),
      offDutyComments: remarks,
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
  const handleResetForm = () => {
    form.resetFields();
  };

  return (
   <div>
    <div className="d-flex justify-content-between align-items-center" style={{ paddingBottom: "10px" }}>
          <NurseInnerHeader icon={<UserAddOutlined />} title="Sick Off" />

       <Button icon={<PrinterOutlined />} type="primary">
                Print
              </Button>
      </div>
      <hr/>
     <Form
      form={form}
      layout="vertical"
      style={{ paddingTop: "10px" }}
      onFinish={handleOnFinish}
      initialValues={{
        startDate: "",
        sickOffDays: "",
        remarks: "",
        inPatient: false, 
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
              disabled={isViewing}
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
              disabled={isViewing}
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
            <TextArea placeholder="Enter remarks" rows={2} disabled={isViewing} />
          </Form.Item>
        </Col>
        <Col span={12}>
        <Form.Item
            label="Inpatient "
            name="inPatient"
            valuePropName="checked"
            rules={[
              {
                required: true,
                message: "Please confirm if this is an inpatient!",
              },
            ]}>
            <Switch
              checkedChildren="Yes"
              unCheckedChildren="No"
              defaultChecked={true}
              disabled={isViewing}
              size="large"
              />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item>
        <Space>
          {isViewing ? null : (
           <>
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
           </>
          )}
          
        </Space>
      </Form.Item>
    </Form>
    </div>
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
