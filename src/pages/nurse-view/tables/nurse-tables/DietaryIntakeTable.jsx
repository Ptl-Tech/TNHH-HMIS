import { Button, message, Table } from 'antd'
import PropTypes from 'prop-types'
import Loading from '../../../../partials/nurse-partials/Loading'
import { useState } from 'react'
import { DeleteOutlined } from '@ant-design/icons'
import { useDispatch } from 'react-redux'
import { POST_DIETARY_INTAKE_FORM_LINE_FAILURE, POST_DIETARY_INTAKE_FORM_LINE_SUCCESS, postDietaryIntakeFormLineSlice } from '../../../../actions/nurse-actions/postDietaryIntakeFormLineSlice'
import { getQyDietaryFormLinesSlice } from '../../../../actions/nurse-actions/getQyIPDietaryFormLinesSlice'
import { useLocation, useSearchParams } from 'react-router-dom'

const DietaryIntakeTable = ({ filterDietaryIntakeForm, loadingGetIpDietaryForm, rowSelection }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const patientNo = new useSearchParams(location.search)[0].get('PatientNo');
  console.log('patientNo', patientNo);
  const handleDelete = async (record) => {
    const formData = {
      ...record,
      myAction: 'delete'
    }

    const result = await dispatch(postDietaryIntakeFormLineSlice(formData))
     if( result.type === POST_DIETARY_INTAKE_FORM_LINE_SUCCESS){
       dispatch(getQyDietaryFormLinesSlice());
       message.success(`Dietary Intake Form Line deleted successfully!`);
     }else if(result.type === POST_DIETARY_INTAKE_FORM_LINE_FAILURE){
       message.error(result.payload.message || "Internal server error, please try again.");
     }

  }
    const columns = [
        {
          title: 'Admission Number',
          dataIndex: 'AdmissionNo',
          key: 'AdmissionNo',
          fixed: 'left',
          width: 150,
        },
        {
          title: 'Category',
          dataIndex: 'Category',
          key: 'Category',
        },
        {
          title: 'Comments',
          dataIndex: 'Comment',
          key: 'Comment',
        },
        {
          title: 'Action',
          dataIndex: 'Action',
          key: 'Action',
          fixed: 'right',
          width: 150,
          render: (text, record) => <Button style={{ color: '#0f5689'}} onClick={() => handleDelete(record)} icon={<DeleteOutlined />}>Delete</Button>
        }
        
    ]
     const [pagination, setPagination] = useState({
            current: 1,
            pageSize: 10,
            total: filterDietaryIntakeForm?.length,
        });
              
        const handleTableChange = (newPagination) => {
            setPagination(newPagination); // Update pagination settings
        };
  return (
    <>
    {
      loadingGetIpDietaryForm ? (
        <Loading />
      ) : (
        <Table columns={columns}
        rowKey={(record, index) => record.AdmissionNo + index}
        scroll={{ x: 'max-content' }}
        rowSelection={rowSelection} 
        dataSource={filterDietaryIntakeForm}
        bordered 
        size='small' 
        pagination={{
          ...pagination,
          total: filterDietaryIntakeForm?.length,
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
    </>
  )
}

export default DietaryIntakeTable
// prop validation
DietaryIntakeTable.propTypes = {
    showModal: PropTypes.func,
    loadingGetIpDietaryForm: PropTypes.bool,
    filterDietaryIntakeForm: PropTypes.array,
    rowSelection: PropTypes.object
}