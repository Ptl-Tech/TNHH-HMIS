import { Button, Modal, Table } from "antd";
import PropTypes from "prop-types";
import Loading from "../../../../partials/nurse-partials/Loading";
import { useState } from "react";
import DOMPurify from "dompurify";
import { FolderViewOutlined } from "@ant-design/icons";

const NursingNotesTable = ({
  loadingGetNurseAdmissionNotes,
  getNurseNotes,
}) => {
  const [selectedRecord, setSelectedRecord] = useState([]);
  const renderNotes = (notes) => {
    if (!notes) return null;
    // Sanitize and render HTML safely
    const sanitizedHtml = DOMPurify.sanitize(notes);
    return <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = (record) => {
    setIsModalOpen(true);
    setSelectedRecord(record);
    console.log("Selected Record", record);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const columns = [
    {
      title: "Notes Date",
      dataIndex: "NotesDate",
      key: "NotesDate",
    },
    {
      title: "Notes Time",
      dataIndex: "NotesTime",
      key: "NotesTime",
      render: (time) => {
        if (!time) return "-";

        const today = new Date();
        const dateString = `${today.toISOString().split("T")[0]}T${time}`;
        const date = new Date(dateString);

        if (isNaN(date.getTime())) return "Invalid Time";

        return date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
      },
      sorter: (a, b) => {
        const today = new Date();

        const getTimeValue = (time) => {
          if (!time) return 0;
          const dateString = `${today.toISOString().split("T")[0]}T${time}`;
          return new Date(dateString).getTime();
        };

        return getTimeValue(b.NotesTime) - getTimeValue(a.NotesTime); // Newest first
      },
    },

    {
      title: "Notes",
      dataIndex: "Notes",
      key: "Notes",
      render: (text) => {
        return renderNotes(text);
      },
    },
    {
      title: "Added By",
      dataIndex: "NurseID",
      key: "NurseID",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      fixed: "right",
      width: 100,
      render: (_, record) => (
        <Button style={{ color: "#0f5689" }} onClick={()=> showModal(record)}>
          <FolderViewOutlined /> View
        </Button>
      ),
    },
  ];

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: getNurseNotes?.length,
  });

  const handleTableChange = (newPagination) => {
    setPagination(newPagination); // Update pagination settings
  };

  return (
    <div style={{ paddingTop: "30px" }}>
      {loadingGetNurseAdmissionNotes ? (
        <Loading />
      ) : (
        <Table
          columns={columns}
          dataSource={getNurseNotes}
          rowKey="SystemId"
          scroll={{ x: "max-content" }}
          bordered
          size="middle"
          pagination={{
            ...pagination,
            total: getNurseNotes?.length,
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

      <Modal
        title="Read Notes"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={
          <Button onClick={handleCancel}>Cancel</Button>
        }
      >
        <div style={{ border: "1px solid gray", padding: "10px", borderRadius: "5px" }}>
          {renderNotes(selectedRecord?.Notes)}
        </div>
      </Modal>
    </div>
  );
};

export default NursingNotesTable;

//Prop validations

NursingNotesTable.propTypes = {
  loadingGetNurseAdmissionNotes: PropTypes.bool.isRequired,
  getNurseNotes: PropTypes.array.isRequired,
};
