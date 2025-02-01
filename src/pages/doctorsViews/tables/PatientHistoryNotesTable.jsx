import { Card, Collapse, Empty } from "antd";
import PropTypes from "prop-types";

const PatientHistoryNotesTable = ({ data }) => {
    const notesType = [
        { value: '1', label: 'Chief Complaints' },
        { value: '2', label: 'Allegations' },
        { value: '3', label: 'History of Presenting Complaint' },
        { value: '4', label: 'Past Psychiatric and Medical History' },
        { value: '5', label: 'Family History' },
        { value: '6', label: 'Personal History' },
        { value: '7', label: 'Forensic History' },
        { value: '8', label: 'Premorbid Personality' },
        { value: '9', label: 'Medical' },
        { value: '10', label: 'Gynecology' },
        { value: '11', label: 'Past Psychiatric and Medical History' },
    ]

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
  )
}

export default PatientHistoryNotesTable
// props validation
PatientHistoryNotesTable.propTypes = {
  data: PropTypes.array.isRequired,
  };