import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { FaPersonWalking } from 'react-icons/fa6';
import { PlusOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Divider, Input, Table, Tooltip } from 'antd';

import { listPatients } from '../actions/patientActions';

const WalkInPatientList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { patients, loading: loadingPatients } = useSelector(
    (state) => state.patientList,
  );
  const [searchParams, setSearchParams] = useState('');
  const [filteredPatients, setFilteredPatients] = useState([patients]);

  useEffect(() => {
    patients.length
      ? setFilteredPatients(patients)
      : dispatch(listPatients('Walkin', true));
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchParams(value);
    filterPatients(value);
  };

  console.log({ filteredPatients });

  const filterPatients = (value) => {
    const filtered = patients.filter((patient) => {
      return (
        patient.SearchName.toLowerCase().includes(value.toLowerCase()) ||
        patient.IDNumber.includes(value)
      );
    });
    setFilteredPatients(filtered);
  };

  const columns = [
    {
      title: 'Patient Name',
      dataIndex: 'SearchName',
      key: 'SearchName',
      sorter: (a, b) => a.SearchName.localeCompare(b.SearchName),
    },
    { title: 'Gender', dataIndex: 'Gender', key: 'Gender' },
    { title: 'ID Number', dataIndex: 'IDNumber', key: 'IDNumber' },
    {
      title: 'Date Registered',
      dataIndex: 'DateRegistered',
      key: 'DateRegistered',
      render: (text) => new Date(text).toLocaleDateString(),
      sorter: (a, b) => new Date(a.DateRegistered) - new Date(b.DateRegistered),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          {record.Activated ? (
            // So that we can view them we don't need to create a visit
            <Tooltip title="View Details">
              <Button
                icon={<EyeOutlined />}
                onClick={() =>
                  navigate(
                    `/Reception/Walkin-Patient-List/${record.ActiveVisitNo}`,
                  )
                }
              >
                Dispatch Client
              </Button>
            </Tooltip>
          ) : (
            // So that we can create a visit for them
            <Tooltip title="Dispatch Patient">
              <Button
                icon={<PlusOutlined />}
                onClick={() =>
                  navigate(
                    `/Reception/Walkin-Patient-List/Walk-In-Create-Visit?PatientNo=${record.PatientNo}`,
                  )
                }
              >
                Create Visit
              </Button>
            </Tooltip>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="d-grid justify-content-start gap-4 py-3">
        <div
          className="d-flex gap-2 align-items-center"
          style={{ position: 'relative' }}
        >
          <span
            style={{
              height: '100%',
              borderRadius: '2px',
              border: '1px solid #1c77b0',
            }}
          ></span>
          <FaPersonWalking style={{ color: '#1c77b0', fontSize: '20px' }} />
          <h5 style={{ color: '#1c77b0', margin: 0 }}>Walk-in Patient List</h5>
        </div>
        <p style={{ color: '#6d6d6d', margin: 0, fontSize: '15px' }}>
          Register a new Walk-In Patient or Search an Existing Patient.
        </p>
        <div className="d-flex align-items-center gap-3">
          <Button
            type="primary"
            onClick={() => navigate('/Reception/Register-walkin')}
          >
            Register New Walk-in Patient
          </Button>
          <div
            className="d-flex align-items-center position-relative"
            style={{ height: '100%' }}
          >
            <span
              style={{
                position: 'absolute',
                inset: '0',
                left: '50%',
                right: '50%',
                borderRight: '1px solid #d1d1d1',
                zIndex: 0,
              }}
            />
            <span
              style={{
                color: '#6d6d6d',
                fontSize: '12px',
                background: '#fff',
                borderRadius: '50%',
                zIndex: 1,
              }}
            >
              OR
            </span>
          </div>
          <Input
            allowClear
            placeholder="Search by Name OR ID"
            value={searchParams.SearchName}
            onChange={(e) => handleSearchChange(e)}
          />
        </div>
      </div>
      <Divider />
      <div className="mt-4">
        <Table
          rowKey="PatientNo"
          columns={columns}
          loading={loadingPatients}
          dataSource={filteredPatients}
          pagination={{ pageSize: 10 }}
        />
      </div>
    </div>
  );
};

export default WalkInPatientList;
