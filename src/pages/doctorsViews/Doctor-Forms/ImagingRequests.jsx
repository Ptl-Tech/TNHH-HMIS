import {
  Button,
    Typography,
  } from "antd";
  import { useEffect, useState } from "react";
import KetamineTable from "../../nurse-view/tables/nurse-tables/KetamineTable";
import { useLocation } from "react-router-dom";
import { FileTextOutlined, PlusOutlined } from "@ant-design/icons"
import ImplantFormData from "../../nurse-view/nurse-forms/ImplantRequestFormData";
import { useDispatch, useSelector } from "react-redux";
import { listDoctors } from "../../../actions/DropdownListActions";
import { getPatientKetamineRequest } from "../../../actions/Doc-actions/postDoctorProcedures";
  
  
  const ImagingRequests = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const treatmentNo = queryParams.get("TreatmentNo");
    const [showForm, setShowForm] = useState(false);
    const dispatch = useDispatch();

    const { loading: loadingKetamine, data } = useSelector(
      (state) => state.getKetamine
    );

    const { loading: loadingDoctors, data: doctors } = useSelector(state => state.getDoctorsList);

    useEffect(() => {
        if (!doctors?.length) {
        dispatch(listDoctors());
        }
    }, [dispatch, doctors?.length]);

    useEffect(() => {
        dispatch(getPatientKetamineRequest())
      }, [dispatch])

    return (
      <div>
        
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px",alignItems: "center" }}>
        <div>
        <Typography.Title
            level={5}
            style={{ color: "#b96000" }}
        >
            <FileTextOutlined style={{ marginRight: "8px" }} />
            Implant Request
        </Typography.Title>
        </div>
        <div style={{ display: "flex", gap: "10px"}}>
        
            <Button
            type="primary"
            onClick={() => setShowForm(!showForm)}
            icon={showForm ? <FileTextOutlined /> : <PlusOutlined />}
            >
            {!showForm ? " New Implant Request" : "View Implant Requests"}
            </Button>
                
        </div>
        </div>
  
        {!showForm ? (
          <KetamineTable loadingKetamine={loadingKetamine} data={data} treatmentNo={treatmentNo}/>
        ) : (
          <ImplantFormData patientNo={treatmentNo} treatmentNo={treatmentNo} doctors={doctors} loadingDoctors={loadingDoctors}/>
        )}
      </div>
    );
  };
  
  export default ImagingRequests;
  