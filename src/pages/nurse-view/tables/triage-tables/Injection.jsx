import { Button, Space, Table } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';


const InjectionTable = ({ handleOpenModal}) => {

    const injectionsColumns = [
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
          title: 'Injections No',
          dataIndex: 'injectionsNo',
          rowScope: 'row',
        },
        {
          title: 'Quantity',
          dataIndex: 'Quantity',
          rowScope: 'row',
        },
        {
          title: 'Injections Date',
          dataIndex: 'injectionsDate',
          rowScope: 'row',
        },
        {
          title: 'Injections Time',
          dataIndex: 'injectionsTime',
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
            )
          }
        },
      ]
    
      const injectionsData = [
        {
          staffNo: 432,
          observationNo: 1,
          injectionsNo: 1212,
          Quantity: 1,
          injectionsDate: '12/12/2022',
          injectionsTime: '12:00',
        }
      ]

  return (
    <Table dataSource={injectionsData} columns={injectionsColumns} bordered size='middle' style={{ marginTop: '20px' }} />
  )
}

export default InjectionTable
//props validation

InjectionTable.propTypes = {
  handleOpenModal: PropTypes.func.isRequired,
}