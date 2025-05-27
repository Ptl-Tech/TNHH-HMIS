import { Button, Typography } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { FileTextOutlined, PlusOutlined } from "@ant-design/icons";
import ECTFormData from "../nurse-forms/ETCFormData";
import ETCTable from "../tables/nurse-tables/ETCTable";
import { getPatientECTRequest } from "../../../actions/Doc-actions/postDoctorProcedures";
import { listDoctors } from "../../../actions/DropdownListActions";
import useAuth from "../../../hooks/useAuth";

const ECTScan = () => {
  const location = useLocation();
  const patientDetails = location.state?.patientDetails;
  const queryParams = new URLSearchParams(location.search);
  const treatmentNo = queryParams.get("TreatmentNo");
  const patientNo = queryParams.get("PatientNo");
  const admissionNo = queryParams.get("AdmNo");
  const role = useAuth().userData.departmentName;

  const dispatch = useDispatch();
  const [showForm, setShowForm] = useState(false); // Toggle between table and for

  const { loading: loadingETC, data: etcData } = useSelector(
    (state) => state.getPatientETC
  );
  const { loading: loadingPostEtc } = useSelector(
    (state) => state.postPatientETC
  );
  const { loading: loadingDoctors, data: doctors } = useSelector(
    (state) => state.getDoctorsList
  );

  console.log("Etc form data", etcData);

  useEffect(() => {
    dispatch(getPatientECTRequest(treatmentNo ?? admissionNo));
  }, [dispatch, treatmentNo, admissionNo]);

  useEffect(() => {
    if (!doctors?.length) {
      dispatch(listDoctors());
    }
  }, [dispatch, doctors?.length]);
  return (
    <div style={{ paddingTop: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
          alignItems: "center",
        }}
      >
        <div>
          <Typography.Title level={5} style={{ color: "#0F5689" }}>
            <FileTextOutlined style={{ marginRight: "8px" }} />
            ECT Request
          </Typography.Title>
        </div>
        {role === "Doctor"|| role ==="Nurse" && patientDetails?.Status !== "Completed" && (
          <div style={{ display: "flex", gap: "10px" }}>
            <Button
              type="primary"
              onClick={() => setShowForm(!showForm)}
              icon={showForm ? <FileTextOutlined /> : <PlusOutlined />}
            >
              {!showForm ? " New ECT Request" : "View ECT Requests"}
            </Button>
          </div>
        )}
      </div>

      {!showForm ? (
        <ETCTable
          patientNo={patientNo}
          loadingETC={loadingETC}
          data={etcData}
          doctors={doctors}
          admissionNo={admissionNo}
          treatmentNo={treatmentNo}
        />
      ) : (
        <ECTFormData
          patientNo={patientNo}
          treatmentNo={treatmentNo}
          loadingDoctors={loadingDoctors}
          doctors={doctors}
          admissionNo={admissionNo}
          loadingPostEtc={loadingPostEtc}
        />
      )}
    </div>
  );
};

export default ECTScan;
