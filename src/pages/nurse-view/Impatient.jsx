import { Button, Card, Col, Row, Select, Space, Table, Tabs } from 'antd'
import { useNavigate } from 'react-router-dom'
import { PlusOutlined, ExclamationOutlined } from '@ant-design/icons'
import { hospitalBranchesTotalWards } from '../../constants/nurse-constants'

const Impatient = () => {

    const navigate = useNavigate();

    function handleWardClick(ward){
        navigate(`/Nurse/Impatient/Ward?Ward=${ward}`)
    }

    const impatientTableColumns = [
        {
          title: 'Patient No',
          dataIndex: 'patientNumber',
          key: 'patientNumber'
        },
        {
          title: 'Patient Name',
          dataIndex: 'patientName',
          key: 'patientName',
          render: (text) => <a>{text}</a>,
        },
        {
          title: 'Patient ID',
          dataIndex: 'patientId',
          key: 'patientId',
        },
        {
          title: 'Age',
          dataIndex: 'age',
          key: 'age',
        },
        {
          title: 'Sex',
          dataIndex: 'sex',
          key: 'sex',
        },
        {
          title: 'Doctor',
          dataIndex: 'doctor',
          key: 'doctor',
        }
      ]
      const impatientTableData = [
        {
          key: '1',
          patientNo: 'PT_234',
          patientName: 'John Brown',
          patientId: '123456789',
          age: 32,
          sex: 'Male',
          doctor: 'Dr. John Doe'
        },
        {
          key: '2',
          patientNo: 'PT_234',
          patientName: 'Jim Green',
          patientId: '123456789',
          age: 42,
          sex: 'Male',
          doctor: 'Dr. John Doe'
        },
        {
          key: '3',
          patientNo: 'PT_234',
          patientName: 'Joe Black',
          patientId: '123456789',
          age: 32,
          sex: 'Male',
          doctor: 'Dr. John Doe'
        }
      ];
        
  return (
    <>
        <Tabs style={{ padding: '10px 10px' }}>
            <Tabs.TabPane tab="Ward Management" key="wardManagement">
                <Row>
                    <Col span={24}>
                        <Card style={{ padding: '24px 10px 10px 10px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                                <label htmlFor='selectWard'style={{ marginRight: '20px', fontWeight: 'bold'}}>Select Ward</label>
                                <Select 
                                    options={hospitalBranchesTotalWards} 
                                    showSearch
                                    onChange={handleWardClick} 
                                    placeholder="Search to Select ward"
                                    optionFilterProp="label"
                                    style={{ width: '300px' }}
                                    filterSort={(optionA, optionB) =>
                                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                    }
                                />
                            </div>

                        </Card>
                    </Col>
                </Row>
            </Tabs.TabPane>
            <Tabs.TabPane tab="Outpatient Visits" key="outpatientView">
                Tab 2
            </Tabs.TabPane>
            <Tabs.TabPane tab="Admit Patient" key="admitPatient">
                <Card style={{ padding: '24px 10px 10px 10px' }}>
                    <Space>
                        <Button color='primary'>
                            <PlusOutlined />
                            Admit Patient
                        </Button>
                        <Button color='danger' variant='outlined'>
                            <ExclamationOutlined />
                            Cancel Admission
                        </Button>
                    </Space>
                    <Table columns={impatientTableColumns} dataSource={impatientTableData} />
                </Card>
            </Tabs.TabPane>
            <Tabs.TabPane tab="Current Impatient" key="currentImpatient">
                Tab 4
            </Tabs.TabPane>
            <Tabs.TabPane tab="Discharge Request" key="dischargeRequest">
                Tab 5
            </Tabs.TabPane>
            <Tabs.TabPane tab="Store Requisition" key="storeRequisition">
                Tab 6
            </Tabs.TabPane>
                Tab 7
        </Tabs>
    </>
  )
}

export default Impatient