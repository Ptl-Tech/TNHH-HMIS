import { DisconnectOutlined, BankOutlined } from "@ant-design/icons";
import NurseInnerHeader from "../../partials/nurse-partials/NurseInnerHeader";
import PatientInfo from "./nurse-patient-file/PatientInfo";
import AssignBed from "./AssignBed";
import { Button, Card, Form, message } from "antd";
import useSetTableCheckBoxHook from "../../hooks/useSetTableCheckBoxHook";
import {
  POST_ADMISSION_FORM_DETAILS_FAILURE,
  POST_ADMISSION_FORM_DETAILS_SUCCESS,
  postAdmissionFormDetailsSlice,
} from "../../actions/nurse-actions/postAdmissionFormDetailsSlice";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
const DirectAdmission = () => {
  const { selectedRow, selectedRowKey, rowSelection } =
    useSetTableCheckBoxHook();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [psychiatricCoding, setPsychiatricCoding] = useState(null);
  const [codingReason, setCodingReason] = useState(null);
  const location = useLocation();
  const patientNo = new URLSearchParams(location.search).get("PatientNo");
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
      myAction: "create",
      admissionNo: "",
      recId: "",
      patientNo,
      wardRoom: selectedRow[0]?.Room_No,
      ward: selectedRow[0]?.WardNo,
      bed: selectedRow[0]?.BedNo,
      psychiatricCoding,
      codingReason,
      admissionType: "0",
    };

    console.log("formData", formData);

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
      <PatientInfo />

      <div style={{ marginTop: "20px" }}>
        <Card className="admit-patient-card-container">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <NurseInnerHeader
              icon={<DisconnectOutlined />}
              title="Direct Admissions Form"
            />
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
          </div>
        </Card>
        <div style={{ marginTop: "20px" }}>
          <AssignBed
            rowSelection={rowSelection}
            handleOnFinish={handleOnFinish}
            form={form}
            setPsychiatricCoding={setPsychiatricCoding}
            setCodingReason={setCodingReason}
          />
        </div>
      </div>
    </div>
  );
};

export default DirectAdmission;
