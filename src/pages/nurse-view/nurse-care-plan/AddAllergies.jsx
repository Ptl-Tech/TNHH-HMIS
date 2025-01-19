import { Button, Form, Input, Modal } from "antd"
import { PlusOutlined, FolderViewOutlined, FileOutlined } from "@ant-design/icons"
import { useState } from "react";
import AddAllergiesTable from "../tables/nurse-tables/AddAllergiesTable";
import { useLocation } from "react-router-dom";
import useSetTableCheckBoxHook from "../../../hooks/useSetTableCheckBoxHook";
import useFetchAllergiesAndMedicationsHook from "../../../hooks/useFetchAllergiesAndMedicationsHook";
import NurseInnerHeader from "../../../partials/nurse-partials/NurseInnerHeader";
import AllergyAndMedication from "../forms/triage-forms/AllergyAndMedication";

const AddAllergies = () => {

        const [ form ] = Form.useForm();
        const [isModalOpen, setIsModalOpen] = useState(false);
        const { patientDetails } = useLocation().state;
        const [isFormVisible, setIsFormVisible] = useState(false);

        const { selectedRowKey, rowSelection, selectedRow } = useSetTableCheckBoxHook();
        const { combinedList, loadingAllergies, loadingTriageList } = useFetchAllergiesAndMedicationsHook();
        const filterAllergies = combinedList?.filter(allergy => allergy.PatientNo === patientDetails?.PatientNo);

        const handleCancel = () => {
          setIsModalOpen(false);
        };

        const handleButtonVisibility = () => {
          setIsFormVisible(!isFormVisible);
        }

        const handleViewAllergies = () => {
          if (selectedRow[0]) {
            //set form fields
            form.resetFields();
            form.setFieldsValue({
              complaints: selectedRow[0]?.Complaints,
              foodAllergy: selectedRow[0]?.FoodAllergy,
              drugAllergy: selectedRow[0]?.DrugAllergy,  
            });
            setIsModalOpen(true);
          }
        }

    
  return (
    <div>

        <NurseInnerHeader icon={<FileOutlined />} title="Allergies and Medications" />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', paddingBottom: '20px',  marginTop: '20px'}}>
        <Button type="primary" style={{ width: '100%' }}  onClick={handleButtonVisibility} icon={<PlusOutlined />}>
          {isFormVisible ? 'View List': 'Add Allergies and Medication'}
        </Button>

          <Button type="primary" style={{ width: '100%' }} disabled={!selectedRowKey} onClick={handleViewAllergies}><FolderViewOutlined /> View Allergies and Medications</Button>
          <Button color="default" variant="outlined" style={{ width: '100%' }} disabled={!selectedRowKey} onClick={handleViewAllergies}><FolderViewOutlined /> Preview Allergies and Medications</Button>
        </div>

        {
          isFormVisible && (
            <AllergyAndMedication setIsFormVisible={setIsFormVisible} />
          )
        }

        {
          !isFormVisible && (
            <AddAllergiesTable rowSelection={rowSelection} filterAllergies={filterAllergies} loadingAllergies={loadingAllergies} loadingTriageList={loadingTriageList} />
          )
        }
        

        <Modal title="Add Allergies and Medications" 
        open={isModalOpen}
        footer={[
          <Button key="cancel" color="danger" onClick={handleCancel}>
            Cancel
          </Button>,
        ]}
        >
        <Form
            layout="vertical" 
            style={{ paddingTop: '10px'}} 
            form={form}
            autoComplete="off"
            initialValues={{
                complains: '',
                foodAllergy: '',
                drugAllergy: '',
            }}
            >
            <Form.Item label="Complains" 
                name='complains'
                hasFeedback
                >
                <Input type='text' 
                    
                />
            </Form.Item>  
            <Form.Item label="Food Allergy"
              name='foodAllergy'
              hasFeedback
            >
            <Input type='text' 
            />
        </Form.Item>
        <Form.Item label="Drug Allergy" 
                name='drugAllergy'
                hasFeedback
            >
            <Input type='text' 
        
            />
        </Form.Item>
        </Form>
        </Modal>

    </div>
  )
}

export default AddAllergies
