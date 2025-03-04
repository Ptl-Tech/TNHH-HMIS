import { Button, Table } from "antd";
import PropTypes from "prop-types";
import { FolderViewOutlined } from "@ant-design/icons";

const CarePlanFormTable = ({
  getCarePlan,
  loadingGetCarePlan,
  setIsFormVisible,
  form,
  setIsViewing
}) => {
  
  const handleShowRecord = (record) => {
    // Filter out undefined/null fields before setting values
    console.log('records from the view', record);
    const sanitizedRecord = Object.keys(record).reduce((acc, key) => {
      if (record[key] !== undefined && record[key] !== null) {
        acc[key] = record[key];
      }
      return acc;
    }, {});
    form.resetFields();
    form.setFieldsValue(sanitizedRecord);
    setIsFormVisible(true);
    setIsViewing(true);
  };
  return (
    <Table
      bordered
      rowKey={"SystemId"}
      style={{ paddingTop: "20px" }}
      dataSource={getCarePlan}
      loading={loadingGetCarePlan}
      scroll={{ x: 1500 }}
      columns={[
        {
          title: "Date",
          dataIndex: "Date",
          key: "Date",
          fixed: "left",
          width: 150,
          render: (text, record) => (
            <span style={{ fontSize: "14px", fontWeight: "bold", color: "#0f5689" }}>
              {new Date(record.Date).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          )
        },
        {
          title: "Admission Number",
          dataIndex: "Admission_No",
          key: "Admission_No",
          render: (text, record) => (
            <span style={{ fontSize: "14px", fontWeight: "bold", color: "#0f5689" }}>
              {record.Admission_No}
            </span>
          )
        },
        {
          title: "Physical Exam",
          dataIndex: "Physical_Assessmet_MSA",
          key: "Physical_Assessmet_MSA",
        },
        {
          title: "Evaluation",
          dataIndex: "Evaluation",
          key: "Evaluation",
        },
        {
          title: "Implementation",
          dataIndex: "Implementation",
          key: "Implementation",
        },
        {
          title: "Nursing_Diagnosis",
          dataIndex: "Nursing_Diagnosis",
          key: "Nursing_Diagnosis",
        },
        {
          title: "Action",
          dataIndex: "action",
          key: "action",
          fixed: "right",
          width: 180,
          render: (_, record) => (
            <Button
            type="primary"
              style={{ color: "white" }}
              onClick={() => handleShowRecord(record)}
              icon={<FolderViewOutlined />}
            >
              View Care Plan
            </Button>
          ),
        },
      ]}
    />
  );
};

export default CarePlanFormTable;
// props validation
CarePlanFormTable.propTypes = {
  getCarePlan: PropTypes.array.isRequired,
  loadingGetCarePlan: PropTypes.bool.isRequired,
  setIsFormVisible: PropTypes.bool.isRequired,
  form: PropTypes.array.isRequired,
  setIsViewing: PropTypes.bool
};
