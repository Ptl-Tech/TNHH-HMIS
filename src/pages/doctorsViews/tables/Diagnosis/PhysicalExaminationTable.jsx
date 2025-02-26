import { Card, Collapse, Empty } from "antd";
import PropTypes from "prop-types";

const PhysicalExaminationTable = ({ data }) => {
  const notesType = [
    { value: "16", label: "Central Nervous system" },
    { value: "17", label: "Cardiovascular system" },
    { value: "18", label: "Respiratory system" },
    { value: "19", label: "Abdomen" },
  ];

  const filterCollapseData = data.filter((item) =>
    notesType.map((note) => note.label).includes(item.Notes_Type)
  );

  const groupedData = filterCollapseData.reduce((acc, item) => {
    if (!acc[item.Notes_Type]) {
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

  return (
    <>
      {filterCollapseData.length === 0 ? (
        <Card style={{ marginTop: "30px", padding: "20px" }}>
          <Empty />
        </Card>
      ) : (
        <Collapse
          accordion
          style={{ marginTop: "30px" }}
          items={collapseItems}
        />
      )}
    </>
  );
};

export default PhysicalExaminationTable;
//props validation
PhysicalExaminationTable.propTypes = {
  data: PropTypes.array.isRequired,
};
