import { FileOutlined, PlusOutlined } from "@ant-design/icons";
import TreatmentSheetTable from "../tables/nurse-tables/TreatmentSheetTable";
import NurseInnerHeader from "../../../partials/nurse-partials/NurseInnerHeader";
import { Button, Form } from "antd";
import { useEffect, useState } from "react";
import TreatmentSheetFormData from "../forms/nurse-forms/TreatmentSheetFormData";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getTreatmentSheetLineSlice } from "../../../actions/Doc-actions/QyPrescriptionLinesSlice";

const TreatmentsSheet = () => {
  const [form] = Form.useForm();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const location = useLocation();
  const admissionNo = new URLSearchParams(location.search).get("AdmNo");
  const dispatch = useDispatch();
  const { loading: loadingTreatmentSheet, data: treatmentSheet } = useSelector(
    (state) => state.getTreatmentSheet
  );

  console.log(treatmentSheet, "treatment sheet");
  const handleButtonVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };

  useEffect(() => {
    dispatch(getTreatmentSheetLineSlice(admissionNo));
  }, [dispatch, admissionNo]);

  return (
    <div>
      <NurseInnerHeader icon={<FileOutlined />} title="Treatments Sheet" />

      {!isFormVisible && (
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
            Add Treatment Sheet
          </Button>
        </div>
      )}

      {isFormVisible && (
        <TreatmentSheetFormData
          setIsFormVisible={setIsFormVisible}
          form={form}
        />
      )}

      {!isFormVisible && (
        <TreatmentSheetTable
          loadingTreatmentSheet={loadingTreatmentSheet}
          treatmentSheet={treatmentSheet}
        />
      )}
    </div>
  );
};

export default TreatmentsSheet;
