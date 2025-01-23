import { Card, Col, Row} from "antd"
import BedOccupancyPie from "./nurse-charts/BedOccupancyPie"
import BedOccupancyBar from "./nurse-charts/BedOccupancyBar"
import NurseInnerHeader from "../../partials/nurse-partials/NurseInnerHeader"
import FilterWardManagement from "../../partials/nurse-partials/FilterWardManagement"
import PropTypes from "prop-types"
import { useGetWardManagementHook } from "../../hooks/useGetWardManagementHook"
import { useEffect, useState } from "react"
import { calculateDailyBedOccupancy } from "../../utils/helpers"

const BedOccupancy = () => {
    const { loadingWards, getWards, getBeds } = useGetWardManagementHook();
    const [ selectedWard, setSelectedWard] = useState(null);
    const [getWardsBeds, setGetWardBeds] = useState([]);
    
    const handleWardChange = (value) => {
        setSelectedWard(value);
    }

    const getFreeBeds = getWardsBeds.filter((bed) => bed?.Occupied === false);
    const getOccupiedBeds = getWardsBeds.filter((bed) => bed?.Occupied === true);

    const getTotalOccupiedBeds = getBeds.filter((bed) => bed.Occupied === true);

    useEffect(() => {
        if (selectedWard) {
            const filteredBeds = getBeds.filter((bed) => bed.WardNo === selectedWard);
            setGetWardBeds(filteredBeds);
        } else {
            setGetWardBeds([]);
        }
    }, [selectedWard, getBeds]);
    
  return (
    <>
        <NurseInnerHeader title="Bed Occupancy" />

        <FilterWardManagement getWards={getWards} handleWardChange={handleWardChange} loadingWards={loadingWards}/>

        <Row gutter={16} style={{ marginTop: '20px' }}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Card title={`Daily Ward Bed Occupancy ${selectedWard ? calculateDailyBedOccupancy(getWardsBeds?.length, getOccupiedBeds?.length) : ''}`}>
                    <BedOccupancyPie getFreeBeds={getFreeBeds} getOccupiedBeds={getOccupiedBeds} />
                </Card>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Card title={`Daily Total Bed Occupancy ${selectedWard ? calculateDailyBedOccupancy(getBeds?.length, getTotalOccupiedBeds?.length) : ''}`}>
                    <BedOccupancyBar getBeds={getBeds}/>
                </Card>
            </Col>
        </Row>
    </>
  )
}

export default BedOccupancy

//props validation
BedOccupancy.propTypes = {
    getWards: PropTypes.array,
    handleWardChange: PropTypes.func,
    loadingWards: PropTypes.bool,
}