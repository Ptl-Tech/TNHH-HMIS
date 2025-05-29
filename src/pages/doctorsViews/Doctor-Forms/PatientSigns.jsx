import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Card, Tabs, Space, message } from 'antd';

import {
  buildFormStructure,
  buildSelectedItemsTree,
} from '../../../utils/doctorNotesTree';

import {
  CategoriesReport,
  CategoriesReportPreview,
} from './Consultation-Room-File/CategoriesReport';
import { NoData } from '../../../components/NoData';
import { Categories } from './Consultation-Room/Categories';

import { SAVE_DOCTOR_NOTES_RESET } from '../../../actions/Doc-actions/saveDoctorNotes';
import { getDoctorsNotesData } from '../../../actions/Doc-actions/getDoctorsNotesData';

const PatientSigns = ({ treatmentNo, filter }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { patientDetails } = location.state || {};

  const { data: getDoctorNotesData } = useSelector(
    (state) => state.getDoctorsNotesData,
  );
  const { data: saveDoctorNotesData, error: saveDoctorNotesError } =
    useSelector((state) => state.saveDoctorNotes);
  const { sections, sectionCategories, formItems } = getDoctorNotesData || {};

  const filterSections = (filter) => {
    var returnValue = [];
    switch (filter) {
      case 'PH':
        returnValue = sections.filter(
          ({ Form_Type }) => Form_Type === 'Patient History',
        );
        break;
      case 'MSE':
        returnValue = sections.filter(({ Form_Type }) => Form_Type === 'MSE');
        break;
      case 'PE':
        returnValue = sections.filter(
          ({ Form_Type }) => Form_Type === 'Physical Exam',
        );
        break;
      default:
        returnValue = sections;
        break;
    }

    return returnValue;
  };

  const tree = Object.keys(getDoctorNotesData).length
    ? buildFormStructure(filterSections(filter), sectionCategories, formItems)
    : null;

  const selectedTreeReport = tree
    ? buildSelectedItemsTree(
        filterSections(filter),
        sectionCategories,
        formItems,
      )
    : null;

  // loading the doctor notes data to add
  useEffect(() => {
    dispatch(getDoctorsNotesData({ treatmentNo }));
  }, [treatmentNo, dispatch, saveDoctorNotesData]);

  // tracking when the adding of data has failed
  useEffect(() => {
    if (saveDoctorNotesError) {
      message.error(saveDoctorNotesError);
      dispatch({ type: SAVE_DOCTOR_NOTES_RESET });
    }
  }, [saveDoctorNotesError]);

  const items = tree?.map(
    ({ Section_Name: label, Section_ID: key, categories }) => {
      const matchingResultsSection = selectedTreeReport.find(
        (section) => section.Section_ID === key,
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
            completed={patientDetails?.Status === 'Completed'}
          />
        ),
      };
    },
  );

  return (
    <Tabs
      size="small"
      items={items}
      tabPosition={'left'}
      className="wrap-white-space"
      tabBarStyle={{
        maxWidth: '270px',
        textAlign: 'left',
      }}
    />
  );
};

const PatientSignsTabsChild = ({
  data,
  label,
  completed,
  categories,
  treatmentNo,
}) => {
  return (
    <Space
      style={{
        width: '100%',
        display: 'grid',
        alignItems: 'stretch',
        gridTemplateColumns: completed ? '1fr' : 'repeat(2, 1fr)',
      }}
    >
      {!completed && (
        <Categories
          categories={categories}
          treatmentNo={treatmentNo}
        />
      )}
      <Card
        size="small"
        type="inner"
        className="wrap-white-space"
        style={{
          width: '100%',
          height: '100%',
          minHeight: '500px',
        }}
        title={
          <h6
            className="pt-2"
            style={{ color: '#0f5689' }}
          >
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
            <NoData
              style={{ padding: '24px' }}
              content={`No ${label}`}
            />
          )}
        </div>
      </Card>
    </Space>
  );
};

export default PatientSigns;
