import { Table, Typography } from "antd";
import Loading from "../../../../partials/nurse-partials/Loading";
import PropTypes from "prop-types";

const DischargeTable = ({
  formattedPatientDischargeList,
  pagination,
  loadingGetPatientDischargeList,
  loading,
  rowSelection,
  handleTableChange,
  searchAdmissionNumber,
  searchPatientNumber,
  searchName,
}) => {
  const columns = [
    {
      title: "Adm No",
      dataIndex: "AdmissionNo",
      key: "AdmissionNo",
      fixed: "left",
      width: 100,
      filteredValue: searchAdmissionNumber ? [searchAdmissionNumber] : null,
      onFilter: (value, record) =>
        record?.AdmissionNo
          ? record.AdmissionNo.toLowerCase().includes(value.toLowerCase())
          : false,
    },
    {
      title: "Patient No",
      dataIndex: "PatientNo",
      key: "PatientNo",
      filteredValue: searchPatientNumber ? [searchPatientNumber] : null,
      onFilter: (value, record) =>
        record?.PatientNo
          ? record.PatientNo.toLowerCase().includes(value.toLowerCase())
          : false,
    },
    {
      title: "Names",
      dataIndex: "Search_Names",
      key: "Search_Names",
      filteredValue: searchName ? [searchName] : null,
      onFilter: (value, record) =>
        record?.Search_Names
          ? record.Search_Names.toLowerCase().includes(value.toLowerCase())
          : false,
      render: (_, record) => {
        return (
          <Typography.Text style={{ color: "#b96000" }}>
            {record.Search_Names}
          </Typography.Text>
        );
      },
    },
    {
      title: "Adm Date",
      dataIndex: "DateofAdmission",
      key: "DateofAdmission",
    },
    {
        title: "Patient Type",
        dataIndex: "PatientType",
        key: "PatientType",
    },
    {
        title: "Ballance",
        dataIndex: "BillBalance",
        key: "BillBalance",
        render: (_, record) => {
          return (
            <Typography.Text style={{ color: "#b96000" }}>
              {`Ksh ${record?.BillBalance}`}
            </Typography.Text>
          );
        }
    },
    {
      title: "Ward",
      dataIndex: "WardNo",
      key: "WardNo",
    },
    {
      title: "Bed",
      dataIndex: "BedNo",
      key: "BedNo",
    },
  
    {
      title: "Doctor",
      dataIndex: "DoctorName",
      key: "DoctorName",
      render: (_, record) => {
        return (
          <Typography.Text style={{ color: "#b96000" }}>
            {record?.DoctorName || ""}
          </Typography.Text>
        );
      },
    },
    {
      title: "Remarks",
      dataIndex: "Remarks",
      key: "Remarks",
      fixed: "right",
      width: 150,
    },
  ];
  return (
    <>
      {loadingGetPatientDischargeList || loading ? (
        <Loading />
      ) : (
        <Table
          scroll={{ x: "max-content" }}
          rowKey="SystemId"
          style={{ zIndex: 0 }}
          rowSelection={rowSelection}
          loading={loadingGetPatientDischargeList || loading}
          columns={columns}
          dataSource={formattedPatientDischargeList}
          className="admit-patient-table"
          bordered
          size="middle"
          pagination={{
            ...pagination,
            total: formattedPatientDischargeList?.length,
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
      )}
    </>
  );
};

export default DischargeTable;

// props validation
DischargeTable.propTypes = {
  formattedPatientDischargeList: PropTypes.array.isRequired,
  pagination: PropTypes.object.isRequired,
  loadingGetPatientDischargeList: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  rowSelection: PropTypes.object.isRequired,
  handleTableChange: PropTypes.func.isRequired,
  searchAdmissionNumber: PropTypes.string.isRequired,
  searchPatientNumber: PropTypes.string.isRequired,
  searchName: PropTypes.string.isRequired,
};
