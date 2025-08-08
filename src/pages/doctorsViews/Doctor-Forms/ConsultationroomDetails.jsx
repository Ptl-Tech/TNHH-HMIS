import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Input, Tabs } from "antd";
import {
  HeartOutlined,
  SolutionOutlined,
  MedicineBoxOutlined,
} from "@ant-design/icons";
import { CgNotes } from "react-icons/cg";

// Import components
import Diagnosis from "./Diagnosis";
import FourPsForm from "./FourPsForm";
import PatientSigns from "./PatientSigns";

import {
  buildFormStructure,
  keywordFilterHelper,
  buildSelectedItemsTree,
} from "../../../utils/doctorNotesTree";
// import useAuth from "../../../hooks/useAuth";

import { getDoctorsNotesData } from "../../../actions/Doc-actions/getDoctorsNotesData";
import { SAVE_DOCTOR_NOTES_RESET } from "../../../actions/Doc-actions/saveDoctorNotes";
import { getBriefMSENotesData } from "../../../actions/nurse-actions/getBriefMSENotesData";
import { ConsultationNotes } from "./ConsultationNotes";
import { useAbility } from "../../../hooks/casl";

const ConsultationroomDetails = ({ observationNo, patientNo }) => {
  const ability = useAbility();
  const dispatch = useDispatch();
  const searchParams = new URLSearchParams(useLocation().search);

  const treatmentNo =
    searchParams.get("TreatmentNo") || searchParams.get("AdmNo");
  const canSeeNurseOrDoctorContent = ability.can("read", "nurseDoctorNotes");

  const { data: doctorNotesData } = useSelector(
    (state) => state.getDoctorsNotesData
  );
  const { data: briefMSENotesData } = useSelector(
    (state) => state.getBriefMSENotesData
  );
  const { data: saveDoctorNotesData, error: saveDoctorNotesError } =
    useSelector((state) => state.saveDoctorNotes);

  // Loading the doctor notes data to add
  useEffect(() => {
    dispatch(getDoctorsNotesData({ treatmentNo }));
    dispatch(getBriefMSENotesData(treatmentNo));
  }, [treatmentNo, dispatch, saveDoctorNotesData]);

  // Tracking when the adding of data has failed
  useEffect(() => {
    if (saveDoctorNotesError) {
      message.error(saveDoctorNotesError);
      dispatch({ type: SAVE_DOCTOR_NOTES_RESET });
    }
  }, [saveDoctorNotesError]);

  const items = [
    {
      icon: <CgNotes />,
      label: "Consultation Notes",
      children: <ConsultationNotes filter={"PH"} data={doctorNotesData} />,
    },
    {
      icon: <SolutionOutlined />,
      label: "Patient History Notes",
      children: <SearchChildView filter={"PH"} data={doctorNotesData} />,
    },
    ...(canSeeNurseOrDoctorContent
      ? [
          {
            label: "Physical Examination",
            icon: <HeartOutlined />,
            children: <SearchChildView filter={"PE"} data={doctorNotesData} />,
          },
        ]
      : []),
    {
      label: "Mental Status Exam",
      icon: <SolutionOutlined />,
      children: <SearchChildView filter={"MSE"} data={doctorNotesData} />,
    },
    ...(canSeeNurseOrDoctorContent
      ? [
          {
            label: "Brief MSE Form",
            icon: <HeartOutlined />,
            children: (
              <SearchChildView filter={"Brief MSE"} data={briefMSENotesData} />
            ),
          },
        ]
      : []),
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
          patientNo={patientNo}
          treatmentNo={treatmentNo}
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

  // console.log({ data, filter });

  // The filter function for the category we are in
  const filterSections = () => {
    const filterObject = {
      MSE: "MSE",
      PE: "Physical Exam",
      PH: "Patient History",
      "Brief MSE": "Brief MSE",
    };

    return filteredData.sections.filter(
      ({ Form_Type }) => Form_Type === filterObject[filter]
    );
  };

  // This is the tree that holds everything in it's category eg: MSE, Patient History, Physical Exam etc.
  const tree = Object.keys(data).length
    ? buildFormStructure(
        filterSections(),
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
