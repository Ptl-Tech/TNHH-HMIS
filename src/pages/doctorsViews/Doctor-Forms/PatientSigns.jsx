import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  Card,
  Form,
  Tabs,
  Space,
  Radio,
  Input,
  Button,
  message,
  Collapse,
  Checkbox,
} from 'antd';

import {
  saveDoctorNotes,
  SAVE_DOCTOR_NOTES_RESET,
} from '../../../actions/Doc-actions/saveDoctorNotes';
import {
  buildFormStructure,
  buildSelectedItemsTree,
} from '../../../utils/doctorNotesTree';
import { IoFileTrayOutline } from 'react-icons/io5';
import { getDoctorsNotesData } from '../../../actions/Doc-actions/getDoctorsNotesData';

const PatientSigns = ({ treatmentNo, filter }) => {
  const dispatch = useDispatch();

  const { data: getDoctorNotesData } = useSelector(
    (state) => state.getDoctorsNotesData,
  );
  const { data: saveDoctorNotesData, error: saveDoctorNotesError } =
    useSelector((state) => state.saveDoctorNotes);
  const { sections, sectionCategories, formItems } = getDoctorNotesData || {};

  const filterSections = (filter) => {
    var returnValue = [];
    switch (filter) {
      case 'PH':
        returnValue = sections.filter(
          ({ Form_Type }) => Form_Type === 'Patient History',
        );
        break;
      case 'MSE':
        returnValue = sections.filter(({ Form_Type }) => Form_Type === 'MSE');
        break;
      case 'PE':
        returnValue = sections.filter(
          ({ Form_Type }) => Form_Type === 'Physical Exam',
        );
        break;
      default:
        returnValue = sections;
        break;
    }

    return returnValue;
  };

  const tree = Object.keys(getDoctorNotesData).length
    ? buildFormStructure(filterSections(filter), sectionCategories, formItems)
    : null;

  const selectedTreeReport = tree
    ? buildSelectedItemsTree(
        filterSections(filter),
        sectionCategories,
        formItems,
      )
    : null;

  // loading the doctor notes data to add
  useEffect(() => {
    dispatch(getDoctorsNotesData({ treatmentNo }));
  }, [treatmentNo, dispatch, saveDoctorNotesData]);

  // tracking when the adding of data has failed
  useEffect(() => {
    if (saveDoctorNotesError) {
      console.log({ saveDoctorNotesError });

      message.error(saveDoctorNotesError);
      dispatch({ type: SAVE_DOCTOR_NOTES_RESET });
    }
  }, [saveDoctorNotesError]);

  return (
    <Tabs
      size="small"
      tabPosition="left"
      items={tree?.map(
        ({ Section_Name: label, Section_ID: key, categories }) => {
          const matchingResultsSection = selectedTreeReport.find(
            (section) => section.Section_ID === key,
          );

          return {
            label,
            key,
            children: (
              <Space
                style={{
                  display: 'grid',
                  gridTemplateColumns: '4fr 5fr',
                  alignItems: 'stretch',
                }}
              >
                <Categories
                  categories={categories}
                  treatmentNo={treatmentNo}
                />
                <Card
                  size="small"
                  type="inner"
                  style={{ minHeight: '500px', height: '100%' }}
                  title={
                    <h6
                      className="pt-2"
                      style={{ color: '#0f5689' }}
                    >
                      {label} Preview Report
                    </h6>
                  }
                >
                  <div>
                    {!!matchingResultsSection && (
                      <CategoriesReport
                        categories={matchingResultsSection.categories}
                      />
                    )}
                  </div>
                </Card>
              </Space>
            ),
          };
        },
      )}
    />
  );
};

const Categories = ({ categories, treatmentNo }) => {
  function renderFormItems(formItems) {
    const { Input_Type } = formItems[0] || {};

    switch (Input_Type) {
      case 'radio':
        return (
          <RadioInputs
            formItems={formItems}
            treatmentNo={treatmentNo}
          />
        );
      case 'checkbox':
        return (
          <CheckboxInputs
            formItems={formItems}
            treatmentNo={treatmentNo}
          />
        );
      default:
        break;
    }
  }

  return (
    <div
      style={{
        border: '1px solid #f0f0f0',
        borderRadius: '8px',
        overflow: 'clip',
      }}
    >
      <Collapse
        size="small"
        accordion
        bordered={false}
        items={categories.map(
          (
            {
              Category_Name: label,
              Category_ID: key,
              formItems,
              subCategories,
            },
            index,
          ) => ({
            key,
            label,
            style: {
              border: 'none',
            },
            styles: {
              body: {
                background: 'white',
              },
              header: {
                borderBottom:
                  index === categories.length - 1 && categories.length !== 1
                    ? 'none'
                    : '1px solid #f0f0f0',
              },
            },
            children: (
              <Space direction="vertical">
                {subCategories && subCategories.length > 0 && (
                  <Categories
                    treatmentNo={treatmentNo}
                    categories={subCategories}
                  />
                )}
                {formItems && renderFormItems(formItems)}
              </Space>
            ),
          }),
        )}
      />
    </div>
  );
};

const CategoriesReport = ({ categories }) => {
  function renderFormItemsReport(formItems) {
    const { Input_Type } = formItems[0] || {};

    switch (Input_Type) {
      case 'radio':
        return <RadioInputsReport formItems={formItems} />;
      case 'checkbox':
        return <CheckboxInputsReport formItems={formItems} />;
      default:
        break;
    }
  }

  if (!categories?.length) {
    return (
      <div className="">
        <IoFileTrayOutline />
      </div>
    );
  }

  return categories.map(
    (
      { Category_Name, subCategories, formItems, Parent_Category_ID },
      index,
    ) => (
      <div
        style={{
          padding: `${Parent_Category_ID ? '0px' : '16px'} 0px 0px 16px`,
          borderTop: `${
            Parent_Category_ID || index === 0 ? '' : '1px dashed #dadada'
          }`,
        }}
      >
        <h6 style={{ color: '#0f5689' }}>{Category_Name}</h6>
        {formItems && renderFormItemsReport(formItems)}
        {subCategories && subCategories.length > 0 && (
          <CategoriesReport categories={subCategories} />
        )}
      </div>
    ),
  );
};

const RadioInputsReport = ({ formItems }) => {
  const selectedItem = formItems.find(({ IsSelected }) => IsSelected);
  const { Other_Specify, Item_Name, Item_ID } = selectedItem;
  return (
    <ul style={{ listStyle: 'none', display: 'grid', gap: '4px' }}>
      <li
        key={Item_ID}
        style={{ position: 'relative', fontSize: '14px' }}
      >
        <span style={{ position: 'absolute', left: '-16px', top: '0px' }}>
          &ndash;
        </span>
        <span>{Other_Specify || Item_Name}</span>
      </li>
    </ul>
  );
};

const CheckboxInputsReport = ({ formItems }) => {
  const selectedItems = formItems.filter(({ IsSelected }) => IsSelected);

  return (
    <ul style={{ listStyle: 'none', display: 'grid' }}>
      {selectedItems.map(({ Other_Specify, Item_Name, Item_ID }) => (
        <li
          key={Item_ID}
          style={{ position: 'relative', fontSize: '14px' }}
        >
          <span style={{ position: 'absolute', left: '-16px', top: '0px' }}>
            &ndash;
          </span>
          <span>{Other_Specify || Item_Name}</span>
        </li>
      ))}
    </ul>
  );
};

const RadioInputs = ({ formItems, treatmentNo }) => {
  const RadioGroup = Radio.Group;

  const dispatch = useDispatch();

  const [editing, setEditing] = useState(false);
  const [selectedItem, setSelectedItem] = useState(
    formItems.find(({ IsSelected }) => IsSelected)?.Item_ID,
  );

  const onChange = (e, valueToReset) => {
    // getting the current value
    const value = e.target.value;

    // updating the state
    setSelectedItem((prevItem) => {
      console.log({ value, prevItem });

      // removing the previous item from the database
      if (prevItem) {
        dispatch(
          saveDoctorNotes({
            myAction: 'edit',
            encounterNo: treatmentNo,
            itemId: prevItem,
            isSelected: false,
            specifiedText: '',
          }),
        );
      }

      // save the added item to the database
      // if they are same, then it should be removed
      if (valueToReset && prevItem === valueToReset) {
        dispatch(
          saveDoctorNotes({
            itemId: valueToReset,
            myAction: 'edit',
            isSelected: false,
            specifiedText: '',
            encounterNo: treatmentNo,
          }),
        );
      } else {
        dispatch(
          saveDoctorNotes({
            itemId: value,
            myAction: 'edit',
            isSelected: true,
            specifiedText: '',
            encounterNo: treatmentNo,
          }),
        );
      }
      // set the state finally
      return prevItem === value ? null : value;
    });
  };

  return (
    <RadioGroup
      style={{ display: 'grid', gap: 8 }}
      value={selectedItem}
      onChange={onChange}
      options={formItems.map(
        ({
          Is_Text_Item,
          Item_ID: value,
          Item_Name: label,
          Other_Specify,
        }) => ({
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
                  <Button
                    variant="text"
                    onClick={(e) => {
                      e.preventDefault();
                      onChange(e, selectedItem);
                    }}
                    style={{
                      textDecoration: 'underline',
                      padding: '0px',
                      border: 'none',
                      boxShadow: 'none',
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
            <span style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              <span>{label}</span>
              {selectedItem === value && (
                <Button
                  variant="text"
                  onClick={(e) => {
                    e.preventDefault();
                    onChange(e, selectedItem);
                  }}
                  style={{
                    textDecoration: 'underline',
                    padding: '0px',
                    border: 'none',
                    boxShadow: 'none',
                  }}
                >
                  Reset
                </Button>
              )}
            </span>
          ),
          value,
        }),
      )}
    />
  );
};

const CheckboxInputs = ({ formItems, treatmentNo }) => {
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

  return (
    <CheckboxGroup
      onChange={onChange}
      value={selectedValues}
      style={{ display: 'grid', gap: 8 }}
      options={formItems.map(
        ({
          Is_Text_Item,
          Item_ID: value,
          Item_Name: label,
          Other_Specify,
        }) => ({
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
        }),
      )}
    />
  );
};

const InputForm = ({ treatmentNo, formItem, setEditing }) => {
  const { Other_Specify, Item_ID } = formItem;
  const dispatch = useDispatch();

  const FormItem = Form.Item;

  const onFinish = (values) => {
    const { other: textValue, value } = values;

    setEditing(false);
    dispatch(
      saveDoctorNotes({
        myAction: 'edit',
        encounterNo: treatmentNo,
        itemId: value,
        isSelected: true,
        specifiedText: textValue,
      }),
    );
  };

  return (
    <Form
      name="basic"
      variant={'filled'}
      onFinish={onFinish}
      autoComplete="off"
      initialValues={{ other: Other_Specify, value: Item_ID }}
    >
      <Space>
        <FormItem
          style={{ padding: 0, margin: 0 }}
          label="Other (Specify Value)"
          name="other"
          rules={[
            {
              required: true,
              message: 'Please input the other value',
            },
          ]}
        >
          <Input />
        </FormItem>
        <FormItem
          label={null}
          name="value"
          style={{ height: 0, padding: 0, margin: 0 }}
        >
          <Input type={'hidden'} />
        </FormItem>
        <FormItem
          label={null}
          style={{ padding: 0, margin: 0 }}
        >
          <Button htmlType="submit">Submit</Button>
        </FormItem>
      </Space>
    </Form>
  );
};

export default PatientSigns;
