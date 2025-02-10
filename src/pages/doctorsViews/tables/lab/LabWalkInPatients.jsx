import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import moment from 'moment';
import { Button, Table } from 'antd';

import Loading from '../../../../partials/nurse-partials/Loading';
import { getPatientListSlice } from '../../../../actions/nurse-actions/getPatientListSlice';

const LabWalkInPatients = () => {
  // hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loadingPatientList, allPatientLList, error } = useSelector(
    (state) => state.getPatientList,
  );

  useEffect(() => {
    if (!allPatientLList.length) {
      dispatch(getPatientListSlice());
    }
  }, [dispatch]);

  const walkInPatientList = allPatientLList.filter((item) => item.Walkin);

  const columns = [
    {
      key: 'IDNumber',
      title: 'ID Number',
      dataIndex: 'IDNumber',
    },
    {
      key: 'ActiveVisitNo',
      title: 'Active Visit No',
      dataIndex: 'ActiveVisitNo',
    },
    {
      title: 'Telephone Number(s)',
      render: (_, record) => {
        const telephones = [record.TelephoneNo1, record.TelephoneNo2];
        return telephones
          .reduce((acc, current) => {
            if (current) acc.push(current);
            return acc;
          }, [])
          .join(', ');
      },
    },
    {
      key: 'Gender',
      title: 'Gender',
      dataIndex: 'Gender',
    },
    {
      key: 'Status',
      title: 'Status',
      dataIndex: 'Status',
    },
    {
      title: 'Name',
      render: (_, record) => {
        const names = [record.MiddleName, record.LastName, record.Surname];
        return names
          .reduce((acc, current) => {
            if (current) acc.push(current);
            return acc;
          }, [])
          .join(' ');
      },
    },
    {
      key: 'DateRegistered',
      title: 'Date Registered',
      dataIndex: 'DateRegistered',
      render: (item) => {
        return moment(item, 'YYYY-MM-DD').format('MMM Do YY');
      },
    },
    {
      title: 'Select',
      render: (item, record) => {
        // TODO: Here you are supposed to pass a dispatch to create a lab header, and get the lab request no back
        return (
          <Button onClick={() => handleNavigate(record.PatientNo)}>
            Create Lab Request
          </Button>
        );
      },
    },
  ];

  const handleNavigate = (labNo) => {
    navigate(`/Lab/Walk-In/Lab-Header?LaboratoryNo=${labNo}`, {
      state: {
        labNo,
        patientNo: labNo,
        walkIn: true,
      },
    });
  };

  return (
    <div className="">
      {loadingPatientList ? (
        <Loading />
      ) : (
        <Table
          columns={columns}
          dataSource={walkInPatientList}
        />
      )}
    </div>
  );
};

export default LabWalkInPatients;
