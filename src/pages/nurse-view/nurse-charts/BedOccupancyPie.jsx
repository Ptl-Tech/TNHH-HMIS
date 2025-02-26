import { Pie } from "@ant-design/charts";
import PropTypes from "prop-types";

const BedOccupancyPie = ({ getFreeBeds, getOccupiedBeds }) => {
    const data = [
        { type: 'occupied', value: getOccupiedBeds?.length, name: 'Occupied Beds' },
        { type: 'free bed', value: getFreeBeds?.length, name: 'Free Beds' },
    ]
    
    const config = {
        data,
        angleField: 'value',
        colorField: 'type',
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
        <Pie {...config} width={400} height={400} />
    </>
  )
}

export default BedOccupancyPie
// props validation
BedOccupancyPie.propTypes = {
    getFreeBeds: PropTypes.array.isRequired,
    getOccupiedBeds: PropTypes.array.isRequired,
}