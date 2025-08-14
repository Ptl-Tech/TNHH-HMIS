import { Button, Col, Form, Input, message, Row, Space, Spin, Table } from "antd";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllergiesAndMedicationsSlice } from "../../../../actions/triage-actions/getAllergiesAndMedicationsSlice";
import { postAllergiesMedicationSlice } from "../../../../actions/triage-actions/postAllergiesMedicationSlice";
import { SaveOutlined, CloseOutlined } from "@ant-design/icons";
import useAuth from "../../../../hooks/auth";
import TextArea from "antd/es/input/TextArea";
import { useLocation, useSearchParams } from "react-router-dom";
import { render } from "@react-pdf/renderer";

const AllergyAndMedication = ({ observationNumber, setIsFormVisible }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const config = useAuth();
  const location = useLocation();
  const admissionNo = new useSearchParams(location.search)[0].get("AdmNo");
 const { loadingGetAllergiesAndMedications, allergiesMedication } = useSelector(
    (state) => state.getAllergiesAndMedications
  );
  const { postAllergyMedicationLoading } = useSelector(
    (state) => state.postAllergiesMedication
  );


  useEffect(() => {
    dispatch(getAllergiesAndMedicationsSlice(observationNumber));
  }, [dispatch, observationNumber]);

useEffect(() => {
  if (allergiesMedication && allergiesMedication.length > 0) {
    const lastRecord = allergiesMedication[allergiesMedication.length - 1];
    form.setFieldsValue({
      allergy: {
        complains: lastRecord.Complaints || '',
        foodAllergy: lastRecord.FoodAllergy || '',
        drugAllergy: lastRecord.DrugAllergy || '',
      },
    });
  }
}, [allergiesMedication, form]);


  const onFinish = (values) => {
    const { complains, foodAllergy, drugAllergy } = values.allergy;
    const createAllergyAndMedicationData = {
      foodAllergy,
      drugAllergy,
      myAction: "create",
      complaints: complains,
      staffNo: config.staffNo,
      assessedBy: config.staffNo,
      observationNo: observationNumber ?? admissionNo,
    };
    dispatch(postAllergiesMedicationSlice(createAllergyAndMedicationData)).then(
      (data) => {
        if (data?.status === "success") {
          message.success("Successfully saved allergy and medication");
          dispatch(
            getAllergiesAndMedicationsSlice(observationNumber ?? admissionNo)
          );
          ////setIsFormVisible(false);
        } else if (data?.status === "error") {
          message.error(
            data?.status || "Failed to save allergy and medication"
          );
        } else {
          message.warning("Found allergies and medication for this patient");
        }
      }
    );
  };

//columns for allergies and medications

  const columns = [
    {
      title: "No",
      dataIndex: "No",
      key: "No",
      render: (_, __, index) => index + 1,
      width: 50,  
    },
    {
      title: "Complains",
      dataIndex: "Complaints",
      key: "Complaints",
    },
    {
      title: "Food Allergy",
      dataIndex: "FoodAllergy",
      key: "FoodAllergy",
    },
    {
      title: "Drug Allergy",
      dataIndex: "DrugAllergy",
      key: "DrugAllergy",
    },
  ];

  return (
    <div>
      <div>
        <Form
          layout="vertical"
          onFinish={onFinish}
          form={form}
          initialValues={{
            allergy: {
              complains: "",
              foodAllergy: "",
              drugAllergy: "",
            },
          }}
          autoComplete="off"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Food Allergy"
                name={["allergy", "foodAllergy"]}
                hasFeedback
              >
                <Input
                  type="text"
                  name="foodAllergy"
                  placeholder="Food Allergy"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Drug Allergy"
                name={["allergy", "drugAllergy"]}
                hasFeedback
              >
                <Input
                  type="text"
                  name="drugAllergy"
                  placeholder="`Drug Allergy"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Complains"
                name={["allergy", "complains"]}
                hasFeedback
              >
                <TextArea
                  type="text"
                  name="complains"
                  placeholder="Enter complains"
                  autoSize={{ minRows: 4, maxRows: 6 }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Col span={12}>
            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={postAllergyMedicationLoading}
                  disabled={postAllergyMedicationLoading}
                >
                  <SaveOutlined />
                  Add allergies and medication
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
          </Col>
        </Form>
        {loadingGetAllergiesAndMedications ? (
          <Spin  />
        ) : (
          <Table
            columns={columns}
            dataSource={[...allergiesMedication].reverse()}
            size="middle"
            pagination={
              {
                defaultPageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: ["10", "20", "30", "40", "50"],
              }
            }
          />
        )}        
      </div>
    </div>
  );
};

export default AllergyAndMedication;

AllergyAndMedication.propTypes = {
  observationNumber: PropTypes.string.isRequired,
  patientNumber: PropTypes.string.isRequired,
  staffNo: PropTypes.string.isRequired,
  setIsFormVisible: PropTypes.bool,
};
