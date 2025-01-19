import { Button, Form, Modal, Select } from 'antd'
import { PlusOutlined, FolderViewOutlined, FileOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react';
import TextArea from 'antd/es/input/TextArea';
import MentalStatusExaminationTable from '../tables/nurse-tables/MentalStatusExaminationTable';
import { useDispatch, useSelector } from 'react-redux';
import { getMentalExaminationFormSlice } from '../../../actions/nurse-actions/getMentalExaminationFormSlice';
import { useLocation } from 'react-router-dom';
import NurseInnerHeader from '../../../partials/nurse-partials/NurseInnerHeader';
import MseStatusFormData from './MseStatusFormData';
import useSetTableCheckBoxHook from '../../../hooks/useSetTableCheckBoxHook';
import useAuth from '../../../hooks/useAuth';

const MentalStateExaminationForm = () => {
  const role = useAuth().userData.departmentName;
    const { patientDetails } = useLocation().state;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [ form ] = Form.useForm();
    const [isFormVisible, setIsFormVisible] = useState(false);
    const { selectedRowKey, rowSelection, selectedRow } = useSetTableCheckBoxHook();

    const { loadingIpGetMentalStatusForm, ipGetMentalStatusForm} = useSelector((state) => state.getMentalStatusExaminationForm);
    const { loadingMentalStatus } = useSelector((state) => state.postMentalStatusExaminationForm);

    const filterMSEFormData = ipGetMentalStatusForm.filter((item) => item?.AdmissionNo === patientDetails?.CurrentAdmNo);

    const dispatch = useDispatch();

    const handleViewMSEForm = () => {
      if(selectedRow[0]) {
        form.resetFields();
        form.setFieldsValue({
          status: selectedRow[0]?.Status,
          comments: selectedRow[0]?.Comments
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
        dispatch(getMentalExaminationFormSlice());
    }, [dispatch]);
    
  return (
    <div>
      
        <NurseInnerHeader icon={<FileOutlined/>} title='Mental Status Level Checklist'/>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', paddingBottom: '20px'}}>
          {
            role === "Nurse" && (
              <>
                <Button type="primary" style={{ width: '100%' }} onClick={handleButtonVisibility}><PlusOutlined /> New MSE Level Checklist
                </Button>
                <Button type="primary" style={{ width: '100%' }} disabled={!selectedRowKey} onClick={handleViewMSEForm}><FolderViewOutlined />
                View MSE Level Checklist
                </Button>
                <Button color="default" variant="outlined" style={{ width: '100%' }}><FolderViewOutlined />
                Preview Form
                </Button>
              </>
            )
          }

          {
            role === "Doctor" && (
              <Button type="primary" style={{ width: '100%' }} disabled={!selectedRowKey} onClick={handleViewMSEForm}><FolderViewOutlined />
                View MSE Level Checklist
                </Button>
            )
          }
        
        </div>

        {
          isFormVisible && (
            <MseStatusFormData 
            patientDetails={patientDetails} 
            form={form}
            setIsFormVisible={setIsFormVisible}
            loadingMentalStatus={loadingMentalStatus}
            />
          )
        }

        {
          !isFormVisible && (
            <MentalStatusExaminationTable 
            rowSelection={rowSelection}
            loadingIpGetMentalStatusForm={loadingIpGetMentalStatusForm} 
            filterMSEFormData={filterMSEFormData}
          />
          )
        }
        
        <Modal title="Suicidal Precaution Form" 
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
                initialValues={
                  {
                    date: '',
                    status: '',
                    comments: '',
                  }
                }
            >
            <Form.Item
            label="Status"    
            name="status"
            hasFeedback
            rules={[
                {
                  required: true,
                  message: 'Please select status!',
                },
              ]}
            >
                <Select>
                    <Select.Option value="good">Good</Select.Option>
                    <Select.Option value="average">Average</Select.Option>
                    <Select.Option value="bad">Bad</Select.Option>
                </Select>
            </Form.Item>

            <Form.Item 
                label="Comments" 
                name="comments"
                hasFeedback
                rules={[
                    {
                      required: true,
                      message: 'Please input comments!',
                    },
                  ]}
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

export default MentalStateExaminationForm
