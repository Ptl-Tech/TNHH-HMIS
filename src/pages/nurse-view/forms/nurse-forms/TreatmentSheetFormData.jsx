import {
  Button,
  Card,
  Col,
  Form,
  Input,
  message,
  Row,
  Select,
  Space,
} from "antd";
import { SearchOutlined, SaveOutlined, CloseOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";

import { useEffect } from "react";
import TextArea from "antd/es/input/TextArea";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";
import {
  getInPatientQyPrescriptionLineSlice,
  getTreatmentSheetLineSlice,
  POST_TREATMENT_SHEET_LINE_FAILURE,
  POST_TREATMENT_SHEET_LINE_SUCCESS,
  postTreatmentSheetLineSlice,
} from "../../../../actions/Doc-actions/QyPrescriptionLinesSlice";

const TreatmentSheetFormData = ({ setIsFormVisible, form }) => {

  const location = useLocation();
  const admissionNo = new URLSearchParams(location.search).get("AdmNo");
  const { loading: loadingPostTreatmentSheet } = useSelector(
    (state) => state.postTreatmentSheet
  );
  const { loading:loadingPrescriptions, data:prescriptions } = useSelector(
    (state) => state.getInPatientPrescriptionLine
  );

  console.log(prescriptions, 'prescription lines')
  const dispatch = useDispatch();
  
  const handleOnFinish = async (values) => {
    try {
      const { DrugNo, Dosage, Quantity, TreatmentRemarks } = values;

      const treatmentSheet = {
        myAction: "create",
        admissionNo,
        recId: "",
        drugNo: DrugNo,
        dosage: Dosage,
        quantity: Quantity,
        issued: true,
        remarks: TreatmentRemarks,
        issuedDate: new Date().toISOString().split("T")[0],
        issuedTime: new Date().toLocaleTimeString([], { hour12: false }),
      };

      console.log(treatmentSheet, "treatment sheet");
      const response = await dispatch(
        postTreatmentSheetLineSlice()
      );
      if (response.type === POST_TREATMENT_SHEET_LINE_SUCCESS) {
        message.success(
          response.payload.msg || "Treatment sheet line saved successfully."
        );
        setIsFormVisible(false);
        form.resetFields();

        dispatch(getTreatmentSheetLineSlice(admissionNo));
      } else if (response.type === POST_TREATMENT_SHEET_LINE_FAILURE) {
        message.error(
          response.payload.msg || "Failed to save treatment sheet line."
        );
      }
    } catch (error) {
      message.error(
        error.payload.message ||
          "An error occurred while saving treatment sheet."
      );
    }
  };

  useEffect(() => {
    dispatch(getInPatientQyPrescriptionLineSlice(admissionNo));
  }, [dispatch, admissionNo]);


  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={handleOnFinish}
      initialValues={{
        DrugNo: undefined,
        Dosage: "",
        Quantity: "",
        TreatmentRemarks: "",
      }}
    >
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card style={{ padding: "20px" }}>
            <Form.Item
              label="Search Drug Name"
              name="DrugNo"
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Please select a drug",
                },
              ]}
              className="w-100 my-2"
            >
              {prescriptions && (
                <Select
                  placeholder="Select Drug e.g Paracetamol"
                  showSearch
                  loading={loadingPrescriptions}
                  
                  suffixIcon={<SearchOutlined />}
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
  
                >
                  {
                      prescriptions.map((item) => (
                        <Select.Option key={item.Drug_No} value={item.Drug_No}>
                          {item.Drug_Name}
                        </Select.Option>
                      ))
                  }

                </Select>
              )}
            </Form.Item>
            <Form.Item
              label="Dosage"
              name="Dosage"
              placeholder="Enter Dosage e.g 1 tablet"
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Please enter dosage",
                },
              ]}
              className="w-100"
            >
              <Input
                className="w-100"
                placeholder="Enter Dosage e.g 1 tablet"
              />
            </Form.Item>
            <Form.Item
              label="Quantity"
              name="Quantity"
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Please enter quantity",
                },
              ]}
            >

              <Input type="number" placeholder="Enter Quantity" />
            </Form.Item>
            {/* <Form.Item
              label="Is issued"
              name="IsIssued"
              valuePropName="checked"
            >
              <Checkbox></Checkbox>
            </Form.Item> */}
            <Form.Item
              label="Treatment Remarks"
              name="TreatmentRemarks"
              hasFeedback
            >
              <TextArea
                autoSize={{ minRows: 3, maxRows: 5 }}
                name="TreatmentRemarks"
                placeholder="Enter Treatment Sheet Remarks"
              />
            </Form.Item>
            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loadingPostTreatmentSheet}
                  disabled={loadingPostTreatmentSheet}
                >
                  <SaveOutlined />
                  Save Treatment Sheet
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
          </Card>
        </Col>
      </Row>
    </Form>
  );
};

export default TreatmentSheetFormData;
// props validation
TreatmentSheetFormData.propTypes = {
  setIsFormVisible: PropTypes.bool,
  form: PropTypes.object,
};
