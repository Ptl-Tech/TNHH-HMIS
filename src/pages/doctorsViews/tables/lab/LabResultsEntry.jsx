import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Flex,
  Form,
  Input,
  Space,
  Table,
  Drawer,
  Button,
  message,
  Typography,
  InputNumber,
  Skeleton,
} from "antd";

// draftjs components
import StarterKit from "@tiptap/starter-kit";
import Strike from "@tiptap/extension-strike";
import { EditorContent, useEditor, FloatingMenu } from "@tiptap/react";

import { labLinesColumns, labResultsColumns } from "./utils";

import Loading from "../../../../partials/nurse-partials/Loading";
import SkeletonLoading from "../../../../partials/nurse-partials/Skeleton";

import {
  postLabTestResults,
  POST_LAB_TEST_RESULTS_RESET,
} from "../../../../actions/lab-actions/postLabTestResults";
import { getLabTestResults } from "../../../../actions/lab-actions/getLabTestResults";
import { getSingleLabDetails } from "../../../../actions/Doc-actions/getSingleLabRequestDetails";
import WYSIWYGEditor from "../../../../components/WYSIWYGEditor";

const LabResultsEntry = ({ data, loading }) => {
  // state
  const [openResults, setOpenResults] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);

  const showResultsDrawer = (record) => {
    setCurrentRecord(record);
    setOpenResults(true);
  };

  const handleResultsOk = () => {
    setCurrentRecord(null);
    setOpenResults(false);
  };

  const handleResultsCancel = () => {
    setCurrentRecord(null);
    setOpenResults(false);
  };

  const { Title } = Typography;

  const columns = [
    ...labLinesColumns,
    {
      align: "right",
      title: "Add results",
      render: (_, record) => {
        return (
          <Button
            type="primary"
            onClick={() => {
              showResultsDrawer(record);
            }}
          >
            Add Test Results
          </Button>
        );
      },
    },
  ];

  return (
    <div>
      <Title level={5} style={{ color: "#0F5689", marginBottom: "12px" }}>
        Results Recording
      </Title>
      {loading ? (
        <Loading />
      ) : (
        <>
          <Table
            rowClassName={(record) =>
              !record.Sample_Collected ? "disabled-row" : "editable-row"
            }
            columns={columns}
            dataSource={data}
            pagination={false}
          />
          <ResultsDrawer
            open={openResults}
            record={currentRecord}
            handleOk={handleResultsOk}
            handleCancel={handleResultsCancel}
          />
        </>
      )}
    </div>
  );
};

const ResultsDrawer = ({ record, open, handleOk, handleCancel }) => {
  const dispatch = useDispatch();

  // These are the lab line tests
  const { data: resultsData, loading: resultsLoading } = useSelector(
    (state) => state.getLabTestResults
  );

  const isNarration = resultsData?.find(
    ({ Result_Type }) => Result_Type === "Narration"
  );

  const { LaboratoryTestName } = record || {};
  const { Laboratory_No: labNo, LaboratoryTestCode: testCode } = record || {};

  useEffect(() => {
    if (record) dispatch(getLabTestResults({ labNo, testCode }));
  }, [record]);

  console.log({ record });

  return (
    <Drawer
      open={open}
      size="large"
      onOk={handleOk}
      onCancel={() => {
        setRemarks("");
        handleCancel();
      }}
      closeIcon={null}
      destroyOnHidden={true}
      title={`Results for ${LaboratoryTestName}`}
      extra={<Button onClick={handleCancel}>Close</Button>}
    >
      {resultsLoading ? (
        <SkeletonLoading />
      ) : isNarration ? (
        <WYSIWYGContainer
        handleClose={handleOk}
          initialData={resultsData}
          currentLabLine={{
            recId: record?.SystemId,
            laboratoryNo: record?.Laboratory_No,
            testCode: record?.LaboratoryTestCode,
          }}
        />
      ) : (
        <ResultsTable
          loading={resultsLoading}
          initialData={resultsData}
          currentLabLine={{
            recId: record?.SystemId,
            laboratoryNo: record?.Laboratory_No,
          }}
        />
      )}
    </Drawer>
  );
};

const WYSIWYGContainer = ({ initialData, currentLabLine, handleClose }) => {
  const dispatch = useDispatch();
  const {
    Flag,
    Results,
    Reactive,
    Specimen_Code,
    Laboratory_Test_Code,
    SystemId: TestLineSystemId,
  } = initialData[0] || {};

  console.log({ currentLabLine });

  const { recId, testCode, laboratoryNo } = currentLabLine;

  const {
    data: labResultsData,
    error: labResultsError,
    loading: labResultsLoading,
  } = useSelector((state) => state.postLabTestResults);
  const { data: singleLabDetails, loading: singleLabDetailsLoading } =
    useSelector((state) => state.singleLabDetails);

  useEffect(() => {
    // fetching the current lab request both initially and after we have changed the remarks
    dispatch(getSingleLabDetails(laboratoryNo, recId));
  }, [labResultsData]);

  useEffect(() => {
    if (labResultsData) {
      const { labResults, labRemarks } = labResultsData;
      labRemarks?.status === "success" && labResults?.status === "success"
        ? message.success("Results submitted successfully!")
        : message.error("Something went wrong!");
      dispatch({ type: POST_LAB_TEST_RESULTS_RESET });
      handleClose()
    }

    if (labResultsError) {
      message.error(labResultsError);
      dispatch({ type: POST_LAB_TEST_RESULTS_RESET });
    }

    if (labResultsLoading) message.info("Submitting the results");
  }, [labResultsData, labResultsLoading, labResultsError]);

  const { Positive, SystemId, MeasuringUnitCode, LaboratoryTestCode } =
    singleLabDetails || {};

  const handleSubmit = (remarks) => {
    if (!(recId && SystemId)) return;

    const results = [
      {
        Results,
        Positive,
        Reactive,
        flag: Flag,
        Specimen_Code,
        Remarks: remarks,
        SystemId: TestLineSystemId,
        Laboratory_No: laboratoryNo,
        Measuring_Unit_Code: MeasuringUnitCode,
        Laboratory_Test_Code: LaboratoryTestCode,
      },
    ];

    dispatch(postLabTestResults([...results], ""));
  };

  return (
    <Skeleton loading={singleLabDetailsLoading}>
      <WYSIWYGEditor
        handleSubmit={handleSubmit}
        content={initialData[0]?.Remarks || ""}
      />
    </Skeleton>
  );
};

const EditableCell = ({
  dataIndex,
  inputType,
  editing,
  children,
  record,
  handleSave,
  ...props
}) => {
  const { Item } = Form;
  const [value, setValue] = useState(
    inputType === "number" ? parseFloat(children) || 0 : children || ""
  );

  const handleChange = (newValue) => {
    setValue(newValue);
    handleSave(record.Specimen_Code, dataIndex, newValue);
  };

  const inputNode =
    inputType === "number" ? (
      <InputNumber value={value} onChange={handleChange} />
    ) : (
      <Input value={value} onChange={(e) => handleChange(e.target.value)} />
    );

  return (
    <td {...props}>
      {editing ? (
        <Item name={dataIndex} style={{ margin: 0 }}>
          {inputNode}
        </Item>
      ) : (
        children
      )}
    </td>
  );
};

const ResultsTable = ({ loading, initialData, currentLabLine }) => {
  const { TextArea } = Input;
  const { Item, useForm } = Form;

  const { recId, laboratoryNo } = currentLabLine;

  const [form] = useForm();
  const dispatch = useDispatch();

  const {
    data: labResultsData,
    error: labResultsError,
    loading: labResultsLoading,
  } = useSelector((state) => state.postLabTestResults);
  const {
    data: singleLabDetails,
    error: singleLabDetailsError,
    loading: singleLabDetailsLoading,
  } = useSelector((state) => state.singleLabDetails);

  const [results, setResults] = useState(
    [...initialData].map((item) => ({ ...item }))
  );
  const [editingKey, setEditingKey] = useState(null);
  const [remarks, setRemarks] = useState(singleLabDetails?.Remarks || "");

  useEffect(() => {
    // fetching the current lab request both initially and after we have changed the remarks
    dispatch(getSingleLabDetails(laboratoryNo, recId));
  }, [labResultsData]);

  // This will set the remarks to be the value of the singleLabDetails after it loads
  useEffect(() => {
    if (singleLabDetails) setRemarks(singleLabDetails?.Remarks);
  }, [singleLabDetails]);

  useEffect(() => {
    if (labResultsData) {
      const { labResults, labRemarks } = labResultsData;
      labRemarks?.status === "success" && labResults?.status === "success"
        ? message.success("Results submitted successfully!")
        : message.error("Something went wrong!");
      dispatch({ type: POST_LAB_TEST_RESULTS_RESET });
    }

    if (labResultsError) {
      message.error(labResultsError);
      dispatch({ type: POST_LAB_TEST_RESULTS_RESET });
    }

    if (labResultsLoading) message.info("Submitting the results");
  }, [labResultsData, labResultsLoading, labResultsError]);

  const {
    Positive,
    SystemId,
    CountValue,
    SpecimenCode,
    MeasuringUnitCode,
    LaboratoryTestCode,
  } = singleLabDetails || {};

  const isEditing = (record) => record.Specimen_Code === editingKey;

  const handleSave = (key, dataIndex, value) => {
    setResults((prevResults) =>
      prevResults.map((item) =>
        item.Specimen_Code === key ? { ...item, [dataIndex]: value } : item
      )
    );
  };

  const columns = labResultsColumns.map((col) => {
    if (!col.editable) return col;

    return {
      ...col,
      onCell: (record) => ({
        record,
        handleSave,
        dataIndex: col.dataIndex,
        editing: isEditing(record),
        inputType: col.dataIndex === "Results" ? "number" : "text",
      }),
    };
  });

  const edit = (record) => {
    if (!record) return;
    form.setFieldsValue(record);
    setEditingKey(record.Specimen_Code);
  };

  const handleSubmit = () => {
    if (!(recId && SystemId)) return;

    const finalData = {
      recId,
      remarks,
      laboratoryNo,
      myAction: "edit",
      positive: Positive,
      countValue: CountValue,
      specimenCode: SpecimenCode,
      labTestCode: LaboratoryTestCode,
      unitOfMeasure: MeasuringUnitCode,
    };

    if (editingKey) {
      setEditingKey(null);
    } else {
      dispatch(postLabTestResults([...results], finalData));
    }
  };

  return (
    <>
      {loading || singleLabDetailsLoading ? (
        <SkeletonLoading />
      ) : (
        <Form form={form} layout="vertical" component={false} clearOnDestroy>
          <Space direction="vertical" className="gap-3 m-0 p-0 d-grid">
            <Space direction="vertical" className="d-grid">
              <h6 className="text-main-primary">Results</h6>
              <Table
                columns={columns}
                pagination={false}
                dataSource={results}
                className="d-block"
                rowClassName={"editable-row"}
                onRow={(record) => ({
                  onClick: () => edit(record),
                })}
                components={{ body: { cell: EditableCell } }}
              />
            </Space>
            <Item
              layout="vertical"
              label={<h6 className="text-main-primary">Comments</h6>}
            >
              <TextArea
                value={remarks}
                defaultValue={remarks}
                onChange={(e) => {
                  setRemarks(e.target.value);
                }}
              />
            </Item>
            <Flex justify="end">
              <Button
                type="primary"
                onClick={handleSubmit}
                disabled={labResultsLoading}
              >
                {labResultsLoading
                  ? "Loading..."
                  : editingKey
                  ? "Preview"
                  : "Submit"}
              </Button>
            </Flex>
          </Space>
        </Form>
      )}
    </>
  );
};

export default LabResultsEntry;
