import { Input, Radio } from 'antd'
import PropTypes from 'prop-types'

const TriageFilters = ({ setFilterWaitingListType, filterWaitingListType, setSearchQueryWaitingList}) => {
  return (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <Radio.Group 
        defaultValue="a" 
        buttonStyle="solid"
        onChange={(e) => setFilterWaitingListType(e.target.value)}
        value={filterWaitingListType}
        >
        <Radio value='name'>Filter by name</Radio>
        <Radio value='idNumber'>Filter by ID</Radio>
        <Radio value='patientNo'>Filter by patient no</Radio>
        </Radio.Group>
        <Input 
        showCount maxLength={20} 
        type='search' 
        placeholder='Search' 
        style={{ width: '300px' }}
        onChange={(e) => setSearchQueryWaitingList(e.target.value)}
        />
    </div>
  )
}

export default TriageFilters

//props validation
TriageFilters.propTypes = {
    setFilterWaitingListType: PropTypes.func.isRequired,
    filterWaitingListType: PropTypes.string.isRequired,
    setSearchQueryWaitingList: PropTypes.func.isRequired,
}