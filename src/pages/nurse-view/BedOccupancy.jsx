import { Card, Col, Row} from "antd"
import BedOccupancyPie from "./nurse-charts/BedOccupancyPie"
import BedOccupancyBar from "./nurse-charts/BedOccupancyBar"
import NurseInnerHeader from "../../partials/nurse-partials/NurseInnerHeader"
import FilterWardManagement from "../../partials/nurse-partials/FilterWardManagement"
import PropTypes from "prop-types"
import { useGetWardManagementHook } from "../../hooks/useGetWardManagementHook"

const BedOccupancy = () => {
    const { loadingWards, getWards } = useGetWardManagementHook();
    
    const handleWardChange = () => {

    }
    
  return (
    <>
        <NurseInnerHeader title="Bed Occupancy" />

        <FilterWardManagement getWards={getWards} handleWardChange={handleWardChange} loadingWards={loadingWards}/>

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

//props validation
BedOccupancy.propTypes = {
    getWards: PropTypes.array.isRequired,
    handleWardChange: PropTypes.func.isRequired,
    loadingWards: PropTypes.bool.isRequired,
}