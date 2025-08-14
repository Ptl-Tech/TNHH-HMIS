import {
  Button,
  Drawer,
  Skeleton,
  Table,
  Typography,
} from "antd";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import moment from "moment";
import { CloseOutlined } from "@ant-design/icons";

const NursingNotesTable = ({
  loadingGetNurseAdmissionNotes,
  getNurseNotes,
  open,
  onClose,
}) => {
  const [initLoading, setInitLoading] = useState(true);
  const [sortedNotes, setSortedNotes] = useState([]);

const renderNotes = (notes) => {
  if (!notes) return null;

  const sanitized = DOMPurify.sanitize(notes);

  const plainText = sanitized
    .replace(/<\/?[^>]+(>|$)/g, "") 
    .replace(/&nbsp;/gi, " ")      
    .replace(/\s+/g, " ")         
    .trim();

  return plainText
    .split(/[\r\n]+|(?<=\.)\s+/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line, idx) => (
      <div key={idx}>
        {line.charAt(0).toUpperCase() + line.slice(1).toLowerCase()}
      </div>
    ));
};


  useEffect(() => {
    if (!getNurseNotes?.length) return;

    const sorted = [...getNurseNotes].sort((a, b) => {
      const dateA = moment(
        `${a.NotesDate} ${a.NotesTime || "00:00"}`,
        "YYYY-MM-DD HH:mm"
      );
      const dateB = moment(
        `${b.NotesDate} ${b.NotesTime || "00:00"}`,
        "YYYY-MM-DD HH:mm"
      );
      return dateA - dateB;
    });

    setSortedNotes(sorted);
    setInitLoading(false);
  }, [getNurseNotes]);

  const columns = [
    {
      title: "Date",
      dataIndex: "NotesDate",
      key: "date",
      render: (text, record) =>
        !record ? (
          <Skeleton.Input active size="small" style={{ width: 100 }} />
        ) : (
          moment(record.NotesDate).format("DD/MM/YYYY")
        ),
    },
    {
      title: "Time",
      dataIndex: "NotesTime",
      key: "time",
      render: (text, record) =>
        !record ? (
          <Skeleton.Input active size="small" style={{ width: 80 }} />
        ) : record.NotesTime ? (
          moment(`2023-01-01T${record.NotesTime}`).format("hh:mm:ss A")
        ) : (
          "--:--"
        ),
      width: 120,
    },
    {
      title: "Notes",
      dataIndex: "Notes",
      key: "notes",
      render: (text, record) =>
        !record ? (
          <Skeleton active paragraph={{ rows: 3 }} />
        ) : (
          renderNotes(record.Notes)
        ),
    },
    {
      title: "Added By",
      dataIndex: "NurseID",
      key: "nurse",
      render: (text, record) =>
        !record ? (
          <Skeleton.Input active size="small" style={{ width: 100 }} />
        ) : (
          <Typography.Text italic style={{ color: "#666" }}>
            {record.NurseID}
          </Typography.Text>
        ),
      width: 150,
    },
  ];


  return (
    <div style={{ paddingTop: "30px" }}>
      <Drawer
        title="Nursing Notes"
        placement="right"
        onClose={onClose}
        open={open}
        width={1000}
        extra={
          <Button onClick={onClose} icon={<CloseOutlined />} danger>
          </Button>
        }
      >
        <Table
        dataSource={sortedNotes}
          columns={columns}
          rowKey={(record, idx) => record.SystemId || idx}
          pagination={false}
        loading={loadingGetNurseAdmissionNotes}
        />
        
      </Drawer>
    </div>
  );
};

export default NursingNotesTable;

NursingNotesTable.propTypes = {
  loadingGetNurseAdmissionNotes: PropTypes.bool.isRequired,
  getNurseNotes: PropTypes.array.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
