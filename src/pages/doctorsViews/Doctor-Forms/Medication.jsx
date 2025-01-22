
import { Button, Typography } from "antd";
import PrescriptionForm from "./PrescriptionForm";
import { FileTextOutlined, PlusOutlined, SendOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getQyPrescriptionLineSlice } from "../../../actions/Doc-actions/QyPrescriptionLinesSlice";
import PrescriptionTable from "../tables/PrescriptionTable";
import { sendtoPharmacy } from "../../../actions/Doc-actions/postPrescription";

const Medication = () => {
  const dispatch = useDispatch();
  const [showForm, setShowForm] = useState(false);
  const queryParams = new URLSearchParams(location.search);
  const treatmentNo = queryParams.get("TreatmentNo"); 
  const { loadingPrescriptions, prescriptions} = useSelector((state) => state.getQyPrescriptionLine);
  const filteredPrescriptions = prescriptions.filter(
    (prescription) => prescription.TreatmentNo === treatmentNo
  );
  const { loading: pharmacyPosting } = useSelector(
    (state) => state.sendtoPharmacy
  );
  const handleSendToPharmacy = () => {
    dispatch(sendtoPharmacy(treatmentNo));
  };

  useEffect(() => {
      dispatch(getQyPrescriptionLineSlice());
    }, [dispatch]);
  return (
    <div>
      
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px",alignItems: "center" }}>
      <div>
      <Typography.Title
        level={5}
        style={{ color: "#0F5689" }}
      >
        <FileTextOutlined style={{ marginRight: "8px" }} />
        Patient Prescription
      </Typography.Title>
      </div>
      <div style={{ display: "flex", gap: "10px"}}>
      <Button
              type="primary"
              icon={<SendOutlined />}
              loading={pharmacyPosting}
              onClick={handleSendToPharmacy}
// disabled={!selectedRow}

            >
              Send to Pharmacy
            </Button>

        <Button
          type="primary"
          onClick={() => setShowForm(!showForm)}
          icon={showForm ? <FileTextOutlined /> : <PlusOutlined />}
        >
          
          {!showForm ? " New Prescription" : "View Prescriptions"}
        </Button>
             
      </div>
      </div>

      {
        !showForm ? (
          <PrescriptionTable filteredPrescriptions={filteredPrescriptions} loadingPrescriptions={loadingPrescriptions} />
        ): (
          <PrescriptionForm setShowForm={setShowForm}/>
        )
      }
      
      {/* {
        !showForm ? (
          <PrescriptionTable filteredPrescriptions={filteredPrescriptions} loadingPrescriptions={loadingPrescriptions} />
        ) : (
          <PrescriptionForm setShowForm={setShowForm}/>
        )
      } */}
      
    </div>
  )
}

export default Medication