import { Table } from "antd"
import Loading from "../../../partials/nurse-partials/Loading"
import PropTypes from "prop-types"


const PrescriptionTable = ({ loadingPrescriptions, filteredPrescriptions }) => {
  const handleEdit = (record) => {
    console.log('Edit clicked for record:', record);
  }

  const columns = [
    {
      title: 'Encounter No',
      dataIndex: 'TreatmentNo',
      key: 'TreatmentNo',
      fixed: 'left',
      width: 100,
    },
    {
      title: 'Drug No',
      dataIndex: 'DrugNo',
      key: 'DrugNo',
    },
    {
      title: 'Drug Name',
      dataIndex: 'DrugName',
      key: 'DrugName',
    },
    {
      title: 'Dosage',
      dataIndex: 'Dosage',
      key: 'Dosage',
    },
    /* {
      title: 'Quantity',
      dataIndex: 'Quantity',
      key: 'Quantity',
    }, */
    {
      title: 'Route',
      dataIndex: 'Route',
      key: 'Route',      
    },
    /* {
      title: 'Units of Measure',
      dataIndex: 'UnitOfMeasure',
      key: 'UnitOfMeasure',
    }, */
    // {
    //   title: 'Prescribed By',
    //   dataIndex: 'PrescribedByname',
    //   key: 'PrescribedByname',
    // },
    {
      title: 'Remarks',
      dataIndex: 'Remarks',
      key: 'Remarks',
      fixed: 'right',
      // width: 100,
    },
    {
      title: 'Status',
      dataIndex: 'Status',
      key: 'Status',
      // fixed: 'right',
      // width: 100,
    },

    //   {
    //     title: 'Action',
    //     dataIndex: 'Action',
    //     key: 'Action',
    //     fixed: 'right',
    //     width: 100,
    //     render: (_, record) => (
    //       <div>
    //         <Button color="danger" variant="outlined" onClick={() => handleEdit(record)}>Delete</Button>
    //       </div>
    //     )
    // },
  ]
  return (
    <div>
      {
        loadingPrescriptions ? (
          <Loading />
        ) : (
          <Table
            rowKey={(record, index) => (record.ObservationNo || '') + '-' + index}
            scroll={{ x: 'max-content' }}
            columns={columns}
            dataSource={filteredPrescriptions}
            bordered size='middle'
          // pagination={{
          // ...pagination,
          // total: filterAllergies?.length,
          // showSizeChanger: true,
          // showQuickJumper: true,
          // position: ['bottom', 'right'],
          // showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          // onChange: (page, pageSize) => handleTableChange({ current: page, pageSize, total: pagination.total }),
          // onShowSizeChange: (current, size) => handleTableChange({ current, pageSize: size, total: pagination.total }),
          // style: {
          // marginTop: '30px',
          //     }
          // }}
          />
        )
      }
    </div>
  )
}

export default PrescriptionTable

//props types validations
PrescriptionTable.propTypes = {
  loadingPrescriptions: PropTypes.bool.isRequired,
  filteredPrescriptions: PropTypes.array.isRequired,

}
