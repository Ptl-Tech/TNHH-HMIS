import { Button, Space, Table } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

const DressingTable = ({ handleOpenModal }) => {

    const dressingColumns = [
        {
          title: 'Staff No',
          dataIndex: 'staffNo',
          rowScope: 'row',
        },
        {
          title: 'Observation No',
          dataIndex: 'observationNo',
          rowScope: 'row',
        },
        {
          title: 'Process No',
          dataIndex: 'ProcessNo',
          rowScope: 'row',
        },
        {
          title: 'Item No',
          dataIndex: 'itemNo',
          rowScope: 'row',
        },
        {
          title: 'Unit of Measure',
          dataIndex: 'unitOfMeasure',
          rowScope: 'row',
        },
        {
          title: 'Quantity',
          dataIndex: 'quantity',
          rowScope: 'row',
        },
        {
          title: 'Action',
          dataIndex: 'action',
          rowScope: 'row',
          fixed: 'right',
          width: 200,
          render: () => {
            return (
              <Space>
                <Button type='primary' onClick={() => handleOpenModal('Check In', null)}>
                  <EditOutlined />
                  Edit
                </Button>
                <Button color="danger" variant="outlined" onClick={() => handleOpenModal('Check In', null)}>
                  <DeleteOutlined />
                  Delete
                </Button>
              </Space>
            )}
          }
      ]
    
    
      const dressingData = [
        {
          staffNo: 432,
          observationNo: 1,
          ProcessNo: 1212,
          itemNo: 1,
          unitOfMeasure: 1,
          quantity: 1,
        }
      ]

  return (
    <Table dataSource={dressingData} columns={dressingColumns} bordered size='middle' style={{ marginTop: '20px' }} />
  )
}

export default DressingTable

//propTypes validation
DressingTable.propTypes = {
    handleOpenModal: PropTypes.func.isRequired,
}