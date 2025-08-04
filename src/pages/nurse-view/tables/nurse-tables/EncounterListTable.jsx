import { Button, Table } from "antd";
import { FilePdfOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import useAuth from "../../../../hooks/useAuth";

const EncounterListTable = ({ filteredList, loadingConsultationRoomList }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userRole = user.role;

  const columns = [
    {
      title: "Encounter Date",
      dataIndex: "TreatmentDate",
      key: "TreatmentDate",
      fixed: "left",
      width: 150,
    },
    {
      title: "Treatment Number",
      dataIndex: "TreatmentNo",
      key: "TreatmentNo",
    },
    {
      title: "Primary Doctor",
      dataIndex: "DoctorsName",
      key: "DoctorsName",
    },
    {
      title: "Patient Type",
      dataIndex: "TreatmentType",
      key: "TreatmentType",
    },
    {
      title: "Clinic",
      dataIndex: "Clinic",
      key: "Clinic",
    },
    {
      title: "Action",
      dataIndex: "PrintOut",
      key: "PrintOut",
      fixed: "right",
      width: 100,
      render: (_, record) => (
        <Button
          icon={<FilePdfOutlined />}
          onClick={() => handleOnClick(record)}
        >
          Encounter Summary
        </Button>
      ),
    },
  ];

  const handleOnClick = (record) => {
    navigate(
      `/Dashboard/Past-doctor-visit/Encounter?TreatmentNo=${record?.TreatmentNo}`,
      {
        state: { patientDetails: record },
      }
    );
  };

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: filteredList?.length,
  });

  const handleTableChange = (newPagination) => {
    setPagination(newPagination); // Update pagination settings
  };
  return (
    <div>
      <Table
        style={{ marginTop: "30px" }}
        rowKey={"TreatmentDate"}
        columns={columns}
        bordered
        dataSource={filteredList}
        loading={loadingConsultationRoomList}
        pagination={{
          ...pagination,
          total: filteredList?.length,
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

export default EncounterListTable;
// props validation
EncounterListTable.propTypes = {
  filteredList: PropTypes.array,
  rowSelection: PropTypes.object,
  loadingConsultationRoomList: PropTypes.bool,
};
