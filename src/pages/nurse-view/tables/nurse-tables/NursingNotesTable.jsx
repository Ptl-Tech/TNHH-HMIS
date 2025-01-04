import { Button, Table } from "antd"
import PropTypes from "prop-types"
import Loading from "../../../../partials/nurse-partials/Loading"
import { useState } from "react"
import { FolderViewOutlined } from '@ant-design/icons'

const NursingNotesTable = ({ showModal, loadingGetNurseAdmissionNotes, getNurseNotes }) => {

  const columns = [
    
    {
      title: 'Admission No',
      dataIndex: 'AdmissionNo', // Matches key in data
      key: 'AdmissionNo',
      fixed: 'left',
      width: 100
    },
    {
      title: 'Notes Date',
      dataIndex: 'NotesDate', // Matches key in data
      key: 'NotesDate',
    },
    {
      title: 'Notes Time',
      dataIndex: 'NotesTime', // Matches key in data
      key: 'NotesTime',
    },
    {
      title: 'Notes',
      dataIndex: 'Notes', // Matches key in data
      key: 'Notes',
      render: (text) => 
        text.length > 50 ? `${text.substring(0, 47)}...` : text,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      fixed: 'right',
      width: 100,
      render: (_, record) => <Button style={{ color: '#0f5689'}} onClick={() => showModal(record)}>
        <FolderViewOutlined /> View
      </Button>
    }
  ]

  const [pagination, setPagination] = useState({
          current: 1,
          pageSize: 10,
          total: getNurseNotes?.length,
      });
            
      const handleTableChange = (newPagination) => {
          setPagination(newPagination); // Update pagination settings
      };

      const formattedDataSource = Array.isArray(getNurseNotes) ? getNurseNotes : [getNurseNotes];


  return (
    <div style={{ paddingTop: '30px' }}>
         {
          loadingGetNurseAdmissionNotes ? <Loading /> :
          <Table columns={columns} dataSource={formattedDataSource} 
          rowKey='SystemId'
          scroll={{ x: 'max-content' }}
          bordered size='middle' 
          pagination={{
            ...pagination,
            total: getNurseNotes?.length,
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
         }
    </div>
   
  )
}

export default NursingNotesTable

//Prop validations

NursingNotesTable.propTypes = {
  showModal: PropTypes.func.isRequired,
  loadingGetNurseAdmissionNotes: PropTypes.bool.isRequired,
  getNurseNotes: PropTypes.array.isRequired,
}