import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  message,
  Row,
  Select,
  Table,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import PropTypes from "prop-types";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getItemsSlice } from "../../../../actions/triage-actions/getItemsSlice";
import { getDressingSlice } from "../../../../actions/triage-actions/getDressingSlice";
import { SaveOutlined } from "@ant-design/icons";
import { postDressingsSlice } from "../../../../actions/triage-actions/postDressingsSlice";

const Dressing = ({ observationNumber, staffNo }) => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.getItems);
  const { dressing } = useSelector((state) => state.getDressing);
  const { dressingsLoading } = useSelector((state) => state.postDressings);

  // Save handler
  const onFinish =async (values) => {
    const { processNumber, itemNumber, unitsOfMeasure, quantity, injectionRemarks } =
      values.dressing;

    const createDressing = {
      processNo: processNumber,
      itemNo: itemNumber,
      unitOfMeasure: unitsOfMeasure,
      quantity,
      remarks: injectionRemarks,
      observationNo: observationNumber,
      staffNo: staffNo,
      myAction: "create",
    };

    await dispatch(postDressingsSlice(createDressing)).then((data) => {
      if (data?.status === "success") {
        message.success("Dressing saved successfully");
        dispatch(getDressingSlice(observationNumber));
      } else {
        message.error("Error saving dressings");
      }
    });
  };

  // Fetch initial data
  useEffect(() => {
    dispatch(getItemsSlice());
    dispatch(getDressingSlice(observationNumber));
  }, [dispatch, observationNumber]);

  // Columns definition
  const columns = [
    { title: "Item Number", dataIndex: "itemNo", key: "itemNo" },
    { title: "Unit of Measure", dataIndex: "unitOfMeasure", key: "unitOfMeasure" },
  ];

  // Normalize dressing data
  const dataSource = useMemo(() => {
    if (!dressing) return [];

    let records = Array.isArray(dressing) ? dressing : [dressing];

    // Sort latest first (assuming there's a createdAt or similar timestamp)
    records = records.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateB - dateA;
    });

    return records.map((rec, index) => ({
      key: rec.id || `${rec.itemNo}-${index}`,
      quantity: rec.quantity,
      itemNo: rec.itemNo,
      processNumber: rec.processNo,
      unitOfMeasure: rec.unitOfMeasure,
      remarks: rec.remarks,
    }));
  }, [dressing]);

  return (
    <div>
      <Form
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          dressing: {
            processNumber: "",
            itemNumber: "",
            unitsOfMeasure: "",
            quantity: "",
            injectionRemarks: "",
          },
        }}
        autoComplete="off"
      >
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Form.Item
              label="Item No"
              name={["dressing", "itemNumber"]}
              hasFeedback
              rules={[{ required: true, message: "Please select item no!" }]}
            >
              <Select
                style={{ width: "100%" }}
                optionFilterProp="label"
                options={items.map((item) => ({
                  label: item.Description,
                  value: item.No,
                }))}
                placeholder="Select item number"
                showSearch
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Quantity"
              name={["dressing", "quantity"]}
              hasFeedback
              rules={[{ required: true, message: "Please input quantity!" }]}
            >
              <Input type="number" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Form.Item
              label="Dressing Remarks"
              name={["dressing", "injectionRemarks"]}
              hasFeedback
            >
              <TextArea
                autoSize={{
                  minRows: 3,
                  maxRows: 5,
                }}
              />
            </Form.Item>
            <Col span={12}>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={dressingsLoading}
                  disabled={dressingsLoading}
                  icon={<SaveOutlined />}
                >
                  Save dressings
                </Button>
              </Form.Item>
            </Col>
          </Col>
        </Row>
      </Form>

      {dataSource.length > 0 && (
        <div style={{ marginTop: "10px" }}>
          <Divider />
          <Table
            columns={columns}
            dataSource={dataSource}
            pagination={false}
            expandable={{
              expandedRowRender: (record) => (
                <p style={{ margin: 0 }}>
                  Quantity: {record.quantity}, Remarks: {record.remarks}
                </p>
              ),
            }}
          />
        </div>
      )}
    </div>
  );
};

Dressing.propTypes = {
  observationNumber: PropTypes.string.isRequired,
  staffNo: PropTypes.string.isRequired,
};

export default Dressing;
