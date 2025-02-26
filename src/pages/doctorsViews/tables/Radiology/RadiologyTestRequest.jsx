import {
  Typography,
  Table,
  Input,
  Button,
  Upload,
  message,
  Modal,
} from "antd";
import { FileTextOutlined, UploadOutlined, EditOutlined } from "@ant-design/icons";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import SkeletonLoading from "../../../../partials/nurse-partials/Skeleton";
import { getRadiologyDetails } from "../../../../actions/Doc-actions/getRadiologyDetails";
import { forwardRadiologyResults, postRadiologyResults } from "../../../../actions/radiology-actions/radiologyActions";
// import SkeletonLoading from "../../../../partials/nurse-partials/Skeleton";
// import { getRadiologyDetails } from "../../../../actions/Doc-actions/getRadiologyDetails";
// import { forwardRadiologyResults, postRadiologyResults } from "../../../../actions/radiology-actions/radiologyActions";

const RadiologyTestRequest = ({ rerender, setRerender, radiologyDetails }) => {
  const dispatch = useDispatch();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const radiologyNo = queryParams.get("radiologyNo");
  const status = queryParams.get("status");

  const { loading, data } = useSelector((state) => state.getRadiologyDetails);
  // const { loading: loadingRadiologyDetails, radiologyDetails } = useSelector((state) => state.getSingleRadiologyDetails);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [remarks, setRemarks] = useState({});
  const [attachments, setAttachments] = useState({});
  const [attachmentsBase64, setAttachmentsBase64] = useState({});

  useEffect(() => {
    dispatch(getRadiologyDetails(radiologyNo));
  }, [dispatch, radiologyNo, modalVisible, rerender]);

  // useEffect(() => {
  //   setRerender((prev) => !prev)
  // }, [dispatch, radiologyNo]);

  const openModal = (record) => {
    setSelectedRecord(record);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedRecord(null);
  };

  const handleRemarkChange = (value) => {
    setRemarks((prev) => ({ ...prev, [selectedRecord.key]: value }));
  };

  const handleAttachmentChange = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result.split(",")[1]; // Extract Base64 part
      setAttachments((prev) => ({ ...prev, [selectedRecord.key]: file }));
      setAttachmentsBase64((prev) => ({ ...prev, [selectedRecord.key]: base64String }));
      message.success("Attachment added successfully!");
    };
    reader.readAsDataURL(file); // Convert file to Base64
    return false; // Prevent auto-upload
  };

  const handleSubmit = () => {
    if (!selectedRecord) return;

    const remark = remarks[selectedRecord.key] || "";
    const attachmentBase64 = attachmentsBase64[selectedRecord.key] || "";

    const payload = {
      myAction: "edit",
      recId: selectedRecord.SystemId,
      radiologyNo: selectedRecord.Radiology_no,
      radiologyTypeCode: selectedRecord.Radiology_Type_Code,
      remarks: remark,
      fileBase64: attachmentBase64 || "",
    };
    

    dispatch(postRadiologyResults(payload))
      .then((res) => {
        if (res.status === "failed") {
          message.error(`Failed to submit: ${res.message}`);
          return;
        }
        if (res.status === "success") {
          message.success("Radiology result submitted successfully!");
          closeModal();
        }
      })
      .catch((error) => {
        message.error(`Failed to submit radiology result: ${error.message}`);
      });
  };

  const forwardRequest = () => {
    const payload = { radiologyNo };
    setRerender((prev) => !prev)

    dispatch(forwardRadiologyResults(payload))
      .then((res) => {
        if (res.status === "failed") {
          message.error(`Failed to forward: ${res.message}`);
          return;
        }
        if (res.status === "success") {
          message.success("Radiology result forwarded successfully!");
        }
      })
      .catch((error) => {
        message.error(`Failed to forward request: ${error.message}`);
      });
  };

  const columns = [
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
      title: "Result",
      key: "result",
      render: (_, record) => (
        <div>

          {record.Completed ? (<div style={{ display: "flex", columnGap: "20px", alignItems: "center", justifyItems: "center" }}><p>✅ Completed</p>
            {radiologyDetails?.Status === "New" && <Button type="primary" onClick={() => openModal(record)}>
              <EditOutlined /> <span>Edit</span>
            </Button>}
          </div>) : <Button type="primary" onClick={() => openModal(record)}>
            Open Results
          </Button>}
        </div>
      ),
    },
  ];

  return (
    <div>
      <Typography.Title
        level={5}
        style={{ color: "#0F5689", marginBottom: "12px" }}
      >
        <FileTextOutlined style={{ marginRight: "8px" }} />
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
            key: index,
          }))}
          pagination={false}
        />
      )}
      {radiologyDetails && radiologyDetails.Status === "New" && (
        <div style={{ display: "flex", justifyContent: "end", margin: "8px 0px" }}>
          <Button
            type="primary"
            disabled={radiologyDetails.Status != "New" || data.some((e) => !e.Completed)}
            onClick={forwardRequest}
          >
            Forward Request
          </Button>
        </div>
      )}

      {/* Modal for Result Submission */}
      <Modal
        title="Submit Radiology Result"
        visible={modalVisible}
        onCancel={closeModal}
        footer={[
          <Button key="cancel" onClick={closeModal}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleSubmit}
            disabled={!remarks[selectedRecord?.key] && !attachments[selectedRecord?.key]}
          >
            Submit
          </Button>,
        ]}
      >
        {selectedRecord && (
          <div>
            {console.log("selectedRecord", selectedRecord)}
            <Typography.Paragraph>Enter Remarks:</Typography.Paragraph>
            <Input.TextArea
              rows={3}
              defaultValue={selectedRecord.Remarks}
              placeholder="Add a remark"
              value={remarks[selectedRecord.key] || selectedRecord.Remarks}
              onChange={(e) => handleRemarkChange(e.target.value)}
            />

            <Typography.Paragraph style={{ marginTop: "12px" }}>
              Upload Attachment:
            </Typography.Paragraph>
            <Upload
              beforeUpload={handleAttachmentChange}
              fileList={attachments[selectedRecord.key] ? [attachments[selectedRecord.key]] : []}
            >
              <Button icon={<UploadOutlined />}>Attach File</Button>
            </Upload>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default RadiologyTestRequest;
