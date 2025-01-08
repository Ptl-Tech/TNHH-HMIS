import { Button, Divider } from 'antd'
import { useState } from 'react'
import AddAllergies from './nurse-care-plan/AddAllergies'
import Vitals from './nurse-care-plan/Vitals'
import TreatmentsSheet from './nurse-care-plan/TreatmentsSheet'
import ECTScan from './nurse-care-plan/ECTScan'
import TCAAppointments from './nurse-care-plan/TCAAppointments'
import DailyProcess from './nurse-care-plan/DailyProcess'
import Injections from './nurse-care-plan/Injections'
import Diagnosis from './nurse-care-plan/Diagnosis'
import Prescription from './nurse-care-plan/Prescription'

const CarePlan = () => {
  const [selectedItem, setSelectedItem] = useState('Add Allergies')
  const handleOnClick = (item) => {
    switch (item) {
        case 'Add Allergies':
            setSelectedItem(<AddAllergies />)
            break
        case 'Vitals':
            setSelectedItem(<Vitals/>)
            break
        case 'Daily Process / Procedures':
            setSelectedItem(<DailyProcess />)
            break
        case 'Injections':
            setSelectedItem(<Injections />)
            break
        case 'Diagnosis':
            setSelectedItem(<Diagnosis />)
            break
        case 'Prescription':
            setSelectedItem(<Prescription />)
            break
        case 'Treatments Sheet':
            setSelectedItem(<TreatmentsSheet />)
            break
        case 'ECT':
            setSelectedItem(<ECTScan />)
            break
        case 'TCA / Appointments':
            setSelectedItem(<TCAAppointments />)
            break
        default:
            setSelectedItem(<AddAllergies />)
    }
  }
  return (
    <>
        <div style={{ display: 'flex', flex: 1, gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
            {
                [
                    'Allergies',
                    'Vitals',
                    'Daily Process / Procedures',
                    'Injections',
                    'Diagnosis',
                    'Prescription',
                    'Treatments Sheet',
                    'ECT',
                    'TCA / Appointments',
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
                selectedItem === 'Add Allergies' ? <AddAllergies /> : selectedItem
            }
        </div>

    </>
  )
}

export default CarePlan