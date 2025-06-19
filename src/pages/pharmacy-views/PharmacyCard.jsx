import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import ReactPDF, { pdf } from "@react-pdf/renderer";

import {
  Col,
  Row,
  Tag,
  Card,
  Form,
  Spin,
  Input,
  Modal,
  Space,
  Table,
  Button,
  message,
  Typography,
  InputNumber,
} from "antd";
import {
  IdcardOutlined,
  SignatureOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import { Select } from "antd";

import { SearchDrugTable } from "./SearchDrugTable";
import {
  pharmacyCardPatientData,
  pharmacyCardSearchDrugsColumns,
  pharmacyCardCurrentSelectionColumns,
} from "./pharmacy-utils";

import PharmacyLabel from "./PharmacyLabel";
import {
  postDrugIssuance,
  postArchivePrescription,
  postPrescriptionQuantity,
  POST_EDIT_PRESCRIPTION_RESET,
  POST_ARCHIVE_PRESCRIPTION_RESET,
  POST_PHARMACY_DRUG_ISSUANCE_RESET,
} from "../../actions/pharmacy-actions/postPharmacyAction";
import {
  GET_PHARMACY_RETURN_LIST_RESET,
  getPharmacyLineReturnbyPharmacyNo,
} from "../../actions/pharmacy-actions/getPharmacyLineReturns";
import { getItemsSlice } from "../../actions/triage-actions/getItemsSlice";
import PDFViewer from "../../components/PDFView";
import { getPharmacyRequestsAll } from "../../actions/pharmacy-actions/getPharmacyRequestsAll";
import { getSinglePharmacyRecord } from "../../actions/pharmacy-actions/getSinglePharmacyRecord";

const { confirm } = Modal;
const { Text } = Typography;

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  children,
  ...restProps
}) => {
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const PharmacyCard = ({ type, title, hideSelector }) => {
  const dispatch = useDispatch();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);

  const [form] = Form.useForm();

  const [editingKey, setEditingKey] = useState("");
  const [pdfLabels, setPdfLabels] = useState(null);
  const [viewPDFLabel, setViewPDFLabel] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);
  const [Status, setStatus] = useState(searchParams.get("status") || "");

  const { Title } = Typography;
  const SpaceCompact = Space.Compact;
  const { Row: TableSummaryRow, Cell: TableSummaryCell } = Table.Summary;

  const statuses = [
    { label: "All", value: "" },
    { label: "New", value: "New" },
    { label: "Forwarded", value: "Forwarded" },
    { label: "Completed", value: "Completed" },
    { label: "Cancelled", value: "Cancelled" },
  ];

  const { data: pharmacyRequests, loading: pharmacyRequestsLoading } =
    useSelector((state) => state.getPharmacyRequestsAll);
  const { data: postDrugIssuanceData, loading: postDrugIssuanceLoading } =
    useSelector((state) => state.postDrugIssuance);
  const {
    data: postArchivePrescriptionData,
    loading: postArchivePrescriptionLoading,
  } = useSelector((state) => state.postArchivePrescription);
  const { items } = useSelector((state) => state.getItems);
  const {
    data: postPharmacyLineData,
    loading: postPharmacyLineLoading,
    error: postPharmacyLineError,
  } = useSelector((state) => state.postPrescriptionQuantity);
  const {
    data: pharmacyLineData,
    success: pharmacyLineDataSuccess,
    loading: pharmacyLineDataLoading,
  } = useSelector((state) => state.getPatientPharmacyReturnLine);
  const { data: pharmacyRecord } = useSelector(
    (state) => state.getSinglePharmacyRecord
  );
  const { data: returnedDrugs } = useSelector((state) => state.returnDrugs);

  const disabled =
    pharmacyRecord?.Status === "Completed" ||
    pharmacyRecord?.Status === "Cancelled";

  const isEditing = (record) => record.No === editingKey;

  const edit = (record) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.No);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (record) => {
    try {
      const row = await form.validateFields();
      const { SystemId, Pharmacy_No, No, UnitPrice } = record;
      const {
        Dosage,
        Duration_Days,
        Frequency,
        Quantity,
        Take = 0,
        remarks = "",
      } = row;

      console.log({ row });

      dispatch(
        postPrescriptionQuantity({
          myAction: "edit",
          recId: SystemId,
          pharmacyNo: Pharmacy_No,
          quantity: Quantity,
          take: Take,
          drugNo: No,
          noOfDays: Duration_Days,
          frequency: Frequency,
          dosage: Dosage,
          TotalAmount: Math.round(UnitPrice * Quantity * 1000) / 1000,
          remarks,
        })
      );

      setEditingKey("");
    } catch (error) {
      console.log({ error });
    }
  };

  const showConfirm = (record) => {
    confirm({
      title: "Delete the pharmacy line?",
      icon: <ExclamationCircleFilled />,
      content: "Are you sure you want to delete the pharmacy line?",
      onOk() {
        deleteRecord(record);
      },
      onCancel() {},
    });
  };

  // getting the items to be searched with
  useEffect(() => {
    // if we don't have items, then we get the items
    if (!items.length) {
      dispatch(getItemsSlice());
    }

    if (
      (!pharmacyLineDataSuccess && currentRequest) ||
      postPharmacyLineData?.status === "success" ||
      returnedDrugs
    ) {
      dispatch(getPharmacyLineReturnbyPharmacyNo(currentRequest));
    } else {
      dispatch({ type: GET_PHARMACY_RETURN_LIST_RESET });
    }
  }, [
    items,
    returnedDrugs,
    currentRequest,
    postDrugIssuanceData,
    postPharmacyLineData,
    pharmacyLineDataSuccess,
  ]);

  useEffect(() => {
    dispatch(getPharmacyRequestsAll({ type, status: Status }));
  }, [postArchivePrescriptionData, type, Status]);

  // to track once the pharmacy line has been updated
  useEffect(() => {
    if (postPharmacyLineData) {
      const status = postPharmacyLineData.status;

      message[status === "success" ? status : "error"](
        status === "success"
          ? "Pharmacy line updated successfully"
          : postPharmacyLineData.data.msg
      );

      dispatch({ type: POST_EDIT_PRESCRIPTION_RESET });
    }
    if (postPharmacyLineError) {
      message.error("Something wen't wrong while deleting the pharmacy line");
      dispatch({ type: POST_EDIT_PRESCRIPTION_RESET });
    }
  }, [postPharmacyLineData, postPharmacyLineError]);

  // The archive effect
  useEffect(() => {
    if (postArchivePrescriptionData) {
      const status = postArchivePrescriptionData.status;

      message[status](
        status === "success"
          ? "The prescription has been archived successfully"
          : "Something went wrong when acrchiving the prescription"
      );
      dispatch({ type: POST_ARCHIVE_PRESCRIPTION_RESET });
    }
  }, [postArchivePrescriptionData]);

  // to track once we post the drug issuance
  useEffect(() => {
    if (postDrugIssuanceData) {
      const status = postDrugIssuanceData.status;

      message[status](
        status === "success"
          ? "The prescription has been posted successfully"
          : "Something went wrong when posting the prescription"
      );
    }
  }, [postDrugIssuanceData]);

  // to get a single pharmacy record
  useEffect(() => {
    // We cannot update based on whether we have archived or not because the request will not be found
    if (
      (currentRequest && !pharmacyRecord) ||
      (currentRequest &&
        pharmacyRecord &&
        currentRequest !== pharmacyRecord.Pharmacy_No) ||
      postDrugIssuanceData?.status === "success" ||
      postArchivePrescriptionData?.status === "success"
    ) {
      dispatch(getSinglePharmacyRecord("Pharmacy_No", currentRequest));
      if (postArchivePrescriptionData)
        dispatch({ type: POST_ARCHIVE_PRESCRIPTION_RESET });
      if (postDrugIssuanceData)
        dispatch({ type: POST_PHARMACY_DRUG_ISSUANCE_RESET });
    }
  }, [
    currentRequest,
    pharmacyRecord,
    postDrugIssuanceData,
    postPharmacyLineData,
    postArchivePrescriptionData,
  ]);

  const handleAddDrug = (drugNo) => {
    dispatch(
      postPrescriptionQuantity({
        drugNo,
        pharmacyNo: currentRequest,
        quantity: 0,
        myAction: "create",
      })
    );
  };

  const deleteRecord = (record) => {
    // deleting a pharmacy line
    dispatch(
      postPrescriptionQuantity({
        myAction: "delete",
        recId: record.SystemId,
        pharmacyNo: record.Pharmacy_No,
        quantity: record.Quantity,
        drugNo: record.No,
      })
    );
  };

  const handleRequestChange = (value) => {
    setCurrentRequest(value.split("-").at(-1));
  };

  const handleStatusChange = (value) => {
    setStatus(value);
  };

  const handleArchivePrescription = () => {
    dispatch(postArchivePrescription(currentRequest));
  };

  const handleIssuePrescription = () => {
    dispatch(postDrugIssuance(currentRequest));
  };

  const handlePrintLabels = async () => {
    try {
      const blob = await pdf(
        <PharmacyLabel
          items={pharmacyLineData?.map((pLineData) => ({
            ...pLineData,
            patientName: pharmacyRecord?.Search_Name,
          }))}
        />
      ).toBlob();

      console.log({ pharmacyLineData });

      const blobToBase64 = (blob) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(blob); // This reads the blob as a Data URL (base64 with MIME)
          reader.onloadend = () => {
            const base64data = reader.result;
            // Strip the data prefix to get only the base64 string (optional)
            const base64 = base64data.split(",")[1];
            resolve(base64);
          };
          reader.onerror = reject;
        });
      };

      const base64String = await blobToBase64(blob);
      console.log({ base64String });

      // Displaying the printables
      setViewPDFLabel(() => {
        setPdfLabels(base64String);
        return true;
      });
    } catch (error) {
      console.log({ error: error?.message });
    }
  };

  const handleCloseLabelModal = () => {
    setPdfLabels(null);
    setViewPDFLabel(false);
  };

  return (
    <div style={{ display: "grid", gap: "16px", padding: "16px 0" }}>
      <Title level={4} style={{ color: "#0f5689", marginBottom: "0px" }}>
        {title}
      </Title>
      <SpaceCompact direction="horizontal">
        {!hideSelector && (
          <Select
            showSearch
            options={statuses}
            prefix={<Tag color="#ac8342">Status</Tag>}
            placeholder="Status"
            defaultValue={Status}
            style={{ width: "200px" }}
            onChange={handleStatusChange}
          />
        )}
        <Select
          showSearch
          style={{ width: "400px" }}
          onChange={handleRequestChange}
          placeholder="Select a patient"
          notFoundContent={
            pharmacyRequestsLoading ? <Spin size="small" /> : "No results found"
          }
          options={
            pharmacyRequestsLoading
              ? []
              : pharmacyRequests.map((request) => ({
                  label: (
                    <span>
                      {request.Search_Name} - {request.Link_No}
                    </span>
                  ),
                  value: `${request.Search_Name}-${request.Link_No}-${request.Pharmacy_No}`,
                }))
          }
        />
      </SpaceCompact>
      <Card
        style={{ background: "#00000006" }}
        title={
          <Title
            level={5}
            style={{
              gap: "8px",
              display: "flex",
              color: "#0f5689",
              alignItems: "center",
            }}
          >
            <IdcardOutlined />
            Pharmacy Card
          </Title>
        }
        variant="borderless"
      >
        <div
          style={{
            color: "#0F5689",
            padding: "0 16px",
            borderRadius: "5px",
            fontWeight: "semibold",
          }}
        >
          <Row>
            {pharmacyCardPatientData.map((patientRow) => (
              <Col span={12}>
                {patientRow.map(({ name, value, noBorder }) => (
                  <Row
                    style={{
                      gap: "8px",
                      display: "flex",
                      padding: "8px 16px",
                      borderBottom: !noBorder && "1px solid #ebebeb",
                    }}
                  >
                    <Text strong>{name} :</Text>
                    {` ${
                      pharmacyRecord
                        ? value === "Link_Type" &&
                          pharmacyRecord[value] === "DOCTOR"
                          ? `${pharmacyRecord[value]} (${
                              pharmacyRecord["Doctor_Name"] || "From Reception"
                            })`
                          : pharmacyRecord[value]
                        : ""
                    }`}
                  </Row>
                ))}
              </Col>
            ))}
          </Row>
        </div>
      </Card>
      {currentRequest && pharmacyRecord && (
        <>
          <div style={{ display: "grid", gap: "16px" }}>
            <Form form={form} component={false}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Title
                  level={5}
                  style={{
                    gap: "8px",
                    display: "flex",
                    color: "#0f5689",
                    alignItems: "center",
                  }}
                >
                  <SignatureOutlined />
                  Prescription
                </Title>
                <SpaceCompact direction="horizontal">
                  <Button
                    style={{ height: "32px" }}
                    disabled={
                      disabled ||
                      postDrugIssuanceLoading ||
                      postArchivePrescriptionLoading
                    }
                    onClick={handleArchivePrescription}
                  >
                    Cancel Prescription
                  </Button>
                  <Button
                    type="primary"
                    style={{
                      height:
                        disabled ||
                        postDrugIssuanceLoading ||
                        postArchivePrescriptionLoading
                          ? "32px"
                          : "30px",
                    }}
                    disabled={
                      disabled ||
                      postDrugIssuanceLoading ||
                      postArchivePrescriptionLoading
                    }
                    onClick={handleIssuePrescription}
                  >
                    Issue Drugs
                  </Button>
                  <Button
                    style={{ height: "32px" }}
                    onClick={handlePrintLabels}
                    disabled={!Boolean(pharmacyLineData?.length)}
                  >
                    Print Labels
                  </Button>
                  <Modal
                    destroyOnHidden
                    title="Basic Modal"
                    open={viewPDFLabel}
                    onOk={handleCloseLabelModal}
                    onCancel={handleCloseLabelModal}
                    closable={{ "aria-label": "Custom Close Button" }}
                  >
                    <PDFViewer base64String={pdfLabels} />
                  </Modal>
                </SpaceCompact>
              </div>
              <Table
                components={{
                  body: { cell: EditableCell },
                }}
                bordered
                size="small"
                pagination={false}
                columns={pharmacyCardCurrentSelectionColumns({
                  edit,
                  save,
                  cancel,
                  disabled,
                  completed: pharmacyRecord.Status === "Completed",
                  isEditing,
                  showConfirm,
                })}
                dataSource={[...pharmacyLineData]
                  .sort(
                    ({ line_no: LineNoA }, { line_no: LineNoB }) =>
                      LineNoA - LineNoB
                  )
                  .map((pharmacyLine, Index) => ({
                    ...pharmacyLine,
                    Index: Index + 1,
                  }))}
                loading={pharmacyLineDataLoading || postPharmacyLineLoading}
                summary={(pageData) => {
                  const totalValue = pageData.reduce(
                    (acc, { Quantity, UnitPrice }) =>
                      (acc += Quantity * UnitPrice),
                    0
                  );

                  return pageData.length ? (
                    <TableSummaryRow>
                      <TableSummaryCell index={0} colSpan={9} />
                      <TableSummaryCell index={0}>
                        <Text style={{ fontWeight: "bold", color: "#0f5689" }}>
                          Total
                        </Text>
                      </TableSummaryCell>
                      <TableSummaryCell index={1}>
                        <Text style={{ fontWeight: "bold", color: "#0f5689" }}>
                          {new Intl.NumberFormat("en-US").format(
                            Math.round(totalValue * 1000) / 1000
                          )}
                        </Text>
                      </TableSummaryCell>
                      <TableSummaryCell index={2} />
                    </TableSummaryRow>
                  ) : (
                    <></>
                  );
                }}
              />
            </Form>
          </div>
          <SearchDrugTable
            items={items}
            loading={postPharmacyLineLoading}
            columns={pharmacyCardSearchDrugsColumns(handleAddDrug)}
          />
        </>
      )}
    </div>
  );
};

export default PharmacyCard;
