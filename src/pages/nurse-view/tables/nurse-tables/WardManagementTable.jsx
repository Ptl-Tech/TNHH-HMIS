import { Table, Tag } from "antd";
import PropTypes from "prop-types";
import Loading from "../../../../partials/nurse-partials/Loading";
import { useState } from "react";

const WardManagementTable = ({ rowSelection, filteredBeds, loadingBeds }) => {
   
    const columns = [
        {
            title: 'Bed Name',
            dataIndex: 'BedName',
            key: 'BedName',
        },
        {
            title: 'Bed Number',
            dataIndex: 'BedNo',
            key: 'BedNo',
        },
        {
            title: 'Room Number',
            dataIndex: 'Room_No',
            key: 'Room_No',
        },
        {
            title: 'Ward Number',
            dataIndex: 'WardNo',
            key: 'WardNo',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (_, text) => {
                console.log('text', text);
                if (text.Occupied == true) {
                  return <Tag color="#f50">Occupied</Tag>;
                } else if (text.Occupied == false) {
                  return <Tag color="#108ee9">Bed free</Tag>;
                }
                return text; 
              }          
            
        },
        
    ];

     const [pagination, setPagination] = useState({
            current: 1,
            pageSize: 10,
            total: filteredBeds?.length,
        });
              
        const handleTableChange = (newPagination) => {
            setPagination(newPagination); // Update pagination settings
        };

  return (
    <>
    {
        loadingBeds ? (
         <Loading />
        ):(
        <Table 
        rowKey={'BedNo'}
        columns={columns} 
        dataSource={filteredBeds} 
        rowSelection={rowSelection}
        bordered size='middle' 
              pagination={{
                ...pagination,
                total: filteredBeds?.length,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                onChange: (page, pageSize) => handleTableChange({ current: page, pageSize, total: pagination.total }),
                onShowSizeChange: (current, size) => handleTableChange({ current, pageSize: size, total: pagination.total }),
                style: {
                    marginTop: '30px',
                }
            }}
            onRow={(record) => ({
                onClick: () => {
                    const selectedRowKeys = rowSelection.selectedRowKeys || [];
                    const selectedKeyIndex = selectedRowKeys.indexOf(record.BedNo);
        
                    const newSelectedRowKeys =
                        selectedKeyIndex === -1
                            ? [...selectedRowKeys, record.BedNo]
                            : selectedRowKeys.filter((key) => key !== record.BedNo);
        
                    rowSelection.onChange(newSelectedRowKeys, newSelectedRowKeys.map((key) =>
                        filteredBeds.find((bed) => bed.BedNo === key)
                    ));
                },
            })}
        />
        )
    }       
    </>
  )
}

export default WardManagementTable

// props validation
WardManagementTable.propTypes = {
    rowSelection: PropTypes.array.isRequired,
    filteredBeds: PropTypes.array.isRequired,
    loadingBeds: PropTypes.bool.isRequired,
};

//props validation
WardManagementTable.propTypes = {
    rowSelection: PropTypes.array.isRequired,
    filteredBeds: PropTypes.array.isRequired,
    loadingBeds: PropTypes.bool.isRequired,
};