import { Table } from "antd"
import PropTypes from "prop-types"

const NurseNotesTable = ({ observationNotes, loadingTriageList }) => {

  const columns = [
    
    {
      title: 'Treatment Number',
      dataIndex: 'TreatmentNo', 
      key: 'TreatmentNo',
      fixed: 'left',
      width: 100
    },
    {
      title: 'Notes Date',
      dataIndex: 'LinkType', 
      key: 'LinkType',
      render: (text) => text?.toLowerCase(),
    },
    {
      title: 'Notes Date',
      dataIndex: 'ObservationDate', 
      key: 'ObservationDate',
    },
    {
      title: 'Notes',
      dataIndex: 'StatusRemarks', 
      key: 'StatusRemarks',
    },
  ]

  return (
    <div style={{ paddingTop: '30px' }}>
          <Table columns={columns} dataSource={observationNotes} 
          loading={loadingTriageList}
          rowKey='SystemId'
          scroll={{ x: 'max-content' }}
          bordered size='middle' 
          />
    </div>
   
  )
}

export default NurseNotesTable
// propTypes
NurseNotesTable.propTypes = {
  observationNotes: PropTypes.array,
  loadingTriageList: PropTypes.bool
}
