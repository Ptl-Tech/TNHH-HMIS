export const CheckboxInputsReport = ({ formItems }) => {
  const selectedItems = formItems?.filter(({ IsSelected }) => IsSelected);

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
