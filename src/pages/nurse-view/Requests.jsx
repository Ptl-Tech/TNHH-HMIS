import { Button, Divider } from "antd"
import { useState } from "react"
import PhysiotherapyRequest from "./requests/PhysiotherapyRequest"
import RadiologyRequest from "./requests/RadiologyRequest"
import LaboratoryRequest from "./requests/LaboratoryRequest"

const Requests = () => {
    const [selectedItem, setSelectedItem] = useState('Laboratory Requests')
    const handleOnClick = (item) => {
        switch (item) {
            case 'Laboratory Requests':
                setSelectedItem(<LaboratoryRequest />)
                break
            case 'Physiotherapy Requests':
                setSelectedItem(<PhysiotherapyRequest />)
                break
            case 'Radiology Requests':
                setSelectedItem(<RadiologyRequest />)
                break
            default:
                break
        }
    }
  return (
    <>
        <div style={{ display: 'flex', flex: 1, gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
            {
                [
                    'Laboratory Requests',
                    'Physiotherapy Requests',
                    'Radiology Requests',
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
                selectedItem === 'Laboratory Requests' ? <LaboratoryRequest /> : selectedItem
            }
        </div>

    </>
  )
}

export default Requests