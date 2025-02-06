import { Table } from "antd"
import PropTypes from "prop-types"

const NurseNotesTable = ({ observationNotes, loadingTriageList }) => {

  const columns = [
    
    {
      title: 'Treatment Number',
      dataIndex: 'TreatmentNo', 
      key: 'TreatmentNo',
      fixed: 'left',
      width: 150
    },
    {
      title: 'Notes Type',
      dataIndex: 'LinkType', 
      key: 'LinkType',
      render: (text) => text?.toLowerCase(),
      width: 150
    },
    {
      title: 'Notes Date',
      dataIndex: 'ObservationDate', 
      key: 'ObservationDate',
      width: 150
    },
    {
      title: 'Notes',
      dataIndex: 'ObservationRemarks', 
      key: 'ObservationRemarks',
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
