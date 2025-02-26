import PropTypes from "prop-types"
import { Card, Collapse, Empty } from "antd";
import Loading from "../../../partials/nurse-partials/Loading";

const AetiologyTable = ({ data, loadingHistory}) => {
    const notesType = [
        { value: "12", label: "Predisposing Factors" },
        { value: "13", label: "Precipitating Factors" },
        { value: "14", label: "Perpetuating Factors" },
        { value: "15", label: "Protective Factors" },
      ];

    const filterCollapseData = data.filter((item) =>
      notesType.map((note) => note.label).includes(item.Notes_Type)
    );

const groupedData = filterCollapseData.reduce((acc, item) => {
    if(!acc[item.Notes_Type]) {
    acc[item.Notes_Type] = [];
  }
  acc[item.Notes_Type].push(item.Notes);
  return acc;
}, {});

// Convert grouped data into the format required for the Collapse `items`
const collapseItems = Object.entries(groupedData).map(
  ([notesType, notes], index) => ({
    key: index + 1, // Ensure unique keys
    label: notesType,
    children: (
      <div>
        {notes.map((note, idx) => (
          <p key={idx} style={{ marginBottom: "8px" }}>
            {note}
          </p>
        ))}
      </div>
    ),
  })
);

if (loadingHistory) return <Loading />;
  return (
    <>
      {filterCollapseData.length === 0 ? (
        <Card style={{ marginTop: "30px", padding: "20px" }}>
          <Empty  />
        </Card>
      ) : (
        <Collapse
          accordion
          style={{ marginTop: "30px" }}
          items={collapseItems}
        />
      )}
    </>
  )
}

export default AetiologyTable
// PropTypes
AetiologyTable.propTypes = {
  data: PropTypes.array.isRequired,
  loadingHistory: PropTypes.bool
}