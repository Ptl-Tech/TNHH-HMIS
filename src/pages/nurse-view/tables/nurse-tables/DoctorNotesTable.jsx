import { Table } from "antd"
import PropTypes from "prop-types"
import { useState } from "react"
import Loading from "../../../../partials/nurse-partials/Loading"

const DoctorNotesTable = ({ rowSelection, loadingGetDoctorNotes, getDoctorNotes }) => {

  const columns = [
    
    {
      title: 'Date',
      dataIndex: 'TreatmentDate',
      key: 'TreatmentDate',
    },
    {
      title: 'Doctor',
      dataIndex: 'Doctor',
      key: 'Doctor',
    },
    {
      title: 'Notes',
      dataIndex: 'Notes',
      key: 'Notes',
    },
    
  ]

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: getDoctorNotes?.length,
});
      
const handleTableChange = (newPagination) => {
    setPagination(newPagination); // Update pagination settings
};

  return (
    <div style={{ paddingTop: '30px' }}>
         {
          loadingGetDoctorNotes ? (
                <Loading />
            ) : (
              <Table columns={columns} dataSource={getDoctorNotes} 
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

export default DoctorNotesTable

// props validation
DoctorNotesTable.propTypes = {
  rowSelection: PropTypes.object.isRequired,
  loadingGetDoctorNotes: PropTypes.bool.isRequired,
  getDoctorNotes: PropTypes.array.isRequired,
};