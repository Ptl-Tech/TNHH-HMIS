import { useState } from "react";

import { Collapse, Space } from "antd";

import { RadioInputs } from "./RadioInputs";
import { CheckboxInputs } from "./CheckboxInputs";

export const Categories = ({ categories, treatmentNo, multiple }) => {
  const [activeKey, setActiveKey] = useState(
    multiple ? categories.map(({ Category_ID }) => Category_ID) : null
  );

  function renderFormItems(formItems) {
    const { Input_Type } = formItems[0] || {};

    switch (Input_Type) {
      case "radio":
        return <RadioInputs formItems={formItems} treatmentNo={treatmentNo} />;
      case "checkbox":
        return (
          <CheckboxInputs formItems={formItems} treatmentNo={treatmentNo} />
        );
      default:
        break;
    }
  }

  return (
    <div
      style={{
        border: "1px solid #f0f0f0",
        borderRadius: "8px",
        overflow: "clip",
      }}
    >
      <Collapse
        size="small"
        bordered={false}
        accordion={false}
        activeKey={activeKey}
        onChange={(key) =>
          setActiveKey((previousKey) => (previousKey === key ? null : key))
        }
        items={categories.map(
          (
            {
              formItems,
              subCategories,
              Category_ID: key,
              Category_Name: label,
            },
            index
          ) => ({
            key,
            label,
            style: {
              border: "none",
            },
            styles: {
              body: {
                background: "white",
              },
              header: {
                borderBottom:
                  index === categories.length - 1 && categories.length !== 1
                    ? "none"
                    : "1px solid #f0f0f0",
              },
            },
            children: (
              <Space direction="vertical">
                {subCategories?.length > 0 && (
                  <Categories
                    multiple={multiple}
                    treatmentNo={treatmentNo}
                    categories={subCategories}
                  />
                )}
                {formItems && renderFormItems(formItems)}
              </Space>
            ),
          })
        )}
      />
    </div>
  );
};
