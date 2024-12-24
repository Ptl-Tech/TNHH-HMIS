import { Button, Divider } from "antd"
import { useState } from "react"
import Summery from "./discharges/Summery"
import DischargeMedication from "./discharges/DischargeMedication"
import SickOff from "./discharges/SickOff"

const Discharges = () => {
    const [selectedItem, setSelectedItem] = useState('Summery')
    const handleOnClick = (item) => {
        switch (item) {
            case 'Summery':
                setSelectedItem(<Summery />)
                break
            case 'Discharge Medication':
                setSelectedItem(<DischargeMedication />)
                break
            case 'Sick Off':
                setSelectedItem(<SickOff />)
                break
            default:
                setSelectedItem(<Summery />)
        }
    }
  return (
    <>
        <div style={{ display: 'flex', flex: 1, gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
            {
                [
                    'Summery',
                    'Discharge Medication',
                    'Sick Off',
                ].map((item, index) => (
                    <Button key={index} type="primary" style={{ backgroundColor: '#0f5689' }} 
                    onClick={() => handleOnClick(item)}
                    >
                        {item}
                    </Button>
                ))
            }

        </div>

        <Divider />
        <div className="patient-file-content">
            {
                selectedItem === 'Summery' ? <Summery /> : selectedItem
            }
        </div>

    </>
  )
}

export default Discharges