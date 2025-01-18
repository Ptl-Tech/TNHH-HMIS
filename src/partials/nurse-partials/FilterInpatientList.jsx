import { Card, Input } from "antd"
import PropTypes from "prop-types"

const FilterInpatientList = ({ setSearchName, setSearchPatientNumber, setSearchAdmissionNumber }) => {
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
        <Input.Search placeholder="search admission number" 
            allowClear
            onChange={(value)=>setSearchAdmissionNumber(value.target.value)}
        />
    </div>
    </Card>
</>
  )
}

export default FilterInpatientList

// props validation
FilterInpatientList.propTypes = {
    setSearchName: PropTypes.bool.isRequired,
    setSearchPatientNumber: PropTypes.bool.isRequired,
    setSearchAdmissionNumber: PropTypes.bool.isRequired

}