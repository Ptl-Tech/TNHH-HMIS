import { useDispatch } from 'react-redux';

import { Table } from 'antd';

import TestMenu from '../Menus/TestMenu';
import { createLabTestHeader } from '../../../actions/lab-actions/createLabTestHeader';
import dayjs from 'dayjs';

const DispatchesTable = ({ data, handleOpenLab, loading }) => {
  const dispatch = useDispatch();
  // TODO: this will be done once we get the last API for submitting the lab tests of the lab header
  const handleOpenEditRequest = (record) => {
    handleOpenLab(record.RequestNo);
  };

  // handle forwading the lab request to it's department
  const handleForwardRequest = ({ SystemId, Cash_Sale, LinkNo, PatientNo }) => {
    dispatch(
      createLabTestHeader({
        myAction: 'edit',
        recId: SystemId,
        cashSale: Cash_Sale,
        visitNo: LinkNo,
        patientNo: PatientNo,
        status: 1,
      }),
    );
  };

  const columns = [
    {
      title: 'Request Number',
      key: 'RequestNo',
      dataIndex: 'RequestNo',
    },
    {
      title: 'Status',
      key: 'Status',
      dataIndex: 'Status',
    },
    {
      title: 'Created On',
      key: 'RequestNo',
      dataIndex: 'RequestNo',
      render: (data, record) => {
        return dayjs(
          `${record?.LaboratoryDate} ${record?.LaboratoryTime}`,
        ).format('MMMM D, YYYY h:mm A');
      },
    },
    {
      align: 'right',
      title: 'Actions',
      render: (_, record) => (
        <TestMenu
          record={record}
          handleEditRequest={handleOpenEditRequest}
          handleForwardRequest={handleForwardRequest}
        />
      ),
    },
  ];

  return (
    <Table
      bordered
      dataSource={data}
      columns={columns}
      loading={loading}
      pagination={false}
      rowClassName={(record) => (record.Status !== 'New' ? 'disabled-row' : '')}
    />
  );
};

export default DispatchesTable;
