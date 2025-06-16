import Loading from "../../../partials/nurse-partials/Loading";
import RowSelectionTable from "../../../partials/doc-partials/RowSelectionTable";

const PrescriptionTable = ({
  columns,
  loadingPrescriptions,
  filteredPrescriptions,
}) => {
  const handleEdit = (record) => {
    console.log("Edit clicked for record:", record);
  };

  console.log({ filteredPrescriptions });

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
