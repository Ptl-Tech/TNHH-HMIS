import { List, Typography } from "antd"

const PatientInfo = () => {
  const data = [
    {
        title: 'Patient Name',
        description: 'Kevin Mwakasila Mwakasila',
    },
    {
        title: 'Patient ID',
        description: '123456789',
    },
    {
        title: 'Admission Number',
        description: 'ADM0001',
    },
    {
        title: 'Treatment Number',
        description: 'TREAT0001',
    },
    {
        title: 'Date of Admission',
        description: '2023-01-01',
    },
    {
        title: 'Identification Number',
        description: '123456789',
    },
    {
        title: 'Gender',
        description: 'Male',
    },
    {
        title: 'Marital Status',
        description: 'Single',
    },
    {
        title: 'Nationality',
        description: 'Kenyan',
    },
    {
        title: 'Date of Birth',
        description: '1990-01-01',
    },
    {
        title: 'Address 1',
        description: '123 Main St',
    },
    {
        title: 'Address 2',
        description: '123 Main St',
    },
    {
        title: 'City',
        description: 'Nairobi',
    },
    {
        title: 'Country',
        description: 'Kenya',
    },
    {
        title: 'County',
        description: 'Nairobi',
    },
    {
        title: 'Postal Code',
        description: 'Kenya',
    },
    {
        title: 'Home Telephone',
        description: '',
    },
    {
        title: 'Mobile Phone',
        description: '+254712345678',
    },
    {
        title: 'Next of Kin Full Name',
        description: 'John Doe',
    },
    {
        title: 'Next of Kin Relationship',
        description: 'Father',
    },
    {
        title: 'Next of Kin Address',
        description: '123 Main St',
    },
]
  return (
    <List 
        itemLayout="horizontal"
          dataSource={data}
          renderItem={item => (
            <List.Item>
                <List.Item.Meta
                    title={<Typography.Text style={{ fontSize: '14px', fontWeight: 'bold' }}>{item.title}</Typography.Text>}
                    description={<Typography.Text>{item.description}</Typography.Text>}
                />
            </List.Item>
         )}
     />
  )
}

export default PatientInfo