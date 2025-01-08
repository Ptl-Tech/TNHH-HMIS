import { Column } from "@ant-design/charts"


const BedOccupancyBar = () => {
    const data = [
        { type: 'occupied', value: 60, name: 'Occupied Beds' },
        { type: 'free bed', value: 40, name: 'Free Beds' },
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