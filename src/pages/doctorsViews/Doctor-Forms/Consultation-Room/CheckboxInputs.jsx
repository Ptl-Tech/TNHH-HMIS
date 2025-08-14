import { useState } from "react";
import { useDispatch } from "react-redux";

import { Button, Checkbox, Space } from "antd";

import { InputForm } from "./InputForm";

import { saveDoctorNotes } from "../../../../actions/Doc-actions/saveDoctorNotes";

export const CheckboxInputs = ({
  formItems,
  sectionId,
  categoryId,
  treatmentNo,
}) => {
  const CheckboxGroup = Checkbox.Group;

  const dispatch = useDispatch();

  const [editing, setEditing] = useState(false);
  const [selectedValues, setSelectedValues] = useState(
    formItems
      .filter((selectedValue) => selectedValue.IsSelected)
      .map(({ Item_ID }) => Item_ID)
  );

  const onChange = (newValues) => {
    console.log({ newValues });

    // updating the state
    setSelectedValues((formerValues) => {
      // getting the removed item position
      const removedItemIndex = formerValues.findIndex(
        (formerValue) => !newValues.includes(formerValue)
      );

      // getting the added item id
      const addedItemId = newValues.find(
        (newValue) => !formerValues.includes(newValue)
      );

      if (removedItemIndex >= 0) {
        // get the system id
        const { SystemId: systemId } = formItems.find(
          (item) => item.Item_ID === formerValues[removedItemIndex]
        );

        // delete an item from the database
        dispatch(
          saveDoctorNotes({
            systemId,
            sectionId,
            categoryId,
            myAction: "delete",
            isSelected: false,
            specifiedText: "",
            encounterNo: treatmentNo,
            itemId: formerValues[removedItemIndex],
          })
        );
      } else if (addedItemId) {
        // add an item to the database
        dispatch(
          saveDoctorNotes({
            sectionId,
            categoryId,
            systemId: "",
            myAction: "create",
            isSelected: true,
            itemId: addedItemId,
            specifiedText: "",
            encounterNo: treatmentNo,
          })
        );
      }

      return newValues;
    });
  };

  const checkboxOptions = formItems.map((formItem) => {
    const {
      Is_Text_Item,
      Item_ID: value,
      Item_Name: label,
      Other_Specify,
    } = formItem;

    return {
      label: Is_Text_Item ? (
        selectedValues.includes(value) ? (
          editing ? (
            <InputForm
              setEditing={setEditing}
              treatmentNo={treatmentNo}
              formItem={{ ...formItem, Section_ID: sectionId }}
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
            </Space>
          )
        ) : (
          label
        )
      ) : (
        label
      ),
      value,
      className: Is_Text_Item ? "other-select" : "",
    };
  });

  return (
    <CheckboxGroup
      value={selectedValues}
      options={checkboxOptions}
      onChange={(values) => onChange(values)}
      style={{ display: "grid", gap: 8, width: "100%" }}
    />
  );
};
