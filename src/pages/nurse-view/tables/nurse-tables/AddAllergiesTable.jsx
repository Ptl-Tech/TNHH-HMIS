import { Table } from "antd"
import PropTypes from "prop-types"
import Loading from "../../../../partials/nurse-partials/Loading"
import useSetTablePagination from "../../../../hooks/useSetTablePagination"

const AddAllergiesTable = ({ rowSelection, filterAllergies, loadingAllergies, loadingTriageList }) => {
    const columns = [
        {
          title: 'Patient No',
          dataIndex: 'PatientNo',
          key: 'PatientNo',
          fixed: 'left',
          width: 100,
        },
        {
          title: 'Observation No',
          dataIndex: 'ObservationNo',
          key: 'ObservationNo',
        },
        {
          title: 'Assessed By',
          dataIndex: 'AssessedBy',
          key: 'AssessedBy',
        },
        {
          title: 'Complains',
          dataIndex: 'Complaints',
          key: 'Complaints',
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
        ]

        const { pagination, handleTableChange } = useSetTablePagination(filterAllergies);
  return (
    <div style={{ paddingTop: '30px' }}>
         {
           loadingAllergies || loadingTriageList ? (
              <Loading />
           ) : (
            <Table 
            rowKey={(record, index) => (record.ObservationNo || '') + '-' + index} 
            scroll={{ x: 'max-content' }}
            columns={columns} 
            dataSource={filterAllergies} 
            rowSelection={rowSelection}
            bordered size='middle' 
                pagination={{
                ...pagination,
                total: filterAllergies?.length,
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
           )
         }
    </div>
  )
}

export default AddAllergiesTable

//props types validations
AddAllergiesTable.propTypes = {
  rowSelection: PropTypes.object.isRequired,
  filterAllergies: PropTypes.array,
  loadingAllergies: PropTypes.bool,
  loadingTriageList: PropTypes.bool
}
