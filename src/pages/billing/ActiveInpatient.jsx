import { Button } from 'antd';
import React, { useState } from 'react';
import InpatientCash from "./InpatientCash";
import InpatientCorporate from "./InpatientCorporate";

const ActiveOutPatients = () => {
  const [activeComponent, setActiveComponent] = useState("cash");

  return (
      <div className="row justify-content-center">
          {/* Styled Button Tabs */}
          <div className="d-flex gap-2 my-3">
            <Button
              type={activeComponent === "cash" ? "primary" : "default"}
              onClick={() => setActiveComponent("cash")}
              style={{
                width: "100%",
                fontWeight: "bold",
                padding: "10px",
              }}

            >
              Cash Patients
            </Button>

            <Button
              type={activeComponent === "insurance" ? "primary" : "default"}
              onClick={() => setActiveComponent("insurance")}
              style={{
                width: "100%",
                fontWeight: "bold",
                padding: "10px",
              }}
            >
              Insurance Patients
            </Button>
          </div>

          {/* Conditional Rendering for Active Section */}
          <div
            style={{
              // backgroundColor: activeComponent === "cash" ? "#e6f7ff" : "#f6ffed",
              padding: "20px",
              borderRadius: "8px",
            }}
          >
            {activeComponent === "cash" ? <InpatientCash /> : <InpatientCorporate />}
          </div>
    </div>
  );
};

export default ActiveOutPatients;
