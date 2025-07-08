import { Table, Typography, Tag, Divider, Tooltip, Space, Alert } from "antd";
import PropTypes from "prop-types";
import moment from "moment";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import InpatientCardInfo from "../../InpatientCardInfo";

const { Text } = Typography;

const timeSlots = [
  "Morning (6 AM - 12 PM)",
  "Afternoon (12 PM - 6 PM)",
  "Evening (6 PM - 12 AM)",
  "Night (12 AM - 6 AM)",
];

const frequencyOptions = [
  { value: 1, label: "STAT" },
  { value: 2, label: "As Needed" },
  { value: 3, label: "Twice a Day" },
  { value: 4, label: "Three Times a Day" },
  { value: 5, label: "Once a Day" },
  { value: 6, label: "Four Times a Day" },
  { value: 8, label: "HOURLY" },
  { value: 9, label: "At Night" },
];

const frequencyLegend = Object.fromEntries(
  frequencyOptions.map((f) => [f.label.toLowerCase(), f.label])
);

const getTimeSlot = (time) => {
  const [hour, minute] = time.split(":").map(Number);
  const totalMinutes = hour * 60 + minute;
  if (totalMinutes >= 360 && totalMinutes < 720) return timeSlots[0];
  if (totalMinutes >= 720 && totalMinutes < 1080) return timeSlots[1];
  if (totalMinutes >= 1080 && totalMinutes < 1440) return timeSlots[2];
  return timeSlots[3];
};

const normalizeFrequency = (value) => {
  const match = frequencyOptions.find(
    (opt) =>
      opt.value === Number(value) ||
      opt.label.toLowerCase() === String(value).toLowerCase()
  );
  return match?.label || String(value);
};

const TreatmentSheetTable = ({ loadingTreatmentSheet, treatmentSheet,patientDetails }) => {
  const location = useLocation();
  const admissionNo = new URLSearchParams(location.search).get("AdmNo");
  const dispatch = useDispatch();

const [data, setData] = useState(() => {
  const rows = [];

  treatmentSheet.forEach((entry) => {
    const issuedDate = moment(entry.IssuedDate).format("YYYY-MM-DD");
    const weekday = moment(entry.IssuedDate).format("dddd");
    const slot = getTimeSlot(entry.IssuedTime);
    const mapKey = `${weekday}||${slot}`;
    const rowKey = `${entry.AdmissionNo}-${entry.DrugNo}-${issuedDate}`;

    let row = rows.find((r) => r.key === rowKey);
    if (!row) {
      row = {
        key: rowKey,
        AdmissionNo: entry.AdmissionNo,
        DrugNo: entry.DrugNo,
        DrugName: entry.DrugName,
        Dosage: normalizeFrequency(entry.Dosage),
        IssuedDate: issuedDate,
        issuedDateRaw: entry.IssuedDate, // Keep raw date for sorting
        issuedTime: entry.IssuedTime,
      };
      rows.push(row);
    }

    if (!row[mapKey]) {
      row[mapKey] = [];
    }

    row[mapKey].push({
      issued: entry.Issued,
      issuedDate: entry.IssuedDate,
      issuedTime: entry.IssuedTime,
      quantity: entry.Quantity,
      remark: entry.Remarks,
    });
  });

  //  Sort rows by date descending (latest at top)
  rows.sort((a, b) => moment(b.issuedDateRaw).diff(moment(a.issuedDateRaw)));

  return rows;
});


  const weekStart = moment().startOf("week");
  const weekDates = Array.from({ length: 7 }).map((_, i) =>
    weekStart.clone().add(i, "days")
  );

  const uniqueDates = [
    ...new Set(
      treatmentSheet.map((item) => moment(item.IssuedDate).format("YYYY-MM-DD"))
    ),
  ];
  const baseColumns = [
    {
      title: "#",
      dataIndex: "index",
      width: 50,
      render: (_, __, index) => <Text>{index + 1}.</Text>,
      fixed: "left",
    },
    {
      title: "Drug Name",
      dataIndex: "DrugName",
      fixed: "left",
      width: 180,
      render: (text) => (
        <Text ellipsis style={{ color: "#0f5689" }}>
          {text}
        </Text>
      ),
    },
{
  title: "Issued Date",
  dataIndex: "IssuedDate",
        fixed: "left",

  width: 120,
  render: (dateStr) => <Text>{moment(dateStr).format("DD/MM/YYYY")}</Text>,
},


    {
      title: "Dosage",
      dataIndex: "Dosage",
      width: 140,
      render: (text) => (
        <Tooltip title={frequencyLegend[text.toLowerCase()] || ""}>
          <Tag>{text}</Tag>
        </Tooltip>
      ),
    },
  ];
const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const dynamicCols = daysOfWeek.map((day) => ({
  title: day,
  children: timeSlots.map((slot) => {
    const key = `${day}||${slot}`;
    return {
      title: slot,
      key,
      dataIndex: key,
      width: 120,
      render: (_, record) => {
        const entries = record[key] || [];
        if (entries.length === 0) return <Text>-</Text>;

        const issuedEntries = entries.filter((e) => e.issued);
        if (issuedEntries.length === 0) return <Text>-</Text>;

        const issuedTime = issuedEntries
          .map((e) => moment(e.issuedTime, "HH:mm:ss").format("HH:mm"))
          .join(", ");
        const quantity = issuedEntries.reduce((sum, e) => sum + (e.quantity || 0), 0);
        const remark = issuedEntries[0].remark || "-";

        return (
          <Space direction="vertical" size={0}>
            <Tooltip title={`Issued at: ${issuedTime} \nQuantity: ${quantity}\nRemark: ${remark}`}>
              <Text style={{ color: "green", fontWeight: "bold", fontSize: 16 }}> ✔</Text>
            </Tooltip>
            
          </Space>
        );
      },
    };
  }),
}));


  const expandedRowRender = (record) => {
    const rows = [];

    for (const [key, val] of Object.entries(record)) {
      if(key.startsWith("Monday") || key.startsWith("Tuesday") || key.startsWith("Wednesday") ||
         key.startsWith("Thursday") || key.startsWith("Friday") || key.startsWith("Saturday") || key.startsWith("Sunday")) {
        const entries = val || [];
        entries.forEach((entry) => {
          rows.push({
            date: moment(entry.issuedDate).format("DD/MM/YYYY"),
            //FOR TIME SLOT GET DAY OF WEEK
           DayOfWeek: moment(entry.issuedDate).format("dddd"),
            timeSlot: getTimeSlot(entry.issuedTime),
            //add pm or am to time and 12 hour
            time:moment(entry.issuedTime, "HH:mm:ss").format("hh:mm A"),
            quantity: entry.quantity,
            remark: entry.remark || "-",
          });
        });
      }
    }

    return (
      <Table
        size="small"
        columns={[
          { title: "Date", dataIndex: "date", key: "date" },
          { title: "Day of Week", dataIndex: "DayOfWeek", key: "DayOfWeek" },
        //  { title: "Time Slot", dataIndex: "timeSlot", key: "timeSlot" },
          { title: "Time", dataIndex: "time", key: "time" },
          { title: "Quantity", dataIndex: "quantity", key: "quantity" },
          { title: "Remark", dataIndex: "remark", key: "remark" },
        ]}
        dataSource={rows}
        pagination={false}
        rowKey={(row, idx) => idx}
      />
    );
  };

  return (
    <div style={{ padding: 20 }}>
              <InpatientCardInfo patientDetails={patientDetails} />

      <Divider />
      {/* instructions on how to use the table in info card */}
      <Alert
  message="How to Use the Treatment Sheet Table"
  description={
    <>
      <ul style={{ paddingLeft: 20 }}>
        <li>
          The table summarizes medication issued per patient per day.
        </li>
        <li>
          Columns are grouped by <strong>day of the week</strong> and <strong>time slots</strong> (Morning, Afternoon, Evening, Night).
        </li>
        <li>
          A <strong>✔ icon</strong> means medication was issued at that time. Hover to see time, quantity, and any remarks.
        </li>
        <li>
          Click on a row to expand and view detailed logs — including exact date, time, and notes.
        </li>
      </ul>
    </>
  }
  type="info"
  showIcon
  style={{ marginBottom: 16 }}
/>
      <Table
        bordered
        rowKey="key"
        size="small"
        loading={loadingTreatmentSheet}
        dataSource={data}
        columns={[...baseColumns, ...dynamicCols]}
        scroll={{ x: 1200 }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50", "100"],
          position: ["bottomRight"],
        }}
        sticky
        expandable={{ expandedRowRender }}
      />
    </div>
  );
};

TreatmentSheetTable.propTypes = {
  loadingTreatmentSheet: PropTypes.bool,
  treatmentSheet: PropTypes.array,
};

export default TreatmentSheetTable;
