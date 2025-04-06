import {
  Form,
  Card,
  Select,
  Row,
  Col,
  Input,
  Button,
  Checkbox,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import {
  PlusOutlined,
  MinusCircleOutlined,
  DeleteFilled,
} from "@ant-design/icons";
import { postReceiptHeader } from "../../../actions/Charges-Actions/postReceiptHeader";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { useLocation } from "react-router-dom";
import { getReceiptLines } from "../../../actions/Charges-Actions/getReceiptLines";
import { getSinglePatientBill } from "../../../actions/Charges-Actions/getSinglePatientBill";

const InsurancePaymentSection = ({ patientNo }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const location = useLocation();
  const activeVisitNo = new URLSearchParams(location.search).get("PatientNo");

  const [paymentTypes, setPaymentTypes] = useState({}); // { [fieldName]: paymentType }
  const { loading: processReceiptLoading } = useSelector(
    (state) => state.savePayment
  );
  const { loading: receiptLinesLoading, data: receiptLines } = useSelector(
    (state) => state.getReceiptLines
  );
  const {
    loading: patientBillLoading,
    error: patientBillError,
    data: patientBillData,
  } = useSelector((state) => state.getSingleBill);

  const [splitAmount, setSplitAmount] = useState(false);

  useEffect(() => {
    if (activeVisitNo) {
      dispatch(getSinglePatientBill(activeVisitNo));
    }
  }, [dispatch, activeVisitNo]);

  const handlePaymentTypeChange = (index, value) => {
    setPaymentTypes((prev) => ({
      ...prev,
      [index]: value,
    }));
  };

  const handleSavePayments = async (values) => {
    if (!values.payments || values.payments.length === 0) {
      return;
    }
  
    const isSplitAmount = values.payments.length > 1;
    let successCount = 0;
  
    for (const payment of values.payments) {
      const payload = {
        myAction: "create",
        recId: "",
        patientNo,
        receiptDate: moment().format("YYYY-MM-DD"),
        depositDate: moment().format("YYYY-MM-DD"),
        payMode: payment.payMode,
        transactionCode: payment.transactionCode || "",
        splitAmount: isSplitAmount,
        amountReceived: parseFloat(Number(payment.amountReceived).toFixed(2)),
        isPartialPayment: payment.isPartialPayment || false,
        coPay: payment.coPay || false,
        ...(payment.payMode === 7
          ? {
              transactionCode: payment.transactionCode,
              phoneNumber: payment.phoneNumber,
            }
          : {}),
      };
  
      const receiptNo = await dispatch(postReceiptHeader(payload));
  
      if (receiptNo) {
        successCount++;
        dispatch(getReceiptLines(activeVisitNo));
      } else {
        message.error("Failed to save one of the payments. Please try again.");
      }
    }
  
    if (successCount > 0) {
      message.success(`${successCount} payment(s) saved successfully.`);
      form.resetFields();
      setPaymentTypes({});
    }
  };
  

  return (
    <div>
      <Card title="Add Payment Options" style={{ padding: "10px 16px" }}>
        <Form
          layout="vertical"
          form={form}
          onFinish={(values) => handleSavePayments(values)}
          style={{ maxWidth: 600 }}
        >
          <Form.List name="payments">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }, index) => {
                  const paymentType = paymentTypes[name];

                  return (
                    <div
                      key={key}
                      style={{
                        marginBottom: 24,
                        borderBottom: "1px solid #f0f0f0",
                        paddingBottom: 16,
                      }}
                    >
                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item
                            {...restField}
                            name={[name, "payMode"]}
                            label="Payment Method"
                            rules={[
                              {
                                required: true,
                                message: "Please select payment method",
                              },
                            ]}
                          >
                            <Select
                              placeholder="Choose payment method"
                              allowClear
                              showSearch
                              onChange={(value) =>
                                handlePaymentTypeChange(name, value)
                              }
                            >
                              <Select.Option value={1}>Cash</Select.Option>
                              <Select.Option value={2}>Cheque</Select.Option>
                              <Select.Option value={3}>EFT</Select.Option>
                              <Select.Option value={4}>
                                Deposit Slip
                              </Select.Option>
                              <Select.Option value={5}>
                                Banker's Cheque
                              </Select.Option>
                              <Select.Option value={6}>RTGS</Select.Option>
                              <Select.Option value={7}>MPESA</Select.Option>
                              <Select.Option value={8}>PayPal</Select.Option>
                              <Select.Option value={9}>Cheque</Select.Option>
                              <Select.Option value={10}>PDQ</Select.Option>
                            </Select>
                          </Form.Item>
                        </Col>

                        <Col span={11}>
                          <Form.Item
                            {...restField}
                            name={[name, "amountReceived"]}
                            label="Amount"
                            rules={[
                              { required: true, message: "Enter amount" },
                            ]}
                          >
                            <Input type="number" placeholder="Ksh 0.00" />
                          </Form.Item>
                        </Col>
                        <Col span={1}>
                          <DeleteFilled
                            style={{
                              fontSize: 20,
                              marginTop: 40,
                              cursor: "pointer",
                              color: "red",
                            }}
                            onClick={() => {
                              remove(name);
                              // Remove the paymentType from state
                              setPaymentTypes((prev) => {
                                const updated = { ...prev };
                                delete updated[name];
                                return updated;
                              });
                            }}
                          />
                        </Col>
                        <Row gutter={16}>
                          <Col span={24}>
                            {patientBillData[0]?.CurrentAdmNo ? (
                              <Form.Item
                                {...restField}
                                name={[name, "isPartialPayment"]}
                                //   label="Partial Payment"
                                valuePropName="checked"
                                style={{
                                  marginTop: 16,
                                  width: "100%",
                                  paddingLeft: "10px",
                                }}
                              >
                                <Checkbox
                                  style={{ width: "100%", textAlign: "left" }}
                                >
                                  Partial Payment
                                </Checkbox>
                              </Form.Item>
                            ) : (
                              <Form.Item
                                {...restField}
                                name={[name, "coPay"]}
                                valuePropName="checked"
                                style={{
                                  marginTop: 16,
                                  width: "100%",
                                  paddingLeft: "10px",
                                }}
                              >
                                <Checkbox>Co-Pay</Checkbox>
                              </Form.Item>
                            )}
                          </Col>
                        </Row>
                      </Row>

                      {paymentType === 7 && (
                        <Row gutter={16}>
                          <Col span={12}>
                            <Form.Item
                              {...restField}
                              name={[name, "phoneNumber"]}
                              label="Phone Number"
                              rules={[
                                {
                                  required: true,
                                  message: "Phone number is required for MPESA",
                                },
                                {
                                  pattern: /^07\d{8}$/,
                                  message:
                                    "Enter a valid Kenyan phone (e.g. 0712345678)",
                                },
                              ]}
                            >
                              <Input
                                type="tel"
                                placeholder="Enter MPESA phone number"
                              />
                            </Form.Item>
                          </Col>
                          <Col span={11}>
                            <Form.Item
                              {...restField}
                              name={[name, "transactionCode"]}
                              label="Reference Code"
                              rules={[
                                {
                                  required: true,
                                  message: "Enter reference code",
                                },
                              ]}
                            >
                              <Input placeholder="Enter ref. code" />
                            </Form.Item>
                          </Col>
                          <Col span={1}>
                            <DeleteFilled
                              style={{
                                fontSize: 20,
                                marginTop: 40,
                                cursor: "pointer",
                                color: "red",
                              }}
                              onClick={() => {
                                remove(name);
                                // Remove the paymentType from state
                                setPaymentTypes((prev) => {
                                  const updated = { ...prev };
                                  delete updated[name];
                                  return updated;
                                });
                              }}
                            />
                          </Col>
                        </Row>
                      )}
                    </div>
                  );
                })}

                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add Payment Option
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              disabled={processReceiptLoading}
              loading={processReceiptLoading}
            >
              Save Payments
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default InsurancePaymentSection;
