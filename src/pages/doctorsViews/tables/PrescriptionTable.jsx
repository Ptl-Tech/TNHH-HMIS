import Loading from "../../../partials/nurse-partials/Loading";
import PropTypes from "prop-types";
import RowSelectionTable from "../../../partials/doc-partials/RowSelectionTable";

const PrescriptionTable = ({ loadingPrescriptions, filteredPrescriptions }) => {
  const handleEdit = (record) => {
    console.log("Edit clicked for record:", record);
  };

  const columns = [
    {
      title: "Encounter No",
      dataIndex: "TreatmentNo",
      key: "TreatmentNo",
      fixed: "left",
      width: 100,
    },
    {
      title: "Drug No",
      dataIndex: "DrugNo",
      key: "DrugNo",
    },
    {
      title: "Drug Name",
      dataIndex: "DrugName",
      key: "DrugName",
    },
    {
      title: "Dosage",
      dataIndex: "Dosage",
      key: "Dosage",
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
    },
    {
      title: "Status",
      dataIndex: "Status",
      key: "Status",
    },
  ];
  return (
    <div>
      {loadingPrescriptions ? (
        <Loading />
      ) : (
        <RowSelectionTable
          columns={columns}
          dataSource={filteredPrescriptions}
          onRowSelect={handleEdit}
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
