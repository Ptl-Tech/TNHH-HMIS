import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { QyBranchesList } from "../../actions/Common-Actions/getBranchesListAction";
import { Divider, List, Spin, Typography, Skeleton } from "antd";

const InpatientBranchFilters = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, data } = useSelector((state) => state.getBranchesList);

  useEffect(() => {
    dispatch(QyBranchesList());
  }, [dispatch]);

  console.log("Branches List Data:", data);

  return (
    <>
      <Typography.Title level={4}>Inpatient Branch Filters</Typography.Title>

      {loading ? (
        <Skeleton active paragraph={{ rows: 2 }} />
      ) : (
        <>
          <Typography.Text type="secondary">
            Click on a branch to filter the inpatient list.
          </Typography.Text>

          <Divider />

          <List
            header={<div>Branch Details</div>}
            bordered
            size="Large"
            dataSource={Array.isArray(data) ? data.filter((item) => item.Code !== "MUTHITHI-94" && item.Code !== "MUTHITHI" && item.Code !== "UPPERHILL" && item.Code !== "CHIROMO") : []}
            renderItem={(item) => (
              <List.Item
                onClick={() =>
                  navigate(`/Nurse/Inpatient/Inpatient-List/${item.Code}`, {
                    state: { filterParam: item.Code },
                  })
                }
              >
                <Typography.Text style={{ marginRight: 8, cursor: "pointer", color: "#0f5689", fontWeight: "bold", textTransform: "uppercase" }}  strong>{item.Name}</Typography.Text>
                <span style={{ marginLeft: 8, color: "#999", fontSize: "0.9em", fontStyle: "italic", cursor: "pointer" }}>
                  {item.Code}
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

export default InpatientBranchFilters;
