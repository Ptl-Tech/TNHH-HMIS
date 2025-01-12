import { Column } from "@ant-design/charts"
import PropTypes from "prop-types"


const BedOccupancyBar = ({ getBeds }) => {
  const getTotalFreeBeds = getBeds.filter((bed) => bed.Occupied === false);
  const getTotalOccupiedBeds = getBeds.filter((bed) => bed.Occupied === true);

    const data = [
        { type: 'occupied', value: getTotalOccupiedBeds?.length, name: 'Occupied Beds' },
        { type: 'free bed', value: getTotalFreeBeds?.length, name: 'Free Beds' },
    ]

    const config = {
        data,
        xField: 'type',
        yField: 'value',
        colorField: 'type',
        state: {
            unselected: { opacity: 0.5 },
            selected: { lineWidth: 3, stroke: 'red' },
          },
          interaction: {
            elementSelect: true,
          },
        label: {
        text: 'value',
        style: {
            fontWeight: 'bold',
        },
        },
        legend: {
        color: {
            title: false,
            position: 'right',
            rowPadding: 5,
        },
        },
    }
  return (
    <>
        <Column {...config} width={400} height={400} />
    </>
  )
}

export default BedOccupancyBar
// props validation
BedOccupancyBar.propTypes = {
    getBeds: PropTypes.array.isRequired,
}