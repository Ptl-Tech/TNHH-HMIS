import { Button } from "antd"

const Requests = () => {
  return (
    <>
        <div style={{ display: 'flex', flex: 1, gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
            {
                [
                    'Laboratory Requests',
                    'Pharmacy Requests',
                    'Radiology Requests',
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

export default Requests