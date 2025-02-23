import {
  Button,
    Typography,
  } from "antd";
  import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FileTextOutlined, PlusOutlined } from "@ant-design/icons"
import ImplantFormData from "../../nurse-view/nurse-forms/ImplantRequestFormData";
import { useDispatch, useSelector } from "react-redux";
import { listDoctors } from "../../../actions/DropdownListActions";
import { getPatientImplantRequest } from "../../../actions/Doc-actions/postDoctorProcedures";
import ImplantTable from "../../nurse-view/tables/nurse-tables/ImplantTable";
import useAuth from "../../../hooks/useAuth";
  
  
  const ImagingRequests = () => {
    const location = useLocation();
    const patientDetails = location.state?.patientDetails;
    const queryParams = new URLSearchParams(location.search);
    const treatmentNo = queryParams.get("TreatmentNo");
    const patientNo = queryParams.get("PatientNo");
    const admissionNo = queryParams.get("AdmNo");
    const role = useAuth().userData.departmentName
    const [showForm, setShowForm] = useState(false);
    const dispatch = useDispatch();

    const { loading: loadingGetImplant, data } = useSelector(
      (state) => state.getPatientImplant
    );

    const { loading: loadingPostImplant } = useSelector(
      (state) => state.postImplant
    );

    const { loading: loadingDoctors, data: doctors } = useSelector(state => state.getDoctorsList);

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
        
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px",alignItems: "center" }}>
        <div>
        <Typography.Title
            level={5}
            style={{ color: "#0F5689" }}
        >
            <FileTextOutlined style={{ marginRight: "8px" }} />
            Implant Request
        </Typography.Title>
        </div>
        {
          role === "Doctor" &&
          patientDetails?.Status !== "Completed" && (
            <div style={{ display: "flex", gap: "10px"}}>
        
            <Button
            type="primary"
            onClick={() => setShowForm(!showForm)}
            icon={showForm ? <FileTextOutlined /> : <PlusOutlined />}
            >
            {!showForm ? " New Implant Request" : "View Implant Requests"}
            </Button>
                
        </div>
          )
        }
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
  