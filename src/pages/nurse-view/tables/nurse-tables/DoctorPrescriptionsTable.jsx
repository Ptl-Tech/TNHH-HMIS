import { Badge, Space, Table } from "antd"

const DoctorPrescriptionsTable = () => {
const columns = [
        {
            title: 'Drug Name',
            dataIndex: 'drugName',
            key: 'drugName',
        },
        {
          title: 'Dosage',
          dataIndex: 'dosage',
          key: 'dosage',
        },
        {
          title: 'Frequency',
          dataIndex: 'frequency',
          key: 'frequency',
        },
        {
            title: 'Route',
            dataIndex: 'route',
            key: 'route',
        },
        {
          title: 'Duration',
          dataIndex: 'duration',
          key: 'duration',
        },
        {
            title: 'Prescribed By',
            dataIndex: 'prescribedBy',
            key: 'prescribedBy',
        },
        {
          title: 'Status',
          key: 'status',
          render: (_, record) => (
            <Space>
                <Badge status="processing" text={record.status} />
            </Space>
          ),
        },
      ];
      
      const data = [
        {
          key: '1',
          drugName: 'Paracetamol',
          dosage: '500mg',
          frequency: 'Twice a day',
          route: 'Oral',
          duration: '3 days',
          prescribedBy: 'Dr. John Doe',
          status: 'Pending',
        },
        {
          key: '2',
          drugName: 'Ibuprofen',
          dosage: '200mg',
          frequency: 'Once a day',
          route: 'Oral',
          duration: '5 days',
          prescribedBy: 'Dr. Jane Doe',
          status: 'Processed',
        }
    ];
  return (
    <div style={{ paddingTop: '30px' }}>
        <Table columns={columns} dataSource={data} />
    </div>
  )
}

export default DoctorPrescriptionsTable
