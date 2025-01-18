import { Card, Input } from "antd"
import PropTypes from "prop-types"

const FilterConsultationRoom = ({ setSearchName, setSearchPatientNumber, setSearchVisitNumber }) => {
  return (
    <>
    <Card style={{ padding: '10px 16px', marginBottom: '10px', backgroundColor: '#fcfafa' }}>
    <div className='admit-patient-filter-container'>
        <Input.Search placeholder="search by patient name" 
            allowClear
            onChange={(value)=>setSearchName(value.target.value)}
        />
        <span style={{ color: 'gray', fontSize: '14px', fontWeight: 'bold' }}>or</span>
        <Input.Search placeholder="search by patient number" 
            allowClear
            onChange={(value)=>setSearchPatientNumber(value.target.value)}
        />
        <span style={{ color: 'gray', fontSize: '14px', fontWeight: 'bold'}}>or</span>
        <Input.Search placeholder="search visit number" 
            allowClear
            onChange={(value)=>setSearchVisitNumber(value.target.value)}
        />
    </div>
    </Card>
    </>
  )
}

export default FilterConsultationRoom
//props validation
FilterConsultationRoom.propTypes = {
    setSearchName: PropTypes.bool.isRequired,
    setSearchPatientNumber: PropTypes.bool.isRequired,
    setSearchVisitNumber: PropTypes.bool.isRequired
}