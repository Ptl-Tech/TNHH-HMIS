import { Table } from "antd";
import PropTypes from "prop-types";
import useSetTablePagination from "../../../../hooks/useSetTablePagination";
import Loading from "../../../../partials/nurse-partials/Loading";
import DOMPurify from "dompurify";

const GeneralObservationsTable = ({
  ipGetProcedure,
  loadingGetIpProcedure,
}) => {
  const renderNotes = (notes) => {
    if (!notes) return null;
    // Sanitize and render HTML safely
    const sanitizedHtml = DOMPurify.sanitize(notes);
    return <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
  };
  const columns = [
    {
      title: "Patient Admission No",
      dataIndex: "AdmissionNo",
      key: "AdmissionNo",
    },
    {
      title: "Date",
      dataIndex: "ProcessDate",
      key: "ProcessDate",
      render: (text) => (
        <span>{text ? new Date(text).toLocaleDateString() : ""}</span>
      ),
    },
    {
      title: "Title",
      dataIndex: "Process",
      key: "Process",
    },
    {
      title: "Remarks",
      dataIndex: "Remarks",
      key: "ProcessTime",
      render: (text) => {
        return renderNotes(text);
      },
    },
  ];

  const { pagination, handleTableChange } =
    useSetTablePagination(ipGetProcedure);
  return (
    <div>
      {loadingGetIpProcedure ? (
        <Loading />
      ) : (
        <Table
          columns={columns}
          rowKey="SystemId"
          dataSource={ipGetProcedure}
          scroll={{ x: "max-content" }}
          bordered
          size="middle"
          pagination={{
            ...pagination,
            total: ipGetProcedure?.length,
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
    </div>
  );
};

export default GeneralObservationsTable;

//props validations

GeneralObservationsTable.propTypes = {
  showModal: PropTypes.func.isRequired,
  loadingGetIpProcedure: PropTypes.bool.isRequired,
  ipGetProcedure: PropTypes.array.isRequired,
};
