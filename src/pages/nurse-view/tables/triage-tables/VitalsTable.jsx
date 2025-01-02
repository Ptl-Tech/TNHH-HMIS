import { Button, Space, Table } from "antd"
import PropTypes from "prop-types"
import { useState } from "react"

const VitalsTable = ({ rowSelection }) => {
  const columns = [
    {
      title: 'Pulse Rate',
      dataIndex: 'pulseRate',
      key: 'pulseRate',
    },
    {
      title: 'Pain',
      dataIndex: 'pain',
      key: 'pain',
    },
    {
      title: 'Height',
      dataIndex: 'height',
      key: 'height',
    },
    {
      title: 'Weight',
      dataIndex: 'weight',
      key: 'weight',
    },
    {
      title: 'Temperature',
      dataIndex: 'temperature',
      key: 'temperature',
    },

  ]

  const data = [
    {
      key: '1',
      pulseRate: '70bpm',
      pain: '3/10',
      height: '5ft 7in',
      weight: '70kg',
      temperature: '36.5°C'
    }
  ]
 
  return (
    <div style={{ paddingTop: '30px' }}>
        <Table columns={columns} dataSource={data} 
        rowSelection={rowSelection}
        />
    </div>
  )
}

export default VitalsTable
//props types validations
VitalsTable.propTypes = {
    rowSelection: PropTypes.object.isRequired
}