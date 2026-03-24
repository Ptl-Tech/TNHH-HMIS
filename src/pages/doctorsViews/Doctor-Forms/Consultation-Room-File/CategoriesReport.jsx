import { NoData } from "../../../../components/NoData";
import { RadioInputsReport } from "../Consultation-Room/RadioInputsReport";
import { CheckboxInputsReport } from "../Consultation-Room/CheckboxInputReport";

export const CategoriesReport = ({ categories, child: Child }) => {
  function renderFormItemsReport(formItems, Category_Input_Type) {
    switch (Category_Input_Type) {
      case "radio":
        return <RadioInputsReport formItems={formItems} />;
      case "checkbox":
        return <CheckboxInputsReport formItems={formItems} />;
      default:
        return null;
    }
  }

  if (!categories?.length) {
    return <NoData />;
  }

  return categories.map((category, index) => (
    <Child
      key={index}
      index={index}
      category={category}
      last={categories?.length - 1 === index}
      renderFormItemsReport={renderFormItemsReport}
    />
  ));
};

export const CategoriesReportPreview = ({
  index,
  category,
  renderFormItemsReport,
}) => {
  const {
    formItems,
    Input_Type,
    subCategories,
    Category_Name,
    Parent_Category_ID,
  } = category;

  return (
    <div
      key={index}
      style={{
        padding: `${Parent_Category_ID ? "0px" : "16px"} 0px 0px 16px`,
        borderTop: `${
          Parent_Category_ID || index === 0 ? "" : "1px dashed #dadada"
        }`,
      }}
    >
      <h6 style={{ color: "#b96000" }}>{Category_Name}</h6>
      {!!formItems?.length && renderFormItemsReport(formItems, Input_Type)}
      {subCategories?.length > 0 && (
        <CategoriesReport
          categories={subCategories}
          child={CategoriesReportPreview}
        />
      )}
    </div>
  );
};

export const CategoriesReportShowReport = ({
  last,
  index,
  category,
  renderFormItemsReport,
}) => {
  const {
    formItems,
    Input_Type,
    subCategories,
    Category_Name,
    Parent_Category_ID,
  } = category;

  return (
    <div
      key={index}
      style={{
        display: "grid",
        alignItems: "stretch",
        gridTemplateColumns: "1fr 2fr",
        borderBottom: last ? "none" : "1px dashed #dbdbdb",
        padding: `0px ${!Parent_Category_ID ? "0px" : "8px"} 0px 8px`,
      }}
    >
      <h6 style={{ color: "#b96000", padding: "8px" }}>{Category_Name}</h6>
      <div
        style={{
          display: "grid",
          borderLeft: "1px dashed #dbdbdb",
        }}
      >
        {subCategories?.length > 0 && (
          <CategoriesReport
            categories={subCategories}
            child={CategoriesReportShowReport}
          />
        )}
        {!!formItems?.length && (
          <div style={{ paddingTop: "8px" }}>
            {renderFormItemsReport(formItems, Input_Type)}
          </div>
        )}
      </div>
    </div>
  );
};
