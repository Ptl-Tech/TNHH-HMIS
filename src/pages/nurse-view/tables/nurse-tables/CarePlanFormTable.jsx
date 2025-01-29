import { Button, Table } from "antd";
import PropTypes from "prop-types";
import { FolderViewOutlined } from "@ant-design/icons";

const CarePlanFormTable = ({
  getCarePlan,
  loadingGetCarePlan,
  setIsFormVisible,
  form,
  patientDetails,
  setIsViewing
}) => {
  const filterPatient = getCarePlan.filter(
    (patient) => patient.Admission_No === patientDetails?.Admission_No
  );

  const handleShowRecord = (record) => {
    // Filter out undefined/null fields before setting values
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
      style={{ paddingTop: "20px" }}
      dataSource={filterPatient}
      loading={loadingGetCarePlan}
      scroll={{ x: 1500 }}
      columns={[
        {
          title: "Date",
          dataIndex: "Date",
          key: "Date",
          fixed: "left",
          width: 150,
        },
        {
          title: "Admission Number",
          dataIndex: "Admission_No",
          key: "Admission_No",
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
          width: 150,
          render: (_, record) => (
            <Button
              style={{ color: "#0f5689" }}
              onClick={() => handleShowRecord(record)}
              icon={<FolderViewOutlined />}
            >
              View
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
  patientDetails: PropTypes.array.isRequired,
  setIsViewing: PropTypes.bool
};
