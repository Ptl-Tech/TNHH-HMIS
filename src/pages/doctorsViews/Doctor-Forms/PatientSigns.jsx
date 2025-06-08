import { useLocation } from "react-router-dom";

import { Card, Tabs, Space } from "antd";

import {
  CategoriesReport,
  CategoriesReportPreview,
} from "./Consultation-Room-File/CategoriesReport";
import { NoData } from "../../../components/NoData";
import { Categories } from "./Consultation-Room/Categories";

const PatientSigns = ({ tree, searchValue, selectedTreeReport }) => {
  const location = useLocation();

  const { patientDetails } = location.state || {};
  const treatmentNo = new URLSearchParams(location.search).get("TreatmentNo");

  const items = tree?.map(
    ({ Section_Name: label, Section_ID: key, categories }) => {
      const matchingResultsSection = selectedTreeReport.find(
        (section) => section.Section_ID === key
      );

      return {
        key,
        label,
        children: (
          <PatientSignsTabsChild
            label={label}
            categories={categories}
            treatmentNo={treatmentNo}
            data={matchingResultsSection}
            multiple={Boolean(searchValue)}
            completed={patientDetails?.Status === "Completed"}
          />
        ),
      };
    }
  );

  return (
    <>
      {items?.length ? (
        <Tabs
          size="small"
          items={items}
          tabPosition={"left"}
          className="wrap-white-space"
          tabBarStyle={{
            maxWidth: "270px",
            textAlign: "left",
          }}
        />
      ) : (
        <NoData content="No data matched your search" />
      )}
    </>
  );
};

const PatientSignsTabsChild = ({
  data,
  label,
  multiple,
  completed,
  categories,
  treatmentNo,
}) => {
  return (
    <Space
      style={{
        width: "100%",
        display: "grid",
        alignItems: "stretch",
        gridTemplateColumns: completed ? "1fr" : "repeat(2, 1fr)",
      }}
    >
      {!completed && (
        <Categories
          multiple={multiple}
          categories={categories}
          treatmentNo={treatmentNo}
        />
      )}
      <Card
        size="small"
        type="inner"
        className="wrap-white-space"
        style={{
          width: "100%",
          height: "100%",
          minHeight: "500px",
        }}
        title={
          <h6 className="pt-2" style={{ color: "#0f5689" }}>
            {label} Preview Report
          </h6>
        }
      >
        <div>
          {!!data ? (
            <CategoriesReport
              categories={data.categories}
              child={CategoriesReportPreview}
            />
          ) : (
            <NoData style={{ padding: "24px" }} content={`No ${label}`} />
          )}
        </div>
      </Card>
    </Space>
  );
};

export default PatientSigns;
