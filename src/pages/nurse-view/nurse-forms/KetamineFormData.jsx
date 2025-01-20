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

  const KetamineFormData = ({ patientNo, treatmentNo, doctors, loadingDoctors, postKetamine, admissionNo}) => {
    
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
    
        await dispatch(postPatientKetamineRequest(formData))
        dispatch(getPatientKetamineRequest())
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
                  label="Procedure Dates"
                  rules={[
                    {
                      required: true,
                      message: "Please select at least one date!",
                    },
                  ]}
                  name="dates"
                  hasFeedback
                >
                  <DatePicker
                    size="large"
                     style={{ width: "100%" }}
                    placeholder="Select dates"
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
              label="Ketamine procedure notes"
              name="description"
              rules={[{ required: true, message: "Please enter ECT procedure notes!" }]}
              hasFeedback
            >
              <TextArea placeholder="Enter ketamine procedure notes" />
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
  