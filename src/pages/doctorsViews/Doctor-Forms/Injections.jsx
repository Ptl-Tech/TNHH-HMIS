import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Row,
  Select,
  TimePicker,
  Divider,
  Table,
  Typography,
  Skeleton,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import {
  SaveOutlined,
  MedicineBoxOutlined,
  FileTextOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteFilled,
} from "@ant-design/icons";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getInjectionNumberSlice } from "../../../actions/triage-actions/getInjectionNumberSlice";
import {
  getInjectionsLinesSlice,
  getInjectionsSlice,
} from "../../../actions/triage-actions/getInjectionsSlice";
import { getLoactions } from "../../../actions/DropdownListActions";
import { getItemsSlice } from "../../../actions/triage-actions/getItemsSlice";
import { postDocInjectionsSlice } from "../../../actions/Doc-actions/postInjectionsSlice";
import Loading from "../../../partials/nurse-partials/Loading";
import { useLocation } from "react-router-dom";
import { getItemUnitsOfMeasureSlice } from "../../../actions/triage-actions/getItemUnitsOfMeasureSlice";

const Injections = ({ observationNumber }) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const treatmentNo = queryParams.get("TreatmentNo");

  const dispatch = useDispatch();
  const [showForm, setShowForm] = useState(false); // Toggle between table and form

  const { injectionsNumber } = useSelector((state) => state.getInjectionNumber);
  const { getInjectionsLoading, getInjections } = useSelector(
    (state) => state.getInjections
  );
  const { getInjectionsLinesLoading, getInjectionsLines } = useSelector(
    (state) => state.getInjectionLines
  );
  const { loading } = useSelector((state) => state.postDoctorInjections);
  const { locations } = useSelector((state) => state.getLocationsSetup);
  const { items } = useSelector((state) => state.getItems);
  const { itemUnitsOfMeasure } = useSelector((state) => state.getItemUnits);

  useEffect(() => {
    dispatch(getInjectionNumberSlice());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getLoactions());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getItemsSlice());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getInjectionsSlice(observationNumber));
  }, [dispatch, observationNumber]);

  useEffect(() => {
    dispatch(getInjectionsLinesSlice(treatmentNo));
  }, [dispatch, treatmentNo]);

  useEffect(() => {
    dispatch(getItemUnitsOfMeasureSlice());
  }, [dispatch]);

  const onFinish = (values) => {
    const {
      injectionNo,
      injectionQuantity,
      injectionRemarks,
      itemNo,
      location,
      injectionUnitOfMeasure,
      duration,
    } = values.injections;

    const createInjection = {
      myAction: "create",
      treatmentNo: treatmentNo,
      injectionNo,
      itemNo,
      location,
      injectionGiven: true,
      injectionUnitOfMeasure,
      injectionQuantity,
      duration, // Ensure that duration is included
      remarks: injectionRemarks,
    };

    dispatch(postDocInjectionsSlice(createInjection));
  };

  const columns = [
    {
      title: "Injection No",
      dataIndex: "InjectionNo",
      key: "InjectionNo",
    },
    {
      title: "Injection Date",
      dataIndex: "InjectionDate",
      key: "InjectionDate",
    },
    {
      title: "Injection Quantity",
      dataIndex: "InjectionQuantity",
      key: "InjectionQuantity",
    },
  ];

  const columnsLines = [
    {
      title: "Injection No",
      dataIndex: "InjectionNo",
      key: "InjectionNo",
    },
    {
      title: "Item Name",
      dataIndex: "InjectionName",
      key: "InjectionName",
    },
    {
      title: "Injection Quantity",
      dataIndex: "InjectionQuantity",
      key: "InjectionQuantity",
    },
    {
      title: "Unit of Measure",
      dataIndex: "InjectionUnitofMeasure",
      key: "InjectionUnitofMeasure",
    },
    {
      title: "Remarks",
      dataIndex: "InjectionRemarks",
      key: "InjectionRemarks",
    },
    {
      title: "Duration",
      dataIndex: "Duration",
      key: "Duration",
    },
    {
      title: "Station",
      dataIndex: "Location",
      key: "Location",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Button
            type="danger"
            icon={<DeleteFilled />}
            onClick={() => handleDelete(record)}
            danger
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];
  
  const [
    InjectionNo,
    InjectionDate,
    InjectionTime,
    InjectionQuantity,
    InjectionRemarks,
    ObservationNo,
  ] = getInjections;
  const dataSource = [
    {
      key: ObservationNo,
      InjectionNo,
      InjectionDate,
      InjectionTime,
      InjectionQuantity,
      InjectionRemarks,
      ObservationNo,
    },
  ];

  const DataSource = [
    {
      key: getInjectionsLines.InjectionNo,
      InjectionNo: getInjectionsLines.InjectionNo,
      InjectionName: getInjectionsLines.InjectionName,
      InjectionQuantity: getInjectionsLines.InjectionQuantity,
      InjectionUnitofMeasure: getInjectionsLines.InjectionUnitofMeasure,
      InjectionRemarks: getInjectionsLines.InjectionRemarks,
      Duration: getInjectionsLines.Duration,
      Location: getInjectionsLines.Location,
    },
  ];

  return (
    <div>
      {getInjectionsLoading ? (
        <Loading />
      ) : (
        <div>
          <Typography.Title
            level={5}
            style={{
              color: "#b96000",
              fontSize: "16px",
              marginBottom: "12px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <MedicineBoxOutlined
              style={{ marginRight: "8px", fontSize: "20px" }}
            />
            Injections
          </Typography.Title>
          <div className="d-flex justify-content-end mb-4 mt-2">

          <Button
            type="primary"
            onClick={() => setShowForm(!showForm)}
            icon={showForm ? <FileTextOutlined /> : <PlusOutlined />}
          >
            {showForm ? "View History" : "New Request"}
          </Button>
</div>
          {!showForm ? (
            <Table 
  columns={columnsLines} 
  dataSource={DataSource} 
  loading={{
    spinning: getInjectionsLinesLoading,
    indicator: <Skeleton active title={false} paragraph={{ rows: 3 }} />,
  }}
/>
          ) : (
           <>
            <Form
              layout="vertical"
              validateTrigger="onChange"
              onFinish={onFinish}
              initialValues={{
                injections: {
                  observationNumber: "",
                  injectionNo: "",
                  itemNo: "",
                  location: "",
                  injectionUnitOfMeasure: "",
                  injectionQuantity: "",
                  duration: "",
                  remarks: "",
                  injectionGiven: false,
                },
              }}
              autoComplete="off"
            >
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    label="Injection Location"
                    name={["injections", "location"]}
                    rules={[
                      { required: true, message: "Please select a location!" },
                    ]}
                    hasFeedback
                  >
                    <Select
                      style={{ width: "100%" }}
                      optionFilterProp="label"
                      placeholder="Select Location"
                      name="location"
                    >
                      {locations &&
                        locations.map((item, index) => (
                          <Select.Option
                            key={index}
                            value={item.Code}
                            label={item.Code}
                          >
                            {item.Name}
                          </Select.Option>
                        ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Injection "
                    name={["injections", "itemNo"]}
                    rules={[
                      { required: true, message: "Please select an item!" },
                    ]}
                    hasFeedback
                  >
                    <Select
                      style={{ width: "100%" }}
                      optionFilterProp="label"
                      placeholder="Select Items"
                      name="itemNo"
                    >
                      {items &&
                        items.map((item, index) => (
                          <Select.Option
                            key={index}
                            value={item.No}
                            label={item.No}
                          >
                            {item.Description}
                          </Select.Option>
                        ))}
                    </Select>
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item
                    label="Unit of measure"
                    name={["injections", "injectionUnitOfMeasure"]}
                    rules={[
                      {
                        required: true,
                        message: "Please select a unit of measure!",
                      },
                    ]}
                    hasFeedback
                  >
                    <Select
                      key={"injectionUnitOfMeasure"}
                      style={{ width: "100%" }}
                      optionFilterProp="label"
                      options={itemUnitsOfMeasure.map((itemUnit) => ({
                        label: itemUnit.Code,
                        value: itemUnit.Description,
                      }))}
                      placeholder="Select units of measure"
                      showSearch
                      name="injectionUnitOfMeasure"
                    ></Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    label="Injection Quantity"
                    name={["injections", "injectionQuantity"]}
                    rules={[
                      {
                        required: true,
                        message: "Please input injection quantity!",
                      },
                    ]}
                    hasFeedback
                  >
                    <Input type="number" name="injectionQuantity" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Injection No"
                    name={["injections", "injectionNo"]}
                    hasFeedback
                    rules={[
                      { required: true, message: "Please input injection no!" },
                    ]}
                  >
                    <Select
                      style={{ width: "100%" }}
                      optionFilterProp="label"
                      placeholder="Select Injection No"
                    >
                      {injectionsNumber &&
                        injectionsNumber.map((item, index) => (
                          <Select.Option
                            key={index}
                            value={item.Code}
                            label={item.Code}
                          >
                            {item.Description}
                          </Select.Option>
                        ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Duration "
                    name={["injections", "duration"]}
                    rules={[
                      { required: true, message: "Please input duration!" },
                    ]}
                    hasFeedback
                  >
                    <Input name="duration" placeholder="Duration " />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Special Instructions"
                    name={["injections", "injectionRemarks"]}
                    hasFeedback
                  >
                    <TextArea
                      autoSize={{ minRows: 3, maxRows: 5 }}
                      name="injectionRemarks"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                      <SaveOutlined />
                      Save injections
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
            
            {getInjections && Object.keys(getInjections).length > 0 && (
                <div style={{ marginTop: "10px" }}>
                  <Divider />
                  <Table
                    columns={columns}
                    dataSource={dataSource}
                    pagination={false}
                    expandable={{
                      expandedRowRender: (record) => (
                        <p style={{ margin: 0 }}>
                          Injection Remarks: {record.InjectionRemarks}, Injection Time:{" "}
                          {record.InjectionTime}
                        </p>
                      ),
                      rowExpandable: (record) => record.name !== "Not Expandable",
                    }}
                  />
                </div>
              )}
           </>
          )}

         
        </div>
      )}
    </div>
  );
};

Injections.propTypes = {
  observationNumber: PropTypes.string.isRequired,
  staffNo: PropTypes.string.isRequired,
};

export default Injections;
