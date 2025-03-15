import { useLocation, useNavigate } from "react-router-dom";
import useSetTableCheckBoxHook from "../../../../hooks/useSetTableCheckBoxHook";
import { useState } from "react";
import NurseInnerHeader from "../../../../partials/nurse-partials/NurseInnerHeader";
import {
  Button,
  Card,
  Space,
  message,
  Form,
} from "antd";
import { BankOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { postAdmissionFormDetailsSlice } from "../../../../actions/nurse-actions/postAdmissionFormDetailsSlice";
import {
  POST_ADMISSION_FORM_DETAILS_SUCCESS,
  POST_ADMISSION_FORM_DETAILS_FAILURE,
} from "../../../../actions/nurse-actions/postAdmissionFormDetailsSlice";
import AssignBed from "../../AssignBed";

const AdmitPatientForm = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { patientDetails } = location.state || {};
  const { selectedRow, selectedRowKey, rowSelection } =
    useSetTableCheckBoxHook();
  const [psychiatricCoding, setPsychiatricCoding] = useState(null);
  const [codingReason, setCodingReason] = useState(null);
  const { loadingAdmissionDetails } = useSelector(
      (state) => state.postAdmissionFormDetails);


  const handleOnFinish = async () => {
    //validate form fields
    form
      .validateFields()
      .then(() => {
        handleAssignBed();
      })
      .catch(() => {
        message.error("Please fill in all required fields");
      });
  };
  const handleAssignBed = async () => {
    if (!selectedRow[0]) {
      return message.warning("Please select bed to assign patient");
    }

    if (selectedRow[0]?.Occupied === true) {
      return message.warning(
        "Bed is already occupied, please select another bed"
      );
    }

    const formData = {
      myAction: "edit",
      recId: patientDetails?.SystemId,
      admissionNo: patientDetails?.Admission_No,
      wardRoom: selectedRow[0]?.Room_No,
      ward: selectedRow[0]?.WardNo,
      bed: selectedRow[0]?.BedNo,
      psychiatricCoding,
      codingReason,
      admissionType: "0",
    };

    try {
      const result = await dispatch(postAdmissionFormDetailsSlice(formData));
      if (result.type === POST_ADMISSION_FORM_DETAILS_SUCCESS) {
        message.success(
          result.payload.message ||
            "Ward, Room and Bed assigned successfully to patient"
        );
        navigate(`/Nurse/Inpatient`);
      } else if (result.type === POST_ADMISSION_FORM_DETAILS_FAILURE) {
        message.error(
          result.payload.message ||
            "Failed to assign ward, bed and room to patient"
        );
      }
    } catch (error) {
      message.error(
        error.message || "An internal error occurred, please try again"
      );
    }
  };

  return (
    <div>
      <NurseInnerHeader
        title="Assign Ward, Room and Bed to Patient"
        icon={<BankOutlined />}
      />

      <Card className="admit-patient-card-container">
        <Space>
          <Button
            size="large"
            type="primary"
            disabled={!selectedRowKey}
            onClick={handleOnFinish}
            loading={loadingAdmissionDetails}
          >
            <BankOutlined />
            Assign Bed
          </Button>
        </Space>
      </Card>

      <AssignBed
        rowSelection={rowSelection}
        handleOnFinish={handleOnFinish}
        form={form}
        setPsychiatricCoding={setPsychiatricCoding}
        setCodingReason={setCodingReason}
      />
    </div>
  );
};

export default AdmitPatientForm;
