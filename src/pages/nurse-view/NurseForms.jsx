import { Button, Divider } from "antd"
import { useState } from "react"
import VisitorsList from "./nurse-forms/VisitorsList"
import SuicidalForm from "./nurse-forms/SuicidalForm"
import MentalStateExaminationForm from "./nurse-forms/MentalStateExaminationForm"
import DietaryIntakeForm from "./nurse-forms/DietaryIntakeForm"
import JacksonVisualForm from "./nurse-forms/JacksonVisualForm"

const NurseForms = () => {
    
    const [selectedItem, setSelectedItem] = useState('Patient Info')

    const handleOnClick = (item) => {
        switch (item) {
            case 'Visitor List':
                setSelectedItem(<VisitorsList />)
                break
            case 'Suicidal Form':
                setSelectedItem(<SuicidalForm />)
                break
            case 'Mental State Examination Form':
                setSelectedItem(<MentalStateExaminationForm />)
                break
            case 'Dietary Intake Form':
                setSelectedItem(<DietaryIntakeForm />)
                break
            case 'Jackson Visual Form':
                setSelectedItem(<JacksonVisualForm />)
                break
            default:
                setSelectedItem(<VisitorsList />)
        }
    }
  return (
    <>
        <div style={{ display: 'flex', flex: 1, gap: '10px', flexWrap: 'wrap' }}>
            {
                [
                    'Visitor List',
                    'Suicidal Form',
                    'Mental State Examination Form',
                    'Dietary Intake Form',
                    'Jackson Visual Form'
                ].map((item, index) => (
                    <Button key={index} 
                     type='primary' 
                     onClick={()=>handleOnClick(item)}>
                        {item}
                    </Button>
                ))
            }
        </div>

        <Divider />
        <div className="patient-file-content">
            {
                selectedItem === 'Patient Info' ? <VisitorsList /> : selectedItem
            }
        </div>
    </>
  )
}

export default NurseForms