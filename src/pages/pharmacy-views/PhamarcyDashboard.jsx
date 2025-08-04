import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { ArrowUpOutlined } from "@ant-design/icons";
import { Col, Row, Select, Space, Spin, Typography, DatePicker } from "antd";

import { getPharmacyRequestsAll } from "../../actions/pharmacy-actions/getPharmacyRequestsAll";
import dayjs from "dayjs";

const PharmacyDashboard = () => {
  const { Title } = Typography;
  const { RangePicker } = DatePicker;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [dateRange, setDateRange] = useState({
    from: dayjs(new Date()).format("YYYY-MM-DD"),
    to: dayjs(new Date()).format("YYYY-MM-DD"),
  });
  const [variant, setVariant] = useState("");
  const { data: pharmacyRequests, loading: pharmacyRequestsLoading } =
    useSelector((state) => state.getPharmacyRequestsAll);

  useEffect(() => {
    dispatch(
      getPharmacyRequestsAll({
        dateRange,
        status: "",
        type: variant.split(" ").join(""),
      })
    );
  }, [dispatch, variant, dateRange]);

  const variants = [
    { label: "All", value: "" },
    { label: "Walk In", value: "Walk In" },
    { label: "In Patient", value: "In Patient" },
    { label: "Out Patient", value: "Out Patient" },
  ];

  const statuses = [
    { status: "New", backgroundColor: "#ad4e0023", color: "#ad4e00" },
    { status: "Forwarded", backgroundColor: "#0060a323", color: "#0060a3" },
    { status: "Completed", backgroundColor: "#23780423", color: "#237804" },
    { status: "Cancelled", backgroundColor: "#ad4e0023", color: "#ad4e00" },
  ];

  const viewableData = statuses.map(({ status, ...statusItem }) => ({
    ...statusItem,
    status,
    name: `${status} Pharmacy Requests`,
    number: pharmacyRequests.filter((request) =>
      filterByStatus(request, status)
    ).length,
  }));

  const handleVariantChange = (value) => {
    console.log({ value, variant });
    setVariant(value);
  };

  return (
    <div style={{ display: "grid", gap: "16px", padding: "10px 10px" }}>
      <Space
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Title level={4} style={{ marginBottom: "0" }}>
          Pharmacy Dashboard
        </Title>
        <Space.Compact>
          <RangePicker
            size="middle"
            onChange={(value) =>
              setDateRange({
                to: dayjs(value[1]).format("YYYY-MM-DD"),
                from: dayjs(value[0]).format("YYYY-MM-DD"),
              })
            }
            defaultValue={[dayjs(new Date()), dayjs(new Date())]}
          />
          <Select
            showSearch
            defaultValue={""}
            options={variants}
            style={{ width: "150px" }}
            onChange={handleVariantChange}
          />
        </Space.Compact>
      </Space>
      <Row gutter={[16, 16]}>
        {viewableData.map(
          ({ name, status, number, backgroundColor, color }) => (
            <Col
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 8 }}
              lg={{ span: 6 }}
              key={name}
              className="gutter-row"
            >
              <div
                className="card border"
                style={{
                  borderRadius: "10px",
                  cursor: "pointer",
                }}
                onClick={() =>
                  variant
                    ? navigate(
                        `/Dashboard/Pharmacy-${variant
                          .split(" ")
                          .join("")}?status=${status}`,
                        {
                          state: {
                            dateRange,
                          },
                        }
                      )
                    : {}
                }
              >
                <div className="card-body gap-3" style={{ display: "grid" }}>
                  <div
                    style={{
                      fontWeight: 500,
                      display: "flex",
                      fontSize: "15px",
                      color: "#6f6f6f",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    {name}
                    {variant && (
                      <ArrowUpOutlined style={{ transform: "rotate(45deg)" }} />
                    )}
                  </div>
                  <span
                    level={8}
                    style={{ fontSize: "40px", color: "#3e3e3e" }}
                  >
                    {pharmacyRequestsLoading ? <Spin /> : number}
                  </span>
                  <div
                    style={{
                      textTransform: "capitalize",
                      fontWeight: 500,
                      color: "#6f6f6f",
                    }}
                  >
                    <small
                      className="p-1"
                      style={{
                        backgroundColor,
                        color,
                        borderRadius: "3px",
                      }}
                    >
                      {status}
                    </small>{" "}
                    <small>of {variant ? variant : "All"}</small>
                  </div>
                </div>
              </div>
            </Col>
          )
        )}
      </Row>
    </div>
  );
};

export const filterByStatus = (labRequest, status) =>
  status ? labRequest.Status === status : true;

export default PharmacyDashboard;
