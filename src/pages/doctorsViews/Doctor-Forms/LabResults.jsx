import {
  Form,
  DatePicker,
  Row,
  Col,
  Button,
  Typography,
  Select,
  message,
  Tag,
  Modal
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
import moment from "moment";
import {
  FileTextOutlined,
  SaveOutlined,
  PlusOutlined,
  OrderedListOutlined,
} from "@ant-design/icons";
import RowSelectionTable from "../../../partials/doc-partials/RowSelectionTable";
import useAuth from "../../../hooks/useAuth";

const { Option } = Select;

const LabResults = () => {
  const location = useLocation();
  const patientDetails = location.state?.patientDetails;
  const queryParams = new URLSearchParams(location.search);
  const treatmentNo = queryParams.get("TreatmentNo");
  const admissionNo = queryParams.get("AdmNo");
  const role = useAuth().userData.departmentName
  const [selectedRow, setSelectedRow] = useState([]); // Track selected rows


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
  const { data: patientLabTest } = useSelector((state) => state.patientLabTest);
  const { loading: loadingLabRequest } = useSelector(
    (state) => state.requestLabTest
  );
  const [labRequest, setLabRequest] = useState({
    myAction: "create",
    treatmentNo: treatmentNo ? treatmentNo : admissionNo,
    testPackageCode: "",
    dueDate: "",
  });

  useEffect(() => {
    dispatch(getLabRequestSetup());
    dispatch(getPatientLabTest());
  }, [dispatch]);

  const handleLabRequest = async () => {
    if (selectedRow && selectedRow.TreatmentNo) {
      try {
        const response = await dispatch(requestLabTest(selectedRow.TreatmentNo));
        console.log("Response from requestLabTest:", response);
        if (response) {
          message.success(
            `Requesting test for ${selectedRow.LaboratoryTestPackageName} with Laboratory No: ${response.laboratoryNo}`
          );
          // Refresh the patient lab test data
          dispatch(getPatientLabTest());
        } else {
          message.error("Failed to request the lab test. Please try again.");
        }
      } catch (error) {
        console.error("Error requesting lab test:", error);
        message.error("An error occurred while requesting the lab test.");
      }
    } else {
      message.warning("Please select a lab test to proceed.");
    }
  };
  

  const handleFieldChange = (field, value) => {
    setLabRequest((prev) => ({
      ...prev,
      [field]: field === "dueDate" ? moment(value).format("YYYY-MM-DD") : value,
    }));
  };
  

  const handleSave = () => {
    dispatch(postLabRequest(labRequest)).then((data) => {
      if (data.status === "success") message.success(data.status);
      dispatch(getPatientLabTest());
      showForm(false);
    });
  };
  const handleViewResults = (record) => {
    if (record.Results) {
      setIframeSrc(record.Results); // Assuming `Results` contains the iframe source URL.
      setNoResultsMessage(false);
    } else {
      setNoResultsMessage(true);
    }
    setModalVisible(true);
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
          case "Cancelled":
            color = "red";
            break;
          default:
            color = "default";
        }
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Results",
      dataIndex: "Results",
      key: "Results",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => handleViewResults(record)}
          icon={<FileTextOutlined />}
        >
          View Results
        </Button>
      ),
    },
  ];
  
  // const rowSelection = {
  //   type: "radio", // This ensures only one row can be selected
  //   selectedRowKeys: selectedRow.length ? [selectedRow[0].key] : [], // Ensure only a single row is selected
  //   onChange: (selectedRowKeys, selectedRow) => {
  //     setSelectedRow(selectedRow);
  //   },
  // };
  
  
  // Filter the data based on the selected rows  
  const dataSource = Array.isArray(patientLabTest)
  ? patientLabTest
      .filter((item) => item.TreatmentNo === treatmentNo) // Filter based on TreatmentNo
      .map((item, index) => ({
        ...item,
        key: index, // Ensure unique key
      }))
  : [];

  return (
    <div>
      <Typography.Title
        level={5}
        style={{ color: "#0F5689", marginBottom: "12px" }}
      >
        <FileTextOutlined style={{ marginRight: "8px" }} />
        Laboratory Request 
      </Typography.Title>
      
      {
        role === 'Doctor' &&
        patientDetails?.Status !== "Completed" ? (
          <div className="d-block d-md-flex justify-content-between align-items-center gap-3 my-3">
         <div className="d-flex justify-content-start align-items-center">
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
              disabled={!selectedRow}
            >
              Request Test
            </Button>
          
          {/* <Popconfirm
            title="Are you sure?"
            onConfirm={() => console.log(`Delete: ${record.key}`)}
          >
            <Button type="default" icon={<DeleteOutlined />} danger>
              Delete
            </Button>
          </Popconfirm> */}
         </div>
          <div className="d-flex justify-content-end my-2">
        <Button
          type="primary"
          onClick={() => setShowForm(!showForm)}
          icon={showForm ? <OrderedListOutlined /> : <PlusOutlined />}
        >
          {!showForm ? " New Request" : "View List"}
        </Button>
      </div>
        </div>
        ) : (
          null
        )
      }
      

      {!showForm ? (
          <>
           <RowSelectionTable
           columns={columns}
           dataSource={dataSource}
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
           <Typography.Text type="danger">No Results to View</Typography.Text>
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
        <Form layout="vertical" autoComplete="off">
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="dueDate"
                label="Due Date"
                rules={[{ required: true }]}
                style={{ width: "100%" }}
              >
                <DatePicker
                  // format="YYYY-MM-DD"
                  value={moment().format("YYYY-MM-DD")} // Set the current date
                  style={{ width: "100%" }}
                  onChange={(date) => handleFieldChange("dueDate", date)}
                  inputReadOnly // Make the input readonly
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="testPackageCode"
                label="Test Package Code"
                rules={[{ required: true }]}
              >
                <Select
                  placeholder="Select Test Package Code"
                  onChange={(value) =>
                    handleFieldChange("testPackageCode", value)
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
            </Col>
          </Row>

          <div className="my-2">
           
            <Button
              type="primary"
              style={{
                marginTop: "16px",
                marginBottom: "16px",
                marginRight: "16px",
                float: "right",
                width: "150px",
              }}
              icon={<SaveOutlined />}
              onClick={handleSave}
              loading={loadingLabRequestPost}
            >
              {labRequest.myAction === "create"
                ? "Add Lab Request"
                : "Update Lab Request"}
            </Button>
          </div>
        </Form>
      )}
    </div>
  );
};

export default LabResults;
