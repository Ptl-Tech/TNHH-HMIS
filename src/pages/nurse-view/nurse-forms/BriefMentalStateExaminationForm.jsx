import { Button } from "antd";
import NurseInnerHeader from "../../../partials/nurse-partials/NurseInnerHeader";
import {
  FileOutlined,
  PlusOutlined,
  FolderViewOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import BriefMentalStateExamFormData from "./BriefMentalStateExamFormData";
import { useLocation } from "react-router-dom";
import BriefMentalStateTable from "../tables/nurse-tables/BriefMentalStateTable";
import { useDispatch, useSelector } from "react-redux";
import { getPatientMSESlice } from "../../../actions/Doc-actions/getPatientMentalStateNotes";

const BriefMentalStateExaminationForm = () => {
  const location = useLocation();
  const patientNo = new URLSearchParams(location.search).get("PatientNo");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const dispatch = useDispatch();

  const { loading:loadingBriefMSE, data:briefMSEForm } = useSelector((state) => state.getPatientMSE);

  useEffect(() => {
    dispatch(getPatientMSESlice(patientNo));
  }, [dispatch, patientNo]);

  const handleButtonVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };
  return (
    <>
      <NurseInnerHeader
        icon={<FileOutlined />}
        title="Brief Mental Status Exam Form"
      />

      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        {!isFormVisible && (
          <>
            <Button type="primary" onClick={handleButtonVisibility}>
              <PlusOutlined /> New Brief MSE form
            </Button>
          </>
        )}
      </div>

      {isFormVisible && (
        <BriefMentalStateExamFormData
          setIsFormVisible={setIsFormVisible}
          patientNo={patientNo}
        />
      )}

      {!isFormVisible && <BriefMentalStateTable loadingBriefMSE={loadingBriefMSE} briefMSEForm={briefMSEForm}/>}
    </>
  );
};

export default BriefMentalStateExaminationForm;
