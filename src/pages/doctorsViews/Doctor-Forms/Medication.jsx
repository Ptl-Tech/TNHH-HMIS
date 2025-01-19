
import { Typography } from "antd";
import PrescriptionForm from "./PrescriptionForm";

const Medication = () => {
  return (
    <div>
      <div>
        <Typography.Title
          level={5}
          style={{
            color: "#0F5689",
            fontSize: "16px",
            marginBottom: "12px",
          }}
        >
         Prescription Details
        </Typography.Title>
        
        <PrescriptionForm />
      </div>

    </div>
  )
}

export default Medication