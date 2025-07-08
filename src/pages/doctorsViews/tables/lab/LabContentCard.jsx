import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Space, Tabs } from "antd";

import LabResultsEntry from "./LabResultsEntry";
import SampleCollection from "./SampleCollection";
import TestLinesCreation from "./TestLinesCreation";

import { getLabDetails } from "../../../../actions/Doc-actions/getLabRequestDetails";

const LabContentCard = () => {
  // hooks
  const location = useLocation();
  const dispatch = useDispatch();

  // search params
  const labNo = new URLSearchParams(location.search).get("LaboratoryNo");

  // when we update the sample, we need to update the data
  const { data } = useSelector((state) => state.postLabSample);

  // state
  const { loading: labTestsLoading, data: labTestsData } = useSelector(
    (state) => state.labDetails
  );

  console.log({ labTestsData });

  useEffect(() => {
    dispatch(getLabDetails(labNo));
  }, [labNo, data]);

  const tabsItems = [
    {
      key: "Add Test Lines",
      label: "Add Test Lines",
      children: <TestLinesCreation data={labTestsData} />,
    },
    {
      key: "Sample Collection",
      label: "Sample Collection",
      children: (
        <SampleCollection data={labTestsData} loading={labTestsLoading} />
      ),
    },
    {
      key: "Lab Results Entry",
      label: "Lab Results Entry",
      children: (
        <LabResultsEntry data={labTestsData} loading={labTestsLoading} />
      ),
    },
  ];

  return (
    <Space className="d-block" style={{ marginTop: "20px" }}>
      <Tabs type="card" items={tabsItems} />
    </Space>
  );
};

export default LabContentCard;
