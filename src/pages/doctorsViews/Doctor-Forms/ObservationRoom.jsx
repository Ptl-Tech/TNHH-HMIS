import React from "react";
import Vitals from "../Vitals";
import AddAllergies from "../AddAllergies";
import AllergyAndMedication from "../../nurse-view/forms/triage-forms/AllergyAndMedication";
import Injections from "../../nurse-view/forms/triage-forms/Injections";
import { Typography } from "antd";
import FormVitals from "../Vitals";

const { Title } = Typography;

const ObservationRoom = () => {
  return (
    <div className="d-flex flex-column gap-4">
      <div>
        <Typography.Title
          level={5}
          style={{
            color: "#0F5689",
            fontSize: "16px",
            marginBottom: "12px",
          }}
        >
          Vitals
        </Typography.Title>
        <FormVitals />
      </div>
      {/* <div>
        <Typography.Title
          level={5}
          style={{
            color: "#0F5689",
            fontSize: "16px",
            marginBottom: "12px",
          }}
        >
          Allergy and Medication
        </Typography.Title>
        <AllergyAndMedication />
      </div>
      <div>
        <Typography.Title
          level={5}
          style={{
            color: "#0F5689",
            fontSize: "16px",
            marginBottom: "12px",
          }}
        >
          Injections
        </Typography.Title>
        <Injections />
      </div> */}
    </div>
  );
};

export default ObservationRoom;
