import { Card, Col, Row, Space, Typography } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { FolderViewOutlined, SearchOutlined } from '@ant-design/icons'
import { hospitalBranchesTotalWards } from '../../constants/nurse-constants'

const Impatient = () => {

    const navigate = useNavigate();

    function handleWardClick(ward){
        navigate(`/Nurse/Impatient/Ward?Ward=${ward}`)
    }
  return (
    <Row gutter={[16, 16]} style={{ margin: '10px 10px' }}>
        <Col flex={2}>
            <Card title="Impatient List" >

                {
                    hospitalBranchesTotalWards.map((ward, index) => (
                        <div key={index} style={{ padding: '10px 22px 10px 22px' }}>
                            <div style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}} onClick={()=>handleWardClick(ward.name)}>
                                <Typography.Text style={{ fontWeight: 'bold', fontSize: '12px' }}>
                                    {ward.name}
                                </Typography.Text>
                                <Space style={{ color: 'gray'}}>
                                    <FolderViewOutlined />
                                    <Typography.Text style={{ color: 'gray', fontSize: '12px', fontWeight: "bold" }}>View</Typography.Text>
                                </Space>
                            </div>
                        </div>
                    ))
                }
                
            </Card>
        </Col>
        <Col flex={3}>
            <Card title="Quick View">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 22px 10px 22px' }}>
                <Link to="/nurse-view/patient-registration" style={{ textDecoration: 'none', fontWeight: 'bold', fontSize: '12px' }}>
                    Quick View
                </Link>
                <Space style={{ color: 'gray'}}>
                    <SearchOutlined />
                    <Typography.Text style={{ color: 'gray', fontSize: '12px', fontWeight: "bold" }}>
                        Quick view of today's occupancy of the nursing wards.
                    </Typography.Text>
                </Space>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 22px 10px 22px' }}>
                <Link to="/nurse-view/patient-registration" style={{ textDecoration: 'none', fontWeight: 'bold', fontSize: '12px' }}>
                    Search a Patient
                </Link>
                <Space style={{ color: 'gray'}}>
                    <SearchOutlined />
                    <Typography.Text style={{ color: 'gray', fontSize: '12px', fontWeight: "bold" }}>
                        Search the wards for an admitted patient.
                    </Typography.Text>
                </Space>
            </div>
            </Card>
        </Col>
    </Row>
  )
}

export default Impatient