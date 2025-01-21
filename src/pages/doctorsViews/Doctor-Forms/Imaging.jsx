import {
  Form,
  Input,
  DatePicker,
  Row,
  Col,
  Button,
  Typography,
  Select,
  message,
  Tag,
} from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FileTextOutlined, EyeOutlined, PlusOutlined, SendOutlined, OrderedListOutlined } from "@ant-design/icons";
import { useLocation } from "react-router-dom";
import { getRadiologySetup } from "../../../actions/Doc-actions/qyRadiologyTestSetups";
import { postRadiologyRequest } from "../../../actions/Doc-actions/postRadiolgyRequest";
import { getPatientRadiologyTest, requestRadiologyTest } from "../../../actions/Doc-actions/requestRadiologyTest";
import RowSelectionTable from "../../../partials/doc-partials/RowSelectionTable";
import useAuth from "../../../hooks/useAuth";

const { Option } = Select;

const Imaging = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const treatmentNo = queryParams.get("TreatmentNo");
  const role = useAuth().userData.departmentName

  const dispatch = useDispatch();
  const [showForm, setShowForm] = useState(true);
  const [selectedRow, setSelectedRow] = useState([]); // Track selected rows

  const { data: radiologySetupData } = useSelector((state) => state.getRadiologySetup);
  const { data: radiologyData } = useSelector((state) => state.patientRadiologyTest);
  const { loading: requestingTest } = useSelector(
    (state) => state.requestRadiologyTest
  );
  useEffect(() => {
    dispatch(getRadiologySetup());
    if (treatmentNo) {
      dispatch(getPatientRadiologyTest(treatmentNo));
    }
  }, [dispatch, treatmentNo]);

  const handleSave = async (values) => {
    const { testPackageCode, dueDate, treatmentNo: formTreatmentNo } = values;

    if (!testPackageCode || !dueDate) {
      console.error("Missing required fields:", { testPackageCode, dueDate });
      return;
    }

    const formattedDueDate = dueDate.format("YYYY-MM-DD");

    const radiologyRequest = {
      myAction: "create",
      treatmentNo: treatmentNo || formTreatmentNo,
      testPackageCode: testPackageCode,
      dueDate: formattedDueDate,
    };

    try {
      const response = await dispatch(postRadiologyRequest(radiologyRequest));

      if (response && response.status === 'success') {
        message.success(`Laboratory request was successful`);
        dispatch(getPatientRadiologyTest(formTreatmentNo));
      } else {
        message.error('Failed to submit radiology request');
      }
    } catch (error) {
      message.error('An error occurred while submitting the radiology request');
      console.error("Error in request submission:", error);
    }
  };
  const handleRadiologyRequest = async () => {
    if (selectedRow && selectedRow.TreatmentNo) {
      const treatmentNo = selectedRow.TreatmentNo;
      const response = await dispatch(requestRadiologyTest(treatmentNo));
      if (response && response.status === 'success') {
        message.success(`Successfully requested radiology test for ${response.radiologyNo}`);
        dispatch(getPatientRadiologyTest(treatmentNo));
      }
    } else {
      message.error('No Request selected');
    }
  };


  const columns = [
    {
      title: "TreatmentNo",
      dataIndex: "TreatmentNo",
      key: "TreatmentNo",
      // render: (text) => <Button type="link">{text}</Button>,
    },
    {
      title: "Test Package",
      dataIndex: "RadiologyTypeCode",
      key: "RadiologyTypeCode",
      // render: (text) => <Button type="link">{text}</Button>,
    },
    {
      title: "Radiology Test Name",
      dataIndex: "RadiologyTypeName",
      key: "RadiologyTypeName",
      // render: (_, record) => {
      //   console.log(record)
      // },
    },
    {
      title: "Date Due",
      dataIndex: "DateDue",
      key: "DateDue",
      render: (text) => moment(text).format("YYYY-MM-DD"),
    },
    {
      title: "Status",
      dataIndex: "Status",
      key: "Status",
      render: (text) => {
        const statusColors = {
          new: "blue",
          forwarded: "orange",
          cancelled: "red",
          completed: "green"
        };
        return <Tag color={statusColors[text?.toLowerCase()]} >{text}</Tag>;
      },
    },
  ];

  const dataSource = Array.isArray(radiologyData)
    ? radiologyData
    : Object.keys(radiologyData).map((key, index) => ({
      key: index,
      Treatment: key.TreatmentNo,
    }));

  console.log("dateme", dataSource);
  return (
    <div>
      <Typography.Title level={5} style={{ marginBottom: "12px" }}>
        <FileTextOutlined style={{ marginRight: "8px" }} />
        Radiology Request
      </Typography.Title>

      {
        role === 'Doctor' ? (
          <div className="d-flex justify-content-between my-4">
        {!showForm &&
          <Button
            type="primary"
            htmlType="submit"
            icon={<SendOutlined />}
            onClick={handleRadiologyRequest}
            style={{ width: "150px" }}
            disabled={!selectedRow}
            loading={requestingTest}

          >
            Forward Requests
          </Button>
        }
        <Button
          type="primary"
          onClick={() => setShowForm(!showForm)}
          icon={showForm ? <OrderedListOutlined /> : <PlusOutlined />}
        >
          {showForm ? "View List" : "New Request"}
        </Button>

      </div>
        ) : (
          null
        )
      }

      {showForm ? (
        <Form
          layout="vertical"
          initialValues={{
            treatmentNo: treatmentNo || "",
            testPackageCode: "",
            // dueDate: moment(),
          }}
          onFinish={handleSave}
        >
          <Row gutter={24}>
            {/* <Col span={12}>
              <Form.Item
                name="treatmentNo"
                label="Treatment Number"
                rules={[{ required: true, message: "Please enter the treatment number." }]}
              >
                <Input disabled placeholder="Treatment Number" />
              </Form.Item>
            </Col> */}
            <Col span={12}>
              <Form.Item
                name="dueDate"
                label="Due Date"
                rules={[{ required: true, message: "Please select a due date." }]}
              >
                <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="testPackageCode"
                label="Radiology Test Name"
                rules={[{ required: true, message: "Please select a radiology code." }]}
              >
                <Select placeholder="Select Radiology Code" showSearch
                  filterOption={(input, option) =>
                    option?.children?.toLowerCase().includes(input.toLowerCase())
                  }
                  size="large" 
                  >
                  {radiologySetupData?.map((item) => (
                    <Option key={item.Code} value={item.Code}>
                      {item.Description}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
           
          </Row>

          <Button type="primary" htmlType="submit" style={{ marginTop: "16px" }}>
            Save Radiology Request
          </Button>
        </Form>
      ) : (
        <RowSelectionTable
          dataSource={dataSource}
          columns={columns}
          onRowSelect={(row) => setSelectedRow(row)} // Update selected row
          tableProps={{ scroll: { x: 600 } }} // Additional Table props
        />
      )}
    </div>
  );
};

export default Imaging;
