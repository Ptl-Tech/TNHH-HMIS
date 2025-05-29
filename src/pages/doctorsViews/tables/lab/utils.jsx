import moment from 'moment';

export const labLinesColumns = [
  {
    title: 'Lab Number',
    dataIndex: 'Laboratory_No',
    key: 'Laboratory_No',
  },
  {
    title: 'Test Name',
    dataIndex: 'LaboratoryTestName',
    key: 'LaboratoryTestName',
  },
  {
    title: 'Positive',
    dataIndex: 'Positive',
    key: 'Positive',
    render: (_, record) =>
      record.Positive ? 'TRUE' : !record.Positive ? 'FALSE' : record.Positive,
  },
  {
    title: 'Completed',
    dataIndex: 'Completed',
    key: 'Completed',
    render: (_, record) =>
      record.Completed
        ? 'TRUE'
        : !record.Completed
        ? 'FALSE'
        : record.Completed,
  },
  {
    title: 'Date',
    dataIndex: 'CollectionDate',
    key: 'CollectionDate',
    render: (_, record) => {
      const date = new Date(
        `${record.CollectionDate}T${record.CollectionTime}`,
      );

      return moment(date).format('MMMM Do YYYY, h:mm a');
    },
  },
];

export const labResultsColumns = [
  {
    title: 'Specimen Code',
    dataIndex: 'Specimen_Code',
    key: 'Specimen_Code',
  },
  {
    title: 'Specimen Name',
    dataIndex: 'Specimen_Name',
    key: 'Specimen_Name',
  },
  {
    title: 'Lab Results',
    dataIndex: 'Results',
    key: 'Results',
    editable: true,
  },
  {
    title: 'Unit',
    dataIndex: 'Measuring_Unit_Code',
    key: 'Measuring_Unit_Code',
  },
  {
    title: 'Reference Range',
    dataIndex: 'Test_Normal_Ranges',
    key: 'Test_Normal_Ranges',
  },
];

export const filterByCategory = (labRequest, variant) => {
  var returnValue;
  switch (variant) {
    case 'All':
      returnValue = true;
      break;
    case 'Walk-In':
      returnValue = labRequest.Walk_In;
      break;
    case 'Inpatient':
      returnValue = labRequest.Inpatient;
      break;
    case 'Outpatient':
      returnValue = !labRequest.Inpatient && !labRequest.Walk_In;
      break;
    default:
      returnValue = true;
      break;
  }

  return returnValue;
};

export const filterByStatus = (labRequest, status) =>
  status ? labRequest.Status === status : true;
