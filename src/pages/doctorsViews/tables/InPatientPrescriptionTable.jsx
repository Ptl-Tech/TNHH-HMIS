import Loading from "../../../partials/nurse-partials/Loading";
import PropTypes from "prop-types";
import RowSelectionTable from "../../../partials/doc-partials/RowSelectionTable";
import { Table, Tag, Typography } from "antd";

const PrescriptionTable = ({ loadingPrescriptions, filteredPrescriptions }) => {
  const handleEdit = (record) => {
    console.log("Edit clicked for record:", record);
  };

  const columns = [
    {
        title: "#",
        dataIndex: "key",
        key: "key",
        render: (text, record, index) => index + 1,
        fixed: "left",
        width: 50,

    },
    {
      title: "Admission No",
      dataIndex: "Admission_No",
      key: "Admission_No",
      fixed: "left",
      width: 150,
      render: (text) => (
        <Typography.Text style={{ color: "#b96000", fontWeight: "bold" }}>
          {text}
        </Typography.Text>
      ),
    },
    {
      title: "Drug No",
      dataIndex: "Drug_No",
      key: "Drug_No",
    },
    {
      title: "Drug Name",
      dataIndex: "Drug_Name",
      key: "Drug_Name",
    },
    {
      title: "Dosage",
      dataIndex: "Dosage",
      key: "Dosage",
    },
    {
      title: "Frequency",
      dataIndex: "Frequency",
      key: "Frequency",
    },
    {
      title: "Duration",
      dataIndex: "Number_of_Days",
      key: "Number_of_Days",
    },
    {
      title: "Take",
      dataIndex: "Take",
      key: "Take",
    },
    {
      title: "Quantity",
      dataIndex: "Quantity",
      key: "Quantity",
    },
    {
      title: "Unit",
      dataIndex: "Unit_Of_Measure",
      key: "Unit_Of_Measure",
    },
    {
      title: "Route",
      dataIndex: "Route",
      key: "Route",
    },
    {
      title: "Remarks",
      dataIndex: "Remarks",
      key: "Remarks",
      fixed: "right",
      width: 100,
    },
    {
      title: "Status",
      dataIndex: "Posted",
      key: "Posted",
      fixed: "right",
      width: 100,
      render: (_, record) => {
        if(record.Posted === false){
            return <Tag color="red">New</Tag>
        }else{
            return <Tag color="green">Posted</Tag>
        }
      }
    },
  ];
  return (
    <div>
      {loadingPrescriptions ? (
        <Loading />
      ) : (
        <Table
          columns={columns}
          dataSource={filteredPrescriptions}
          onRowSelect={handleEdit}
          rowKey="key"
          size="small"
      scroll={{ x: 1500 }}
        />
      )}
    </div>
  );
};

export default PrescriptionTable;

//props types validations
PrescriptionTable.propTypes = {
  loadingPrescriptions: PropTypes.bool.isRequired,
  filteredPrescriptions: PropTypes.array.isRequired,
};
