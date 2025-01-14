import { Button } from "antd"
import NurseInnerHeader from "../../../partials/nurse-partials/NurseInnerHeader"
import { ProfileOutlined, PlusOutlined, FolderViewOutlined } from "@ant-design/icons"
import { useState } from "react";
import BriefMentalStateExamFormData from "./BriefMentalStateExamFormData";

const BriefMentalStateExaminationForm = () => {
     const [isFormVisible, setIsFormVisible] = useState(false);
    const handleButtonVisibility = () => {
        setIsFormVisible(!isFormVisible);
      }
  return (
    <>
        <NurseInnerHeader title="Brief Mental Status Exam Form" icon={<ProfileOutlined />} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', paddingBottom: '20px'}}>

            <Button type="primary" style={{ width: '100%' }} onClick={handleButtonVisibility}><PlusOutlined /> New Brief MSE form
            </Button>
            <Button color="default" variant="outlined" style={{ width: '100%' }}><FolderViewOutlined />
                View Brief MSE form
            </Button>
        </div>

        {
            isFormVisible && (
                <BriefMentalStateExamFormData setIsFormVisible={setIsFormVisible}/>
            )
        }
    </>
  )
}

export default BriefMentalStateExaminationForm