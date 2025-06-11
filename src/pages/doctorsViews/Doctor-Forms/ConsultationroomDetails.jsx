import { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import { Input, Tabs } from "antd";
import {
  HeartOutlined,
  SolutionOutlined,
  MedicineBoxOutlined,
} from "@ant-design/icons";

// Import components
import Diagnosis from "./Diagnosis";
import FourPsForm from "./FourPsForm";
import PatientSigns from "./PatientSigns";

import {
  buildFormStructure,
  keywordFilterHelper,
  buildSelectedItemsTree,
} from "../../../utils/doctorNotesTree";
import useAuth from "../../../hooks/useAuth";

import { getDoctorsNotesData } from "../../../actions/Doc-actions/getDoctorsNotesData";
import { SAVE_DOCTOR_NOTES_RESET } from "../../../actions/Doc-actions/saveDoctorNotes";

const ConsultationroomDetails = ({ observationNo, patientNo }) => {
  const dispatch = useDispatch();
  const role = useAuth().userData.departmentName;
  const treatmentNo =
    new URLSearchParams(location.search).get("TreatmentNo") ||
    new URLSearchParams(location.search).get("AdmNo");

  const { data: getDoctorNotesData } = useSelector(
    (state) => state.getDoctorsNotesData
  );
  const { data: saveDoctorNotesData, error: saveDoctorNotesError } =
    useSelector((state) => state.saveDoctorNotes);

  // Loading the doctor notes data to add
  useEffect(() => {
    dispatch(getDoctorsNotesData({ treatmentNo }));
  }, [treatmentNo, dispatch, saveDoctorNotesData]);

  console.log({ getDoctorNotesData });

  // Tracking when the adding of data has failed
  useEffect(() => {
    if (saveDoctorNotesError) {
      message.error(saveDoctorNotesError);
      dispatch({ type: SAVE_DOCTOR_NOTES_RESET });
    }
  }, [saveDoctorNotesError]);

  const items = [
    {
      label: "Patient History Notes",
      icon: <SolutionOutlined />,
      children: <SearchChildView filter={"PH"} data={getDoctorNotesData} />,
    },
    ...(role === "Doctor" || role === "Nurse"
      ? [
          {
            label: "Physical Examination",
            icon: <HeartOutlined />,
            children: (
              <SearchChildView filter={"PE"} data={getDoctorNotesData} />
            ),
          },
        ]
      : []),
    {
      label: "Mental Status Exam",
      icon: <SolutionOutlined />,
      children: <SearchChildView filter={"MSE"} data={getDoctorNotesData} />,
    },
    {
      label: "Diagnosis Formulation",
      icon: <MedicineBoxOutlined />,
      children: <Diagnosis />,
    },
    {
      label: "Aetiology",
      icon: <HeartOutlined />,
      children: (
        <FourPsForm
          treatmentNo={treatmentNo}
          patientNo={patientNo}
          observationNo={observationNo}
        />
      ),
    },
  ];

  return (
    <Tabs
      type="card"
      items={items.map(({ label, children, icon }) => ({
        label,
        icon,
        key: label,
        children,
      }))}
    />
  );
};

const SearchChildView = ({ data, filter }) => {
  const { Search } = Input;
  const { sections, sectionCategories, formItems } = data || {};

  const [searchValue, setSearchValue] = useState("");

  const filteredData = searchValue
    ? keywordFilterHelper(sections, sectionCategories, formItems, searchValue)
    : { sections, sectionCategories, formItems };

  // The filter function for the category we are in
  const filterSections = () => {
    const filterObject = {
      PH: "Patient History",
      MSE: "MSE",
      PE: "Physical Exam",
      "Brief MSE": "Breif MSE",
    };

    return filteredData.sections.filter(
      ({ Form_Type }) => Form_Type === filterObject[filter]
    );
  };

  // This is the tree that holds everything in it's category eg: MSE, Patient History, Physical Exam etc.
  const tree = Object.keys(data).length
    ? buildFormStructure(
        filterSections(filter),
        filteredData.sectionCategories,
        filteredData.formItems
      )
    : null;

  // This is the tree that holds the selected items in the currrent category.
  const selectedTreeReport = tree
    ? buildSelectedItemsTree(
        filterSections(filter),
        sectionCategories,
        formItems
      )
    : null;

  return (
    <div className="d-grid gap-3">
      <Search
        placeholder="Search"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
      <PatientSigns
        tree={tree}
        searchValue={searchValue}
        selectedTreeReport={selectedTreeReport}
      />
    </div>
  );
};

export default ConsultationroomDetails;
