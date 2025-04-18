import {
  Form,
  Button,
  Typography,
  Select,
  message,
  Tag,
  Modal,
  Card,
  Input,
  Alert,
  notification,
} from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLabRequestSetup } from "../../../actions/Doc-actions/qyLabTestsSetup";
import { postLabRequest } from "../../../actions/Doc-actions/postLabRequest";
import {
  getPatientLabTest,
  requestLabTest,
} from "../../../actions/Doc-actions/requestLabTest";
import { useLocation } from "react-router-dom";
import {
  FileTextOutlined,
  PlusOutlined,
  OrderedListOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import RowSelectionTable from "../../../partials/doc-partials/RowSelectionTable";
import useAuth from "../../../hooks/useAuth";
import LabResultDrawer from "./LabResultDrawer";
import {
  GENERATE_LAB_RESULTS_REPORT_RESET,
  generateLabResultsReport,
} from "../../../actions/lab-actions/generateLabResultsReport";
import moment from "moment";

const { Option } = Select;

const LabResults = () => {
  const location = useLocation();
  const patientDetails = location.state?.patientDetails;
  const queryParams = new URLSearchParams(location.search);
  const treatmentNo = queryParams.get("TreatmentNo");
  const admissionNo = queryParams.get("AdmNo");
  const role = useAuth().userData.departmentName;
  const [selectedRow, setSelectedRow] = useState([]); // Track selected rows
  const [selectedTestPackage, setSelectedTestPackage] = useState(null); // Track selected test package
  const [labRequests, setLabRequests] = useState([]); // Track lab requests
  const [error, setError] = useState(null);
  const [form] = Form.useForm(); // AntD form instance

  const {
    data: reportData,
    loading: reportLoading,
    error: reportError,
  } = useSelector((state) => state.generateLabResultsReport);
  const [currentReportData, setCurrentReportData] = useState(reportData);

  const dispatch = useDispatch();
  const [showForm, setShowForm] = useState(false); // Toggle between table and form

  const [modalVisible, setModalVisible] = useState(false);
  const [iframeSrc, setIframeSrc] = useState("");
  const [noResultsMessage, setNoResultsMessage] = useState(false);
  const { data: labTestSetupData } = useSelector(
    (state) => state.getlabRequestSetup
  );
  const { loading: loadingLabRequestPost } = useSelector(
    (state) => state.postLabRequest
  );

  const { loading: loadingPatientLabTest, data: patientLabTest } = useSelector(
    (state) => state.patientLabTest
  );
  const { loading: loadingLabRequest } = useSelector(
    (state) => state.requestLabTest
  );

  const [labRequest, setLabRequest] = useState({
    myAction: "create",
    treatmentNo: treatmentNo ? treatmentNo : admissionNo,
    testPackageCode: "",
    dueDate: "",
  });

  // lab test drawer
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState();
  const [record, setRecord] = useState(null);

  const showLargeDrawer = async (record) => {
    setSize("large");
    const labRequest = {
      treatmentNo: treatmentNo ?? admissionNo,
      laboratoryNo: record?.Lab_No,
    };
    console.log("lab request number", labRequest);
    await dispatch(generateLabResultsReport(record));

    setOpen(true);

    setRecord(record);
  };

  const handleTestPackageChange = (name, value, option) => {
    setSelectedTestPackage({ code: value, name: option.children });
  };

  const handleAddLabRequest = () => {
    if (!selectedTestPackage) {
      setError("Please select a test package");
      return;
    }

    // Avoid duplicates
    const alreadyAdded = labRequests.find(
      (r) => r.code === selectedTestPackage.code
    );
    if (alreadyAdded) {
      setError("This test package is already added");
      return;
    }

    setLabRequests((prev) => [...prev, selectedTestPackage]);

    // Reset select input and error
    setSelectedTestPackage(null);
    form.setFieldsValue({ testPackageCode: undefined }); // Reset AntD form field
    setError(null);
  };

  const handleRemoveLabTest = (code) => {
    setLabRequests(labRequests.filter((item) => item.code !== code));
  };
  const onClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (reportData) {
      message.success("Report generated successfully");
      setCurrentReportData(reportData);
      dispatch({ type: GENERATE_LAB_RESULTS_REPORT_RESET });
    }

    if (reportLoading) {
      message.info("Generating Report...");
    }

    if (reportError) {
      message.warning(
        Array.isArray(reportError?.errors)
          ? reportError.errors[0]
          : reportError.errors
      );
      dispatch({ type: GENERATE_LAB_RESULTS_REPORT_RESET });
    }
  }, [reportData, reportLoading, reportError, dispatch]);

  useEffect(() => {
    dispatch(getLabRequestSetup());
    dispatch(getPatientLabTest(treatmentNo ?? admissionNo));
  }, [dispatch, treatmentNo, admissionNo]);

  const handleLabRequest = async () => {
    //fetch treatmentNo from the URL
    try {
      const response = await dispatch(
        requestLabTest(treatmentNo ?? admissionNo)
      );
      if (response) {
        message.success(
          `Requesting test for Laboratory No: ${response.laboratoryNo}`
        );
        // Refresh the patient lab test data
        dispatch(getPatientLabTest(admissionNo ?? treatmentNo));
      } else {
        message.error("Failed to request the lab test. Please try again.");
      }
    } catch (error) {
      console.error("Error requesting lab test:", error);
      message.error("An error occurred while requesting the lab test.");
    }
  };

  const handleSave = async () => {
    if (labRequests.length === 0) return;

    let allSuccessful = true;

    for (const item of labRequests) {
      const payload = {
        ...labRequest,
        testPackageCode: item.code,
        dueDate: moment().format("YYYY-MM-DD"),
      };

      try {
        const response = await dispatch(postLabRequest(payload));

        if (response.status === "success") {
          notification.success({
            message: "Lab request saved!",
            description: `Lab request ${item.code} saved successfully.`,
          });
        } else {
          allSuccessful = false;
          message.error(`Failed to save lab request ${item.code}.`);
        }
      } catch (error) {
        allSuccessful = false;
        console.error(`Error saving ${item.code}:`, error);
        message.error(`Error saving lab request ${item.code}`);
      }
    }

    // Only refresh and reset if all were successful
    if (allSuccessful) {
      dispatch(getPatientLabTest(treatmentNo ?? admissionNo));
      setLabRequests([]);
      setSelectedTestPackage(null);
      setShowForm(false);
    }
  };

  const columns = [
    {
      title: "Treatment No",
      dataIndex: "TreatmentNo",
      key: "TreatmentNo",
    },
    {
      title: "Test Package",
      dataIndex: "LaboratoryTestPackageCode",
      key: "LaboratoryTestPackageCode",
      render: (text) => {
        return <Button type="link">{text}</Button>;
      },
    },
    {
      title: "Test Name",
      dataIndex: "LaboratoryTestPackageName",
      key: "LaboratoryTestPackageName",
    },
    {
      title: "Due Date",
      dataIndex: "DateDue",
      key: "DateDue",
    },
    {
      title: "Status",
      dataIndex: "Status",
      key: "Status",
      render: (status) => {
        let color = "default";
        switch (status) {
          case "New":
            color = "blue";
            break;
          case "Forwarded":
            color = "green";
            break;
          case "Voided":
            color = "red";
            break;
          default:
            color = "default";
        }
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        if (record.Lab_No === "") {
          return <Tag color="red">Result not yet Ready</Tag>;
        } else {
          return (
            <Button
              type="primary"
              onClick={() => showLargeDrawer(record)}
              disabled={record.Status !== "Completed"}
            >
              View Results
            </Button>
          );
        }
      },
    },
  ];

  return (
    <div>
      <Typography.Title
        level={5}
        style={{ color: "#0F5689", marginBottom: "12px" }}
      >
        <FileTextOutlined style={{ marginRight: "8px" }} />
        Laboratory Request
      </Typography.Title>

      {role === "Doctor" && patientDetails?.Status !== "Completed" ? (
        <div className="d-block d-md-flex align-items-center gap-3 my-3">
          <div className="d-flex justify-content-start align-items-center">
            {!showForm && (
              <Button
                type="primary"
                style={{
                  marginTop: "16px",
                  marginBottom: "16px",
                  marginRight: "16px",
                  float: "right",
                  width: "150px",
                }}
                icon={<FileTextOutlined />}
                onClick={handleLabRequest}
                loading={loadingLabRequest}
                disabled={!patientLabTest.length} // Disable if no rows are selected
              >
                Request Test
              </Button>
            )}

            <Button
              type="primary"
              style={{
                marginTop: "16px",
                marginBottom: "16px",
                marginRight: "16px",
                width: "150px",
              }}
              onClick={() => setShowForm(!showForm)}
              icon={showForm ? <OrderedListOutlined /> : <PlusOutlined />}
            >
              {!showForm ? " New Request" : "View List"}
            </Button>
          </div>
        </div>
      ) : null}

      {error && <Alert message={error} type="warning" showIcon closable />}

      {!showForm ? (
        <>
          <RowSelectionTable
            loadingPatientLabTest={loadingPatientLabTest}
            columns={columns}
            dataSource={patientLabTest}
            onRowSelect={(row) => setSelectedRow(row)} // Update selected row
            tableProps={{ scroll: { x: 600 } }} // Additional Table props
          />
          <Modal
            title="Lab Test Results"
            visible={modalVisible}
            onCancel={() => setModalVisible(false)}
            footer={null}
            width={800}
            bodyStyle={{ padding: "16px", textAlign: "center" }}
          >
            {noResultsMessage ? (
              <Typography.Text type="danger">
                No Results to View
              </Typography.Text>
            ) : (
              <iframe
                src={iframeSrc}
                title="Lab Test Results"
                style={{ width: "100%", height: "500px", border: "none" }}
              />
            )}
          </Modal>
        </>
      ) : (
        <Form layout="vertical" autoComplete="off" form={form}>
          <div className="d-flex justify-content-between align-items-center gap-3 my-3">
            <Form.Item
              name="testPackageCode"
              label="Test Package Code"
              rules={[{ required: true }]}
              style={{ flex: 1 }} // 💡 Apply flex here
            >
              <Select
                placeholder="Select Test Package Code"
                onChange={(value, option) =>
                  handleTestPackageChange("testPackageCode", value, option)
                }
                showSearch
                filterOption={(input, option) =>
                  option?.children?.toLowerCase().includes(input.toLowerCase())
                }
                size="large"
              >
                {labTestSetupData?.map((item) => (
                  <Option key={item.Code} value={item.Code}>
                    {item.Description}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              onClick={handleAddLabRequest}
              disabled={!selectedTestPackage}
            >
              Add Lab Test
            </Button>
          </div>
          {labRequests.length > 0 && (
            <Card>
              <div
                style={{
                  display: "flex",
                  fontWeight: "bold",
                  padding: "8px 0",
                  borderBottom: "1px solid #ddd",
                }}
              >
                <div style={{ flex: "1" }}>#</div>
                <div style={{ flex: "3" }}>Lab test Code</div>
                <div style={{ flex: "4" }}>Lab Test Name</div>
                <div style={{ flex: "2" }}>Action</div>
              </div>
              {labRequests.map((item, index) => (
                <div
                  key={item.code}
                  style={{
                    display: "flex",
                    padding: "8px 0",
                    borderBottom: "1px solid #f0f0f0",
                    alignItems: "center",
                    gap: "16px",
                  }}
                >
                  <div style={{ flex: "1" }}>{index + 1}</div>
                  <div style={{ flex: "3" }}>
                    <Input value={item.code} disabled />
                  </div>
                  <div style={{ flex: "4" }}>
                    <Input value={item.name} disabled />
                  </div>
                  <div style={{ flex: "2" }}>
                    <Button
                      type="text"
                      danger
                      onClick={() => handleRemoveLabTest(item.code)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </Card>
          )}

          {labRequests.length > 0 && (
            <div className="my-2">
              <Button
                type="primary"
                style={{
                  marginTop: "16px",
                }}
                icon={<SaveOutlined />}
                onClick={handleSave}
                loading={loadingLabRequestPost}
              >
                Save Lab Request
              </Button>
            </div>
          )}
        </Form>
      )}

      <LabResultDrawer
        onClose={onClose}
        open={open}
        size={size}
        record={record}
        currentReportData={currentReportData}
        procedure="Laboratory"
      />
    </div>
  );
};

export default LabResults;
