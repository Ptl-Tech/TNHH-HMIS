import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Button, Typography } from "antd";
import { FileTextOutlined, PlusOutlined } from "@ant-design/icons";

import { useAbility } from "../../../hooks/casl";
import { listDoctors } from "../../../actions/DropdownListActions";
import KetamineFormData from "../../nurse-view/nurse-forms/KetamineFormData";
import KetamineTable from "../../nurse-view/tables/nurse-tables/KetamineTable";
import { getPatientKetamineRequest } from "../../../actions/Doc-actions/postDoctorProcedures";

const Ketamine = () => {
  const ability = useAbility();
  const dispatch = useDispatch();
  const location = useLocation();

  const patientDetails = location.state?.patientDetails;
  const queryParams = new URLSearchParams(location.search);
  const canCreateKetamineRequest = ability.can("create", "ketamineRequest");

  const admissionNo = queryParams.get("AdmNo");
  const patientNo = queryParams.get("PatientNo");
  const treatmentNo = queryParams.get("TreatmentNo");

  const [showForm, setShowForm] = useState(false);
  const { loading: loadingKetamine, data } = useSelector(
    (state) => state.getKetamine
  );
  const { loading: loadingDoctors, data: doctors } = useSelector(
    (state) => state.getDoctorsList
  );
  const { loading: postKetamine } = useSelector((state) => state.postKetamine);

  useEffect(() => {
    if (!doctors?.length) {
      dispatch(listDoctors());
    }
  }, [dispatch, doctors?.length]);

  useEffect(() => {
    dispatch(getPatientKetamineRequest(treatmentNo ?? admissionNo));
  }, [dispatch, treatmentNo, admissionNo]);

  return (
    <>
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
            Ketamine Request
          </Typography.Title>
        </div>
        {canCreateKetamineRequest && patientDetails?.Status !== "Completed" && (
          <div style={{ display: "flex", gap: "10px" }}>
            <Button
              type="primary"
              onClick={() => setShowForm(!showForm)}
              icon={showForm ? <FileTextOutlined /> : <PlusOutlined />}
            >
              {!showForm ? " New Ketamine Request" : "View Ketamine Requests"}
            </Button>
          </div>
        )}
      </div>

      {!showForm ? (
        <KetamineTable
          loadingKetamine={loadingKetamine}
          data={data}
          doctors={doctors}
          treatmentNo={treatmentNo}
          patientNo={patientNo}
        />
      ) : (
        <KetamineFormData
          patientNo={patientNo}
          treatmentNo={treatmentNo}
          doctors={doctors}
          loadingDoctors={loadingDoctors}
          postKetamine={postKetamine}
          admissionNo={admissionNo}
        />
      )}
    </>
  );
};

export default Ketamine;
