import { Button, Space, Table } from 'antd'
import PropTypes from 'prop-types';
import useSetTablePagination from '../../../../hooks/useSetTablePagination';
import Loading from '../../../../partials/nurse-partials/Loading';
import { FolderViewOutlined } from '@ant-design/icons';

const GeneralObservationsTable = ({ showModal, ipGetProcedure, loadingGetIpProcedure }) => {
    const columns = [
        {
          title: 'Process Code',
          dataIndex: 'ProcessCode',
          key: 'ProcessCode',
          fixed: 'left',
          width: 100,
        },
        {
          title: 'Process Description',
          dataIndex: 'Process',
          key: 'Process',
        },
        {
            title: 'Date',
            dataIndex: 'ProcessDate',
            key: 'ProcessDate',
            render: (text) => <span>{text ? new Date(text).toLocaleDateString() : ''}</span>
        },
        {
          title: 'Remarks',
          dataIndex: 'Remarks',
          key: 'Remarks',
        },
        {
          title: 'Action',
          key: 'action',
          fixed: 'right',
          width: 100,
          render: (_, record) => (
            <Space size="middle">
              <Button type="primary" onClick={() => showModal(record)}><FolderViewOutlined /> View</Button>
            </Space>
          ),
        },
      ];
      
      const { pagination, handleTableChange } = useSetTablePagination(ipGetProcedure);
  return (
    <div style={{ paddingTop: '30px' }}>
      {
        loadingGetIpProcedure ? (
          <Loading />
        ) : (
        <Table columns={columns} 
         rowKey='SystemId'
         dataSource={ipGetProcedure} 
         scroll={{ x: 'max-content' }}
         bordered size='middle' 
          pagination={{
          ...pagination,
          total: ipGetProcedure?.length,
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

export default GeneralObservationsTable

//props validations

GeneralObservationsTable.propTypes = {
    showModal: PropTypes.func.isRequired,
    loadingGetIpProcedure: PropTypes.bool.isRequired,
    ipGetProcedure: PropTypes.array.isRequired
  };