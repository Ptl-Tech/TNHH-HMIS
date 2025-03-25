import { Table } from "antd"
import PropTypes from "prop-types";
import { useState } from "react";

const TreatmentSheetTable = ({ loadingTreatmentSheet, treatmentSheet }) => {

    const columns = [
        {
            title: 'Drug Number',
            dataIndex: 'drugNumber',
            key: 'drugNumber',
        },
        {
          title: 'Drug Name',
          dataIndex: 'drugName',
          key: 'drugName',
        },
        {
          title: 'Date Prescribed',
          dataIndex: 'datePrescribed',
          key: 'datePrescribed'
        },
        {
          title: 'Prescribed By',
          dataIndex: 'prescribedBy',
          key: 'prescribedBy',
        },
        {
            title: 'Days Prescribed',
            dataIndex: 'daysPrescribed',
            key: 'daysPrescribed',
        },
        {
            title: 'Days Remaining',
            dataIndex: 'daysRemaining',
            key: 'daysRemaining',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        }
      ];

       const [pagination, setPagination] = useState({
          current: 1,
          pageSize: 10,
          total: treatmentSheet?.length,
        });
      
        const handleTableChange = (newPagination) => {
          setPagination(newPagination); // Update pagination settings
        };
  
  return (
    <div>
         <Table 
         
            columns={columns} 
            rowKey={(record, index) => record.Time + index}
            bordered
            size="middle"
            dataSource={treatmentSheet}
            loading={loadingTreatmentSheet} 
            className="admit-patient-table"
            pagination={{
              ...pagination,
              total: treatmentSheet?.length,
              showSizeChanger: true,
              showQuickJumper: true,
              position: ["bottom", "right"],
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} items`,
              onChange: (page, pageSize) =>
                handleTableChange({
                  current: page,
                  pageSize,
                  total: pagination.total,
                }),
              onShowSizeChange: (current, size) =>
                handleTableChange({
                  current,
                  pageSize: size,
                  total: pagination.total,
                }),
              style: {
                marginTop: "30px",
              },
            }}
            
         />
    </div>
  )
}

export default TreatmentSheetTable

//props types validations
TreatmentSheetTable.propTypes = {
    loadingTreatmentSheet: PropTypes.bool,
    treatmentSheet: PropTypes.array
}