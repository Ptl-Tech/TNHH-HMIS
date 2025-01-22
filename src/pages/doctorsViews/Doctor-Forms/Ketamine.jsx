
  import { Button, Typography } from "antd";
import { useLocation } from "react-router-dom";
import { FileTextOutlined, PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import KetamineTable from "../../nurse-view/tables/nurse-tables/KetamineTable";
import KetamineFormData from "../../nurse-view/nurse-forms/KetamineFormData";
import { useDispatch, useSelector } from "react-redux";
import { getPatientKetamineRequest } from "../../../actions/Doc-actions/postDoctorProcedures";
import { listDoctors } from "../../../actions/DropdownListActions";
import useAuth from "../../../hooks/useAuth";

  const Ketamine = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const treatmentNo = queryParams.get("TreatmentNo");
    const patientNo = queryParams.get("PatientNo");
    const admissionNo = queryParams.get("AdmNo");
    const role = useAuth().userData.departmentName
    const [showForm, setShowForm] = useState(false);
    const dispatch = useDispatch();

    const { loading: loadingKetamine, data } = useSelector(
        (state) => state.getKetamine
      );
      const { loading: postKetamine } = useSelector(
        (state) => state.postKetamine
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
      <>
        
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px",alignItems: "center" }}>
        <div>
        <Typography.Title
            level={5}
            style={{ color: "#0F5689" }}
        >
            <FileTextOutlined style={{ marginRight: "8px" }} />
            Ketamine Request
        </Typography.Title>
        </div>
        {
          role === 'Doctor' && (
            <div style={{ display: "flex", gap: "10px"}}>
        
            <Button
            type="primary"
            onClick={() => setShowForm(!showForm)}
            icon={showForm ? <FileTextOutlined /> : <PlusOutlined />}
            >
            {!showForm ? " New Ketamine Request" : "View Ketamine Requests"}
            </Button>
                
            </div>
          )
        }
        </div>
  
        {!showForm ? (
          <KetamineTable 
          loadingKetamine={loadingKetamine} 
          data={data} 
          treatmentNo={treatmentNo}
          admissionNo={admissionNo}
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
  