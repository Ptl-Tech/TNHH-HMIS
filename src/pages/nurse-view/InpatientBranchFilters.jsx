import React, { useEffect, useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Divider, List, Skeleton, Typography, Select } from "antd";
import { useGetWardManagementHook } from "../../hooks/useGetWardManagementHook";
import { useAuth } from "../../hooks/auth";

const { Option } = Select;

const InpatientWardFilters = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const branchCode = user.branchCode;

  const { getBeds, loadingWards, getWards } = useGetWardManagementHook();
  const [branchFilter, setBranchFilter] = useState(branchCode);

  // Extract branch codes for dropdown
  const branchOptions = useMemo(() => {
    if (!Array.isArray(getWards)) return [];
    const uniqueBranches = [...new Set(getWards.map(w => w.Branch_Code))];
    return uniqueBranches.map(code => ({
      value: code,
      label: code
    }));
  }, [getWards]);

  // Filter wards based on selected branch
  const filteredWards = useMemo(() => {
    if (!Array.isArray(getWards)) return [];
    return getWards.filter(w => w.Branch_Code === branchFilter);
  }, [getWards, branchFilter]);
  return (
    <>
      <Typography.Title level={4}>Inpatient Ward Filters</Typography.Title>

      {loadingWards ? (
        <Skeleton active paragraph={{ rows: 2 }} />
      ) : (
        <>
        
          <Divider />
  <Typography.Text type="secondary" style={{ paddingBottom: 26, fontWeight: "bold" }}>
            Select a branch to filter wards, then click a ward to view inpatients.
          </Typography.Text>

          <Select
            allowClear
            placeholder="Filter by Branch Code"
            style={{ width: "100%", marginBottom: 16, marginTop: 8}}
            onChange={value => setBranchFilter(value || branchCode)}
            value={branchFilter}
          >
            {branchOptions.map(branch => (
              <Option key={branch.value} value={branch.value}>
                {branch.label}
              </Option>
            ))}
          </Select>

          <List
            header={<div>Ward List</div>}
            bordered
            size="large"
            dataSource={filteredWards}
            renderItem={(item) => (
              <List.Item
                onClick={() =>
                  navigate(`/Dashboard/Inpatient/Inpatient-List/${item.Ward_Code}`, {
                    state: { filterParam: item.Ward_Code },
                  })
                }
                style={{ cursor: "pointer" }}
              >
                <Typography.Text
                  style={{
                    marginRight: 8,
                    color: "#b96000",
                    fontWeight: "bold",
                    textTransform: "uppercase"
                  }}
                >
                  {item.Ward_Name}
                </Typography.Text>
                <span
                  style={{
                    marginLeft: 8,
                    color: "#999",
                    fontSize: "0.9em",
                    fontStyle: "italic"
                  }}
                >
                  {item.Branch_Code}
                </span>
              </List.Item>
            )}
          />
        </>
      )}

      <Divider />
    </>
  );
};

export default InpatientWardFilters;
