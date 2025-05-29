import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { Button, Checkbox, Space } from 'antd';

import { InputForm } from './InputForm';

import { saveDoctorNotes } from '../../../../actions/Doc-actions/saveDoctorNotes';

export const CheckboxInputs = ({ formItems, treatmentNo }) => {
  const CheckboxGroup = Checkbox.Group;

  const dispatch = useDispatch();

  const [editing, setEditing] = useState(false);
  const [selectedValues, setSelectedValues] = useState(
    formItems
      .filter((selectedValue) => selectedValue.IsSelected)
      .map(({ Item_ID }) => Item_ID),
  );

  const onChange = (newValues) => {
    // updating the state
    setSelectedValues((formerValues) => {
      // getting the removed item
      const removedItem = formerValues.findIndex(
        (formerValue) => !newValues.includes(formerValue),
      );
      // getting the added item
      const addedItem = newValues.find(
        (newValue) => !formerValues.includes(newValue),
      );

      if (removedItem >= 0) {
        // delete an item from the database
        dispatch(
          saveDoctorNotes({
            myAction: 'edit',
            encounterNo: treatmentNo,
            itemId: formerValues[removedItem],
            isSelected: false,
            specifiedText: '',
          }),
        );
      } else if (addedItem) {
        // add an item to the database
        dispatch(
          saveDoctorNotes({
            myAction: 'edit',
            encounterNo: treatmentNo,
            itemId: addedItem,
            isSelected: true,
            specifiedText: '',
          }),
        );
      }

      return newValues;
    });
  };

  const checkboxOptions = formItems.map(
    ({ Is_Text_Item, Item_ID: value, Item_Name: label, Other_Specify }) => ({
      label: Is_Text_Item ? (
        selectedValues.includes(value) ? (
          editing ? (
            <InputForm
              treatmentNo={treatmentNo}
              formItem={{ Other_Specify, Item_ID: value }}
              setEditing={setEditing}
            />
          ) : (
            <Space>
              <div
                className="d-flex gap-2"
                style={{ whiteSpace: 'nowrap' }}
              >
                <span style={{ color: '#0f5689' }}>Added value:</span>
                <span>{Other_Specify}</span>
              </div>

              <Button
                style={{ padding: '0px 2px', height: 'fit-content' }}
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
      className: Is_Text_Item ? 'other-select' : '',
    }),
  );

  return (
    <CheckboxGroup
      onChange={onChange}
      value={selectedValues}
      options={checkboxOptions}
      style={{ display: 'grid', gap: 8, width: '100%' }}
    />
  );
};
