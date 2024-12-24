import { Button, Space, Table } from "antd"
import PropTypes from "prop-types"

const VitalsTable = ({ showModal }) => {
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
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
          <Space size="middle">
              <Button type="primary" onClick={() => showModal()}>Edit</Button>
              <Button color="danger" variant="outlined">Delete</Button>
          </Space>
      ),
    }

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
        <Table columns={columns} dataSource={data} />
    </div>
  )
}

export default VitalsTable
//props types validations
VitalsTable.propTypes = {
    showModal: PropTypes.func.isRequired,
}