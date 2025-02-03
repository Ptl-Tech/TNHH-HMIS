import { Card, Collapse, Empty, Button, Input, message } from "antd";
import PropTypes from "prop-types";
import { useState } from "react";
import { EditOutlined, SaveOutlined } from "@ant-design/icons";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { postPatientHistoryNotes } from "../../../actions/Doc-actions/posPatientHistoryNotes";
import { getPatientHistorySlice } from "../../../actions/Doc-actions/getPatientHistoryNotes";

const PatientHistoryNotesTable = ({ data }) => {
  const useQueryParams = () => {
    return new URLSearchParams(useLocation().search);
  };

  const query = useQueryParams();
  const patientNo = query.get("PatientNo");
  const treatmentNo = query.get("TreatmentNo");

  const [editing, setEditing] = useState({});
  const [editedValues, setEditedValues] = useState({});
  const dispatch = useDispatch();

  const { loading: saveNotesLoading } = useSelector(
    (state) => state.postPatientHistory
  );

  const notesType = [
    { value: "1", label: "Chief Complaints" },
    { value: "2", label: "Allegations" },
    { value: "3", label: "History of Presenting Complaint" },
    { value: "4", label: "Past Psychiatric and Medical History" },
    { value: "5", label: "Family History" },
    { value: "6", label: "Personal History" },
    { value: "7", label: "Forensic History" },
    { value: "8", label: "Premorbid Personality" },
    { value: "9", label: "Medical" },
    { value: "10", label: "Gynecology" },
  ];

  // Filter data based on predefined notesType labels
  const filterCollapseData = data.filter((item) =>
    notesType.map((note) => note.label).includes(item.Notes_Type)
  );

  const groupedData = filterCollapseData.reduce((acc, item) => {
    acc[item.Notes_Type] = {
      Line_No: item.Line_No,
      SystemId: item.SystemId,
      Notes_Type: item.Notes_Type,
      Notes: item.Notes,
    }; // Store both Line_No and Notes
    return acc;
  }, {});

  const handleEditClick = (notesType, noteData) => {
    setEditing((prev) => ({ ...prev, [notesType]: true }));
    setEditedValues((prev) => ({ ...prev, [notesType]: noteData }));
  };

  const handleInputChange = (notesType, updatedData) => {
    setEditedValues((prev) => ({ ...prev, [notesType]: updatedData }));
  };

  const handleSaveClick = async (notesType, noteData) => {
    const formData = {
      myAction: "edit",
      recId: noteData.SystemId,
      // notesType: noteData.Notes_Type,
      lineNo: noteData.Line_No,
      notes: editedValues[notesType]?.Notes,
      treatmentNo,
      patientNo,
    };

    const results = await (
      dispatch(postPatientHistoryNotes(formData))
    );

    if (results === "success") {
      message.success(
        `Patient ${noteData.Notes_Type} notes updated successfully`
      );
      // dispatch(getPatientHistorySlice(treatmentNo));
    } else {
      message.error(`Failed to update patient ${noteData.Notes_Type} notes`);
    }
    setEditing((prev) => ({ ...prev, [notesType]: false }));
  };

  // Prepare collapse items
  const collapseItems = Object.entries(groupedData).map(
    ([notesType, noteData], index) => ({
      key: index + 1, // Ensure unique keys
      label: notesType,
      children: (
        <div>
          {editing[notesType] ? (
            <Input.TextArea
              value={editedValues[notesType]?.Notes || ""}
              onChange={(e) =>
                handleInputChange(notesType, {
                  ...editedValues[notesType],
                  Notes: e.target.value,
                })
              }
              autoSize={{ minRows: 3, maxRows: 5 }}
            />
          ) : (
            <Input.TextArea
              value={noteData.Notes}
              autoSize={{ minRows: 3, maxRows: 5 }}
              disabled
              style={{ color: "black" }}
            />
          )}
          <Button
            icon={editing[notesType] ? <SaveOutlined /> : <EditOutlined />}
            type="primary"
            loading={saveNotesLoading}
            disabled={saveNotesLoading}
            onClick={() =>
              editing[notesType]
                ? handleSaveClick(notesType, noteData)
                : handleEditClick(notesType, noteData)
            }
            style={{ marginTop: "20px" }}
          >
            {editing[notesType] ? "Save" : "Edit"}
          </Button>
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

export default PatientHistoryNotesTable;

// Props validation
PatientHistoryNotesTable.propTypes = {
  data: PropTypes.array.isRequired,
};
