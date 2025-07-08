import { FileOutlined, PlusOutlined } from "@ant-design/icons";
import TreatmentSheetTable from "../tables/nurse-tables/TreatmentSheetTable";
import NurseInnerHeader from "../../../partials/nurse-partials/NurseInnerHeader";
import { Button, Drawer, Form } from "antd";
import { useEffect, useState } from "react";
import TreatmentSheetFormData from "../forms/nurse-forms/TreatmentSheetFormData";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getTreatmentSheetLineSlice } from "../../../actions/Doc-actions/QyPrescriptionLinesSlice";
import InpatientCardInfo from "../InpatientCardInfo";
import { is } from "immutable";
import useAuth from "../../../hooks/useAuth";

const TreatmentsSheet = ({ patientDetails }) => {
  const [form] = Form.useForm();
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const location = useLocation();
  const admissionNo = new URLSearchParams(location.search).get("AdmNo");
  const dispatch = useDispatch();
  const userRole = useAuth().userData.departmentName;

  const { loading: loadingTreatmentSheet, data: treatmentSheet } = useSelector(
    (state) => state.getTreatmentSheet || {}
  );

  // Open drawer by default if Doctor
  useEffect(() => {
    if (userRole === "Doctor") {
      setDrawerVisible(true);
    }
  }, [userRole]);

  useEffect(() => {
    if (admissionNo) {
      dispatch(getTreatmentSheetLineSlice(admissionNo));
    }
  }, [dispatch, admissionNo]);

  const handleAddClick = () => {
    setIsFormVisible(!isFormVisible);
  };

  const toggleDrawer = () => {
    // Just toggle state; role is already handled in useEffect
    setDrawerVisible((prev) => !prev);
  };

  return (
    <div>
      <NurseInnerHeader icon={<FileOutlined />} title="Treatments Sheet" />

      <div style={{ display: "flex", gap: "20px", marginTop: 20, marginBottom: 20 }}>
        {userRole === "Nurse" && (
          <Button
            type={isFormVisible ? "default" : "primary"}
            icon={<PlusOutlined />}
            onClick={handleAddClick}
          >
            Update Treatment Sheet
          </Button>
        )}

        <Button onClick={toggleDrawer} type={isFormVisible ? "primary" : "default"}>
          View Medication Sheet
        </Button>
      </div>

      {isFormVisible && (
        <TreatmentSheetFormData
          form={form}
          setIsFormVisible={setIsFormVisible}
          loadingTreatmentSheet={loadingTreatmentSheet}
          treatmentSheet={treatmentSheet}
          setDrawerVisible={setDrawerVisible}
          toggleDrawer={toggleDrawer}
        />
      )}

      <Drawer
        title="Medication and Treatment Sheet"
        placement="right"
        width="90%"
        onClose={toggleDrawer}
        open={drawerVisible}
        destroyOnClose
      >

        <TreatmentSheetTable
          loadingTreatmentSheet={loadingTreatmentSheet}
          treatmentSheet={treatmentSheet}
          userRole={userRole}
          patientDetails={patientDetails}
        />
      </Drawer>
    </div>
  );
};

export default TreatmentsSheet;
