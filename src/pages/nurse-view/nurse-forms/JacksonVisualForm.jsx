import { Button, Form, Input, Modal, Select } from 'antd'
import { useEffect, useState } from 'react'
import { PlusOutlined, FolderViewOutlined } from '@ant-design/icons'
import JacksonVisualFormTable from '../tables/nurse-tables/JacksonVisualFormTable';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getJacksonVisualFormSlice } from '../../../actions/nurse-actions/getJacksonVisualFormSlice';
import JacksonVisualFormData from './JacksonVisualFormData';
import NurseInnerHeader from '../../../partials/nurse-partials/NurseInnerHeader';
import useSetTableCheckBoxHook from '../../../hooks/useSetTableCheckBoxHook';
import useAuth from '../../../hooks/useAuth';

const JacksonVisualForm = () => {
    const role = useAuth().userData.departmentName;
    const { selectedRowKey, rowSelection, selectedRow } = useSetTableCheckBoxHook();
    const { patientDetails } = useLocation().state;
    const [ form ] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const dispatch = useDispatch();

    const { loadingGetJacksonVisual, getJacksonVisual } = useSelector((state) => state.getJacksonVisualForm);
    const { loadingJackson } = useSelector((state) => state.postJacksonVisualForm);

    const filterJacksonFormData = getJacksonVisual.filter((item) => item.AdmissionNo === patientDetails?.CurrentAdmNo);   
    console.log('filterJacksonFormData', filterJacksonFormData);

    const handleButtonVisibility = () => {
      setIsFormVisible(!isFormVisible);
    }

    const handleCancel = () => {
      setIsModalOpen(false);
      form.resetFields();
    };

    const handleViewForm = () => {
      if(selectedRow[0]) {
        form.resetFields();
        form.setFieldsValue({
          score: selectedRow[0]?.Score || '',
          iv_line: selectedRow[0]?.IVLine || '',
        })
        setIsModalOpen(true);
      };
    }

    
    useEffect(() => {
        dispatch(getJacksonVisualFormSlice());
    }, [dispatch]);
  
    
  return (
    <div>
        
        <NurseInnerHeader title="Jackson Visual Form" />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', paddingBottom: '20px'}}>
          {
            role === 'Nurse' && (
              <>
                  <Button type="primary" style={{ width: '100%' }} onClick={handleButtonVisibility}><PlusOutlined /> Add Form
                  </Button>
                  <Button type="primary" style={{ width: '100%' }} disabled={!selectedRowKey} onClick={handleViewForm}><FolderViewOutlined />
                  View Jackson Form
                  </Button>
                  <Button color="default" variant="outlined" style={{ width: '100%' }}><FolderViewOutlined />
                  Preview Form
                  </Button>
              </>
            )
          }

          {
            role === 'Doctor' && (
              <Button type="primary" style={{ width: '100%' }} disabled={!selectedRowKey} onClick={handleViewForm}><FolderViewOutlined />
              View Jackson Form
              </Button>
            )
          }
          
        </div>

        {
          isFormVisible && (
            <JacksonVisualFormData 
            patientDetails={patientDetails} 
            form={form}
            setIsFormVisible={setIsFormVisible}
            loadingJackson={loadingJackson}
            />
          )
        }
        
        {
          !isFormVisible && (
            <JacksonVisualFormTable 
            loadingGetJacksonVisual={loadingGetJacksonVisual} 
            getJacksonVisual={filterJacksonFormData}
            rowSelection={rowSelection}
            />
          )
        }
          
        <Modal title="Jackson Visual Form" 
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
                initialValues={{
                  score: '',
                  iv_line: '',
                }}
            >          
            <Form.Item 
                label="Score" 
                name="score"
                hasFeedback
                rules={[
                    {
                      required: true,
                      message: 'Please input score!',
                    },
                  ]}
                >
                <Input placeholder="Score"
                    type='number'
                />
            </Form.Item>

            <Form.Item
            label="IV Line"    
            name="iv_line"
            hasFeedback
            rules={[
                {
                  required: true,
                  message: 'Please input IV Line!',
                },
              ]}
            >
                <Select>
                    <Select.Option value="1">Insertion</Select.Option>
                    <Select.Option value="2">Removal</Select.Option>
                </Select>
            </Form.Item>
            </Form>
        </Modal>

    </div>
  )
}

export default JacksonVisualForm