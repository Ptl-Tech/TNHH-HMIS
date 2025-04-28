import { Button, Form, Input, Modal } from "antd";
import { PlusOutlined, FileOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import AddAllergiesTable from "../tables/nurse-tables/AddAllergiesTable";
import { useLocation, useSearchParams } from "react-router-dom";
import useSetTableCheckBoxHook from "../../../hooks/useSetTableCheckBoxHook";
import NurseInnerHeader from "../../../partials/nurse-partials/NurseInnerHeader";
import AllergyAndMedication from "../forms/triage-forms/AllergyAndMedication";
import { useDispatch, useSelector } from "react-redux";
import { getAllergiesAndMedicationsSlice } from "../../../actions/triage-actions/getAllergiesAndMedicationsSlice";
import useAuth from "../../../hooks/useAuth";

const AddAllergies = () => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const { rowSelection } = useSetTableCheckBoxHook();
  const dispatch = useDispatch();
  const location = useLocation();
  const { loadingGetAllergiesAndMedications, allergiesMedication } =
    useSelector((state) => state.getAllergiesAndMedications);
  const admissionNo = new useSearchParams(location.search)[0].get("AdmNo");
  const role = useAuth().userData.departmentName;

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleButtonVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };

  useEffect(() => {
    dispatch(getAllergiesAndMedicationsSlice(admissionNo));
  }, [dispatch, admissionNo]);

  return (
    <div>
      <NurseInnerHeader
        icon={<FileOutlined />}
        title="Allergies and Medications"
      />

      {(!isFormVisible && role === "Nurse") ||
        (role === "Doctor" && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              paddingBottom: "20px",
              marginTop: "20px",
            }}
          >
            <Button
              type="primary"
              onClick={handleButtonVisibility}
              icon={<PlusOutlined />}
            >
              Add Allergies and Medications
            </Button>
          </div>
        ))}

      {isFormVisible && (
        <AllergyAndMedication
          setIsFormVisible={setIsFormVisible}
          observationNumber={admissionNo}
        />
      )}

      {!isFormVisible && (
        <AddAllergiesTable
          rowSelection={rowSelection}
          loadingGetAllergiesAndMedications={loadingGetAllergiesAndMedications}
          allergiesMedication={allergiesMedication}
        />
      )}

      <Modal
        title="Add Allergies and Medications"
        open={isModalOpen}
        footer={[
          <Button key="cancel" color="danger" onClick={handleCancel}>
            Cancel
          </Button>,
        ]}
      >
        <Form
          layout="vertical"
          style={{ paddingTop: "10px" }}
          form={form}
          autoComplete="off"
          initialValues={{
            complains: "",
            foodAllergy: "",
            drugAllergy: "",
          }}
        >
          <Form.Item label="Complains" name="complains" hasFeedback>
            <Input type="text" />
          </Form.Item>
          <Form.Item label="Food Allergy" name="foodAllergy" hasFeedback>
            <Input type="text" />
          </Form.Item>
          <Form.Item label="Drug Allergy" name="drugAllergy" hasFeedback>
            <Input type="text" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AddAllergies;
