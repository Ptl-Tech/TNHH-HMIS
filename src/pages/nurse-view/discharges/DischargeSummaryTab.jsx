import { Tabs } from "antd";
import { FaDiagnoses } from "react-icons/fa";
import { FileOutlined } from "@ant-design/icons";
import { FaPersonCircleCheck } from "react-icons/fa6";
import { MdSummarize, MdRecommend, MdOutlineFindInPage } from "react-icons/md";

import DischargeSummary from "./DischargeSummary";
import DischargeDiagnosis from "./DischargeDiagnosis";

function DischargeSummaryTab() {
  const items = [
    {
      icon: <FaDiagnoses />,
      key: "dischargeDiagnosis",
      label: "Discharge Diagnosis",
      children: <DischargeDiagnosis />,
    },
    {
      icon: <MdSummarize />,
      key: "clinicalSummary",
      label: "Clinical Summary",
      children: (
        <DischargeSummary
          type={0}
          label="Clinical Summary"
          errorMessage="There was an error posting the clinical summary"
          loadingMessage="Posting the clinical summary"
          successMessage="The clinical summary was posted successfully"
        />
      ),
    },
    {
      icon: <MdOutlineFindInPage />,
      key: "investigations",
      label: "Investigations",
      children: (
        <DischargeSummary
          type={1}
          label="Investigations"
          errorMessage="There was an error posting the investigations"
          loadingMessage="Posting the investigations"
          successMessage="The investigations were posted successfully"
        />
      ),
    },
    {
      icon: <FaPersonCircleCheck />,
      key: "management",
      label: "Management Summary",
      children: (
        <DischargeSummary
          type={2}
          label="Management Summary"
          errorMessage="There was an error posting the management summary"
          loadingMessage="Posting the management summary"
          successMessage="The management summary was posted successfully"
        />
      ),
    },
    {
      icon: <MdRecommend  />,
      key: "recommendations",
      label: "Recommendations",
      children: (
        <DischargeSummary
          type={4}
          label="Recommendations"
          errorMessage="There was an error posting the recommendations"
          loadingMessage="Posting the recommendations"
          successMessage="The recommendations were posted successfully"
        />
      ),
    },
  ];

  return <Tabs destroyOnHidden tabPosition="left" items={items} />;
}

export default DischargeSummaryTab;
