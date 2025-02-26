import { Table } from "antd"
import PropTypes from "prop-types";
import useSetTablePagination from "../../../../hooks/useSetTablePagination";
import Loading from "../../../../partials/nurse-partials/Loading";

const DoctorDiagnosisTable = ({ rowSelection, filterFormattedList, loading, loadingGetDoctorDiagnosis}) => {
const columns = [
        {
            title: 'Patient No',
            dataIndex: 'PatientNoF',
            key: 'PatientNoF',
            fixed: 'left',
            width: 100
        },
        
        {
            title: 'Diagnosis Code',
            dataIndex: 'DiagnosisCode',
            key: 'DiagnosisCode',
           
        },
        {
          title: 'Diagnosis Date',
          dataIndex: 'DiagnosisDate',
          key: 'DiagnosisDate',
         
        },
        {
          title: 'Diagnosis Type',
          dataIndex: 'DiagnosisType',
          key: 'DiagnosisType',
         
        },
        {
          title: 'Doctor',
          dataIndex: 'DoctorName',
          key: 'DoctorName',
         
        },
        {
          title: 'Diagnosis Name',
          dataIndex: 'DiagnosisName',
          key: 'DiagnosisName',
          fixed: 'right',
          width: 300
        },
        {
          title: 'Remarks',
          dataIndex: 'Remarks',
          key: 'Remarks',
          fixed: 'right',
          width: 300
        },
        
      ];
      const { pagination, handleTableChange } = useSetTablePagination(filterFormattedList);
  return (
    <div>
        {
            loadingGetDoctorDiagnosis || loading ? (
              <Loading />
            ) : (
              <Table columns={columns} 
              rowKey={'SystemId'}
              dataSource={filterFormattedList} 
              rowSelection={rowSelection}
              scroll={{ x: 'max-content' }}
              bordered size='middle'
              pagination={{
                ...pagination,
                total: filterFormattedList?.length,
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

export default DoctorDiagnosisTable

// props validation

DoctorDiagnosisTable.propTypes = {
    rowSelection: PropTypes.object.isRequired,
    filterFormattedList: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    loadingGetDoctorDiagnosis: PropTypes.bool.isRequired,
    showModal: PropTypes.func.isRequired
}
