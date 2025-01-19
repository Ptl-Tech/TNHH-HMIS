import { Badge, Table } from "antd"
import PropTypes from "prop-types";

const KetamineTable = ({ loadingKetamine, data, treatmentNo }) => {
    const filterData = data?.filter((item) => item?.Link_No === treatmentNo);
    const filterProcedureData = filterData?.filter((item)=>item.Procedure_Type === 'Ketamine Infusion')
const columns = [
        {
            title: 'Visit No',
            dataIndex: 'Link_No',
            key: 'Link_No',
        },

        {
            title: 'Patient No',
            dataIndex: 'PT_00259',
            key: 'PT_00259',
        },
        {
            title: 'Procedure Date',
            dataIndex: 'Procedure_Date',
            key: 'Procedure_Date',
        },
        {
            title: 'Requested Date',
            dataIndex: 'Request_Date',
            key: 'Request_Date',
        },{
            title: "Procedure Type",
            dataIndex: "Procedure_Type",
            key: "Procedure_Type",
        },
        {
            title: 'Requesting Doctor',
            dataIndex: 'Requesting Doctor',
            key: 'Requesting Doctor',
        },
        {
            title: 'Doctor',
            dataIndex: 'Doctor_ID',
            key: 'Doctor_ID',
        },
        {
            title: "Status",
            dataIndex: "Status",
            key: "Status",
            render: (text, record) => {
              if (record.Status === '0') {
                return (
                  <Badge 
                    status="success" 
                    text="Pending" // or any other label
                  />
                );
              } else {
                return (
                  <Badge 
                    status="error" 
                    text="Approved" // or any other label
                  />
                );
              }
            },
          }
          
    ];
  return (
    <div style={{ }}>
    <Table 
       dataSource={filterProcedureData} 
       loading={loadingKetamine}
       columns={columns} 
       className="admit-patient-table"
    />
</div>
  )
}

export default KetamineTable

//props types validations
KetamineTable.propTypes = {
    loadingKetamine: PropTypes.bool.isRequired,
    data: PropTypes.array.isRequired,
    treatmentNo: PropTypes.string.isRequired
}