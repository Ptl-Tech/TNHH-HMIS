import { Button, Form } from "antd";
import NurseInnerHeader from "../../../partials/nurse-partials/NurseInnerHeader";
import { BorderlessTableOutlined, PlusOutlined } from "@ant-design/icons";
import useAuth from "../../../hooks/useAuth";
import { useEffect, useState } from "react";
import DischargeSummeryTable from "../tables/nurse-tables/DischargeSummeryTable";
import { useDispatch, useSelector } from "react-redux";
import { getNursingCarePlanSlice } from "../../../actions/nurse-actions/postNursingCarePlanFormSlice";
import { useLocation } from "react-router-dom";
import DischargeSummaryFormData from "../nurse-forms/DischargeSummaryFormData";

const Summery = () => {
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
        title="Discharge Summary"
      />

      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        {!isFormVisible && role === "Doctor" && (
          <>
            <Button type="primary" onClick={handleButtonVisibility}>
              <PlusOutlined /> Discharge Summary
            </Button>
          </>
        )}
      </div>

      {isFormVisible && (
        <DischargeSummaryFormData
          setIsFormVisible={setIsFormVisible}
          form={form}
          patientDetails={patientDetails}
          isViewing={isViewing}
        />
      )}

      {!isFormVisible && (
        <DischargeSummeryTable
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
export default Summery;
