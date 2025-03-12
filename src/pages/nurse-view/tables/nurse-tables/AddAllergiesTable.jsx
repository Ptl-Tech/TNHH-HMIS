import { Table } from "antd"
import PropTypes from "prop-types"
import useSetTablePagination from "../../../../hooks/useSetTablePagination"

const AddAllergiesTable = ({ allergiesMedication, loadingGetAllergiesAndMedications }) => {
    const columns = [
        {
          title: 'Admission No',
          dataIndex: 'ObservationNo',
          key: 'ObservationNo',
        },
        {
          title: 'Food Allergy',
          dataIndex: 'FoodAllergy',
          key: 'FoodAllergy',
        },
        {
            title: 'Drug Allergy',
            dataIndex: 'DrugAllergy',
            key: 'DrugAllergy',
            fixed: 'right',
            width: 100,
        },
        {
          title: 'Complains',
          dataIndex: 'Complaints',
          key: 'Complaints',
        },
        {
          title: 'Assessed By',
          dataIndex: 'AssessedBy',
          key: 'AssessedBy',
        },
        ]

        const { pagination, handleTableChange } = useSetTablePagination(allergiesMedication);
  return (
    <div style={{ paddingTop: '30px' }}>
            <Table 
            rowKey={(record, index) => (record.ObservationNo || '') + '-' + index} 
            scroll={{ x: 'max-content' }}
            columns={columns} 
            dataSource={allergiesMedication} 
            loading={loadingGetAllergiesAndMedications}
            bordered size='middle' 
                pagination={{
                ...pagination,
                total: allergiesMedication?.length,
                showSizeChanger: true,
                showQuickJumper: true,
                position: ['bottom', 'right'],
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                onChange: (page, pageSize) => handleTableChange({ current: page, pageSize, total: pagination.total }),
                onShowSizeChange: (current, size) => handleTableChange({ current, pageSize: size, total: pagination.total }),
                style: {
                marginTop: '30px',
                    }
                }}
            />
    </div>
  )
}

export default AddAllergiesTable

//props types validations
AddAllergiesTable.propTypes = {
  allergiesMedication: PropTypes.array,
  loadingGetAllergiesAndMedications: PropTypes.bool
}
