import { Button, Space, Table } from "antd"
import PropTypes from "prop-types"

const AddAllergiesTable = ({ showModal }) => {
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
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="primary" onClick={() => showModal()}>Edit</Button>
                    <Button color="danger" variant="outlined">Delete</Button>
                </Space>
            ),
        }
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
         <Table columns={columns} dataSource={data} />
    </div>
  )
}

export default AddAllergiesTable

//props types validations
AddAllergiesTable.propTypes = {
    showModal: PropTypes.func.isRequired,
}