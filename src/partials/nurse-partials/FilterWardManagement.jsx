import { Card, Select } from "antd"
import PropTypes from "prop-types"

const FilterWardManagement = ({ getWards, handleWardChange, loadingWards }) => {
  return (
    <>
        <Card style={{ padding: '24px 10px 10px 10px', marginTop: '10px', borderTop: '3px solid #0f5689' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <label htmlFor='selectWard'style={{ marginRight: '20px', fontWeight: 'bold'}}>Search to Select Ward, Room and Bed</label>
                <Select 
                    options={getWards?.map((ward) => ({
                        value: ward.Ward_Code,
                        label: ward.Ward_Name,
                      }))
                    }
                    showSearch
                    loading={loadingWards}
                    onChange={handleWardChange} 
                    placeholder="Search to Select ward"
                    optionFilterProp="label"
                    style={{ width: '50%' }}
                    filterSort={(optionA, optionB) =>
                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                    }
                />
            </div>
        </Card>
    </>
  )
}

export default FilterWardManagement
// props validation
FilterWardManagement.propTypes = {
    getWards: PropTypes.array.isRequired,
    handleWardChange: PropTypes.func.isRequired,
    loadingWards: PropTypes.bool.isRequired,
}