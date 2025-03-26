import React, { useEffect, useState } from "react";
import { Select, Skeleton, Alert } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getEmployeesList } from "../../actions/DropdownListActions";

const EmployeeSelect = ({ value, onChange }) => {
  const dispatch = useDispatch();
  const { loading, data, error } = useSelector((state) => state.getEmployees);
  const [skeletonItems] = useState(new Array(5).fill(null)); // Placeholder items for skeleton

  useEffect(() => {
    dispatch(getEmployeesList());
  }, [dispatch]);
  const handleChange = (selectedNo) => {
    const selectedEmployee = data.find((emp) => emp.No === selectedNo);
    const department = selectedEmployee?.Shortcut_Dimension_2_Code || "";
    onChange(selectedNo, department);
  };
  
  return (
    <>
      {loading ? (
        <Select placeholder="Loading employees..." disabled>
          {skeletonItems.map((_, index) => (
            <Select.Option key={index} value={`loading-${index}`}>
              <Skeleton.Input active size="small" style={{ width: "100%" }} />
            </Select.Option>
          ))}
        </Select>
      ) : error ? (
        <Alert message="Failed to load employees" type="error" />
      ) : (
        <Select placeholder="Select Person To Visit" value={value} onChange={handleChange}>
          {data.map((employee) => (
            <Select.Option key={employee?.No} value={employee?.No}>
              {`${employee.FirstName || ""} ${employee.MiddleName || ""} ${employee.LastName || ""}`.trim()}
            </Select.Option>
          ))}
        </Select>
        
      )}
    </>
  );
};

export default EmployeeSelect;
