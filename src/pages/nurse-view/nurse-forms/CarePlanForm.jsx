import { Button } from "antd";
import NurseInnerHeader from "../../../partials/nurse-partials/NurseInnerHeader";
import { BorderlessTableOutlined, PlusOutlined } from "@ant-design/icons";
import useAuth from "../../../hooks/useAuth";
import { useState } from "react";
import CarePlanFormData from "./CarePlanFormData";
import CarePlanFormTable from "../tables/nurse-tables/CarePlanFormTable";

const CarePlanForm = () => {
  const role = useAuth().userData.departmentName;
  const [isFormVisible, setIsFormVisible] = useState(false);

  const handleButtonVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };

  return (
    <>
      <NurseInnerHeader
        icon={<BorderlessTableOutlined />}
        title="Nursing Care Plan"
      />

      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        {!isFormVisible && role === "Nurse" && (
          <>
            <Button type="primary" onClick={handleButtonVisibility}>
              <PlusOutlined /> Nursing Care Plan
            </Button>
          </>
        )}
      </div>

      {isFormVisible && (
        <CarePlanFormData setIsFormVisible={setIsFormVisible} />
      )}

      {!isFormVisible && <CarePlanFormTable />}
    </>
  );
};

export default CarePlanForm;
