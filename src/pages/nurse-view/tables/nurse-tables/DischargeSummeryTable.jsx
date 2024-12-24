import { Button, Space, Table } from "antd"

const DischargeSummeryTable = () => {
    const columns = [   
       
        {
            title: 'Investigation Done',
            dataIndex: 'investigationDone',
            key: 'investigationDone',
        },
        {
            title: 'Management',
            dataIndex: 'management',
            key: 'management',
        },
        {
            title: 'Final Diagnosis',
            dataIndex: 'finalDiagnosis',
            key: 'finalDiagnosis',
        },
        {
            title: 'Review Date',
            dataIndex: 'reviewDate',
            key: 'reviewDate',
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button color="danger" variant="outlined"
                    onClick={() => handleCancel(record)}
                    >Cancel</Button>
                </Space>
            ),
        }
    ];

    const data = [
        {
            key: '1',
            investigationDone: 'Investigation Done',
            management: 'Management',
            finalDiagnosis: 'Final Diagnosis',
            reviewDate: 'Review Date',
        },
    ];

    const handleCancel = (record) => {
        console.log('Cancel clicked');
    };

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

export default DischargeSummeryTable