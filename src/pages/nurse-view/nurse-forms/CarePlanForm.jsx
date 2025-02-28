import { Button, Form } from "antd";
import NurseInnerHeader from "../../../partials/nurse-partials/NurseInnerHeader";
import { BorderlessTableOutlined, PlusOutlined } from "@ant-design/icons";
import useAuth from "../../../hooks/useAuth";
import { useEffect, useState } from "react";
import CarePlanFormData from "./CarePlanFormData";
import CarePlanFormTable from "../tables/nurse-tables/CarePlanFormTable";
import { useDispatch, useSelector } from "react-redux";
import { getNursingCarePlanSlice } from "../../../actions/nurse-actions/postNursingCarePlanFormSlice";
import { useLocation } from "react-router-dom";

const CarePlanForm = () => {
  const role = useAuth().userData.departmentName;
  const [isFormVisible, setIsFormVisible] = useState(false);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const location = useLocation();
  const patientDetails = location.state?.patientDetails;
  const [isViewing, setIsViewing] = useState(false);

  const { loadingGetCarePlan, getCarePlan } = useSelector(
    (state) => state.getNursingCarePlan
  );

  const handleButtonVisibility = () => {
    setIsViewing(false);
    setIsFormVisible(!isFormVisible);
  };

  useEffect(() => {
    dispatch(getNursingCarePlanSlice(patientDetails?.Admission_No));
  }, [dispatch, patientDetails?.Admission_No]);

  return (
    <>
      <NurseInnerHeader
        icon={<BorderlessTableOutlined />}
        title="Nursing Care Plan"
      />

      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        {!isFormVisible && role === "Nurse" && (
          <>
            <Button type="primary" onClick={handleButtonVisibility}>
              <PlusOutlined /> Nursing Care Plan
            </Button>
          </>
        )}
      </div>

      {isFormVisible && (
        <CarePlanFormData
          setIsFormVisible={setIsFormVisible}
          form={form}
          patientDetails={patientDetails}
          isViewing={isViewing}
        />
      )}

      {!isFormVisible && (
        <CarePlanFormTable
          getCarePlan={getCarePlan}
          loadingGetCarePlan={loadingGetCarePlan}
          setIsFormVisible={setIsFormVisible}
          form={form}
          patientDetails={patientDetails}
          setIsViewing={setIsViewing}
        />
      )}
    </>
  );
};

export default CarePlanForm;
