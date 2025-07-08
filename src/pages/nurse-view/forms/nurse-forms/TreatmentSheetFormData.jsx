import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Row,
  Select,
  Space,
  TimePicker,
} from "antd";
import {
  SearchOutlined,
  SaveOutlined,
  CloseOutlined,
  PlusOutlined,
} from "@ant-design/icons";
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
import moment from "moment";

const TreatmentSheetFormData = ({
  setIsFormVisible,
  form,
  setDrawerVisible,
  toggleDrawer,
  treatmentSheet,
}) => {
  const location = useLocation();
  const admissionNo = new URLSearchParams(location.search).get("AdmNo");
  const { loading: loadingPostTreatmentSheet } = useSelector(
    (state) => state.postTreatmentSheet || {}
  );
  const { loading: loadingPrescriptions, data: prescriptions } = useSelector(
    (state) => state.getInPatientPrescriptionLine || {}
  );

  const dispatch = useDispatch();

  //useffect to filter drugno found in treatment sheet from selected prescriptions
  const usedDrugNos = treatmentSheet?.map((entry) => entry.DrugNo) || [];

  const filteredPrescriptions =
    prescriptions?.filter((p) => !usedDrugNos.includes(p.Drug_No)) || [];

  const handleOnFinish = async (values) => {
    try {
      const { date, time, DrugNo, Dosage, quantity, remarks } = values;
      console.log("Form Values:", values);
      const treatmentSheet = {
        myAction: "create",
        admissionNo,
        recId: "",
        drugNo: DrugNo,
        dosage: Dosage,
        quantity: quantity || 0,
        issued: false,
        remarks: remarks || "",
        issuedDate: date.format("YYYY-MM-DD"),
        issuedTime: time ? time.format("HH:mm:ss") : moment().format("HH:mm:ss"),
      };
      console.log("Treatment Sheet Data:", treatmentSheet);
      const response = await dispatch(
        postTreatmentSheetLineSlice(treatmentSheet)
      );
      if (response.type === POST_TREATMENT_SHEET_LINE_SUCCESS) {
        dispatch(getTreatmentSheetLineSlice(admissionNo));

        message.success(
          response.payload.msg || "Treatment sheet line saved successfully."
        );
        setIsFormVisible(false);
        form.resetFields();
        //show drawer after saving
        setDrawerVisible(true);
        toggleDrawer();
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
  console.log({ prescriptions });
  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={handleOnFinish}
      initialValues={{
        DrugNo: undefined,
        Dosage: "",
      }}
    >
      <Card style={{ padding: "20px" }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Date"
              name="date"
              hasFeedback
              className="w-100 my-2"
            >
              <DatePicker
                placeholder="Select date"
                style={{ width: "100%" }}
                format="DD/MM/YYYY"
                allowClear
                defaultValue={moment()}
                onClick={(e) => {
                  e.target.select();
                }}
                onChange={(date) => {
                  if (date) {
                    form.setFieldsValue({ date });
                  }
                }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
           <Form.Item
  label="Time"
  name="time"
  hasFeedback
  className="w-100 my-2"
>
  <TimePicker
    placeholder="Select time"
    style={{ width: "100%" }}
    format="HH:mm"
    allowClear
    defaultValue={moment()}
  />
</Form.Item>

          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Select Drug Name"
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
                  allowClear
                  loading={loadingPrescriptions}
                  suffixIcon={<SearchOutlined />}
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                  onChange={(value) => {
                    const selectedPrescription = prescriptions.find(
                      (item) => item.Drug_No === value
                    );
                    form.setFieldsValue({
                      Dosage: selectedPrescription?.Prescription_Dose || "",
                    });
                  }}
                >
                  {prescriptions.map((item) => (
                    <Select.Option key={item.Drug_No} value={item.Drug_No}>
                      {item.Drug_Name}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Precribed Dosage"
              name="Dosage"
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Please enter dosage",
                },
              ]}
              className="w-100 my-2"
            >
              <Input placeholder="e.g. 1 tablet" readOnly />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Quantity Issued"
              name="quantity"
              className="w-100 my-2"
            >
              <Input
                type="number"
                placeholder="Enter quantity issued"
                min={0}
                max={1000}
                defaultValue={0}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Remarks" name="remarks" className="w-100 my-2">
              <TextArea
                placeholder="Enter any remarks"
                rows={4}
                maxLength={500}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              loading={loadingPostTreatmentSheet}
              disabled={loadingPostTreatmentSheet}
            >
              <PlusOutlined />
              Add to Treatment Sheet
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
    </Form>
  );
};

export default TreatmentSheetFormData;
// props validation
TreatmentSheetFormData.propTypes = {
  setIsFormVisible: PropTypes.bool,
  form: PropTypes.object,
};
