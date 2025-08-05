import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Button, Form } from "antd";
import { BorderlessTableOutlined, PlusOutlined } from "@ant-design/icons";
import NurseInnerHeader from "../../../partials/nurse-partials/NurseInnerHeader";

import { useAbility } from "../../../hooks/casl";

import CarePlanFormData from "./CarePlanFormData";
import CarePlanFormTable from "../tables/nurse-tables/CarePlanFormTable";
import { getNursingCarePlanSlice } from "../../../actions/nurse-actions/postNursingCarePlanFormSlice";

const CarePlanForm = () => {
  const ability = useAbility();
  const dispatch = useDispatch();
  const location = useLocation();

  const [form] = Form.useForm();

  const canCreateNursingPlan = ability.can("create", "nursingPlan");

  const [isViewing, setIsViewing] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const patientDetails = location.state?.patientDetails;

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
        {!isFormVisible && canCreateNursingPlan && (
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
