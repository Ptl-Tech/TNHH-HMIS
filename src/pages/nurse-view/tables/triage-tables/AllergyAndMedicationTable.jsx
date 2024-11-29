import { Button, Space, Table } from 'antd'
import {EditOutlined, DeleteOutlined} from '@ant-design/icons'
import PropTypes from 'prop-types'


const AllergyAndMedicationTable = ({ handleOpenModal }) => {

    const allergyColumns =[
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
          title: 'Complains',
          dataIndex: 'complains',
          rowScope: 'row',
        },
        {
          title: 'Reason for Visit',
          dataIndex: 'reasonForVisit',
          rowScope: 'row',
        },
    
        {
          title: 'Food Allergy',
          dataIndex: 'foodAllergy',
          rowScope: 'row',
        },
        {
          title: 'Drug Allergy',
          dataIndex: 'drugAllergy',
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
    
      const allergyData = [
        {
          staffNo: 1,
          observationNo: 1,
          complains: 1,
          reasonForVisit: 1,
          foodAllergy: 1,
          drugAllergy: 1,
        }
      ]

  return (
    <Table dataSource={allergyData} columns={allergyColumns} bordered size='middle' style={{ marginTop: '20px' }} />
  )
}

export default AllergyAndMedicationTable

//prop type validation
AllergyAndMedicationTable.propTypes = {
    handleOpenModal: PropTypes.func.isRequired
}