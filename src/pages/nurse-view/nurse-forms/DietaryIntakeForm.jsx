import { Button, Form, Modal, Select } from 'antd'
import { PlusOutlined, FolderViewOutlined, FileOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react';
import TextArea from 'antd/es/input/TextArea';
import DietaryIntakeTable from '../tables/nurse-tables/DietaryIntakeTable';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getQyIpLookupValuesSlice } from '../../../actions/nurse-actions/getQyIPLookupValuesSlice';
import { getQyDietaryFormLinesSlice } from '../../../actions/nurse-actions/getQyIPDietaryFormLinesSlice';
import NurseInnerHeader from '../../../partials/nurse-partials/NurseInnerHeader';
import DietaryIntakeFormData from './DietaryIntakeFormData';
import useSetTableCheckBoxHook from '../../../hooks/useSetTableCheckBoxHook';
import useAuth from '../../../hooks/useAuth';

const DietaryIntakeForm = () => {
    const { selectedRowKey, rowSelection, selectedRow } = useSetTableCheckBoxHook();
    const role = useAuth().userData.departmentName;
    const { patientDetails } = useLocation().state;
    const [ form ] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const dispatch = useDispatch();
    const [isFormVisible, setIsFormVisible] = useState(false);

    const { loadingIpLookupValues, ipLookupValues} = useSelector((state) => state.getQyIpLookupValues);
    const { loadingGetIpDietaryForm, ipGetDietaryForm} = useSelector((state) => state.getQyDietaryFormLine);
    const { loadingDietaryIntake } = useSelector((state) => state.postDietaryIntakeFormLine);
    

    console.log('ip forms', ipLookupValues)
      const handleViewForm = () => {
        if(selectedRow[0]) {
          form.resetFields();
          form.setFieldsValue({
            category: selectedRow[0]?.Category || '',
            comments: selectedRow[0]?.Comment || '',
          })
          setIsModalOpen(true);
        };
      }
    const handleCancel = () => {
      setIsModalOpen(false);
      form.resetFields();
    };

    const handleButtonVisibility = () => {
      setIsFormVisible(!isFormVisible);
    }

    useEffect(() => {
        if(!ipLookupValues?.length){
          dispatch(getQyIpLookupValuesSlice("Dietary Intake Form"));
        }
      }, [dispatch, ipLookupValues]);

      useEffect(() => {   
          dispatch(getQyDietaryFormLinesSlice(patientDetails?.Admission_No)); 
      }, [dispatch, patientDetails?.Admission_No]);
      
    
  return (
    <div>
        <NurseInnerHeader icon={<FileOutlined />} title="Dietary Intake Form" />

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', paddingBottom: '20px' }}>

          {
            !isFormVisible && (
              role === 'Nurse' ? (
                <>
                <Button type="primary" onClick={handleButtonVisibility}><PlusOutlined /> New Dietary Form
                </Button>
                <Button type="primary" disabled={!selectedRowKey} onClick={handleViewForm}><FolderViewOutlined />
                View Form
                </Button>
              </>
              ) : (
             <Button type="primary" style={{ width: '100%' }} disabled={!selectedRowKey} onClick={handleViewForm}><FolderViewOutlined />
              View Form
              </Button>
              )
            )
          }
        </div>

        {
          isFormVisible && (
            <DietaryIntakeFormData 
            filterIpLookupValues={ipLookupValues} 
            form={form} 
            patientDetails={patientDetails}
            setIsFormVisible={setIsFormVisible}
            loadingDietaryIntake={loadingDietaryIntake}
            loadingIpLookupValues={loadingIpLookupValues}
            />
          )
        }

        {
          !isFormVisible && (
            <DietaryIntakeTable 
            filterDietaryIntakeForm={ipGetDietaryForm} 
            loadingGetIpDietaryForm={loadingGetIpDietaryForm}
            rowSelection={rowSelection}
            />
          )
        }

        <Modal title="Dietary Intake Form" 
          open={isModalOpen} 
          footer={[
            <Button key="cancel" color="danger" onClick={handleCancel}>
              Cancel
            </Button>
          ]}
        >
            <Form
            
                layout="vertical" 
                style={{ paddingTop: '10px'}} 
                form={form}
                initialValues={
                    {
                        category: '',
                        comments: '',
                    }
                }
            >
            <Form.Item
            label="Category"    
            name="category"
            >
              <Select 
              placeholder="Select a category"

              />
            </Form.Item>

            <Form.Item 
                label="Comments" 
                name="comments"
                >
                <TextArea placeholder="Comments"
                    type="text"
                    
                />
            </Form.Item>
            </Form>
        </Modal> 
    </div>
  )
}

export default DietaryIntakeForm