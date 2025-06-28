// TreatmentSheetTable.jsx
import {
  Table,
  Typography,
  Tag,
  Divider,
  Space,
  Tooltip,
  Input,
  message,
  TimePicker,
  Switch,
} from "antd";
import { EditOutlined, SaveOutlined, CloseOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import moment from "moment";
import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  getTreatmentSheetLineSlice,
  postTreatmentSheetLineSlice,
  POST_TREATMENT_SHEET_LINE_FAILURE,
  POST_TREATMENT_SHEET_LINE_SUCCESS,
} from "../../../../actions/Doc-actions/QyPrescriptionLinesSlice";
import { useLocation } from "react-router-dom";

const { Title, Text } = Typography;

const timeSlots = [
  "06:00 - 11:59",
  "12:00 - 17:59",
  "18:00 - 23:59",
  "00:00 - 05:59",
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
  if (totalMinutes >= 360 && totalMinutes < 720) return "06:00 - 11:59"; // Morning
  if (totalMinutes >= 720 && totalMinutes < 1080) return "12:00 - 17:59"; // Afternoon
  if (totalMinutes >= 1080 && totalMinutes < 1440) return "18:00 - 23:59"; // Evening
  return "00:00 - 05:59"; // Early Morning
};

const normalizeFrequency = (value) => {
  const match = frequencyOptions.find(
    (opt) =>
      opt.value === Number(value) ||
      opt.label.toLowerCase() === String(value).toLowerCase()
  );
  return match?.label || String(value);
};

const TreatmentSheetTable = ({ loadingTreatmentSheet, treatmentSheet }) => {
  const location = useLocation();
  const admissionNo = new URLSearchParams(location.search).get("AdmNo");
  const dispatch = useDispatch();

  const [data, setData] = useState(() => {
    const map = {};
    treatmentSheet.forEach((entry) => {
      const dateKey = moment(entry.IssuedDate).format("YYYY-MM-DD");
      const slot = getTimeSlot(entry.IssuedTime);
      const rowKey = `${entry.AdmissionNo}-${entry.DrugNo}-${entry.Dosage}`;

      if (!map[rowKey]) {
        map[rowKey] = {
          key: rowKey,
          AdmissionNo: entry.AdmissionNo,
          DrugNo: entry.DrugNo,
          DrugName: entry.DrugName,
          Dosage: normalizeFrequency(entry.Dosage),
          editable: false,
        };
      }

      map[rowKey][`${dateKey}-${slot}`] = {
        issued: entry.Issued,
        time: moment(entry.IssuedTime, "HH:mm:ss").format("HH:mm"),
        remark: entry.Remarks,
        quantity: entry.Quantity,
        SystemId: entry.SystemId || null,
      };
    });
    return Object.values(map);
  });

  const uniqueDates = [
    ...new Set(
      treatmentSheet.map((item) => moment(item.IssuedDate).format("YYYY-MM-DD"))
    ),
  ];

  const handleSave = async (record) => {
    const updates = [];
    for (const [key, val] of Object.entries(record)) {
      if (key.includes("-") && val?.modified) {
        const lastDash = key.lastIndexOf("-");
        const date = key.substring(0, lastDash);
        const issuedDate = moment(date, "YYYY-MM-DD");
        if (!issuedDate.isValid()) continue;

        updates.push({
          myAction: val.SystemId ? "edit" : "create",
          admissionNo: record.AdmissionNo,
          recId: val.SystemId || "",
          drugNo: record.DrugNo,
          dosage: record.Dosage,
          quantity: parseInt(val.quantity, 10) || 0,
          issued: val.issued,
          remarks: val.remark,
          issuedDate: issuedDate.format("YYYY-MM-DD"),
          issuedTime: val.time + ":00",
        });
      }
    }

    for (const entry of updates) {
      const res = await dispatch(postTreatmentSheetLineSlice(entry));
      if (res.type === POST_TREATMENT_SHEET_LINE_FAILURE) {
        return message.error(res.payload.msg || "Save failed.");
      } else if (res.type === POST_TREATMENT_SHEET_LINE_SUCCESS) {
        dispatch(getTreatmentSheetLineSlice(admissionNo));
        setData((prev) =>
          prev.map((r) =>
            r.key === record.key ? { ...r, editable: false } : r
          )
        );
        return message.success(
          res.payload.msg || "Treatment sheet line saved successfully."
        );
      }
    }
  };

  const baseColumns = [
    //index numbering column
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
      width: 200,
      render: (text) => (
        <Text ellipsis style={{ color: "#0f5689", fontWeight: "semibold" }}>
          {text}
        </Text>
      ),
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
    {
      title: "Actions",
      width: 100,
      dataIndex: "actions",
            fixed: "left",

      render: (_, r) => (
        <Space>
          {r.editable ? (
            <>
              <Tooltip title="Save Changes">
                <SaveOutlined
                  onClick={() => handleSave(r)}
                  style={{
                    color: "green",
                    cursor: "pointer",
                    fontSize: 16,
                    fontWeight: "bold",
                  }}
                />
              </Tooltip>
              <Tooltip title="Cancel Edit">
                <CloseOutlined
                  onClick={() =>
                    setData((prev) =>
                      prev.map((x) =>
                        x.key === r.key ? { ...x, editable: false } : x
                      )
                    )
                  }
                  style={{
                    color: "red",
                    cursor: "pointer",
                    fontSize: 16,
                    fontWeight: "bold",
                  }}
                />
              </Tooltip>
            </>
          ) : (
            <Tooltip title="Edit Row">
              <EditOutlined
                onClick={() =>
                  setData((prev) =>
                    prev.map((x) =>
                      x.key === r.key ? { ...x, editable: true } : x
                    )
                  )
                }
                style={{
                  color: "blue",
                  cursor: "pointer",
                  fontSize: 16,
                  fontWeight: "bold",
                }}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  const dynamicCols = uniqueDates.map((date) => ({
    title: moment(date).format("DD/MM/YYYY"),
    children: timeSlots.map((slot) => ({
      title: slot,
      key: `${date}-${slot}`,
      dataIndex: `${date}-${slot}`,
      width: 220,
      render: (_, r) => {
        const cell = r[`${date}-${slot}`] || {};
        const issued = cell.issued ?? false;
        const time = cell.time || "--:--";
        const remark = cell.remark || "";
        const quantity = cell.quantity || "";

        return r.editable ? (
          <Tooltip title={`Qty: ${quantity}\nRemarks: ${remark || "None"}`}>
            <Space direction="vertical">
              <Switch
                size="small"
                checked={issued}
                onChange={(val) => {
                  const updated = [...data];
                  const row = updated.find((x) => x.key === r.key);
                  row[`${date}-${slot}`] = {
                    ...cell,
                    issued: val,
                    modified: true,
                    SystemId: cell.SystemId,
                  };
                  setData(updated);
                }}
              />
              <TimePicker
                size="small"
                format="HH:mm"
                value={time !== "--:--" ? moment(time, "HH:mm") : null}
                onChange={(val) => {
                  const updated = [...data];
                  const row = updated.find((x) => x.key === r.key);
                  row[`${date}-${slot}`] = {
                    ...cell,
                    time: val.format("HH:mm"),
                    modified: true,
                    SystemId: cell.SystemId,
                  };
                  setData(updated);
                }}
              />
              <Input
                size="small"
                placeholder="Qty"
                value={quantity}
                onChange={(e) => {
                  const updated = [...data];
                  const row = updated.find((x) => x.key === r.key);
                  row[`${date}-${slot}`] = {
                    ...cell,
                    quantity: e.target.value,
                    modified: true,
                    SystemId: cell.SystemId,
                  };
                  setData(updated);
                }}
              />
              <Input.TextArea
                size="small"
                placeholder="Remark"
                rows={1}
                value={remark}
                onChange={(e) => {
                  const updated = [...data];
                  const row = updated.find((x) => x.key === r.key);
                  row[`${date}-${slot}`] = {
                    ...cell,
                    remark: e.target.value,
                    modified: true,
                    SystemId: cell.SystemId,
                  };
                  setData(updated);
                }}
              />
            </Space>
          </Tooltip>
        ) : (
          <Tooltip
            title={`Qty Issued: ${quantity}\nRemarks: ${remark || "None"}`}
          >
            <Space direction="vertical">
              <Text style={{ color: issued ? "green" : "red" }}>
                {issued ? "\u2713 Issued" : "\u2717 Not Issued"}
              </Text>
              <Text>{time}</Text>
              {quantity && <Text strong>Qty Issued: {quantity}</Text>}
              {remark && (
                <Text type="secondary" style={{ fontSize: 10 }}>
                  {remark}
                </Text>
              )}
            </Space>
          </Tooltip>
        );
      },
    })),
  }));

  return (
 <div style={{ padding: 20 }}>
  <Divider orientation="left">
    Frequency Legend
  </Divider>
  <p style={{ fontSize: 12, color: "#888", marginTop: -16, marginBottom: 16 }}>
    STAT: Immediately, As Needed: When required, Twice a Day: 12-hourly,
    Three Times a Day: 8-hourly, Once a Day: Daily, Four Times a Day: 6-hourly,
    HOURLY: Every hour, At Night: Nightly
  </p>
  {frequencyOptions.map((f) => (
    <Tag key={f.value} color="cyan">
      {f.label}
    </Tag>
  ))}
  <Divider />
      <Table
        bordered
        rowKey="key"
        loading={loadingTreatmentSheet}
        dataSource={data}
        columns={[...baseColumns, ...dynamicCols]}
        scroll={{ x: "max-content" }}
        pagination={false}
        sticky
      />
    </div>
  );
};

TreatmentSheetTable.propTypes = {
  loadingTreatmentSheet: PropTypes.bool,
  treatmentSheet: PropTypes.array,
};

export default TreatmentSheetTable;
