import { Button, Divider } from 'antd'
import { useState } from 'react'
import AddAllergies from './nurse-care-plan/AddAllergies'
import Vitals from './nurse-care-plan/Vitals'
import GeneralObservations from './nurse-care-plan/GeneralObservations'
import Diagnosis from './nurse-care-plan/Diagnosis'
import DoctorPrescriptions from './nurse-care-plan/DoctorPrescriptions'
import TreatmentsSheet from './nurse-care-plan/TreatmentsSheet'
import ECTScan from './nurse-care-plan/ECTScan'
import TCAAppointments from './nurse-care-plan/TCAAppointments'

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
        case 'General Observations':
            setSelectedItem(<GeneralObservations />)
            break
        case 'Diagnosis':
            setSelectedItem(<Diagnosis />)
            break
        case 'Doctors Prescription':
            setSelectedItem(<DoctorPrescriptions />)
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
                    'Add Allergies',
                    'Vitals',
                    'General Observations',
                    'Diagnosis',
                    'Doctors Prescription',
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