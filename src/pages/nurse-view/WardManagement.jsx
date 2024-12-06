import { Card, Col, Row, Select } from "antd"
import { hospitalBranchesTotalWards } from "../../constants/nurse-constants"
import { useNavigate } from "react-router-dom";

const WardManagement = () => {

    const navigate = useNavigate();

    function handleWardClick(ward){
        navigate(`/Nurse/Impatient/Ward?Ward=${ward}`)
    }


  return (
    <div>
        <Row>
            <Col span={24}>
                <Card style={{ padding: '24px 10px 10px 10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <label htmlFor='selectWard'style={{ marginRight: '20px', fontWeight: 'bold'}}>Select Ward</label>
                        <Select 
                            options={hospitalBranchesTotalWards} 
                            showSearch
                            onChange={handleWardClick} 
                            placeholder="Search to Select ward"
                            optionFilterProp="label"
                            style={{ width: '300px' }}
                            filterSort={(optionA, optionB) =>
                            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                            }
                        />
                    </div>

                </Card>
            </Col>
        </Row>

    </div>
  )
}

export default WardManagement