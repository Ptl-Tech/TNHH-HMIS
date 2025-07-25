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

const PAGE_SIZE = 5;

const NursingNotesTable = ({
  loadingGetNurseAdmissionNotes,
  getNurseNotes,
  open,
  onClose,
}) => {
  const [initLoading, setInitLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [list, setList] = useState([]);
  const [sortedNotes, setSortedNotes] = useState([]);

  const renderNotes = (notes) => {
    if (!notes) return null;
    const plainText = DOMPurify.sanitize(notes).replace(/<\/?[^>]+(>|$)/g, "");
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

  const fetchData = (currentPage, source = sortedNotes) => {
    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const sliced = source.slice(start, end);
    return new Promise((resolve) =>
      setTimeout(() => resolve(sliced), 500)
    );
  };

  useEffect(() => {
    if (!getNurseNotes?.length) return;

    const sorted = [...getNurseNotes].sort((a, b) => {
      const dateA = moment(`${a.NotesDate} ${a.NotesTime || "00:00"}`, "YYYY-MM-DD HH:mm");
      const dateB = moment(`${b.NotesDate} ${b.NotesTime || "00:00"}`, "YYYY-MM-DD HH:mm");
      return dateA - dateB;
    });

    setSortedNotes(sorted);
    fetchData(1, sorted).then((res) => {
      setInitLoading(false);
      setData(res);
      setList(res);
    });
  }, [getNurseNotes]);

  const onLoadMore = () => {
    setLoading(true);
    const nextPage = page + 1;
    setPage(nextPage);

    setList(data.concat(Array.from({ length: PAGE_SIZE }).map(() => ({ loading: true }))));

    fetchData(nextPage).then((res) => {
      const newData = data.concat(res);
      setData(newData);
      setList(newData);
      setLoading(false);
      window.dispatchEvent(new Event("resize"));
    });
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "NotesDate",
      key: "date",
      render: (text, record) =>
        record.loading ? (
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
        record.loading ? (
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
        record.loading ? (
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
        record.loading ? (
          <Skeleton.Input active size="small" style={{ width: 100 }} />
        ) : (
          <Typography.Text italic style={{ color: "#666" }}>
            {record.NurseID}
          </Typography.Text>
        ),
      width: 150,
    },
  ];

  const loadMore =
    !initLoading && !loading && data.length < sortedNotes.length ? (
      <div
        style={{
          textAlign: "center",
          marginTop: 16,
          height: 32,
          lineHeight: "32px",
        }}
      >
        <Button onClick={onLoadMore}>Load More</Button>
      </div>
    ) : null;

  return (
    <div style={{ paddingTop: "30px" }}>
      <Drawer
        title="Nursing Notes"
        placement="right"
        onClose={onClose}
        open={open}
        width={1400}
        extra={
          <Button onClick={onClose} icon={<CloseOutlined />} danger>
            Close
          </Button>
        }
      >
        <Table
          dataSource={list}
          columns={columns}
          rowKey={(record, idx) => record.SystemId || idx}
          pagination={false}
          loading={loadingGetNurseAdmissionNotes}
        />
        {loadMore}
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
