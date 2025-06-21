import { useState } from "react";

import { IoSearchOutline } from "react-icons/io5";
import { Input, Space, Table, Typography } from "antd";

export const SearchDrugTable = ({ items, loading, columns }) => {
  const { Title } = Typography;
  const [filter, setFilter] = useState({ specificName: "", genericName: "" });

  return (
    <div className="d-grid gap-3">
      <Title
        level={5}
        className="d-flex align-items-center gap-2 m-0 text-main-primary"
      >
        <IoSearchOutline />
        Search Drugs
      </Title>
      <Space
        style={{
          width: "100%",
          gap: "16px",
        }}
      >
        <Input
          addonBefore="Specific Name"
          style={{ width: "100%" }}
          value={filter.specificName}
          onChange={(e) =>
            setFilter({ ...filter, specificName: e.currentTarget.value })
          }
          placeholder="Search Specific Name"
        />
        <Input
          addonBefore="Generic Name"
          style={{ width: "100%" }}
          value={filter.genericName}
          onChange={(e) =>
            setFilter({ ...filter, genericName: e.currentTarget.value })
          }
          placeholder="Search Generic Name"
        />
      </Space>
      <Table
        bordered
        size="small"
        columns={columns}
        loading={loading}
        dataSource={
          filter.specificName || filter.genericName
            ? items
                .filter(
                  (drug) =>
                    drug.Description.toLowerCase().includes(
                      filter.specificName.toLowerCase()
                    ) &&
                    drug.Description.toLowerCase().includes(
                      filter.genericName.toLowerCase()
                    )
                )
                .map(({ No, ...item }) => ({ ...item, No, key: No }))
            : []
        }
      />
    </div>
  );
};
