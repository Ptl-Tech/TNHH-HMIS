import { Card, DatePicker, Form, Button, Select, TimePicker, Row, Col} from 'antd'
import dayjs from 'dayjs';
const format = 'HH:mm';
const Appointment = () => {
  const patientSearchOptions = [
      {
        value: 1,
        label: 'John Doe',
      },
      {
        value: 2,
        label: 'Jacky Chan',
      },
      {
        value: 3,
        label: 'Peter Parker',
      },
      {
        value: 4,
        label: 'Tony Stark',
      },
      {
        value: 5,
        label: 'Bruce Wayne',
      }
  ]

  const selectLocation = [
    {
      value: 1,
      label: 'CLMC',
    },
    {
      value: 2,
      label: 'Nyali',
    },
    
  ]

  const selectClinic = [
    {
      value: 1,
      label: 'Bustani Outpatient Clinic',
    },
    {
      value: 2,
      label: 'Braeside Outpatient Clinic',
    },
    {
      value: 3,
      label: 'Westlands Outpatient Clinic',
    }
  ]

  const selectDoctorType =[
    {
      value: 1,
      label: 'Psychologist',
    },
    {
      value: 2,
      label: 'Psychiatrist',
    }
  ]

  const selectDoctor = [
    {
      value: 1,
      label: 'Dr. John Doe',
    },
    {
      value: 2,
      label: 'Dr. Jacky Chan',
    },
    {
      value: 3,
      label: 'Dr. Peter Parker',
    },
    {
      value: 4,
      label: 'Dr. Tony Stark',
    },
    {
      value: 5,
      label: 'Dr. Bruce Wayne',
    }
  ]

  const onFinish = (values) => {
    console.log(values);
  }
  
  return (
    <Card title="Book Appointment" style={{ margin: '10px 10px' }}>
        <Form layout="vertical" onFinish={onFinish} style={{ padding: '20px' }}
        
        initialValues={{
          patientName: '',
          appointmentDate: '',
          appointmentTime: '',
          location: '',
          clinic: '',
          department: '',
          clinician: '',
        }}>
          
        <Row>
          <Col span={24}>
            <Form.Item label="Patient Name" name="patientName">
                <Select 
                    size="large"
                    placeholder="Search Patient"  
                    showSearch
                    allowClear 
                    options={patientSearchOptions}
                    style={{ width: '100%' }}
                    optionFilterProp="label"
                    filterSort={(optionA, optionB) =>
                      (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                    }
                    rules={[
                      {
                        required: true,
                        message: 'Please select patient name',
                      },
                    ]}
                >
                </Select>
              </Form.Item>

          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Appointment Date" name="appointmentDate">
                  <DatePicker style={{ width: '100%' }} size="large" 
                    rules={[
                      {
                        required: true,
                        message: 'Please select appointment date',
                      },
                    ]}
                  />
            </Form.Item>
            
          </Col>
          <Col span={12}>
            <Form.Item label="Appointment Time" name="appointmentTime">
                  <TimePicker defaultValue={dayjs('12:08', format)} format={format} style={{ width: '100%' }} size="large"
                    rules={[
                      {
                        required: true,
                        message: 'Please select appointment time',
                      },
                    ]}
                  />
              </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Location" name="location">
                <Select
                    size="large"
                    placeholder="Select Location"  
                    showSearch
                    allowClear 
                    key={'location'}
                    style={{ width: '100%' }}
                    optionFilterProp="label"
                    options={selectLocation}
                    filterSort={(optionA, optionB) =>
                      (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                    }

                    rules={[
                      {
                        required: true,
                        message: 'Please select location',
                      },
                    ]}
                >
                </Select>
              </Form.Item>
          </Col>
          <Col span={12}>
          <Form.Item label="Clinic" name="clinic">
              <Select 
                  size="large"
                  placeholder="Select Clinic"  
                  showSearch
                  allowClear 
                  key={'clinic'}
                  style={{ width: '100%' }}
                  optionFilterProp="label"
                  options={selectClinic}
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                  }
                  rules={[
                    {
                      required: true,
                      message: 'Please select clinic',
                    },
                  ]}
              >
              </Select>
            </Form.Item>
          </Col>
        </Row>

        
      <Row gutter={16}>
        <Col span={12}>

            <Form.Item label="Department" name="department">
              <Select 
                  size="large"
                  placeholder="Select Doctor Type"  
                  showSearch
                  allowClear 
                  key={"department"}
                  style={{ width: '100%' }}
                  optionFilterProp="label"
                  options={selectDoctorType}
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                  }
                  rules={[
                    {
                      required: true,
                      message: 'Please select doctor type',
                    },
                  ]}
              >
              </Select>
            </Form.Item>
        </Col>
        <Col span={12}>
            <Form.Item label="Clinician" name="clinician">
              <Select 
                  size="large"
                  placeholder="Select Doctor"  
                  showSearch
                  allowClear 
                  style={{ width: '100%' }}
                  optionFilterProp="label"
                  options={selectDoctor}
                  key={'doctor'}
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                  }
                  rules={[
                    {
                      required: true,
                      message: 'Please select doctor',
                    },
                  ]}
              >
              </Select>
            </Form.Item>
        </Col>
        </Row>
        
        <Row gutter={16}>
          <Col span={12}>
              <Form.Item>
                <Button 
                    size="large"
                    type="primary"
                    htmlType="submit" 
                    style={{ width: '100%', fontWeight: 'bold' }}>
                    Book Appointment
                </Button>
              </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
    
  )
}

export default Appointment