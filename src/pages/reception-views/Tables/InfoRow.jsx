import { Typography } from 'antd';

const InfoRow = ({ cellData, patientData }) => {
  const { data, highlighted } = cellData;

  if (!patientData) return;

  let color = 'gray';
  let value =patientData[data.value];

  if (highlighted)
    color = typeof highlighted === 'string' ? highlighted : highlighted(value);
  value = typeof value === 'boolean' ? (value ? 'TRUE' : 'FALSE') : value;

  return (
    <Typography.Text
      level={5}
      style={{ display: 'block', fontWeight: 'bold' }}
    >
      <span>{`${data.label} :`}</span>
      <span style={{ color }}>{` ${value}` || 'N/A'}</span>
    </Typography.Text>
  );
};

export default InfoRow;
