import { Badge, Space, Table } from "antd"

const DischargeMedicationTable = () => {
    
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
            title: 'UOM',
            dataIndex: 'uom',
            key: 'uom',
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
          uom: 'mg',
          frequency: 'Twice a day',
          route: 'Oral',
          duration: '3 days',
          prescribedBy: 'Dr. John Doe',
          status: 'Pending',
        },
    ];
      return (
        <div style={{ paddingTop: '30px' }}>
            <Table 
            
            columns={columns} 
            dataSource={data} 
            className="admit-patient-table"
            />
    
        </div>
      )
    }


export default DischargeMedicationTable