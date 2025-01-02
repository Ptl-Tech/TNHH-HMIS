import { Button, Space, Table } from "antd"
import PropTypes from "prop-types"

const AddAllergiesTable = ({ rowSelection }) => {
    const columns = [

        {
          title: 'Assessed By',
          dataIndex: 'assessedBy',
          key: 'assessedBy',
        },
        {
          title: 'Complains',
          dataIndex: 'complains',
          key: 'complains',
        },
        {
          title: 'Food Allergy',
          dataIndex: 'foodAllergy',
          key: 'foodAllergy',
        },
        {
            title: 'Drug Allergy',
            dataIndex: 'drugAllergy',
            key: 'drugAllergy',
        },
        ]

    const data = [
        {
            key: '1',
            assessedBy: 'Dr. John Doe',
            complains: 'Headache',
            foodAllergy: 'Nuts',
            drugAllergy: 'Penicillin',
        }
    ]
  return (
    <div style={{ paddingTop: '30px' }}>
         <Table columns={columns} dataSource={data} 
         rowSelection={rowSelection}
         />
    </div>
  )
}

export default AddAllergiesTable

//props types validations
AddAllergiesTable.propTypes = {
  rowSelection: PropTypes.object.isRequired,
}