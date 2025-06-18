import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Tabs } from "antd";
import { FaDiagnoses } from "react-icons/fa";
import { FaPersonCircleCheck } from "react-icons/fa6";
import { MdSummarize, MdRecommend, MdOutlineFindInPage } from "react-icons/md";

import DischargeSummary from "./DischargeSummary";
import DischargeDiagnosis from "./DischargeDiagnosis";

import { getDischargeSummary } from "../../../actions/nurse-actions/postInitiateDischargeSlice";

function DischargeSummaryTab({ currentInpatient }) {
  const location = useLocation();
  const dispatch = useDispatch();

  const admissionNo = new URLSearchParams(location.search).get("AdmNo");

  /* 
  This component renders the different discharge summary options 
   - It receives the currentInpatient which it needs to render the <DischargeDiagnosis /> component
   - It fetches the single discharge of the current inpatient so that it can be rendered in the <DischargeSummary /> component
   - It also reused the <DischargeSummary /> component since it handles different requests
  */

  const {
    data: dischargeData,
    error: dischargeError,
    loading: loadingDischarge,
  } = useSelector((state) => state.getQyDischargeSummary);

  console.log({ dischargeData, dischargeError });

  useEffect(() => {
    dispatch(getDischargeSummary(admissionNo));
  }, [admissionNo]);

  const items = [
    {
      icon: <FaDiagnoses />,
      disabled: loadingDischarge,
      key: "dischargeDiagnosis",
      label: "Discharge Diagnosis",
      children: <DischargeDiagnosis currentInpatient={currentInpatient} />,
    },
    {
      icon: <MdSummarize />,
      disabled: loadingDischarge,
      key: "clinicalSummary",
      label: "Clinical Summary",
      children: (
        <DischargeSummary
          type={0} //  the type is very important since it's used in the post request
          label="Clinical Summary"
          dischargeData={(dischargeData || []).find(
            ({ Type }) => Type === "Clinical Summary"
          )}
          errorMessage="There was an error posting the clinical summary"
          loadingMessage="Posting the clinical summary"
          successMessage="The clinical summary was posted successfully"
        />
      ),
    },
    {
      icon: <MdOutlineFindInPage />,
      disabled: loadingDischarge,
      key: "investigations",
      label: "Investigations",
      children: (
        <DischargeSummary
          type={1} //  the type is very important since it's used in the post request
          label="Investigations"
          dischargeData={(dischargeData || []).find(
            ({ Type }) => Type === "Investigation"
          )}
          errorMessage="There was an error posting the investigations"
          loadingMessage="Posting the investigations"
          successMessage="The investigations were posted successfully"
        />
      ),
    },
    {
      icon: <FaPersonCircleCheck />,
      disabled: loadingDischarge,
      key: "management",
      label: "Management Summary",
      children: (
        <DischargeSummary
          type={2} //  the type is very important since it's used in the post request
          label="Management Summary"
          dischargeData={(dischargeData || []).find(
            ({ Type }) => Type === "Management"
          )}
          errorMessage="There was an error posting the management summary"
          loadingMessage="Posting the management summary"
          successMessage="The management summary was posted successfully"
        />
      ),
    },
    {
      icon: <MdRecommend />,
      disabled: loadingDischarge,
      key: "recommendations",
      label: "Recommendations",
      children: (
        <DischargeSummary
          type={4} //  the type is very important since it's used in the post request
          label="Recommendations"
          dischargeData={(dischargeData || []).find(
            ({ Type }) => Type === "Recommendation"
          )}
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
