import { Card } from 'antd'
import Search from 'antd/es/transfer/search'

const SearchFilters = () => {
  return (
    <Card style={{ padding: '10px 16px', marginBottom: '20px', backgroundColor: '#fcfafa' }}>
          <div className='admit-patient-filter-container'>
                  <Search placeholder="search by names" 
                      allowClear
                  />
                  <span style={{ color: 'gray', fontSize: '14px', fontWeight: 'bold'}}>or</span>
                  <Search placeholder="search by patient no" 
                      allowClear
                  />
                  <span style={{ color: 'gray', fontSize: '14px', fontWeight: 'bold'}}>or</span>
                  <Search placeholder="search by observation no" 
                      allowClear
                  />
              </div>
    </Card>
  )
}

export default SearchFilters

