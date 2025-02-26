import { Button, Space, Table } from "antd"
import PropTypes from "prop-types";
import { FolderViewOutlined } from "@ant-design/icons";
import Loading from "../../../../partials/nurse-partials/Loading";
import useSetTablePagination from "../../../../hooks/useSetTablePagination";

const DiagnosisTable = ({ showModal, loadingGetInpatientInjection, injections }) => {
    const columns = [
        {
            title: 'Admission No',
            dataIndex: 'AdmissionNo',
            key: 'AdmissionNo',
            fixed: 'left',
            width: 100,
          },
          {
            title: 'Date',
            dataIndex: 'Date',
            key: 'Date',
          },
        {
          title: 'Injection Name',
          dataIndex: 'InjectionName',
          key: 'InjectionName',
        },{
          title: 'Time',
          dataIndex: 'Time',
          key: 'Time',
        },
        {
          title: 'Remarks',
          dataIndex: 'Remarks',
          key: 'Remarks',
          fixed: 'right',
          width: 150,
        },
      ];

      const { pagination, handleTableChange } = useSetTablePagination(injections);

  return (
    <div style={{ paddingTop: '30px' }}>
      {
        loadingGetInpatientInjection ? (
          <Loading />
        ): (
          <Table 
            rowKey='SystemId'
            scroll={{ x: 'max-content' }}
            columns={columns} 
            dataSource={injections} 
            bordered size='middle' 
                pagination={{
                ...pagination,
                total: injections?.length,
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

export default DiagnosisTable

//props types validations
DiagnosisTable.propTypes = {
    showModal: PropTypes.func.isRequired,
    loadingGetInpatientInjection: PropTypes.bool.isRequired,
    injections: PropTypes.array.isRequired,
}