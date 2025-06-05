import { useState } from 'react';

import dayjs from 'dayjs';
import { Badge, Button } from 'antd';

import { getUrgencyColorcode } from '../../../utils/helpers';

const CheckInButton = ({ loading, children, record, treatmentNo, handleNavigate }) => {

  const [currentLoading, setCurrentLoading] = useState(false)

  return <Button
    type="primary"
    disabled={currentLoading ? false : loading}
    loading={currentLoading}
    onClick={() => { setCurrentLoading(true); handleNavigate(record, treatmentNo) }}
  >
    {children}
  </Button>
}

export const waitingListColumns = ({
  searchName,
  loading = false,
  handleNavigate,
  searchVisitNumber,
  searchPatientNumber,
  checkInButton = 'Check In',
}) => [
    {
      title: '#',
      dataIndex: 'key',
      key: 'key',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Treatment No',
      dataIndex: 'TreatmentNo',
      key: 'TreatmentNo',
      filteredValue: searchVisitNumber ? [searchVisitNumber] : null,
      onFilter: (value, record) =>
        record?.TreatmentNo
          ? record.TreatmentNo.toLowerCase().includes(value.toLowerCase())
          : false,
    },
    {
      title: 'Patient Name',
      dataIndex: 'SearchName',
      key: 'SearchName',
      filteredValue: searchName ? [searchName] : null,
      onFilter: (value, record) =>
        record?.SearchName
          ? record.SearchName.toLowerCase().includes(value.toLowerCase())
          : false,
      render: (text, record) => (
        <span style={{ color: '#0f5689', fontWeight: 'bolder' }}>
          {text.toUpperCase()}
        </span>
      ),
    },
    {
      title: 'Patient No',
      dataIndex: 'PatientNo',
      key: 'PatientNo',
      filteredValue: searchPatientNumber ? [searchPatientNumber] : null,
      onFilter: (value, record) =>
        record?.PatientNo
          ? record.PatientNo.toLowerCase().includes(value.toLowerCase())
          : false,
    },
    {
      key: 'DoctorsName',
      title: 'Doctor Name',
      dataIndex: 'DoctorsName',
    },
    {
      title: 'Treatment Date',
      dataIndex: 'TreatmentDate',
      key: 'TreatmentDate',
      defaultSortOrder: 'ascend',
      sorter: (a, b) => new Date(b.TreatmentDate) - new Date(a.TreatmentDate),
    },
    {
      title: 'Waiting Time',
      dataIndex: 'TreatmentTime',
      key: 'TreatmentTime',
      render: (_, record) => {
        const combinedDateTime = `${record.TreatmentDate}T${record.TreatmentTime}`;
        const elapsedMinutes = dayjs().diff(dayjs(combinedDateTime), 'minute');
        const hours = Math.floor(elapsedMinutes / 60);
        const minutes = elapsedMinutes % 60;

        return `${hours}h ${minutes}m`;
      },
    },
    {
      title: 'Patient Type',
      dataIndex: 'PatientType',
      key: 'PatientType',
    },
    {
      title: 'Age',
      dataIndex: 'Age',
      key: 'Age',
      render: (_, record) => {
        return <span>{record.Age} years</span>;
      },
    },
    {
      title: 'Urgency',
      dataIndex: 'urgency',
      key: 'urgency',
      render: (_, record) => {
        const { color, text } = getUrgencyColorcode(record.UrgencyStatus);
        return (
          <Badge
            color={color}
            text={text} // Display urgency text
            style={{ color: color }}
          />
        );
      },
    },
    ...(checkInButton
      ? [
        {
          key: 'urgency',
          title: 'Check In',
          dataIndex: 'urgency',
          render: (_, record) => <CheckInButton loading={loading} children={checkInButton} record={record} treatmentNo={record.TreatmentNo} handleNavigate={handleNavigate} />
        },
      ]
      : []),
  ];
