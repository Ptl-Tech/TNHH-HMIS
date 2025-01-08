import { Card, Col, Row, Select, Space, Typography } from "antd"
import { BankOutlined } from "@ant-design/icons"
import { hospitalBranchesTotalWards } from "../../constants/nurse-constants"
import BedOccupancyPie from "./nurse-charts/BedOccupancyPie"
import BedOccupancyBar from "./nurse-charts/BedOccupancyBar"

const BedOccupancy = () => {
    
    const handleWardClick = () => {

    }
    
  return (
    <>
        <Space style={{ color: '#0f5689', display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '10px'}}>
            <BankOutlined />
            <Typography.Text style={{ fontWeight: 'bold', color: '#0f5689', fontSize: '16px'}}>
                Ward Management
            </Typography.Text>
        </Space>

        <Card style={{ padding: '24px 10px 10px 10px', marginTop: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <label htmlFor='selectWard'style={{ marginRight: '20px', fontWeight: 'bold'}}>Search to Select Ward</label>
                <Select 
                    options={hospitalBranchesTotalWards} 
                    showSearch
                    onChange={handleWardClick} 
                    placeholder="Search to Select ward"
                    style={{ width: '300px' }}
                    filterSort={(optionA, optionB) =>
                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                    }
                />
            </div>
        </Card>

        <Row gutter={16} style={{ marginTop: '20px' }}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Card title="Ward Occupancy">
                    <BedOccupancyPie />
                </Card>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Card title="Bed Occupancy">
                    <BedOccupancyBar />
                </Card>
            </Col>
        </Row>
    </>
  )
}

export default BedOccupancy