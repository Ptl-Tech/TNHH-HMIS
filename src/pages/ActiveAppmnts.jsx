import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  Button,
  Dropdown,
  Input,
  message,
  Space,
  Table,
  Typography,
} from 'antd';

import { appmntList } from '../actions/patientActions';
import dayjs from 'dayjs';
import {
  POST_PHARMACY_APPOINTMENT_RESET,
  postPharmacyAppointment,
} from '../actions/reception-actions/dispatchPharmacyAppointment';

const ActiveAppmnts = () => {
  const { Title } = Typography;

  const [searchKey, setSearchKey] = useState('');
  const { patients, loading: loadingPatients } = useSelector(
    (state) => state.appmntList,
  );
  const {
    data: pharmacyAppointmentDispatched,
    loading: pharmacyAppointmentLoading,
    error: pharmacyAppointmentError,
  } = useSelector((state) => state.postPharmacyAppointment);

  const filteredPatients = useMemo(() => {
    return patients?.filter(
      (patient) =>
        patient.PatientNo.toLowerCase().includes(searchKey.toLowerCase()) ||
        patient.SearchNames.toLowerCase().includes(searchKey.toLowerCase()) ||
        patient.PatientNames.toLowerCase().includes(searchKey.toLowerCase()),
    );
  }, [searchKey, patients]);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(appmntList());
  }, []);

  useEffect(() => {
    if (pharmacyAppointmentLoading) {
      message.info('Dispatching the patient to pharmacy');
    }

    if (pharmacyAppointmentDispatched) {
      message.success('Patient dispatched successfully');
    }

    if (pharmacyAppointmentError) {
      message.error(pharmacyAppointmentError);
    }

    if (pharmacyAppointmentDispatched || pharmacyAppointmentError) {
      dispatch({ type: POST_PHARMACY_APPOINTMENT_RESET });
    }
  }, [
    pharmacyAppointmentDispatched,
    pharmacyAppointmentLoading,
    pharmacyAppointmentError,
  ]);

  const onSearch = (e) => {
    setSearchKey(e.target.value);
  };

  const columns = [
    {
      key: 'PatientNo',
      title: 'PatientNo',
      dataIndex: 'PatientNo',
    },
    {
      key: 'SearchNames',
      title: 'Patient Name',
      dataIndex: 'SearchNames',
    },
    {
      key: 'AppointmentNo',
      title: 'Appointment Number',
      dataIndex: 'AppointmentNo',
      key: 'AppointmentNo',
      render: (text, record) => {
        return (
          <span
            className="fw-bold"
            style={{ color: "#1890ff", cursor: "pointer" }}
          >
            {text.toUpperCase()}
          </span>
        );
      },
    },
    {
      key: 'AppointmentDate',
      title: 'Appointment Date',
      dataIndex: 'AppointmentDate',
      render: (value, record) =>
        `${dayjs(value).format('DD MMMM YYYY')} at ${dayjs(
          value + ' ' + record.AppointmentTime,
        ).format('hh:mm A')}`,
    },
    {
      key: 'Gender',
      title: 'Gender',
      dataIndex: 'Gender',
    },
    {
      key: 'PatientType',
      title: 'Patient Type',
      dataIndex: 'PatientType',
    },
    {
      key: 'VisitType',
      title: 'Visit Type',
      dataIndex: 'VisitType',
    },
    {
      key: 'Status',
      title: 'Status',
      dataIndex: 'Status',
      render: (value) => (
        <span style={{ fontWeight: 'bold', color: '#333' }}>{value}</span>
      ),
    },
    {
      align: 'right',
      title: 'Action',
      key: 'PatientNo',
      render: (value, record) => {
        const items = [
          {
            key: 'pharmacy',
            label: 'Dispatch to pharmacy',
          },
        ];

        const onClick = ({ key }) => {
          switch (key) {
            case 'pharmacy':
              dispatch(postPharmacyAppointment(record));
              break;
            default:
              break;
          }
        };

        return (
          <Dropdown
            placement="bottom"
            trigger={['click']}
            menu={{ items, onClick }}
            arrow={{ pointAtCenter: true }}
          >
            <Button
              type="text"
              style={{ color: '#b96000', fontWeight: '600' }}
            >
              Dispatch Patient
            </Button>
          </Dropdown>
        );
      },
    },
  ];

  return (
    <div style={{ padding: '8px' }}>
      <Title
        level={3}
        style={{ color: 'rgb(15, 86, 137)' }}
      >
        Appointment List
      </Title>
      <p style={{ color: 'rgb(109, 109, 109)' }}>
        Dispatch Outpatient and Walk In patients to their respective clinics
      </p>
      <Space style={{ display: 'grid', gap: '24px' }}>
        <Input
          onChange={onSearch}
          style={{ maxWidth: '424px' }}
          placeholder="Search by Name OR Patient Number"
        />
        <Table
          columns={columns}
          loading={loadingPatients}
          dataSource={filteredPatients}
        />
      </Space>
    </div>
  );
};

export default ActiveAppmnts;
