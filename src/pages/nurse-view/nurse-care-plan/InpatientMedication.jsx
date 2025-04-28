import { Button, message, Typography } from "antd";
import InpatientPrescriptionForm from "../../doctorsViews/Doctor-Forms/InPatientPrescriptionForm";
import {
  FileTextOutlined,
  PlusOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getInPatientQyPrescriptionLineSlice } from "../../../actions/Doc-actions/QyPrescriptionLinesSlice";
import InPatientPrescriptionTable from "../../doctorsViews/tables/InPatientPrescriptionTable";
import { InpatientSendToPharmacy } from "../../../actions/Doc-actions/postPrescription";
import useAuth from "../../../hooks/useAuth";
import { useLocation } from "react-router-dom";

const InpatientMedication = () => {
  const dispatch = useDispatch();
  const [showForm, setShowForm] = useState(false);
  const queryParams = new URLSearchParams(location.search);
  const admissionNo = queryParams.get("AdmNo");
  const getLocation = useLocation();
  const patientDetails = getLocation.state?.patientDetails;
  const { loading: loadingPrescriptions, data: prescriptions } = useSelector(
    (state) => state.getInPatientPrescriptionLine
  );

  const role = useAuth().userData.departmentName;

  const { loading: pharmacyPosting } = useSelector(
    (state) => state.inpatientSentToPharmacy
  );
  const handleSendToPharmacy = async () => {
    const result = await dispatch(InpatientSendToPharmacy(admissionNo));
    if (result.status === "success") {
      message.success(
        result.msg || "Prescription sent to pharmacy successfully"
      );
      dispatch(getInPatientQyPrescriptionLineSlice(admissionNo));
    } else if (result.status === "failed") {
      message.error(result.msg || "Failed to send prescription to pharmacy");
    }
  };

  useEffect(() => {
    dispatch(getInPatientQyPrescriptionLineSlice(admissionNo));
  }, [dispatch, admissionNo]);
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
          <Typography.Title level={5} style={{ color: "#0F5689" }}>
            <FileTextOutlined style={{ marginRight: "8px" }} />
            Patient Prescription
          </Typography.Title>
        </div>
        {role === "Doctor" && patientDetails?.Status !== "Completed" && (
          <div style={{ display: "flex", gap: "10px" }}>
            {!showForm && (
              <Button
                type="primary"
                icon={<SendOutlined />}
                loading={pharmacyPosting}
                onClick={handleSendToPharmacy}
                // disabled={!selectedRow}
              >
                Send to Pharmacy
              </Button>
            )}

            <Button
              type="primary"
              onClick={() => setShowForm(!showForm)}
              icon={showForm ? <FileTextOutlined /> : <PlusOutlined />}
            >
              {!showForm ? " New Prescription" : "View Prescriptions"}
            </Button>
          </div>
        )}
      </div>

      {!showForm ? (
        <InPatientPrescriptionTable
          filteredPrescriptions={prescriptions}
          loadingPrescriptions={loadingPrescriptions}
        />
      ) : (
        <InpatientPrescriptionForm setShowForm={setShowForm} />
      )}
    </div>
  );
};

export default InpatientMedication;
