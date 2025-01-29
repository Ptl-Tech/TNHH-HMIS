import { Button } from "antd"
import NurseInnerHeader from "../../../partials/nurse-partials/NurseInnerHeader"
import { FileOutlined, PlusOutlined, FolderViewOutlined } from "@ant-design/icons"
import { useState } from "react";
import BriefMentalStateExamFormData from "./BriefMentalStateExamFormData";

const BriefMentalStateExaminationForm = () => {
     const [isFormVisible, setIsFormVisible] = useState(false);
    const handleButtonVisibility = () => {
        setIsFormVisible(!isFormVisible);
      }
  return (
    <>
        <NurseInnerHeader icon={<FileOutlined />} title="Brief Mental Status Exam Form"  />

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px'}}>
            
        {
            !isFormVisible && (
                <>
                    <Button type="primary" onClick={handleButtonVisibility}><PlusOutlined /> New Brief MSE form
                    </Button>
                    <Button color="default" variant="outlined"><FolderViewOutlined />
                    View Brief MSE form
                    </Button>
                </>
            )
        }
            
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