import { Card, DatePicker, Form, Button, Select, TimePicker } from 'antd'
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

  const handleOnFinish = (values) => {
    console.log(values)
  }
  
  return (
    <Card title="Appointment Bookings">
        <Form layout="vertical" onFinish={handleOnFinish} style={{ padding: '20px' }}>
            <Form.Item label="Appointment Date">
                <DatePicker style={{ width: '100%' }} size="large"/>
            </Form.Item>
            <Form.Item label="Appointment Time">
                <TimePicker defaultValue={dayjs('12:08', format)} format={format} style={{ width: '100%' }} size="large"/>
            </Form.Item>
            <Form.Item label="Location">
              <Select
                  size="large"
                  placeholder="Select Location"  
                  showSearch
                  allowClear 
                  style={{ width: '100%' }}
                  optionFilterProp="label"
                  options={selectLocation}
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                  }
              >
              </Select>
            </Form.Item>

            <Form.Item label="Clinic">
              <Select 
                  size="large"
                  placeholder="Select Clinic"  
                  showSearch
                  allowClear 
                  style={{ width: '100%' }}
                  optionFilterProp="label"
                  options={selectClinic}
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                  }
              >
              </Select>
            </Form.Item>

            <Form.Item label="Department">
              <Select 
                  size="large"
                  placeholder="Select Doctor Type"  
                  showSearch
                  allowClear 
                  style={{ width: '100%' }}
                  optionFilterProp="label"
                  options={selectDoctorType}
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                  }
              >
              </Select>
            </Form.Item>

            <Form.Item label="Clinician">
              <Select 
                  size="large"
                  placeholder="Select Doctor"  
                  showSearch
                  allowClear 
                  style={{ width: '100%' }}
                  optionFilterProp="label"
                  options={selectDoctor}
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                  }
              >
              </Select>
            </Form.Item>

            <Form.Item label="Patient Name">
              <Select 
                  size="large"
                  placeholder="Search Patient"  
                  showSearch
                  allowClear 
                  style={{ width: '100%' }}
                  optionFilterProp="label"
                  options={patientSearchOptions}
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                  }
              >

              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ width: '100%', fontWeight: 'bold' }}>
                  Book Appointment
              </Button>
            </Form.Item>
        </Form>
    </Card>
    
  )
}

export default Appointment