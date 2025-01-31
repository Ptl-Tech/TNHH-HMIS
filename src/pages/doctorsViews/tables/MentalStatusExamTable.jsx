import { Card, Collapse, Empty } from 'antd';
import PropTypes from 'prop-types';

const MentalStatusExamTable = ({ data }) => {
    const notesType = [
        { value: '1', label: 'APPEARANCE' },
        { value: '2', label: 'SPEECH' },
        { value: '3', label: 'FORM OF THOUGHT' },
        { value: '4', label: 'THOUGHT CONTENT' },
        { value: '5', label: 'SENSORIUM' },
        { value: '6', label: 'MEMORY' },
        { value: '7', label: 'JUDGEMENT' },
        { value: '8', label: 'INSIGHT' },
    ]

    const filterCollapseData = data.filter((item) =>
        notesType.map((note) => note.label).includes(item.Category)
      );
    const groupedData = filterCollapseData.reduce((acc, item) => {
        if (!acc[item.Category]) {
            acc[item.Category] = [];
        }
        acc[item.Category].push(item.Comments);
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

export default MentalStatusExamTable
// props validation
MentalStatusExamTable.propTypes = {
  data: PropTypes.array.isRequired,
};