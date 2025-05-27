export const RadioInputsReport = ({ formItems }) => {
  const selectedItem = formItems?.find(({ IsSelected }) => IsSelected);
  const { Other_Specify, Item_Name, Item_ID } = selectedItem || {};

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
