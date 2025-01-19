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
import { getPatientECTRequest, postPatientECTRequest } from "../../../actions/Doc-actions/postDoctorProcedures";

  const ECTFormData = ({ patientNo, treatmentNo, doctors, loadingDoctors}) => {
    const dispatch = useDispatch();
    const handleOnFinish = async (values) => {
      const formData = {
        myAction: "create",
        recId: "",
        linkNo: treatmentNo,
        patientNo,
        procedureDate: values.dates.format("YYYY-MM-DD"),
        status: 0
      }
    
        await dispatch(postPatientECTRequest(formData))
        dispatch(getPatientECTRequest())
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
                    placeholder="Select multiple dates"
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
              label="ECT procedure notes"
              name="description"
              rules={[{ required: true, message: "Please enter ECT procedure notes!" }]}
              hasFeedback
            >
              <TextArea placeholder="Enter ECT procedure notes" />
            </Form.Item>
            <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              icon={<FileTextOutlined />}
            //   onClick={handleLabRequest}
            //   loading={loadingLabRequest}
            //   disabled={loadingLabRequestPost}
            >
              Request Test
            </Button>
            </Form.Item>
          </Form>
      </div>
    );
  };
  
  export default ECTFormData;
  //props validation
  ECTFormData.propTypes = {
    patientNo: PropTypes.string.isRequired,
    treatmentNo: PropTypes.string.isRequired,
    doctors: PropTypes.array.isRequired,
    loadingDoctors: PropTypes.bool.isRequired
  };
  