import { Button, message, Table, Tag } from "antd"
import PropTypes from "prop-types"
import Loading from "../../../../partials/nurse-partials/Loading"
import { useState } from "react"
import { DeleteOutlined } from "@ant-design/icons"
import { useDispatch } from "react-redux"
import { POST_MENTAL_EXAMINATION_FORM_FAILURE, POST_MENTAL_EXAMINATION_FORM_SUCCESS, postMentalExaminationFormSlice } from "../../../../actions/nurse-actions/postMentalExaminationFormSlice"
import { getMentalExaminationFormSlice } from "../../../../actions/nurse-actions/getMentalExaminationFormSlice"

const MentalStatusExaminationTable = ({ rowSelection, loadingIpGetMentalStatusForm, filterMSEFormData, patientDetails }) => {
  const dispatch = useDispatch();
  const handleDelete = async (record) => {
    const formData = {
      ...record,
      myAction: 'delete'
    }
     const result = await dispatch(postMentalExaminationFormSlice('/InpatientForms/MentalStatusCheckForm', formData))
     if( result.type === POST_MENTAL_EXAMINATION_FORM_SUCCESS){
       dispatch(getMentalExaminationFormSlice(patientDetails?.Admission_No));
       message.success(`MSE form deleted successfully!`);
     }else if(result.type === POST_MENTAL_EXAMINATION_FORM_FAILURE){
       message.error(result.payload.message || "Internal server error, please try again later.");
     }
  }
    const columns = [
        {
          title: 'Date',
          dataIndex: 'Date',
          key: 'Date',
          render: (_, record) => {
            const date = new Date(record.Date);
            const formattedDate = date.toLocaleDateString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            });
            return formattedDate;
          }
        },
        {
          title: 'Status',
          dataIndex: 'Status',
          key: 'Status',
          render: (coding) => {
            let color = null;
            switch (coding) {
              case "0":
                color = "#FF0000";
                break;
              case "1":
                color = "#FFA500";
                break;
              case "2":
                color = "#FFFF00";
                break;
              case "3":
                color = "#008000";
                break;
            }
            return color ? <Tag color={color}>{coding}</Tag> : null;
          }
          
        },
        {
          title: 'Comments',
          dataIndex: 'Comments',
          key: 'Comments',
        },
        {
          title: 'Action',
          dataIndex: 'Action',
          key: 'Action',
          render: (text, record) => <Button style={{ color: '#0f5689'}} onClick={() => handleDelete(record)} icon={<DeleteOutlined />}>Delete</Button>
        }
    ]

    const [pagination, setPagination] = useState({
            current: 1,
            pageSize: 10,
            total: filterMSEFormData?.length,
        });
              
        const handleTableChange = (newPagination) => {
            setPagination(newPagination); // Update pagination settings
        };

  return (
    <>
      {
        loadingIpGetMentalStatusForm ? (
          <Loading />
        ) : (
          <div style={{ paddingTop: '30px' }}>
           <Table columns={columns} 
           rowKey={(record, index) => record.Date + index}
           dataSource={filterMSEFormData} 
           bordered 
           size='middle' 
           rowSelection={rowSelection}
           pagination={{
             ...pagination,
             total: filterMSEFormData?.length,
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
    </>
  )
}

export default MentalStatusExaminationTable

// props validation
MentalStatusExaminationTable.propTypes = {
    showModal: PropTypes.func,
    loadingIpGetMentalStatusForm: PropTypes.bool,
    filterMSEFormData: PropTypes.array,
    rowSelection: PropTypes.array,
    patientDetails: PropTypes.array
}