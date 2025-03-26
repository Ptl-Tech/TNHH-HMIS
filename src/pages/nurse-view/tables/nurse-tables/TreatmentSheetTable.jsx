import { Table, Tag } from "antd";
import PropTypes from "prop-types";
import { useState } from "react";

const TreatmentSheetTable = ({ loadingTreatmentSheet, treatmentSheet }) => {
  const columns = [
    {
      title: "Admission No",
      dataIndex: "AdmissionNo",
      key: "AdmissionNo",
      fixed: "left",
      width: 150,
    },
    {
      title: "Drug Number",
      dataIndex: "DrugNo",
      key: "DrugNo",
    },
    {
      title: "Drug Name",
      dataIndex: "DrugName",
      key: "DrugName",
    },
    {
      title: "Issued Quantity",
      dataIndex: "Quantity",
      key: "Quantity",
    },
    {
      title: "Dosage",
      dataIndex: "Dosage",
      key: "Dosage",
    },
    {
      title: "Issued Date",
      dataIndex: "IssuedDate",
      key: "IssuedDate",
    },
    {
      title: "Issued Time",
      dataIndex: "IssuedTime",
      key: "IssuedTime",
    },
    {
      title: "Remarks",
      dataIndex: "Remarks",
      key: "Remarks",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      fixed: "right",
      width: 100,
      render: (_, record) => {
        return record.Issued ? (
          <Tag color="green">Issued</Tag>
        ) : (
          <Tag color="red">Not Issued</Tag>
        );
      }
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
        rowKey={(record) => record.IssuedTime}
        bordered
        size="middle"
        scroll={{ x: 1500 }}
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
  );
};

export default TreatmentSheetTable;

//props types validations
TreatmentSheetTable.propTypes = {
  loadingTreatmentSheet: PropTypes.bool,
  treatmentSheet: PropTypes.array,
};
