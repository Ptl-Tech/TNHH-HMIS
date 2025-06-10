import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Space, Collapse } from "antd";

import {
  buildFormStructure,
  buildSelectedItemsTree,
} from "../../../utils/doctorNotesTree";

import {
  CategoriesReport,
  CategoriesReportShowReport,
} from "./Consultation-Room-File/CategoriesReport";
import { NoData } from "../../../components/NoData";

import { getDoctorsNotesData } from "../../../actions/Doc-actions/getDoctorsNotesData";

const PatientSignsReport = ({ treatmentNo }) => {
  const dispatch = useDispatch();

  const { data: getDoctorNotesData } = useSelector(
    (state) => state.getDoctorsNotesData
  );

  const { sections, sectionCategories, formItems } = getDoctorNotesData || {};

  const tree = Object.keys(getDoctorNotesData).length
    ? buildFormStructure(sections, sectionCategories, formItems)
    : null;

  const selectedTreeReport = tree
    ? buildSelectedItemsTree(sections, sectionCategories, formItems)
    : null;

  // loading the doctor notes data to add
  useEffect(() => {
    dispatch(getDoctorsNotesData({ treatmentNo }));
  }, [treatmentNo, dispatch]);

  const items = tree?.map(({ Section_Name: label, Section_ID: key }) => {
    const matchingResultsSection = selectedTreeReport.find(
      (section) => section.Section_ID === key
    );

    const style = {
      border: "none",
      marginBottom: 24,
      borderRadius: `.5rem`,
      borderRadiusBottomLeft: `0`,
      borderRadiusBottomRight: `0`,
      background: `rgba(0, 0, 0, 0.02)`,
    };

    const styles = {
      header: { borderBottom: "1px dashed #dbdbdb" },
      body: { padding: 0 },
    };

    return {
      key,
      label,
      style,
      styles,
      children: (
        <PatientSignsCollapseChild
          label={label}
          data={matchingResultsSection}
        />
      ),
      matchingResultsSection,
    };
  });

  return (
    <Collapse
      ghost
      size="small"
      expandIcon={false}
      defaultActiveKey={items.map(({ key }) => key)}
      items={items.filter(
        ({ matchingResultsSection }) => matchingResultsSection
      )}
    />
  );
};

const PatientSignsCollapseChild = ({ data, label }) => {
  return (
    <Space
      style={{
        width: "100%",
        display: "grid",
        alignItems: "stretch",
        gridTemplateColumns: "1fr",
      }}
    >
      <div>
        {!!data ? (
          <CategoriesReport
            categories={data.categories}
            child={CategoriesReportShowReport}
          />
        ) : (
          <NoData style={{ padding: "24px" }} content={`No ${label}`} />
        )}
      </div>
    </Space>
  );
};

export default PatientSignsReport;
