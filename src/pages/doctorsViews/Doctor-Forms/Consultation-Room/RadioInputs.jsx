import { useState } from "react";
import { useDispatch } from "react-redux";

import { Button, Radio, Space } from "antd";

import { InputForm } from "./InputForm";

import { saveDoctorNotes } from "../../../../actions/Doc-actions/saveDoctorNotes";

export const RadioInputs = ({ formItems, treatmentNo, sectionId }) => {
  // console.log({ formItems });

  const RadioGroup = Radio.Group;

  const dispatch = useDispatch();

  const [editing, setEditing] = useState(false);
  const [selectedItem, setSelectedItem] = useState(
    formItems.find(({ IsSelected }) => IsSelected)?.Item_ID
  );

  const onChange = (e, valueToReset) => {
    // getting the current value
    const value = e.target.value;

    // updating the state
    setSelectedItem((prevItem) => {
      // removing the previous item from the database
      if (prevItem) {
        dispatch(
          saveDoctorNotes({
            sectionId,
            myAction: "delete",
            itemId: prevItem,
            isSelected: false,
            specifiedText: "",
            encounterNo: treatmentNo,
          })
        );
      }

      // save the added item to the database
      // if they are same, then it should be removed
      if (valueToReset && prevItem === valueToReset) {
        dispatch(
          saveDoctorNotes({
            sectionId,
            isSelected: false,
            specifiedText: "",
            myAction: "delete",
            itemId: valueToReset,
            encounterNo: treatmentNo,
          })
        );
      } else {
        dispatch(
          saveDoctorNotes({
            sectionId,
            itemId: value,
            myAction: "create",
            isSelected: true,
            specifiedText: "",
            encounterNo: treatmentNo,
          })
        );
      }
      // set the state finally
      return prevItem === value ? null : value;
    });
  };

  const radioOptions = formItems.map(
    ({ Is_Text_Item, Item_ID: value, Item_Name: label, Other_Specify }) => ({
      label: Is_Text_Item ? (
        selectedItem === value ? (
          editing ? (
            <InputForm
              treatmentNo={treatmentNo}
              formItem={{ Other_Specify, Item_ID: value }}
              setEditing={setEditing}
            />
          ) : (
            <Space>
              <div className="d-flex gap-2" style={{ whiteSpace: "nowrap" }}>
                <span style={{ color: "#0f5689" }}>Added value:</span>
                <span>{Other_Specify}</span>
              </div>

              <Button
                style={{ padding: "0px 2px", height: "fit-content" }}
                onClick={(e) => {
                  e.preventDefault();
                  setEditing(true);
                }}
              >
                Edit the values
              </Button>
              <Button
                variant="text"
                onClick={(e) => {
                  e.preventDefault();
                  onChange(e, selectedItem);
                }}
                style={{
                  textDecoration: "underline",
                  padding: "0px",
                  border: "none",
                  boxShadow: "none",
                }}
              >
                Reset
              </Button>
            </Space>
          )
        ) : (
          label
        )
      ) : (
        <span style={{ display: "flex", gap: "4px", alignItems: "center" }}>
          <span>{label}</span>
          {selectedItem === value && (
            <Button
              variant="text"
              onClick={(e) => {
                e.preventDefault();
                onChange(e, selectedItem);
              }}
              style={{
                textDecoration: "underline",
                padding: "0px",
                border: "none",
                boxShadow: "none",
              }}
            >
              Reset
            </Button>
          )}
        </span>
      ),
      value,
      className: Is_Text_Item ? "other-select" : "",
    })
  );

  return (
    <RadioGroup
      value={selectedItem}
      onChange={onChange}
      options={radioOptions}
      style={{ display: "grid", gap: 8, width: "100%" }}
    />
  );
};
