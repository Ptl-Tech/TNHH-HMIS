import { useState } from "react";

import { Collapse, Space } from "antd";

import { RadioInputs } from "./RadioInputs";
import { CheckboxInputs } from "./CheckboxInputs";

export const Categories = ({ categories, treatmentNo, multiple }) => {
  const [activeKey, setActiveKey] = useState(
    multiple ? categories.map(({ Category_ID }) => Category_ID) : null
  );

  function renderFormItems(formItems, inputType, categoryId, sectionId) {
    // Ensure the Doctor Notes works as well
    // const { Input_Type } = formItems[0] || {};

    switch (inputType) {
      case "radio":
        return (
          <RadioInputs
            categoryId={categoryId}
            formItems={formItems}
            sectionId={sectionId}
            treatmentNo={treatmentNo}
          />
        );
      case "checkbox":
        return (
          <CheckboxInputs
            categoryId={categoryId}
            formItems={formItems}
            sectionId={sectionId}
            treatmentNo={treatmentNo}
          />
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
              Input_Type,
              Section_ID,
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
                {formItems &&
                  renderFormItems(formItems, Input_Type, key, Section_ID)}
              </Space>
            ),
          })
        )}
      />
    </div>
  );
};
