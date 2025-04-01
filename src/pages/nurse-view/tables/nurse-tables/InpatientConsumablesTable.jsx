import { Table, Typography } from "antd";
import PropTypes from "prop-types";
import { useState } from "react";

const InpatientConsumablesTable = ({ consumables, loadingGetPgOpenPatientConsumables }) => {


    const columns = [
        {
            title: 'Adm No',
            dataIndex: 'Admission_No',
            key: 'Admission_No',
            fixed: 'left',
            width: 100
        },
        {
            title: 'Drug Name',
            dataIndex: 'DrugName',
            key: 'DrugName',
            render: (_, record) => {
                return <Typography.Text style={{ color: '#0f5689' }}>
                    {record.DrugName}
                </Typography.Text>
            }
        },
      
        {
            title: 'Drug No',
            dataIndex: 'DrugNo',
            key: 'DrugNo',
        },
        {
            title: 'Issued Quantity',
            dataIndex: 'Quantity',
            key: 'Quantity',
        },
        {
            title: 'Remaining Quantity',
            dataIndex: 'RemainingQuantity',
            key: 'RemainingQuantity',
        },
        {
            title: 'Remarks',
            dataIndex: 'Remarks',
            key: 'Remarks',
            fixed: 'right',
            width: 200,
            render: (text) => 
                text.length > 50 ? `${text.substring(0, 47)}...` : text,

        },
    ];

    const [pagination, setPagination] = useState({
            current: 1,
            pageSize: 10,
            total: consumables?.length,
        });
              
        const handleTableChange = (newPagination) => {
            setPagination(newPagination); // Update pagination settings
        };

  return (
    
          
    <Table 
    rowKey="SystemId"
    scroll={{ x: 'max-content' }}
    columns={columns} 
    dataSource={consumables} 
    className="admit-patient-table"
    bordered size='middle' 
    loading={loadingGetPgOpenPatientConsumables}
    pagination={{
    ...pagination,
    total: consumables?.length,
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

export default InpatientConsumablesTable
//props validation
InpatientConsumablesTable.propTypes = {
    consumables: PropTypes.array.isRequired,
    loadingGetPgOpenPatientConsumables: PropTypes.bool.isRequired,
}