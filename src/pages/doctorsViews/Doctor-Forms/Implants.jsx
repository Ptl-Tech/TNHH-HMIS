import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Button, Typography } from "antd";
import { FileTextOutlined, PlusOutlined } from "@ant-design/icons";

import { useAbility } from "../../../hooks/casl";
import { listDoctors } from "../../../actions/DropdownListActions";
import ImplantTable from "../../nurse-view/tables/nurse-tables/ImplantTable";
import ImplantFormData from "../../nurse-view/nurse-forms/ImplantRequestFormData";
import { getPatientImplantRequest } from "../../../actions/Doc-actions/postDoctorProcedures";

const ImagingRequests = () => {
  const ability = useAbility();
  const location = useLocation();
  const dispatch = useDispatch();

  const patientDetails = location.state?.patientDetails;
  const queryParams = new URLSearchParams(location.search);
  const canCreateImplantsRequest = ability.can("create", "implantsRequest");

  const admissionNo = queryParams.get("AdmNo");
  const patientNo = queryParams.get("PatientNo");
  const treatmentNo = queryParams.get("TreatmentNo");

  const [showForm, setShowForm] = useState(false);

  const { loading: loadingGetImplant, data } = useSelector(
    (state) => state.getPatientImplant
  );

  const { loading: loadingPostImplant } = useSelector(
    (state) => state.postImplant
  );
  2;

  const { loading: loadingDoctors, data: doctors } = useSelector(
    (state) => state.getDoctorsList
  );

  useEffect(() => {
    if (!doctors?.length) {
      dispatch(listDoctors());
    }
  }, [dispatch, doctors?.length]);

  useEffect(() => {
    dispatch(getPatientImplantRequest(treatmentNo ?? admissionNo));
  }, [dispatch, treatmentNo, admissionNo]);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
          alignItems: "center",
        }}
      >
        <div>
          <Typography.Title level={5} style={{ color: "#b96000" }}>
            <FileTextOutlined style={{ marginRight: "8px" }} />
            Implant Request
          </Typography.Title>
        </div>
        {canCreateImplantsRequest && patientDetails?.Status !== "Completed" && (
          <div style={{ display: "flex", gap: "10px" }}>
            <Button
              type="primary"
              onClick={() => setShowForm(!showForm)}
              icon={showForm ? <FileTextOutlined /> : <PlusOutlined />}
            >
              {!showForm ? " New Implant Request" : "View Implant Requests"}
            </Button>
          </div>
        )}
      </div>

      {!showForm ? (
        <ImplantTable
          loadingKetamine={loadingGetImplant}
          data={data}
          doctors={doctors}
          treatmentNo={treatmentNo}
          patientNo={patientNo}
        />
      ) : (
        <ImplantFormData
          patientNo={patientNo}
          treatmentNo={treatmentNo}
          admissionNo={admissionNo}
          doctors={doctors}
          loadingDoctors={loadingDoctors}
          loadingImplant={loadingPostImplant}
        />
      )}
    </div>
  );
};

export default ImagingRequests;
