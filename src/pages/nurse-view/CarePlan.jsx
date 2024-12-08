import { Button } from 'antd'

const CarePlan = () => {
  return (
    <>
        <div style={{ display: 'flex', flex: 1, gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
            {
                [
                    'Add Allergies',
                    'Vitals',
                    'General Observations',
                    'Diagnosis',
                    'Doctors Prescription',
                    'Treatments Sheet',
                    'PreOP Checklist',
                ].map((item, index) => (
                    <Button key={index} type="primary" style={{ backgroundColor: '#0f5689' }} >
                        {item}
                    </Button>
                ))
            }

        </div>

    </>
  )
}

export default CarePlan