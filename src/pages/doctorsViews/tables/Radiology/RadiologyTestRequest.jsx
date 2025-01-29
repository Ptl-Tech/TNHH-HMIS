import {
  Typography,
  Table,
  Input,
  Button,
  Space,
  Upload,
  message,
} from "antd";
import { FileTextOutlined, UploadOutlined } from "@ant-design/icons";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import SkeletonLoading from "../../../../partials/nurse-partials/Skeleton";
import { getRadiologyDetails } from "../../../../actions/Doc-actions/getRadiologyDetails";
import { forwardRadiologyResults, postRadiologyResults } from "../../../../actions/radiology-actions/radiologyActions";

const RadiologyTestRequest = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const radiologyNo = queryParams.get("radiologyNo");
  const status = queryParams.get("status");

  const { loading, data } = useSelector((state) => state.getRadiologyDetails);

  const [remarks, setRemarks] = useState({});
  const [attachments, setAttachments] = useState({});
  const [attachmentsBase64, setAttachmentsBase64] = useState({});

  useEffect(() => {
    dispatch(getRadiologyDetails(radiologyNo));
  }, [dispatch, radiologyNo]);

  const handleRemarkChange = (recordKey, value) => {
    setRemarks((prev) => ({ ...prev, [recordKey]: value }));
  };

  const handleAttachmentChange = (recordKey, file) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result.split(",")[1]; // Extract Base64 part
      setAttachments((prev) => ({ ...prev, [recordKey]: file }));
      setAttachmentsBase64((prev) => ({ ...prev, [recordKey]: base64String }));
      message.success("Attachment added successfully!");
    };
    reader.readAsDataURL(file); // Convert file to Base64
    return false; // Prevent auto-upload
  };

  const handleSubmit = (recordKey) => {
    const remark = remarks[recordKey];
    const attachmentBase64 = attachmentsBase64[recordKey];
    const record = data[recordKey]; // Retrieve the record by key

    const payload = {
      myAction: "edit",
      recId: record.SystemId,
      radiologyNo: record.Radiology_no,
      radiologyTypeCode: record.Radiology_Type_Code,
      remarks: remark,
      fileBase64: attachmentBase64 || "",
    };

    dispatch(postRadiologyResults(payload))
      .then((res) => {
        if (res.status === "failed") {
          message.error(`${error.message}`);
          return
        }
        if (res.status === "success") {
          message.success("Radiology result submitted successfully!");
        }

      })
      .catch((error) => {
        message.error(`Failed to submit radiology result: ${error.message}`);
      });
  };
  const forwardRequest = () => {
    const payload = {
      radiologyNo: radiologyNo,
    };

    dispatch(forwardRadiologyResults(payload))
      .then((res) => {
        if (res.status === "failed") {
          message.error(`${error.message}`);
          return
        }
        if (res.status === "success") {
          message.success("Radiology result Forwarded successfully!");
        }

      })
      .catch((error) => {
        message.error(`Failed to submit radiology result: ${error.message}`);
      });
  };

  const columns = status != 'Completed' ? [
    {
      title: "Radiology Number",
      dataIndex: "Radiology_no",
      key: "Radiology_no",
    },
    {
      title: "Radiology Type Code",
      dataIndex: "Radiology_Type_Code",
      key: "Radiology_Type_Code",
    },
    {
      title: "Radiology Type Name",
      dataIndex: "Radiology_Type_Name",
      key: "Radiology_Type_Name",
    },
    {
      title: "Performed Date",
      dataIndex: "Performed_Date",
      key: "Performed_Date",
      render: (_, record) =>
        record.Performed_Date === "0001-01-01" ? "N/A" : record.Performed_Date,
    },
    {
      title: "Remark",
      key: "remark",
      render: (_, record) => (
        <Input
          // defaultValue={record.Remarks}
          disabled={record.Completed == true}
          placeholder={`${record.Completed == true ? "" : "Add a remark"}`}
          value={record.Completed == true ? record.Remarks : remarks[record.key] || ""}
          onChange={(e) => handleRemarkChange(record.key, e.target.value)}
        />
      ),
    },
    {
      title: "Attachment",
      key: "attachment",
      render: (_, record) => (
        <Upload
          beforeUpload={(file) => handleAttachmentChange(record.key, file)}
          fileList={attachments[record.key] ? [attachments[record.key]] : []}
        >
          <Button disabled={record.Completed == true} icon={<UploadOutlined />}>Attach File</Button>
        </Upload>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => {
        const hasRemark = !!remarks[record.key];
        const hasAttachment = !!attachments[record.key];
        const isActionAvailable = hasRemark || hasAttachment;

        return (
          <Button
            type="primary"
            disabled={!isActionAvailable || record.Completed === true}
            onClick={() => handleSubmit(record.key)}
          >
            Done
          </Button>
        );
      },
    },
  ] : [
    {
      title: "Radiology Number",
      dataIndex: "Radiology_no",
      key: "Radiology_no",
    },
    {
      title: "Radiology Type Code",
      dataIndex: "Radiology_Type_Code",
      key: "Radiology_Type_Code",
    },
    {
      title: "Radiology Type Name",
      dataIndex: "Radiology_Type_Name",
      key: "Radiology_Type_Name",
    },
    {
      title: "Performed Date",
      dataIndex: "Performed_Date",
      key: "Performed_Date",
      render: (_, record) =>
        record.Performed_Date === "0001-01-01" ? "N/A" : record.Performed_Date,
    },
  ];

  return (
    <div>
      <Typography.Title
        level={5}
        style={{ color: "#0F5689", marginBottom: "12px" }}
      >
        <FileTextOutlined style={{ marginRight: "8px" }} />
        Radiology Request
      </Typography.Title>
      {loading ? (
        <SkeletonLoading />
      ) : (
        <Table
          columns={columns}
          dataSource={data.map((item, index) => ({
            ...item,
            key: index, // Add a unique key for each record
          }))}
          pagination={false}
        />
      )}
      {status != "Completed" && <div style={{ width: "full", display: "flex", justifyContent: "end", margin: "8px 0px" }}>
        <Button
          type="primary"
          disabled={status == "Completed" || data.find(e => e.Completed === false)}
          onClick={() => forwardRequest()}
        >
          Forward Request
        </Button>
      </div>
      }
    </div>
  );
};

export default RadiologyTestRequest;
