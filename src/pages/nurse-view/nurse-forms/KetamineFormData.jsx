import {
  Button,
  DatePicker,
  Form,
  Select,
} from "antd";
import { FileTextOutlined } from "@ant-design/icons";

import TextArea from "antd/es/input/TextArea";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { getPatientKetamineRequest, postPatientKetamineRequest } from "../../../actions/Doc-actions/postDoctorProcedures";

const KetamineFormData = ({ patientNo, treatmentNo, doctors, postKetamine, admissionNo }) => {

  const dispatch = useDispatch();
  const handleOnFinish = async (values) => {
    const formData = {
      myAction: "create",
      recId: "",
      linkNo: treatmentNo?.trim() ? treatmentNo : admissionNo,
      doctorId: values.doctorName,
      patientNo,
      procedureDate: values.dates.format("YYYY-MM-DD"),
      status: 0
    }


    console.log('formData', formData);

    await dispatch(postPatientKetamineRequest(formData))
    dispatch(getPatientKetamineRequest(treatmentNo ?? admissionNo));

    form.resetFields();
  };

  const [form] = Form.useForm();
  return (
    <div>
      <Form
        layout="vertical"
        style={{ paddingTop: "10px" }}
        form={form}
        autoComplete="off"
        initialValues={{
          date: "",
          doctorName: "",
          description: "",
        }}
        onFinish={handleOnFinish}
      >
        <div className="row">
          <div className="col-12 col-md-6">
            <Form.Item
              label="Procedure Date"
              rules={[
                {
                  required: true,
                  message: "Please select the procedure date!",
                },
              ]}
              name="dates"
              hasFeedback
            >
              <DatePicker
                size="large"
                style={{ width: "100%" }}
                placeholder="Select date"
              />

            </Form.Item>
          </div>
          <div className="col-12 col-md-6">
            <Form.Item
              label="Anesthetist/Anesthesiologist"
              name="doctorName"
              rules={[{ required: true, message: "Please select a anesthetist/anesthesiologist!" }]}
              hasFeedback
              style={{ width: "100%" }}
            >
              {/* <Select
                    placeholder="Select a doctor name"
                    style={{ width: "100%" }}
                    size="large"
                    loading={loadingDoctors}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    options={
                      doctors.map((doc) => ({
                        value: doc?.DoctorID,
                        label: doc?.DoctorsName,
                      }))
                    }
  
                  /> */}
              <Select
                placeholder="Select an Option"
                size="large"
                className="w-100"
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                <Select.Option value="">--Select an Option--</Select.Option>
                {
                  doctors.map((doc) => (
                    <Select.Option key={doc?.DoctorID} value={doc?.DoctorID}>
                      {doc.DoctorsName}
                    </Select.Option>
                  ))}
              </Select>

            </Form.Item>
          </div>

        </div>

        <Form.Item
          label="Ketamine procedure remarks"
          name="description"
          rules={[{ required: true, message: "Please enter ECT procedure remarks!" }]}
          hasFeedback
        >
          <TextArea placeholder="Enter ketamine procedure remarks" />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            icon={<FileTextOutlined />}
            loading={postKetamine}
            disabled={postKetamine}
          >
            Request Test
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default KetamineFormData;
//props validation
KetamineFormData.propTypes = {
  patientNo: PropTypes.string.isRequired,
  treatmentNo: PropTypes.string.isRequired,
  doctors: PropTypes.array.isRequired,
  loadingDoctors: PropTypes.bool.isRequired,
  postKetamine: PropTypes.bool,
  admissionNo: PropTypes.string,
};
