

import { Table } from "antd"
import PropTypes from "prop-types"
import Loading from "../../../../partials/nurse-partials/Loading"
import useSetTablePagination from "../../../../hooks/useSetTablePagination"

const PrescriptionTable = () => {

  const columns = [
    {
      title: 'Patient No',
      dataIndex: 'PatientNo',
      key: 'PatientNo',
      fixed: 'left',
      width: 100
    },
    {
      title: 'Patient Name',
      dataIndex: 'Patient_Name',
      key: 'Patient_Name',
    },
    {
      title: 'Treatment Date',
      dataIndex: 'Treatment_Date',
      key: 'Treatment_Date',
    },
    {
      title: 'Clinic',
      dataIndex: 'Clinic',
      key: 'Clinic',
    },
    {
      title: 'Notes Type',
      dataIndex: 'Notes_Type',
      key: 'Notes_Type',
    },
    {
      title: 'Notes',
      dataIndex: 'NotesTxt',
      key: 'NotesTxt',
      fixed: 'right',
      width: 300
    },
    
  ]

  const { pagination, handleTableChange } = useSetTablePagination(getDoctorNotes);

  return (
    <div style={{ paddingTop: '30px' }}>
         {
          loadingGetDoctorNotes ? (
                <Loading />
            ) : (
              <Table columns={columns} 
              dataSource={getDoctorNotes} 
              rowKey={'SystemId'}
              scroll={{ x: 'max-content' }}
              rowSelection={rowSelection}
              bordered size='middle' 
              pagination={{
                ...pagination,
                total: getDoctorNotes?.length,
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

export default PrescriptionTable

// props validation
PrescriptionTable.propTypes = {
  rowSelection: PropTypes.object.isRequired,
  loadingGetDoctorNotes: PropTypes.bool.isRequired,
  getDoctorNotes: PropTypes.array.isRequired,
};