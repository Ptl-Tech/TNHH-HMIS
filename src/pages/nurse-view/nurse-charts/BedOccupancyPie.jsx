import { Pie } from "@ant-design/charts";

const BedOccupancyPie = () => {
    const data = [
        { type: 'occupied', value: 60, name: 'Occupied Beds' },
        { type: 'free bed', value: 40, name: 'Free Beds' },
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