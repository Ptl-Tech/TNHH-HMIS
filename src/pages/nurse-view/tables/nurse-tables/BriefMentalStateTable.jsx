import { Table } from "antd";
import PropTypes from "prop-types";
import { useState } from "react";

const BriefMentalStateTable = ({ loadingBriefMSE, briefMSEForm }) => {
  const columns = [
    {
      title: "Date",
      dataIndex: "Date",
      key: "Date",
    },
    {
      title: "Patient No",
      dataIndex: "Patient_No",
      key: "Patient_No",
    },
    {
      title: "Category",
      dataIndex: "Category",
      key: "Category",
    },
    {
      title: "Descriptor",
      dataIndex: "Descriptor",
      key: "Descriptor",
    },

    {
      title: "Comments",
      dataIndex: "Comments",
      key: "Comments",
    },
  ];

   const [pagination, setPagination] = useState({
      current: 1,
      pageSize: 10,
      total: briefMSEForm?.length,
    });
  
    const handleTableChange = (newPagination) => {
      setPagination(newPagination); // Update pagination settings
    };

  return (
    <div style={{ paddingTop: "30px" }}>
      <Table
        columns={columns}
        loading={loadingBriefMSE}
        dataSource={briefMSEForm}
        rowKey={(record) => Math.random() + record.Patient_No}
        bordered
        size="middle"
        pagination={{
          ...pagination,
          total: briefMSEForm?.length,
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
  );
};

export default BriefMentalStateTable;
// props validation
BriefMentalStateTable.propTypes = {
  loadingBriefMSE: PropTypes.bool,
  briefMSEForm: PropTypes.array,
};
