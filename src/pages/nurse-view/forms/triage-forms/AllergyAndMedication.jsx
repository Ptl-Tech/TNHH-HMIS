import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  message,
  Row,
  Space,
  Table,
} from "antd";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllergiesAndMedicationsSlice } from "../../../../actions/triage-actions/getAllergiesAndMedicationsSlice";
import { postAllergiesMedicationSlice } from "../../../../actions/triage-actions/postAllergiesMedicationSlice";
import Loading from "../../../../partials/nurse-partials/Loading";
import {
  SaveOutlined,
  CloseOutlined,
  ContactsOutlined,
} from "@ant-design/icons";
import useAuth from "../../../../hooks/useAuth";

const AllergyAndMedication = ({
  observationNumber,
  patientNumber,
  staffNo,
}) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const role = useAuth().userData.departmentName;
  const [showForm, setShowForm] = useState(false); // Toggle between table and form
  const config = useAuth().userData;
  const { allergyMedicationLoading, allergiesMedication } = useSelector(
    (state) => state.getAllergiesAndMedications
  );

  const { postAllergyMedicationLoading } = useSelector(
    (state) => state.postAllergiesMedication
  );

  useEffect(() => {
    dispatch(getAllergiesAndMedicationsSlice(observationNumber));
  }, [dispatch, observationNumber]);

  console.log("allergiesMedication", allergiesMedication);

  const onFinish = (values) => {
    const { complains, foodAllergy, drugAllergy } = values.allergy;
    const createAllergyAndMedicationData = {
      complaints: complains,
      foodAllergy,
      drugAllergy,
      patientNo: patientNumber,
      staffNo: config.no,
      observationNo: observationNumber,
      assessedBy: config.no,
      myAction: "create",
    };

    dispatch(postAllergiesMedicationSlice(createAllergyAndMedicationData)).then(
      (data) => {
        if (data?.status === "success") {
          message.success(data?.status);
          dispatch(getAllergiesAndMedicationsSlice(observationNumber));
          setShowForm(false);
        } else if (data?.status === "error") {
          message.error(
            data?.status || "Failed to save allergy and medication"
          );
        }
      }
    );

    dispatch(getAllergiesAndMedicationsSlice(observationNumber));
  };
  const columns = [
    {
      title: "Complains",
      dataIndex: "complains",
      key: "complains",
    },
    {
      title: "Food Allergy",
      dataIndex: "foodAllergy",
      key: "foodAllergy",
    },
    {
      title: "Drug Allergy",
      dataIndex: "drugAllergy",
      key: "drugAllergy",
    },
    {
      title: "Assessed By",
      dataIndex: "assessedBy",
      key: "assessedBy",
    },
  ];

  console.log("allergiesMedication", allergiesMedication);

  const dataSource = allergiesMedication.map((item) => ({
    key: item.observationNo, // Unique key for each row
    complains: item.Complaints,
    foodAllergy: item.FoodAllergy,
    drugAllergy: item.DrugAllergy,
    assessedBy: item.AssessedBy,
  }));

  return (
    <div>
      {allergyMedicationLoading ? (
        <Loading />
      ) : (
        <div>
          {allergiesMedication && !showForm &&
            Object.keys(allergiesMedication).length > 0 && (
              <div style={{ marginTop: "10px" }}>
                <Divider />
                <Table
                  columns={columns}
                  dataSource={dataSource}
                  pagination={false}
                />
              </div>
            )}

          {showForm && (
            <Form
              layout="vertical"
              onFinish={onFinish}
              initialValues={{
                allergy: {
                  assessedBy: allergiesMedication?.AssessedBy || staffNo,
                  complains: "",
                  foodAllergy: "",
                  drugAllergy: "",
                },
              }}
              autoComplete="off"
            >
              <Row gutter={16}>
                {/* <Col span={12}>
                   <Form.Item label="Assessed by"
                     name={['allergy', 'assessedBy']}
                     rules={[{ required: true, message: 'Please input your name!' }]}
                   >
                     <Input type='text'
                       name='assessedBy'
                       disabled
 
                     />
                   </Form.Item>
                 </Col> */}
                <Col span={24}>
                  <Form.Item
                    label="Complains"
                    name={["allergy", "complains"]}
                    hasFeedback
                  >
                    <Input type="text" name="complains" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Food Allergy"
                    name={["allergy", "foodAllergy"]}
                    hasFeedback
                  >
                    <Input type="text" name="foodAllergy" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Drug Allergy"
                    name={["allergy", "drugAllergy"]}
                    hasFeedback
                  >
                    <Input type="text" name="drugAllergy" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item>
                    <Space>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={postAllergyMedicationLoading}
                      >
                        <SaveOutlined />
                        {allergiesMedication &&
                        Object.keys(allergiesMedication).length > 0
                          ? "Add allergies and medication"
                          : "Save allergies and medication"}
                      </Button>
                      <Button
                        variant="outlined"
                        color="danger"
                        onClick={() => setShowForm(false)} // TODO: UI Slide out
                        icon={<CloseOutlined />}
                      >
                        Cancel
                      </Button>
                    </Space>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          )}
          {/* display the button on the right side of the page */}

            {!showForm && role !== 'Psychology' && (
              <Row justify='end'>
                <Button type="primary" className='' onClick={() => setShowForm(true)} icon={<ContactsOutlined />}>Add Allergies</Button>
              </Row>
            )}


            {
              allergiesMedication && Object.keys(allergiesMedication).length > 0 && (
                <div style={{ marginTop: '10px' }}>
                  <Divider />
                  <Table columns={columns}
                    dataSource={dataSource}
                    pagination={false}

                  />
                </div>
              )
            }

          </div>

        )
      }

    </div>
  );
};

export default AllergyAndMedication;

AllergyAndMedication.propTypes = {
  observationNumber: PropTypes.string.isRequired,
  patientNumber: PropTypes.string.isRequired,
  staffNo: PropTypes.string.isRequired,
  setIsFormVisible: PropTypes.bool.isRequired,
};
