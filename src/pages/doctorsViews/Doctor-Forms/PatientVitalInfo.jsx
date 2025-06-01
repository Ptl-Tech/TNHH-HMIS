import { forwardRef, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import {
  Form,
  Input,
  Space,
  Table,
  Button,
  Drawer,
  Select,
  message,
  Collapse,
  Skeleton,
  Divider,
} from 'antd';
import { IoClose } from 'react-icons/io5';
import { LiaAllergiesSolid } from 'react-icons/lia';
import { BsHeartPulse, BsClipboard2Pulse } from 'react-icons/bs';

import useAuth from '../../../hooks/useAuth';
import { NoData } from '../../../components/NoData';
import {
  vitalsInfo,
  allergenTypes,
  encounterDetails,
  vitalsTableColumns,
  encounterDetailsTable,
  triageDetailsObjectArray,
  treatmentHeaderObjectArray,
  triageVitalsObjectArray,
  vitalKeys,
  allergiesObjectArray,
  diagnosisObjectArray,
  prescriptionObjectArray,
  proceduresObjectArray,
  referralsObjectArray,
  jvFormObjectArray,
  dietaryIntakeObjectArray,
  nursingCarePlanObjectArray,
  suicideFormListObjectArray,
  visitorListObjectArray,
} from './doctor-utils';

import {
  POST_TRIAGE_LIST_VITALS_RESET,
  postTriageListVitalsSlice,
} from '../../../actions/triage-actions/postTriageListVitalsSlice';
import {
  POST_ALLERGIES_MEDICATION_RESET,
  postAllergiesMedicationSlice,
} from '../../../actions/triage-actions/postAllergiesMedicationSlice';
import { getEncounterList } from '../../../actions/encounters/encounter-list';
import { getTriageList } from '../../../actions/triage-actions/getTriageListSlice';
import { getEncounterDetails } from '../../../actions/encounters/encounter-details';
import { getSinglePatientAllVitalsLines } from '../../../actions/triage-actions/getVitalsLinesSlice';
import { getAllergiesAndMedicationsSlice } from '../../../actions/triage-actions/getAllergiesAndMedicationsSlice';
import { MdAttachFile } from 'react-icons/md';
import dayjs from 'dayjs';
import PatientSignsReport from './PatientSignsReport';

const PatientVitalInfo = () => {
  const items = [
    {
      key: '0',
      label: 'Latest Vitals',
      children: <Vitals />,
    },
    {
      key: '1',
      label: 'Allergies & Medications',
      children: <AllergiesAndMedications />,
    },
    {
      key: '2',
      label: 'Triage Notes',
      children: <TraigeNotes />,
    },
    {
      key: '3',
      label: 'Latest Encounter',
      children: <LatestEncounter />,
    }
  ];

  return (
    <Collapse
      accordion
      size="small"
      defaultActiveKey={['0']}
      items={items.map((item) => ({
        ...item,
        styles: {
          body: {
            padding: 0,
          },
        },
      }))}
    />
  );
};

const Vitals = () => {
  const { state } = useLocation() || {};
  const patientNo = new URLSearchParams(location.search).get("PatientNo");
  const dispatch = useDispatch();
  console.log(patientNo);

  const [openAddVitals, setOpenAddVitals] = useState(false);
  const [openPreviousVitals, setOpenPreviousVitals] = useState(false);

  const {
    vitals: postedVitals,
    error: errorPostingVitals,
    loading: loadingPostingVitals,
  } = useSelector((state) => state.postTriageListVitals);
  const { loading: loadingVitals, data: vitals } = useSelector(
    (state) => state.getPatientVitals,
  );

  useEffect(() => {
    dispatch(getSinglePatientAllVitalsLines(patientNo));

    if (loadingPostingVitals) message.info('Posting the patient vitals');

    if (postedVitals?.status === 'success')
      message.success('Vitals posted successfully');

    if (errorPostingVitals)
      message.error('An error occured when posting the vitals');

    if (postedVitals?.status === 'success' || errorPostingVitals)
      dispatch({ type: POST_TRIAGE_LIST_VITALS_RESET });
  }, [postedVitals, loadingPostingVitals, errorPostingVitals]);

  return (
    <div>
      <Skeleton
        loading={loadingVitals || loadingPostingVitals}
        paragraph={{ rows: 2 }}
        style={{ padding: '16px 16px 0 16px' }}
      >
        {vitals?.length ? (
          <ul
            style={{
              margin: 0,
              padding: 0,
              display: 'grid',
              listStyle: 'none',
              justifyItems: 'stretch',
              gridTemplateColumns: 'repeat(2, 1fr)',
            }}
          >
            {vitalsInfo(vitals[vitals.length - 1]).map(
              ({ label, value }, index) => (
                <li
                  key={{ label }}
                  style={{
                    borderBottom: '1px dashed #d5d5d5',
                    borderRight:
                      index % 2 === 0 ? '1px dashed #d5d5d5' : 'none',
                  }}
                  className="text-center px-1 py-2 d-grid"
                >
                  <span
                    style={{
                      fontSize: '14px',
                      color: '#0f5689',
                      fontWeight: 'bolder',
                    }}
                  >
                    {label}
                  </span>
                  <span
                    style={{
                      color: '#555',
                      fontSize: '14px',
                      fontWeight: 'bolder',
                    }}
                  >
                    {value}
                  </span>
                </li>
              ),
            )}
          </ul>
        ) : (
          <NoData />
        )}
      </Skeleton>
      <AddVitalsDrawer
        open={openAddVitals}
        setOpen={setOpenAddVitals}
      />
      <ViewPreviousVitals
        open={openPreviousVitals}
        setOpen={setOpenPreviousVitals}
      />
      <Space
        style={{
          gap: '4px',
          padding: '4px',
          display: 'grid',
          alignItems: 'center',
          gridTemplateColumns: `repeat(${vitals?.length > 1 ? 2 : 1}, 1fr)`,
        }}
      >
        {vitals?.length > 1 && (
          <Button
            block
            onClick={() => setOpenPreviousVitals(true)}
          >
            Previous Vitals
          </Button>
        )}
        <Button
          block
          type="primary"
          onClick={() => setOpenAddVitals(true)}
        >
          Add Vitals
        </Button>
      </Space>
    </div>
  );
};

const AddVitalsDrawer = ({ open, setOpen }) => {
  const dispatch = useDispatch();
  const { state } = useLocation() || {};
  const { patientNo, observationNo } = state || {};

  const { Compact: SpaceCompact } = Space;
  const { useForm, Item: FormItem } = Form;

  const [form] = useForm();

  const onFinish = ({ diastolic, systolic, ...values }) => {
    const finalValues = {
      ...values,
      type: 0, //Type 0 means Triage
      patientNo,
      observationNo,
      myAction: 'create',
      bloodPressure: `${diastolic}/${systolic}`,
    };

    dispatch(postTriageListVitalsSlice(finalValues));
    form.resetFields();
    setOpen(false);
  };

  return (
    <Drawer
      open={open}
      size="medium"
      styles={{
        header: {
          color: '#0f5689',
        },
      }}
      title={
        <div className="d-flex gap-2 align-items-center">
          <BsHeartPulse />
          Add vitals
        </div>
      }
      closable={false}
      onClose={() => setOpen(false)}
    >
      <Form
        form={form}
        layout="vetical"
        name="control-hooks"
        onFinish={onFinish}
      >
        <FormItem
          name="pulseRate"
          label={
            <span style={{ color: '#0f5689', fontWeight: 'bolder' }}>
              Pulse rate &#40;bpm&#41;
            </span>
          }
          layout="vertical"
          rules={[{ required: true, message: 'Please add the pulse rate' }]}
        >
          <Input
            required
            type="number"
            placeholder="eg. 70"
          />
        </FormItem>
        <Space direction="vertical">
          <span style={{ color: '#0f5689', fontWeight: 'bolder' }}>
            Blood Pressure &#40;mmHg&#41;
          </span>
          <SpaceCompact>
            <FormItem
              name="systolic"
              label={
                <span style={{ color: '#333333', fontWeight: 'bolder' }}>
                  Systolic
                </span>
              }
              layout="vertical"
              rules={[
                { required: true, message: 'Please add the diastoluc value' },
              ]}
            >
              <Input
                required
                type="number"
                placeholder="eg. 120"
              />
            </FormItem>
            <FormItem
              name="diastolic"
              label={
                <span style={{ color: '#333333', fontWeight: 'bolder' }}>
                  Diastolic
                </span>
              }
              layout="vertical"
              rules={[
                { required: true, message: 'Please add the systolic value' },
              ]}
            >
              <Input
                required
                type="number"
                placeholder="eg. 80"
              />
            </FormItem>
          </SpaceCompact>
        </Space>
        <FormItem
          name="temperature"
          label={
            <span style={{ color: '#0f5689', fontWeight: 'bolder' }}>
              Temperature &#40;°C&#41;
            </span>
          }
          layout="vertical"
          rules={[{ required: true, message: 'Please add the temperature' }]}
        >
          <Input
            required
            type="number"
            placeholder="eg. 37"
          />
        </FormItem>
        <FormItem
          name="sP02"
          label={
            <span style={{ color: '#0f5689', fontWeight: 'bolder' }}>
              SPO₂ &#40;%&#41;
            </span>
          }
          layout="vertical"
          rules={[{ required: true, message: 'Please add the sP0₂' }]}
        >
          <Input
            required
            type="number"
            placeholder="eg. 98"
          />
        </FormItem>
        <FormItem
          name="respirationRate"
          label={
            <span style={{ color: '#0f5689', fontWeight: 'bolder' }}>
              Respiration Rate &#40;BPM&#41;
            </span>
          }
          layout="vertical"
          rules={[
            { required: true, message: 'Please add the respiratory rate' },
          ]}
        >
          <Input
            required
            type="number"
            placeholder="eg. 16"
          />
        </FormItem>
        <Button
          block
          type="primary"
          htmlType="submit"
        >
          Submit Vitals
        </Button>
      </Form>
    </Drawer>
  );
};

const ViewPreviousVitals = ({ open, setOpen }) => {
  const dispatch = useDispatch();
  const { state } = useLocation() || {};

  const { patientNo } = state || {};

  const { loading: loadingVitals, data: vitals } = useSelector(
    (state) => state.getPatientVitals,
  );

  useEffect(() => {
    dispatch(getSinglePatientAllVitalsLines(patientNo));
  }, []);

  return (
    <Drawer
      open={open}
      size="large"
      placement="bottom"
      extra={
        <Button
          type="primary"
          onClick={() => setOpen(false)}
          children={
            <Space>
              <span>Close Vitals</span>
            </Space>
          }
        />
      }
      styles={{
        header: {
          color: '#0f5689',
        },
      }}
      title={
        <div className="d-flex gap-2 align-items-center">
          <BsClipboard2Pulse />
          Previous vitals
        </div>
      }
      closable={false}
      onClose={() => setOpen(false)}
    >
      <Table
        dataSource={vitals}
        loading={loadingVitals}
        columns={vitalsTableColumns}
      />
    </Drawer>
  );
};

const AllergiesAndMedications = () => {
  const dispatch = useDispatch();
  const { state } = useLocation() || {};
  const { observationNo } = state || {};

  const [open, setOpen] = useState(false);

  const { allergiesMedication, loadingGetAllergiesAndMedications } =
    useSelector((state) => state.getAllergiesAndMedications);
  const {
    postAllergyMedicationLoading,
    postAllergiesMedication,
    error: postAllergiesMedicationError,
  } = useSelector((state) => state.postAllergiesMedication);

  useEffect(() => {
    dispatch(getAllergiesAndMedicationsSlice(observationNo));

    if (postAllergiesMedication.status === 'success')
      message.success('Allergy posted successfully');

    if (postAllergiesMedicationError)
      message.error('Something went wrong while posting the allergy');

    if (
      postAllergiesMedication?.status === 'success' ||
      postAllergiesMedicationError
    )
      dispatch({ type: POST_ALLERGIES_MEDICATION_RESET });
  }, [postAllergiesMedication, postAllergiesMedicationError]);

  const AllergenGroup = ({ allergies, type }) => {
    return (
      <div className="d-grid gap-2">
        <h6 style={{ margin: 0, color: 'rgb(15, 86, 137)', fontSize: '15px' }}>
          {type}
        </h6>
        <ul style={{ margin: 0, padding: '0 0 0 24px' }}>
          {allergies
            .filter(({ Type }) => Type === type)
            .map(({ Allergen, Complaints }, idx) => (
              <li
                key={idx}
                style={{ color: '#555' }}
              >
                <span>{Allergen} - </span>
                <span>{Complaints}</span>
              </li>
            ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="d-grid p-3 gap-2">
      <Skeleton
        paragraph={{ rows: 1 }}
        loading={
          loadingGetAllergiesAndMedications || postAllergyMedicationLoading
        }
      >
        {allergiesMedication?.length ? (
          <div className="d-grid gap-2">
            <AllergenGroup
              allergies={allergiesMedication}
              type={'Food'}
            />
            <AllergenGroup
              allergies={allergiesMedication}
              type={'Drug'}
            />
          </div>
        ) : (
          <NoData />
        )}
      </Skeleton>
      <AddAllergiesAndMedicines
        open={open}
        setOpen={setOpen}
      />
      <Button
        block
        type="primary"
        onClick={() => setOpen(true)}
      >
        Add Allergies
      </Button>
    </div>
  );
};

const AddAllergiesAndMedicines = ({ open, setOpen }) => {
  const dispatch = useDispatch();
  const { state } = useLocation() || {};
  const { observationNo } = state || {};
  const staffNo = useAuth().userData.no;

  const { TextArea } = Input;
  const { useForm, Item: FormItem } = Form;

  const [form] = useForm();

  const { postAllergyMedicationLoading } = useSelector(
    (state) => state.postAllergiesMedication,
  );

  const onFinish = ({ ...values }) => {
    const finalValues = {
      ...values,
      staffNo,
      observationNo,
      myAction: 'create',
      assessedBy: staffNo,
      foodAllergy: '',
      drugAllergy: '',
    };

    dispatch(postAllergiesMedicationSlice(finalValues));
    form.resetFields();
  };

  return (
    <Drawer
      open={open}
      closable={false}
      onClose={() => setOpen(false)}
      styles={{
        header: {
          color: '#0f5689',
        },
      }}
      title={
        <Space className="align-items-center">
          <LiaAllergiesSolid />
          <span>Add allergies and medications</span>
        </Space>
      }
    >
      <Form
        form={form}
        layout="vetical"
        name="control-hooks"
        onFinish={onFinish}
      >
        <FormItem
          name="type"
          label={
            <span style={{ color: '#0f5689', fontWeight: 'bolder' }}>
              Allergy Type
            </span>
          }
          layout="vertical"
          rules={[{ required: true, message: 'Please add the Allery Type' }]}
        >
          <Select
            placeholder="Choose allergy type"
            options={allergenTypes}
          />
        </FormItem>

        <FormItem
          name="allergen"
          label={
            <span style={{ color: '#0f5689', fontWeight: 'bolder' }}>
              Allergen Name
            </span>
          }
          layout="vertical"
          rules={[{ required: true, message: 'Please add the item name' }]}
        >
          <Input
            required
            type="name"
            placeholder="Nuts, Ibuprofen"
          />
        </FormItem>
        <FormItem
          name="complaints"
          label={
            <span style={{ color: '#0f5689', fontWeight: 'bolder' }}>
              Complaints
            </span>
          }
          layout="vertical"
          rules={[{ required: true, message: 'Please add the complaints' }]}
        >
          <TextArea
            required
            placeholder="eg. Patient gets rashes"
          />
        </FormItem>
        <Button
          block
          type="primary"
          loading={postAllergyMedicationLoading}
          disabled={postAllergyMedicationLoading}
          htmlType="submit"
        >
          Submit Vitals
        </Button>
      </Form>
    </Drawer>
  );
};

const TraigeNotes = ({}) => {
  const dispatch = useDispatch();
  const { state } = useLocation() || {};
  const { observationNo } = state || {};

  const { loadingTriageList, triageList } = useSelector(
    (state) => state.getTriageList,
  );

  useEffect(() => {
    dispatch(getTriageList(observationNo));
  }, []);

  return (
    <div>
      <Skeleton
        paragraph={{ rows: 1 }}
        loading={loadingTriageList}
        style={{ padding: loadingTriageList ? '16px 16px 0 16px' : '' }}
      >
        {triageList.length ? (
          <ul style={{ marginBottom: 0, padding: '8px', paddingLeft: '32px' }}>
            {triageList.map(
              ({
                ObservationTime,
                ObservationRemarks,
                ObservationRemarks2,
              }) => (
                <li
                  key={ObservationTime}
                  style={{
                    color:
                      ObservationRemarks || ObservationRemarks2
                        ? '#333'
                        : 'gray',
                  }}
                >
                  {ObservationRemarks || ObservationRemarks2 || 'No Remarks'}
                </li>
              ),
            )}
          </ul>
        ) : (
          <NoData />
        )}
      </Skeleton>
    </div>
  );
};

const LatestEncounter = () => {
  const dispatch = useDispatch();
  const { state } = useLocation() || {};
 const patientNo = new URLSearchParams(location.search).get("PatientNo");
  const [open, setOpen] = useState(false);
  const [openPastEncountersDrawer, setOpenPastEncountersDrawer] =
    useState(false);
  const [encounter, setEncounter] = useState(null);

  const { loading, data, error } = useSelector(
    (state) => state.getEncounterList,
  );

  useEffect(() => {
    dispatch(getEncounterList(patientNo));
  }, []);

  return (
    <div>
      <EncounterDrawer
        open={open}
        setOpen={setOpen}
        encounter={encounter}
        setEncounter={setEncounter}
      />
      {data?.length > 1 && (
        <PastEncountersDrawer
          encounters={data}
          open={openPastEncountersDrawer}
          setOpen={setOpenPastEncountersDrawer}
        />
      )}
      <Skeleton
        style={{}}
        className="p-3"
        loading={loading}
        paragraph={{ rows: 1 }}
      >
        {data?.length ? (
          <ul
            style={{
              margin: 0,
              padding: 0,
              display: 'grid',
              listStyle: 'none',
              gridTemplateColumns: 'repeat(2, 1fr)',
            }}
          >
            {/* Isn't it beautiful 😅 */}
            {encounterDetails.map(
              ({ key, title, dataIndex, render = (value) => value }, index) => (
                <li
                  key={key}
                  style={{
                    borderBottom: '1px dashed #d9d9d9',
                    borderLeft: index % 2 === 0 ? '' : '1px dashed #d9d9d9',
                  }}
                  className="text-center px-1 py-2 d-grid"
                >
                  <span
                    style={{
                      color: '#0f5689',
                      fontSize: '14px',
                      fontWeight: 'bolder',
                    }}
                  >
                    {title}
                  </span>
                  <span
                    style={{
                      color: '#555',
                      fontSize: '14px',
                      fontWeight: 'bolder',
                    }}
                  >
                    {render(data[0][dataIndex], data[0])}
                  </span>
                </li>
              ),
            )}
            <li
              style={{
                gap: '4px',
                padding: '4px',
                display: 'grid',
                gridColumn: '1 / 3',
                alignItems: 'center',
                gridTemplateColumns: `repeat(${data?.length > 1 ? 2 : 1}, 1fr)`,
              }}
            >
              {data?.length > 1 && (
                <Button
                  block
                  onClick={() => setOpenPastEncountersDrawer(true)}
                >
                  Past Encounters
                </Button>
              )}
              <Button
                block
                type="primary"
                onClick={() =>
                  setOpen(() => {
                    setEncounter(data[0]);
                    return true;
                  })
                }
              >
                View Encounter
              </Button>
            </li>
          </ul>
        ) : (
          <NoData />
        )}
      </Skeleton>
    </div>
  );
};

const PastEncountersDrawer = ({ open, setOpen, encounters }) => {
  const [openCurrentEncounter, setOpenCurrentEncounter] = useState(false);
  const [encounter, setEncounter] = useState(null);

  return (
    <Drawer
      open={open}
      size="large"
      closable={false}
      onClose={() => setOpen(false)}
      title={
        <Space style={{ color: '#0f5689' }}>
          <MdAttachFile size={21} />
          <h6 style={{ margin: '0' }}>Past Encounters</h6>
        </Space>
      }
    >
      <EncounterDrawer
        encounter={encounter}
        setEncounter={setEncounter}
        open={openCurrentEncounter}
        setOpen={setOpenCurrentEncounter}
      />
      <Table
        size="small"
        dataSource={encounters}
        columns={encounterDetailsTable(setOpenCurrentEncounter, setEncounter)}
      />
    </Drawer>
  );
};

const EncounterDrawer = ({ open, setOpen, encounter, setEncounter }) => {
  const dispatch = useDispatch();
  const { state } = useLocation() || {};
  const { patientDetails } = state || {};

  const { SearchName, TreatmentNo } = patientDetails || {};

  const {
    patientNo,
    encounterNo,
    encounterType,
    dischargeDate,
    appointmentDate,
  } = encounter || {};

  const { data, error, loading } = useSelector(
    (state) => state.getEncounterDetails,
  );

  const { admissionDetails, treatmentDetails } = data || {};
  const {
    triage,
    diagnosis,
    referrals,
    procedures,
    labRequests,
    nursingTool,
    prescriptions,
    treatmentHeader,
    dischargeDetails,
    // TODO: Ask Ndirangu about the discharge summary
    dischargeSummary,
    radiologyRequests,
    laboratoryRequests,
  } = treatmentDetails || admissionDetails || {};
  const { triageVitals, triageDetails, triageAllergies } = triage || {};
  const {
    jvForm,
    visitorList,
    dietaryIntake,
    nursingCareplan,
    suicideFormList,
    triage: nursingTriage,
    mentalStatusChecklist,
    consultationNotes,
  } = nursingTool || {};
  const {
    triageVitals: nursingTriageVitals,
    triageAllergies: nursingTriageAllergies,
    treatmentDetails: nursingTreatmentDetails,
  } = nursingTriage || {};

  console.log({ consultationNotes });

  const tableTriageVitals = vitalKeys.map(({ label, key }) => {
    const row = {
      key: label,
      vital: label,
    };
    triageVitals?.toReversed().forEach((entry, index) => {
      row[`col_${index}`] = entry[key] ?? '';
    });
    return row;
  });

  const objectsToRenderFile = [
    {
      data: triageDetails,
      title: 'Triage Details',
      display: !!triageDetails,
      renderer: FileSectionFrameWork,
      objectSpecifier: triageDetailsObjectArray,
    },
    {
      pagination: false,
      title: 'Triage Vitals',
      renderer: FileSectionTable,
      scroll: { x: 'max-content' },
      dataSource: tableTriageVitals,
      display: triageVitals?.length,
      columns: triageVitalsObjectArray(triageVitals?.toReversed()),
    },
    {
      pagination: false,
      renderer: FileSectionTable,
      dataSource: triageAllergies,
      columns: allergiesObjectArray,
      display: triageAllergies?.length,
      title: 'Allergies (Food & Drugs)',
    },
    {
      data: treatmentHeader,
      title: 'Treatment Details',
      renderer: FileSectionFrameWork,
      display: treatmentHeader,
      objectSpecifier: treatmentHeaderObjectArray,
    },
    // Restructure and get the data in a better way so that we can actually check if we can render the data: Ndirangu
    {
      renderer: FileConsultationNotes,
      title: 'Doctor Consultation Notes',
      data:
        treatmentHeader?.treatmentNo || (dischargeDetails && [0]?.admission_No),
      display:
        treatmentHeader?.treatmentNo ||
        (dischargeDetails && dischargeDetails[0]?.admission_No),
    },
    {
      pagination: false,
      title: 'Diagnosis',
      dataSource: diagnosis,
      renderer: FileSectionTable,
      display: diagnosis?.length,
      columns: diagnosisObjectArray,
    },
    {
      data: nursingTreatmentDetails,
      title: 'Nursing Triage Details',
      display: !!nursingTreatmentDetails,
      renderer: FileSectionFrameWork,
      objectSpecifier: triageDetailsObjectArray,
    },
    {
      pagination: false,
      renderer: FileSectionTable,
      scroll: { x: 'max-content' },
      dataSource: tableTriageVitals,
      title: 'Nursing Triage Vitals',
      display: nursingTriageVitals?.length,
      columns: triageVitalsObjectArray(nursingTriageVitals?.toReversed()),
    },
    // TODO: check that we can pass the mental status checklist from the nurses, ask Mercy
    {
      renderer: FileConsultationNotes,
      title: 'Mental Status checklist',
      data:
        treatmentHeader?.treatmentNo || (dischargeDetails && [0]?.admission_No),
      display:
        treatmentHeader?.treatmentNo ||
        (dischargeDetails && dischargeDetails[0]?.admission_No),
    },
    {
      pagination: false,
      title: 'JV Form',
      dataSource: jvForm,
      display: jvForm?.length,
      columns: jvFormObjectArray,
      renderer: FileSectionTable,
    },
    {
      pagination: false,
      title: 'Dietrary Intake',
      dataSource: dietaryIntake,
      renderer: FileSectionTable,
      display: dietaryIntake?.length,
      columns: dietaryIntakeObjectArray,
    },
    {
      pagination: false,
      dataSource: nursingCareplan,
      title: 'Nursing Care Plans',
      renderer: FileSectionTable,
      display: nursingCareplan?.length,
      columns: nursingCarePlanObjectArray,
    },
    {
      pagination: false,
      title: 'Suicide Form List',
      renderer: FileSectionTable,
      dataSource: suicideFormList,
      display: suicideFormList?.length,
      columns: suicideFormListObjectArray,
    },
    {
      pagination: false,
      title: 'Visitor List',
      renderer: FileSectionTable,
      dataSource: visitorList,
      display: visitorList?.length,
      columns: visitorListObjectArray,
    },
    {
      pagination: false,
      renderer: FileSectionTable,
      columns: allergiesObjectArray,
      dataSource: nursingTriageAllergies,
      display: nursingTriageAllergies?.length,
      title: 'Nursing Allergies (Food & Drugs)',
    },
    {
      pagination: false,
      title: 'Prescriptions',
      dataSource: prescriptions,
      renderer: FileSectionTable,
      display: prescriptions?.length,
      columns: prescriptionObjectArray,
    },
    // TODO: Add lab and radiology here, Ndirangu
    {
      pagination: false,
      title: 'Procedures',
      dataSource: procedures,
      renderer: FileSectionTable,
      display: procedures?.length,
      columns: proceduresObjectArray,
    },
    {
      pagination: false,
      title: 'Referrals',
      dataSource: referrals,
      display: referrals?.length,
      renderer: FileSectionTable,
      columns: referralsObjectArray,
    },
  ];

  const objectsToRenderRefs = useRef([]);

  useEffect(() => {
    if (encounter) {
      dispatch(
        getEncounterDetails({
          patientNo,
          encounterNo,
          patientCategory: encounterType,
        }),
      );
    }
  }, [encounter]);

  return (
    <Drawer
      open={open}
      size="large"
      width={'90%'}
      style={{ overflowX: 'hidden' }}
      styles={{
        header: {
          padding: '8px 24px',
        },
      }}
      title={
        <Skeleton
          paragraph={false}
          loading={loading}
          className="no-margin"
        >
          <Space
            style={{
              display: 'flex',
              alignItems: 'end',
              justifyContent: 'space-between',
            }}
          >
            <h4
              style={{
                color: '#555',
                fontWeight: '300',
                textTransform: 'capitalize',
              }}
            >
              {SearchName?.toLowerCase()} Encounter
            </h4>
            <h6 style={{ color: 'gray' }}>
              {appointmentDate === dischargeDate
                ? dayjs(appointmentDate).format('DD MMM YYYY')
                : `${dayjs(appointmentDate).format('DD MMM YYYY')} -
                    ${dayjs(dischargeDate).format('DD MMM YYYY')}`}
            </h6>
          </Space>
        </Skeleton>
      }
      closable={false}
      onClose={() => {
        setOpen(() => {
          setEncounter(null);
          return false;
        });
      }}
    >
      <div
        className="d-grid gap-4"
        style={{ gridTemplateColumns: '1fr 5fr' }}
      >
        <Skeleton
          title={false}
          loading={loading}
          paragraph={{ rows: objectsToRenderFile.length }}
        >
          <ul
            style={{
              gap: '4px',
              top: '0px',
              display: 'grid',
              listStyle: 'none',
              position: 'sticky',
              background: 'white',
              height: 'fit-content',
            }}
          >
            {objectsToRenderFile
              .sort((a, b) => Boolean(b.display) - Boolean(a.display))
              .map(({ title, display }, index) => (
                <li
                  key={title}
                  style={{
                    fontSize: '14px',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    color: display ? '#333' : 'gray',
                  }}
                  onClick={() => {
                    console.log({ ref: objectsToRenderRefs[index] });
                    objectsToRenderRefs.current[index]?.scrollIntoView({
                      behavior: 'smooth',
                    });
                  }}
                >
                  <span>{title}</span>
                </li>
              ))}
          </ul>
        </Skeleton>
        <div
          className="d-grid gap-4"
          style={{ width: '100%', maxWidth: '720px' }}
        >
          {objectsToRenderFile
            .filter(({ display }) => display)
            .map(({ title, renderer: Renderer, ...props }, index) => (
              <Renderer
                key={index}
                loading={loading}
                title={`${index + 1}. ${title}`}
                ref={(el) => {
                  objectsToRenderRefs.current[index] = el;
                }}
                {...props}
              />
            ))}
        </div>
      </div>
    </Drawer>
  );
};

const FileTitleSection = ({ title }) => {
  return (
    <Space
      direction="vertical"
      style={{ width: '100%', overflowX: 'scroll' }}
    >
      <h5 style={{ color: '#777', fontWeight: '400' }}>{title}</h5>
      <Divider style={{ margin: 0 }} />
    </Space>
  );
};

const FileSectionFrameWork = forwardRef(
  ({ data, title, loading, objectSpecifier }, ref) => {
    return (
      <Skeleton
        title={!!title}
        loading={loading}
        paragraph={{ rows: objectSpecifier.length }}
      >
        <Space
          direction="vertical"
          ref={ref}
        >
          <FileTitleSection title={title} />
          <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
            {objectSpecifier.map(
              ({
                key,
                dataIndex,
                title,
                render = (value) => value || 'N/A',
              }) => (
                <li
                  key={key}
                  style={{
                    padding: '8px 0',
                    borderBottom: '.5px solid #d9d9d9',
                  }}
                >
                  <Space
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span style={{ color: '#0f5689', fontWeight: 'bolder' }}>
                      {title}
                    </span>
                    <span style={{ color: 'gray', fontWeight: 'bolder' }}>
                      {render(data[dataIndex], data)}
                    </span>
                  </Space>
                </li>
              ),
            )}
          </ul>
        </Space>
      </Skeleton>
    );
  },
);

const FileSectionTable = forwardRef(({ title, loading, ...props }, ref) => {
  return (
    <Skeleton
      title={!!title}
      loading={loading}
      paragraph={{ rows: props?.dataSource?.length || 1 }}
    >
      <Space
        ref={ref}
        direction="vertical"
        style={{ width: '100%', overflowX: 'scroll' }}
      >
        <FileTitleSection title={title} />
        <Table
          bordered
          size="small"
          {...props}
        />
      </Space>
    </Skeleton>
  );
});

const FileConsultationNotes = forwardRef(({ title, loading, data }, ref) => {
  return (
    <Skeleton loading={loading}>
      <Space
        ref={ref}
        direction="vertical"
        style={{ width: '100%', overflowX: 'scroll' }}
      >
        <FileTitleSection title={title} />
        <PatientSignsReport treatmentNo={data} />
      </Space>
    </Skeleton>
  );
});

export default PatientVitalInfo;
