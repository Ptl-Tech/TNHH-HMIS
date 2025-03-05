import { useLocation } from "react-router-dom";
import { createContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Button,
  Col,
  Divider,
  Drawer,
  Dropdown,
  Input,
  message,
  Modal,
  Row,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import { CloseOutlined, SearchOutlined } from "@ant-design/icons";

import Loading from "../../partials/nurse-partials/Loading";
import { createTriageVisit } from "../../actions/patientActions";
import { TRIAGE_VISIT_RESET } from "../../constants/patientConstants";
import { getLabRequest } from "../../actions/lab-actions/getLabRequest";
import { getLabTestCodes } from "../../actions/lab-actions/getLabTestCodes";
import { getSinglePatient } from "../../actions/reception-actions/getSinglePatient";
import { createLabTestHeader } from "../../actions/lab-actions/createLabTestHeader";
import { POST_LAB_HEADER_RESET } from "../../actions/lab-actions/createLabTestHeader";
import dayjs from "dayjs";
import { AiOutlineMore } from "react-icons/ai";
import {
  POST_LAB_TEST_LINES_RESET,
  postLabTestLines,
} from "../../actions/lab-actions/postLabTestLines";
import { getLabDetails } from "../../actions/Doc-actions/getLabRequestDetails";
import {
  POST_LAB_TEST_LINES_UPDATE_RESET,
  updateLabTestLines,
} from "../../actions/lab-actions/updateLabTestLines";

export const DispatchWalkInPatient = () => {
  const { pathname } = useLocation();

  const patientId = pathname.split("/").splice(-1, 1)[0];
  const [openLabDispatch, setOpenLabDispatch] = useState(false);
  const [openPharmacyDispatch, setOpenPharmacyDispatch] = useState(false);
  const [openRadiologyDispatch, setOpenRadiologyDispatch] = useState(false);
  const {
    data: postLabTesLinesData,
    loading: postLabTesLinesLoading,
    error: postLabTesLinesError,
  } = useSelector((state) => state.postLabTestLines);

  // These clinics are as they are described in the backend
  const clinics = ["LAB", "PHARMACY", "PSYCHIATRIST", "PSYCHOLOGIST"];

  const dispatch = useDispatch();

  const {
    data: existingPatient,
    error,
    loading,
  } = useSelector((state) => state.getSinglePatient);
  const [currentKeys, setCurrentKeys] = useState([]);
  const [currentLabRecord, setCurrentLabRecord] = useState(null);
  const {
    loading: visitLoading,
    error: visitError,
    success: visitSuccess,
    data: visitPayload,
  } = useSelector((state) => state.createTriageVisit);
  const {
    data: labTestHeaderData,
    loading: labTestHeaderLoading,
    error: labTestHeaderError,
  } = useSelector((state) => state.createLabTestHeader);
  const {
    data: labHeaderData,
    error: labHeaderError,
    loading: labHeaderLoading,
  } = useSelector((state) => state.getLabRequest);
  const {
    data: updateLabTestLinesData,
    error: updateLabTestLinesError,
    loading: updateLabTestLinesLoading,
  } = useSelector((state) => state.updateLabTestLines);

  // handles getting the lab request that exists
  useEffect(() => {
    if (existingPatient?.ActiveVisitNo || labTestHeaderData) {
      dispatch(getLabRequest("LinkNo", existingPatient?.ActiveVisitNo));
    }
  }, [existingPatient?.ActiveVisitNo, labTestHeaderData]);

  // handles creating the visit
  useEffect(() => {
    if (!existingPatient || patientId !== existingPatient.PatientNo) {
      dispatch(getSinglePatient(patientId));
    }

    if (visitError || visitSuccess) dispatch({ type: TRIAGE_VISIT_RESET });

    if (visitLoading) message.info("Creating a visit and creating a request.");

    if (visitSuccess) {
      createLabHeader();
    }

    if (visitError)
      message.error("Patient visit could not be created. Please try again");
  }, [existingPatient, visitSuccess, visitError]);

  // handles creating the lab header
  useEffect(() => {
    if (labTestHeaderData) {
      const { status, laboratoryNo } = labTestHeaderData;
      addLabTestLines(laboratoryNo);
    }

    if (existingPatient?.ActiveVisitNo && labTestHeaderLoading) {
      message.info("Creating the lab request");
    }

    if (labTestHeaderError) {
      message.error(
        "Something went wrong when creating a lab header, Please try again later."
      );
      dispatch({ type: POST_LAB_HEADER_RESET });
    }
  }, [labTestHeaderError, labTestHeaderLoading, labTestHeaderData]);

  // handles creating the lab test lines
  useEffect(() => {
    if (postLabTesLinesData) {
      message.success("The request has been dispatched successfully");
      dispatch({ type: POST_LAB_HEADER_RESET });
      dispatch({ type: POST_LAB_TEST_LINES_RESET });
    }

    if (postLabTesLinesError) {
      message.error("Something went wrong while creating the lab test lines");
      dispatch({ type: POST_LAB_TEST_LINES_RESET });
    }
  }, [postLabTesLinesData, postLabTesLinesError]);

  // handles updating the lab test lines
  useEffect(() => {
    if (updateLabTestLinesData?.status === "success") {
      message.success("The test lines have been updated successfully");
      dispatch({ type: POST_LAB_TEST_LINES_UPDATE_RESET });
    }

    if (updateLabTestLinesLoading) {
      message.info("Updating the lab test lines");
    }

    if (updateLabTestLinesError) {
      message.error("We could not update the lab test lines");
      dispatch({ type: POST_LAB_TEST_LINES_UPDATE_RESET });
    }
  }, [
    updateLabTestLinesData,
    updateLabTestLinesError,
    updateLabTestLinesLoading,
  ]);

  const addLabTestLines = (laboratoryNo) => {
    dispatch(
      postLabTestLines(
        laboratoryNo,
        currentKeys.map(({ Code }) => ({
          labTestCode: Code,
          specimenCode: "",
          unitOfMeasure: "",
        }))
      )
    );
    setOpenLabDispatch(false);
  };

  const createLabHeader = () => {
    // after creatnig the visit if it did not exist, then we need to create the lab header
    const dataToSubmit = {
      myAction: "create",
      cashSale: false,
      visitNo: existingPatient.ActiveVisitNo,
      patientNo: existingPatient.PatientNo,
      status: 0, //0 means NEW
    };

    dispatch(createLabTestHeader(dataToSubmit));
  };

  const handleOpenLab = (recordNo) => {
    setOpenLabDispatch(true);
    if (recordNo) setCurrentLabRecord(recordNo);
  };

  const handleEdit = async (initialKeys, currentKeys) => {
    console.log({ initialKeys });

    const itemsToDelete = initialKeys
      .filter(
        (key) =>
          !currentKeys.find((item) => item.Code === key.LaboratoryTestCode)
      )
      .map((item) => ({
        ...item,
        myAction: "delete",
        laboratoryNo: item.Laboratory_No,
        recId: item.SystemId,
        labTestCode: item.LaboratoryTestCode,
        specimenCode: "",
        unitOfMeasure: "",
      }));
    const itemsToAdd = currentKeys
      .filter(
        (key) =>
          !initialKeys.find((item) => item.LaboratoryTestCode === key.Code)
      )
      .map((item) => ({
        ...item,
        laboratoryNo: currentLabRecord,
        myAction: "create",
        labTestCode: item.Code,
        specimenCode: "",
        unitOfMeasure: "",
      }));

    setOpenLabDispatch(false);

    dispatch(updateLabTestLines([...itemsToAdd, ...itemsToDelete]));
  };

  const handleLabSubmit = async (keys) => {
    setCurrentKeys(keys);

    // first create a visit so that we can have an appointment no AKA a visit no. only if we did not have it
    if (!existingPatient.ActiveVisitNo) {
      const {
        PatientNo,
        PatientType,
        InsuranceNo,
        InsuranceName,
        PrincipalMemberName,
        Principal,
        MembershipNo,
        SchemeName,
      } = existingPatient;

      const dataToCreateVisit = {
        patientNo: PatientNo,
        clinic: clinics[0],
        doctor: "",
        paymentMode: PatientType === "Cash" ? 0 : 1,
        insuranceNo: InsuranceNo,
        insuranceName: InsuranceName,
        insurancePrincipalMemberName: PrincipalMemberName || "",
        isPrincipleMember: Principal,
        membershipNo: MembershipNo,
        schemeName: SchemeName,
      };

      dispatch(createTriageVisit(dataToCreateVisit));
    } else {
      // we want to call the function that creates a lab header
      createLabHeader();
    }
  };

  const handleOpenPharmacy = () => {
    setOpenPharmacyDispatch(true);
  };

  const handleOpenRadiology = () => {
    setOpenRadiologyDispatch(true);
  };

  const rowData = [
    {
      title: "Personal Details",
      data: [
        {
          type: "content",
          highlighted: "#006d75",
          data: { label: "Patient Number", value: "PatientNo" },
        },
        {
          type: "content",
          highlighted: "#fa8c16",
          data: { label: "Full Name", value: "SearchName" },
        },
        {
          type: "content",
          data: { label: "Gender", value: "Gender" },
        },
        {
          type: "content",
          data: { label: "Residence", value: "PlaceofBirthVillage" },
        },
        {
          type: "content",
          data: { label: "Email", value: "Email" },
        },
        {
          type: "content",
          data: { label: "Phone Number", value: "TelephoneNo1" },
        },
      ],
    },
    {
      title: "Patient Status",
      data: [
        {
          type: "content",
          highlighted: (value) => (value ? "#237804" : "#ad4e00"),
          data: { label: "Appointment No", value: "ActiveVisitNo" },
        },
        {
          type: "content",
          highlighted: (value) => (value ? "#237804" : "#ad4e00"),
          data: { label: "Activated", value: "Activated" },
        },
        {
          type: "content",
          highlighted: "#006d75",
          data: { label: "Status", value: "Status" },
        },
      ],
    },
    {
      title: "Dispatches",
      data: [
        {
          type: "buttons",
          data: [
            {
              buttonType: "primary",
              data: {
                disabled: "Dispatch to Lab",
                active: "Dispatch to Lab",
              },
              style: {
                display: "inline",
                width: "fit-content",
              },
              onClick: () => handleOpenLab(),
              disabled: () => !!labHeaderData,
            },
            {
              buttonType: "primary",
              data: {
                disabled: "Dispatch to Pharmacy",
                active: "Dispatch to Pharmacy",
              },
              style: {
                display: "inline",
                width: "fit-content",
              },
              onClick: () => handleOpenPharmacy(),
              disabled: (value) => false,
            },
            {
              buttonType: "primary",
              data: {
                disabled: "Dispatch to Radiology",
                active: "Dispatch to Radiology",
              },
              style: {
                display: "inline",
                width: "fit-content",
              },
              onClick: () => handleOpenRadiology(),
              disabled: (value) => false,
            },
          ],
        },
      ],
    },
  ];

  const getArrayItem = (initialItem, itemsToAdd) => {
    if (initialItem) {
      var newItem = { ...initialItem };
      itemsToAdd.map(
        (itemToAdd) => (newItem[itemToAdd["key"]] = itemToAdd["value"])
      );
      return newItem;
    } else {
      return initialItem;
    }
  };

  const newLabHeaderDataValues = [
    { key: "RequestType", value: "LAB" },
    { key: "RequestNo", value: labHeaderData?.LaboratoryNo },
    { key: "CreationDate", value: labHeaderData?.LaboratoryDate },
    { key: "CreationTime", value: labHeaderData?.LaboratoryTime },
  ];

  const tableData = [
    getArrayItem(labHeaderData, newLabHeaderDataValues),
  ].reduce((acc, curr) => {
    return curr ? [...acc, curr] : acc;
  }, []);

  const generateCellData = (cellData, index) => {
    return (
      <>
        {cellData.type === "content" ? (
          <InfoRow
            key={index}
            cellData={cellData}
            patientData={existingPatient}
          />
        ) : cellData.type === "buttons" ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {cellData.data.map((button, index) => (
              <Button
                key={`button${index}`}
                style={button.style}
                type={button.buttonType}
                disabled={button.disabled(existingPatient?.Status)}
                onClick={() => button.onClick(existingPatient?.LaboratoryNo)}
              >
                {button.disabled ? button.data.disabled : button.data.active}
              </Button>
            ))}
          </div>
        ) : null}
      </>
    );
  };

  return (
    <div
      style={{
        display: "grid",
        alignContent: "flex-start",
        gap: "16px",
        padding: "16px",
      }}
    >
      <div
        style={{
          display: "grid",
          alignContent: "flex-start",
          gap: "8px",
        }}
      >
        <h4 style={{ color: "#3f3f3f" }}>Dispatch Patient</h4>
        {existingPatient ? (
          <Row gutter={[16, 16]}>
            {rowData.map((colData, index) => (
              <Col
                key={`${colData.title}${index}`}
                md={{ span: 8 }}
                xs={{ span: 24 }}
                style={{
                  display: "grid",
                  alignContent: "flex-start",
                  gap: "8px",
                }}
              >
                <Typography.Title level={5} style={{ color: "#0F5689" }}>
                  {colData.title}
                </Typography.Title>
                {colData.data.map((cellData, idx) =>
                  generateCellData(
                    cellData,
                    `$
              {index}${idx}`
                  )
                )}
              </Col>
            ))}
          </Row>
        ) : (
          <Loading />
        )}
      </div>
      <LabDispatchDrawer
        open={openLabDispatch}
        title={"Laboratory Dispatch"}
        onEdit={handleEdit}
        currentLabRecord={currentLabRecord}
        onClose={() => setOpenLabDispatch(false)}
        onSubmit={(keys) => handleLabSubmit(keys)}
      />
      <Divider orientation="left">
        <span style={{ color: "#0F5689" }}>Dispatches Made</span>
      </Divider>
      {existingPatient ? (
        <DispatchesTable
          data={tableData}
          loading={labHeaderLoading}
          handleOpenLab={handleOpenLab}
        />
      ) : null}
    </div>
  );
};

const DispatchesTable = ({ data, handleOpenLab, loading }) => {
  const dispatch = useDispatch();
  // TODO: this will be done once we get the last API for submitting the lab tests of the lab header
  const handleOpenEditRequest = (record) => {
    handleOpenLab(record.RequestNo);
  };

  // handle forwading the lab request to it's department
  const handleForwardRequest = ({ SystemId, Cash_Sale, LinkNo, PatientNo }) => {
    dispatch(
      createLabTestHeader({
        myAction: "edit",
        recId: SystemId,
        cashSale: Cash_Sale,
        visitNo: LinkNo,
        patientNo: PatientNo,
        status: 1,
      })
    );
  };

  const columns = [
    {
      title: "Request Number",
      key: "RequestNo",
      dataIndex: "RequestNo",
    },
    {
      title: "Status",
      key: "Status",
      dataIndex: "Status",
    },
    {
      title: "Created On",
      key: "RequestNo",
      dataIndex: "RequestNo",
      render: (data, record) => {
        return dayjs(
          `${record?.LaboratoryDate} ${record?.LaboratoryTime}`
        ).format("MMMM D, YYYY h:mm A");
      },
    },
    {
      align: "right",
      title: "Actions",
      render: (_, record) => (
        <TestMenu
          record={record}
          handleEditRequest={handleOpenEditRequest}
          handleForwardRequest={handleForwardRequest}
        />
      ),
    },
  ];

  return (
    <>
      <Table
        bordered
        dataSource={data}
        columns={columns}
        loading={loading}
        pagination={false}
        rowClassName={(record) =>
          record.Status !== "New" ? "disabled-row" : ""
        }
      />
    </>
  );
};

const LabDispatchDrawer = ({
  open,
  title,
  onEdit,
  onClose,
  onSubmit,
  currentLabRecord,
}) => {
  const dispatch = useDispatch();

  const searchInput = useRef(null);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const { data, loading, error } = useSelector(
    (state) => state.getLabTestCodes
  );
  // These are the lab test lines, and they are for a particular header
  const { data: labDetailsData } = useSelector((state) => state.labDetails);

  // handles updating the selected keys if the lab test lines are more than 0
  useEffect(() => {
    if (labDetailsData.length)
      setSelectedRowKeys(
        labDetailsData.map((dataItem) => dataItem.LaboratoryTestCode)
      );
  }, [labDetailsData]);

  // handles getting the current lab test lines, setting the selected keys and getting all the lab test codes
  useEffect(() => {
    // we need to get the current lab request
    if (currentLabRecord && open) {
      dispatch(getLabDetails(currentLabRecord));
    } else {
      setSelectedRowKeys([]);
    }
    dispatch(getLabTestCodes());
  }, [currentLabRecord, open]);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters, confirm) => {
    clearFilters();
    setSearchText("");
    setSearchedColumn("");
    confirm();
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters, confirm)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            Close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    filterDropdownProps: {
      onOpenChange(open) {
        if (open) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    },
  });

  const columns = [
    {
      title: "Code",
      key: "Code",
      dataIndex: "Code",
      ...getColumnSearchProps("Code"),
    },
    {
      title: "Test Name",
      key: "Description",
      dataIndex: "Description",
      ...getColumnSearchProps("Description"),
    },
    {
      title: "Amount",
      key: "Amount",
      dataIndex: "Amount",
    },
    {
      title: "Measurement Proc",
      key: "MeasurementProc",
      dataIndex: "MeasurementProc",
      render: (item) => (item ? item : "N/A"),
      ...getColumnSearchProps("MeasurementProc"),
    },
  ];

  const onSelectChange = (newSelectedRowKeys) => {
    console.log({ newSelectedRowKeys });
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const handleRemoveKey = (key) => {
    const newSelectedKeys = Array.from(selectedRowKeys);
    const indexToRemove = selectedRowKeys.findIndex((item) => item === key);
    newSelectedKeys.splice(indexToRemove, 1);
    setSelectedRowKeys(newSelectedKeys);
  };

  const rowSelection = { selectedRowKeys, onChange: onSelectChange };

  return (
    <Drawer
      size="large"
      open={open}
      title={title}
      onClose={onClose}
      extra={
        <Space>
          <Button
            type="primary"
            onClick={() =>
              currentLabRecord
                ? onEdit(
                    labDetailsData,
                    selectedRowKeys.map((selectedRowKey) =>
                      data.find((dataItem) => dataItem.Code === selectedRowKey)
                    )
                  )
                : onSubmit(
                    selectedRowKeys.map((selectedRowKey) =>
                      data.find((dataItem) => dataItem.Code === selectedRowKey)
                    )
                  )
            }
          >
            {currentLabRecord ? "Update Request" : "Submit Request"}
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </Space>
      }
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          justifyContent: "start",
        }}
      >
        <Space>
          <span style={{ whiteSpace: "nowrap" }}>Selected tests:</span>
          {!!selectedRowKeys.length && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
              }}
            >
              {selectedRowKeys.map((selectedRowKey) => (
                <Tag
                  key={selectedRowKey}
                  onClick={() => handleRemoveKey(selectedRowKey)}
                  style={{ cursor: "pointer" }}
                >
                  <Space>
                    {
                      data.find((item) => item.Code === selectedRowKey)
                        ?.Description
                    }
                    <CloseOutlined style={{ color: "orangered" }} />
                  </Space>
                </Tag>
              ))}
            </div>
          )}
        </Space>
        <Table
          bordered
          dataSource={data.map((dataItem) => ({
            key: dataItem.Code,
            ...dataItem,
          }))}
          loading={loading}
          columns={columns}
          pagination={false}
          rowSelection={rowSelection}
        />
      </div>
    </Drawer>
  );
};

const TestMenu = ({ record, handleEditRequest, handleForwardRequest }) => {
  const [modal, contextHolder] = Modal.useModal();
  const ReachableContext = createContext(null);

  const config = {
    title: "Forward Request",
    content: (
      <>
        <p>
          Are you sure you want to forward this request? You will not be able to
          make further changes on it
        </p>
      </>
    ),
  };

  const items = [
    {
      key: "1",
      label: <div onClick={() => handleEditRequest(record)}>Edit Request</div>,
    },
    {
      key: "2",
      label: (
        <ReachableContext.Provider value="Light">
          <div
            onClick={async () => {
              const confirmed = await modal.confirm(config);
              if (confirmed) {
                handleForwardRequest(record);
              }
            }}
          >
            Forward Request
          </div>
          {contextHolder}
        </ReachableContext.Provider>
      ),
    },
  ];

  return (
    <Dropdown
      menu={{ items }}
      placement="bottomRight"
      arrow={{ pointAtCenter: true }}
    >
      <AiOutlineMore size={28} />
    </Dropdown>
  );
};

const InfoRow = ({ cellData, patientData }) => {
  const { data, highlighted } = cellData;

  if (!patientData) return;

  let color = "gray";
  let value = patientData[data.value];

  if (highlighted)
    color = typeof highlighted === "string" ? highlighted : highlighted(value);
  value = typeof value === "boolean" ? (value ? "TRUE" : "FALSE") : value;

  return (
    <Typography.Text level={5} style={{ display: "block", fontWeight: "bold" }}>
      <span>{`${data.label} :`}</span>
      <span style={{ color }}>{` ${value}` || "N/A"}</span>
    </Typography.Text>
  );
};
