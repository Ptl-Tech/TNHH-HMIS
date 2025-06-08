import dayjs from 'dayjs';
import { Button, Space } from 'antd';

import { MdAttachFile } from 'react-icons/md';

export const smartMerge = (...objects) => {
  return objects.reduce((acc, obj) => {
    // Replacing existing but empty values
    for (const key in obj) if (!String(acc[key]).trim()) acc[key] = obj[key];
    // Add properties that don't yet exist
    for (const key in obj) if (!(key in acc)) acc[key] = obj[key];
    return acc;
  }, {});
};

const formattedDate = (date, format = 'DD MMM YYYY') =>
  dayjs(date).format(format);

const renderDate = ({ month, day, year }) => {
  const newDate = `${month}/${day}/${year}`;
  return formattedDate(newDate);
};

export const generateFileTabsData = ({
  data,
  labelKey,
  renderLabel,
  objectSpecifier,
  component: Component,
}) => {
  const response = data?.map((dataItem, index) => ({
    key: index + 1,
    label: renderLabel ? renderLabel(dataItem[labelKey]) : dataItem[labelKey],
    children: (
      <Component
        index={index}
        data={dataItem}
        objectSpecifier={objectSpecifier}
      />
    ),
  }));

  console.log({ response });

  return response;
};

// TODO: waiting on Ndirangu to finish the API side.
// export const categorizeDoctorNotes = (doctorNotes) => {
//   if (doctorNotes?.length) {
//     doctorNotes.reduce(
//       (acc, curr) => {
//         if (current) {
//         }
//       },
//       { sections: [], sectionCategories: [], formItems: [] },
//     );
//   }
// };

export const summaryPatientInfo = (patient) => [
  {
    type: 'avatar',
    value: [
      { label: 'Name', value: patient['SearchName'] },
      {
        label: 'Age',
        value: patient['Age'],
      },
    ],
  },
  {
    type: 'rowData',
    label: 'Patient Number',
    value: patient['PatientNo'],
  },
  {
    type: 'rowData',
    label: 'Treatnent Number',
    value: patient['TreatmentNo'],
  },
  {
    type: 'rowData',
    label: 'Gender',
    value: patient['Gender'],
  },
];

const getInsuranceInformation = (patient, insurance) =>
  patient[insurance] === 'Cash'
    ? []
    : [
        {
          type: 'rowData',
          label: 'Insurance',
          value: patient['Insurance_Name'],
        },
        { type: 'rowData', label: 'Scheme Name', value: patient['SchemeName'] },
      ];

export const fullPatientInfo = (patient) => [
  ...summaryPatientInfo(patient),
  { type: 'rowData', label: "Doctor's name", value: patient['DoctorsName'] },
  { type: 'rowData', label: 'Patient Type', value: patient['PatientType'] },
  { type: 'rowData', label: 'Phone Number', value: patient['TelephoneNo1'] },
  {
    type: 'rowData',
    label: 'Next of kin Name',
    value: patient['Next_Of_kin_Full_Name'],
  },
  {
    type: 'rowData',
    label: 'Next of kin Address',
    value: patient['Next_Of_kin_Address_1'],
  },
  {
    type: 'rowData',
    label: 'Next of kin relationship',
    value: patient['Next_of_kin_Relationship'],
  },
  ...getInsuranceInformation(patient, 'PatientType'),
];

export const vitalsInfo = (vitals) => [
  {
    label: 'Date Taken',
    value: formattedDate(vitals['DateTaken']),
  },
  {
    label: 'Observation No',
    value: vitals['ObservationNo'],
  },
  {
    label: 'Temperature',
    value: `${vitals['Temperature']} (°C)`,
  },
  {
    label: 'Pulse Rate',
    value: `${vitals['PulseRate']} (bpm)`,
  },
  {
    label: 'Respiration Rate',
    value: `${vitals['RespirationRate']} (BPM)`,
  },
  {
    label: 'Blood Pressure',
    value: `${vitals['BloodPressure']} (mmHg)`,
  },
  {
    label: 'SpO₂',
    value: vitals['SP02'],
  },
  {
    label: 'Height',
    value: `${vitals['Height']} (cm)`,
  },
  {
    label: 'Weight',
    value: `${vitals['Weight']} (kg)`,
  },
  {
    label: 'BMI',
    value: `${
      Math.round(Number.EPSILON + (vitals['BMI'] || 0) * 100) / 100
    } (kg/m²)`,
  },
];

export const allergenTypes = [
  {
    value: 0,
    label: 'Food',
  },
  {
    value: 1,
    label: 'Drug',
  },
];

export const vitalsTableColumns = [
  {
    title: 'Date Taken',
    dataIndex: 'DateTaken',
    key: 'DateTaken',
    render: (value) => formattedDate(value),
  },
  {
    title: 'Observation No',
    dataIndex: 'ObservationNo',
    key: 'ObservationNo',
    fixed: 'left',
  },
  { title: 'Temperature (°C)', dataIndex: 'Temperature', key: 'Temperature' },
  { title: 'Pulse Rate (bpm)', dataIndex: 'PulseRate', key: 'PulseRate' },
  {
    title: 'Respiration Rate (BPM)',
    dataIndex: 'RespirationRate',
    key: 'RespirationRate',
  },
  {
    title: 'Blood Pressure (mmHg)',
    dataIndex: 'BloodPressure',
    key: 'BloodPressure',
  },
  { title: 'SpO₂ (%)', dataIndex: 'SP02', key: 'SP02' },
  { title: 'Height (cm)', dataIndex: 'Height', key: 'Height' },
  { title: 'Weight (kg)', dataIndex: 'Weight', key: 'Weight' },
  {
    title: 'BMI',
    dataIndex: 'BMI',
    key: 'BMI',
    fixed: 'right',

    render: (text) => (text !== '-' ? parseFloat(text).toFixed(2) : '-'),
  },
];

export const encounterDetails = [
  {
    key: 'encounterNo',
    className: 'fw-bold',
    title: 'Encounter No.',
    dataIndex: 'encounterNo',
  },
  {
    key: 'encounterType',
    title: 'Encounter Type',
    dataIndex: 'encounterType',
    render: (value) => (value ? 'Inpatient' : 'Outpatient'),
  },
  {
    key: 'appointmentDate',
    title: 'Appointment Date',
    dataIndex: 'appointmentDate',
    render: (value) => formattedDate(value),
  },
  {
    key: 'dischargeDate',
    title: 'Discharge Date',
    dataIndex: 'dischargeDate',
    render: (value) => formattedDate(value),
  },
];

export const encounterDetailsTable = (setOpen, setEncounter) => [
  ...encounterDetails,
  {
    align: 'right',
    key: 'encounterNo',
    title: 'View Encounter',
    dataIndex: 'encounterNo',
    render: (value, record) => (
      <Button
        type="text"
        onClick={() => {
          setOpen(() => {
            setEncounter(record);
            return true;
          });
        }}
        style={{ alignItems: 'center' }}
      >
        <Space style={{ alignItems: 'center' }}>
          <MdAttachFile
            size={18}
            style={{ rotate: '45deg', color: '#0f5689' }}
          />
          <span style={{ color: '#0f5689' }}>View Encounter</span>
        </Space>
      </Button>
    ),
  },
];

export const triageDetailsObjectArray = [
  {
    key: 'linkNo',
    title: 'Link Number',
    dataIndex: 'linkNo',
  },
  {
    key: 'linkType',
    title: 'Link Type',
    dataIndex: 'linkType',
  },
  {
    key: 'specialClinics',
    title: 'Special Clinics',
    dataIndex: 'specialClinics',
  },
  {
    key: 'observationRemarks',
    title: 'Observation Remarks',
    dataIndex: 'observationRemarks',
    render: (value, record) =>
      value || record['observationRemarks2'] || 'System - (No Remarks)',
  },
  {
    key: 'observationDate',
    title: 'Observation Date',
    dataIndex: 'observationDate',
    render: ({ day, month, year }, record) => {
      const newDate = `${month}/${day}/${year} ${record.observationTime}`;
      return formattedDate(newDate, 'dddd, MMMM D, YYYY h:mm A');
    },
  },
];

export const treatmentHeaderObjectArray = [
  { key: 'treatmentNo', dataIndex: 'treatmentNo', title: 'Treatment Number' },
  {
    key: 'urgencyStatus',
    title: 'Urgency Status',
    dataIndex: 'urgencyStatus',
  },
  { key: 'clinic', dataIndex: 'clinic', title: 'Clinic' },
  { key: 'doctorsName', dataIndex: 'doctorsName', title: "Doctor's Name" },
  {
    key: 'treatmentDate',
    title: 'Treatment Date',
    dataIndex: 'treatmentDate',
    render: ({ day, month, year }, record) => {
      const newDate = `${month}/${day}/${year} ${record.treatmentTime}`;
      return formattedDate(newDate, 'dddd, MMMM D, YYYY h:mm A');
    },
  },
];

export const triageVitalsObjectArray = (vitalsData) => [
  {
    title: 'Vital Sign',
    dataIndex: 'vital',
    key: 'vital',
    fixed: 'left',
    className: 'glassmorphic-white fw-bolder text-main-primary',
  },
  ...(vitalsData
    ? vitalsData?.map((entry, index) => {
        const date = formattedDate(entry.dateCreated, 'DD MMM YYYY h:mm A');
        return {
          title: date,
          key: `col_${index}`,
          dataIndex: `col_${index}`,
        };
      })
    : []),
];

export const vitalKeys = [
  { label: 'Blood Pressure (mmHg)', key: 'bloodPressure' },
  { label: 'Pulse Rate (bpm)', key: 'pulseRate' },
  { label: 'Respiration Rate (breaths/min)', key: 'respirationRate' },
  { label: 'Temperature (°C)', key: 'temperature' },
  { label: 'SpO₂ (%)', key: 'sP02' },
  { label: 'Pain (scale 0 to 10)', key: 'pain' },
  { label: 'BMI (kg/m²)', key: 'bmi' },
  { label: 'Height (cm)', key: 'height' },
  { label: 'Weight (kg)', key: 'weight' },
];

export const allergiesObjectArray = [
  {
    key: 'allergen',
    title: 'Allergen',
    dataIndex: 'allergen',
    render: (value, record) =>
      value || record['foodAllergen'] || record['drugAllergen'],
  },
  {
    key: 'assessedBy',
    title: 'Assesed By',
    dataIndex: 'assessedBy',
  },
  {
    key: 'type',
    title: 'Type',
    dataIndex: 'type',
    render: (value, record) =>
      value || record['foodAllergen']
        ? 'Food'
        : record['drugAllergen']
        ? 'Drug'
        : '',
  },
  {
    key: 'complaints',
    title: 'Complaints',
    dataIndex: 'complaints',
    render: (value, record) => value || 'N/A',
  },
];

export const diagnosisObjectArray = [
  {
    key: 'diagnosisType',
    title: 'Diagnosis Type',
    dataIndex: 'diagnosisType',
    className: 'fw-bolder text-main-primary',
  },
  {
    key: 'description',
    title: 'Diagnosis Name',
    dataIndex: 'description',
    render: (value, record) => value || record['diagnosisName'],
  },
  {
    key: 'diagnosisDate',
    title: 'Diagnosis Date',
    dataIndex: 'diagnosisDate',
    render: (date) => renderDate(date || {}),
  },
];

export const prescriptionObjectArray = [
  {
    key: 'drugName',
    title: 'Drug Name',
    dataIndex: 'drugName',
    className: 'fw-bolder text-main-primary',
    render: (value, record) => value || record['drug_Name'],
  },
  {
    key: 'dosage',
    title: 'Dosage',
    dataIndex: 'dosage',
  },
  {
    key: 'frequency',
    title: 'Frequency',
    dataIndex: 'frequency',
  },
  {
    key: 'numberOfDays',
    title: 'Number of Days',
    dataIndex: 'numberOfDays',
    render: (value, record) => value || record['number_of_Days'] || 'N/A',
  },
  {
    key: 'quantity',
    title: 'Quantity',
    dataIndex: 'quantity',
  },
  {
    key: 'remarks',
    title: 'Remarks',
    dataIndex: 'remarks',
  },
  {
    key: 'prescribedBy',
    title: 'Prescribe By',
    dataIndex: 'prescribedBy',
    render: (value, record) => value || record['prescribedByName'] || 'N/A',
  },
  {
    key: 'datePrescribed',
    title: 'Date Prescribed',
    dataIndex: 'datePrescribed',
    render: (value, record) => renderDate(value || record['posted_Date'] || {}),
  },
];

export const proceduresObjectArray = [
  {
    key: 'procedure_Type',
    title: 'Procedure Type',
    dataIndex: 'procedure_Type',
    className: 'fw-bolder text-main-primary',
  },
  {
    key: 'procedure_Date',
    title: 'Procedure Date',
    dataIndex: 'procedure_Date',
    render: (date) => renderDate(date || {}),
  },
  {
    key: 'status',
    title: 'Done',
    dataIndex: 'status',
    render: (value) => (value === 'Completed' ? '✅' : '❌'),
  },
];

export const referralsObjectArray = [
  {
    key: 'branch',
    title: 'Branch',
    dataIndex: 'branch',
  },
  {
    key: 'hospitalName',
    title: 'Hospital Name',
    dataIndex: 'hospitalName',
  },
  {
    key: 'referralReason',
    title: 'Referral Reason',
    dataIndex: 'referralReason',
  },
  {
    key: 'referralRemarks',
    title: 'Referral Remarks',
    dataIndex: 'referralRemarks',
  },
  {
    key: 'dateReffered',
    title: 'Date Reffered',
    dataIndex: 'dateReffered',
    render: (date) => renderDate(date || {}),
  },
  {
    key: 'status',
    title: 'Referred',
    dataIndex: 'status',
    render: (value) => (value === 'Completed' ? '✅' : '❌'),
  },
];

export const jvFormObjectArray = [
  {
    key: 'nurse',
    title: 'Nurse',
    dataIndex: 'nurse',
    className: 'text-main-primary fw-bolder',
  },
  {
    key: 'date',
    title: 'Date',
    dataIndex: 'date',
    render: (value) => (value && renderDate(value)) || 'N/A',
    className: 'text-main-primary fw-bolder',
  },
  {
    key: 'ivLine',
    title: 'iv Line',
    dataIndex: 'ivLine',
  },
  {
    key: 'score',
    title: 'score',
    dataIndex: 'score',
  },
];

export const dietaryIntakeObjectArray = [
  {
    key: 'category',
    title: 'Category',
    dataIndex: 'category',
    className: 'text-main-primary fw-bolder',
  },
  {
    key: 'comment',
    title: 'Comment',
    dataIndex: 'comment',
  },
];

export const nursingCarePlanObjectArray = [
  {
    key: 'nursing_Diagnosis',
    title: 'Nursing Diagnosis',
    dataIndex: 'nursing_Diagnosis',
  },
  {
    key: 'physical_Assessmet_MSA',
    title: 'Physical Assesment',
    dataIndex: 'physical_Assessmet_MSA',
  },
  {
    key: 'evaluation',
    title: 'Evaluation',
    dataIndex: 'evaluation',
  },
  {
    key: 'implementation',
    title: 'Implementation',
    dataIndex: 'implementation',
  },
  {
    key: 'rationale',
    title: 'Rationale',
    dataIndex: 'rationale',
  },
  {
    key: 'created_By',
    title: 'Created By',
    dataIndex: 'created_By',
    className: 'fw-bolder',
  },
];

export const suicideFormListObjectArray = [
  {
    key: 'handingOver',
    title: 'Handing Over',
    dataIndex: 'handingOver',
  },
  {
    key: 'takingOver',
    title: 'Taking Over',
    dataIndex: 'takingOver',
  },
  {
    key: 'remarks',
    title: 'Remarks',
    dataIndex: 'remarks',
  },
  {
    key: 'date',
    title: 'Date',
    dataIndex: 'date',
    render: ({ year, month, day }, record) =>
      formattedDate(
        `${month} ${day} ${year} ${record['time']}`,
        'DD MMM YYYY h:mm A',
      ),
    className: 'fw-bolder text-main-primary',
  },
];

export const visitorListObjectArray = [
  {
    key: 'visitorName',
    title: 'Visitor Name',
    dataIndex: 'visitorName',
    className: 'fw-bolder text-main-primary',
  },
  {
    key: 'idNumber',
    title: 'ID Number',
    dataIndex: 'idNumber',
  },
  {
    key: 'phoneNumber',
    title: 'Phone Number',
    dataIndex: 'phoneNumber',
  },
];

export const nurseCardExObjectArray = [
  {
    key: 'notes',
    title: 'Notes',
    dataIndex: 'notes',
    innerHTML: true,
  },
];

export const dailyWardRoundsObjectArray = [
  {
    key: 'notes',
    title: 'Notes',
    dataIndex: 'notes',
    innerHTML: true,
  },
];
