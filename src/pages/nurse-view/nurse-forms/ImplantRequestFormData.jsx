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
import { getPatientKetamineRequest, postPatientImplantRequest } from "../../../actions/Doc-actions/postDoctorProcedures";

  const ImplantFormData = ({ patientNo, treatmentNo, doctors, loadingDoctors, loadingInplant, admissionNo}) => {
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
    
        await dispatch(postPatientImplantRequest(formData))
        dispatch(getPatientKetamineRequest())

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
                  label="Doctor"
                  name="doctorName"
                  rules={[{ required: true, message: "Please select a anesthetist/anesthesiologist!" }]}
                  hasFeedback
                  style={{ width: "100%" }}
                >
                  <Select
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
  
                  />
                    
                </Form.Item>
              </div>
             
            </div>
            
            <Form.Item
              label="Implant procedure remarks"
              name="description"
              rules={[{ required: true, message: "Please enter ECT procedure remarks!" }]}
              hasFeedback
            >
              <TextArea placeholder="Enter implant procedure remarks" />
            </Form.Item>
            <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              icon={<FileTextOutlined />}
              loading={loadingInplant}
              disabled={loadingInplant}
            >
              Request Test
            </Button>
            </Form.Item>
          </Form>
      </div>
    );
  };
  
  export default ImplantFormData;
  //props validation
  ImplantFormData.propTypes = {
    patientNo: PropTypes.string.isRequired,
    treatmentNo: PropTypes.string.isRequired,
    doctors: PropTypes.array.isRequired,
    loadingDoctors: PropTypes.bool.isRequired,
    loadingInplant: PropTypes.bool.isRequired,
    admissionNo: PropTypes.string,
  };
  