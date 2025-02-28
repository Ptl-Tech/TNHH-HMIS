import { Button, Table } from 'antd';
import PropTypes from 'prop-types';

const ChargesTable = ({ showModal }) => {
  const columns = [
    {
      title: 'Charges',
      dataIndex: 'charges',
      key: 'charges',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      key: 'remarks',
    },
  ];

  const data = [
    {
      key: '1',
      charges: 'Nursing Fees',
      date: '12/12/2021',
      quantity: '1',
      remarks: 'Delivered by Nurse Jane',
      action: 'View',
    },
  ];

  return (
    <div style={{ paddingTop: '30px' }}>
      <Table
        columns={columns}
        dataSource={data}
      />
    </div>
  );
};

export default ChargesTable;

//props validation
ChargesTable.propTypes = {
  showModal: PropTypes.func,
};
