import { Button, Divider } from "antd"
import { useState } from "react"
import VisitorsList from "./nurse-forms/VisitorsList"
import SuicidalForm from "./nurse-forms/SuicidalForm"
import MentalStateExaminationForm from "./nurse-forms/MentalStateExaminationForm"
import DietaryIntakeForm from "./nurse-forms/DietaryIntakeForm"
import JacksonVisualForm from "./nurse-forms/JacksonVisualForm"
import BriefMentalStateExaminationForm from "./nurse-forms/BriefMentalStateExaminationForm"

const NurseForms = () => {
    
    const [selectedItem, setSelectedItem] = useState('Visitor List')

    const handleOnClick = (item) => {
        switch (item) {
            case 'Visitor List':
                setSelectedItem(<VisitorsList />)
                break
            case 'Suicidal Form':
                setSelectedItem(<SuicidalForm />)
                break
            case 'MSE Status Level Checklist':
                setSelectedItem(<MentalStateExaminationForm />)
                break
            case 'Brief MSE Form':
                setSelectedItem(<BriefMentalStateExaminationForm />)
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
                    'MSE Status Level Checklist',
                    'Brief MSE Form',
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
                selectedItem === 'Visitor List' ? <VisitorsList /> : selectedItem
            }
        </div>
    </>
  )
}

export default NurseForms