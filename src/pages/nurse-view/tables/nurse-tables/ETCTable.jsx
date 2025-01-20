import { Badge, Table } from "antd"
import PropTypes from "prop-types";

const ETCTable = ({ loadingETC, data, treatmentNo, admissionNo }) => {
  const filterData = data?.filter((item) => 
    treatmentNo ? item?.Link_No === treatmentNo : item?.Link_No === admissionNo
  );
    const filterProcedureData = filterData?.filter((item)=>item.Procedure_Type === 'ECT')
const columns = [
        {
            title: 'Visit No',
            dataIndex: 'Link_No',
            key: 'Link_No',
        },

        {
            title: 'Patient No',
            dataIndex: 'Patient_No',
            key: 'Patient_No',
        },
        {
            title: 'Procedure Date',
            dataIndex: 'Procedure_Date',
            key: 'Procedure_Date',
        },
        {
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
       loading={loadingETC}
       columns={columns} 
       className="admit-patient-table"
    />
</div>
  )
}

export default ETCTable

//props types validations
ETCTable.propTypes = {
    loadingETC: PropTypes.bool.isRequired,
    data: PropTypes.array.isRequired,
    treatmentNo: PropTypes.string.isRequired,
    admissionNo: PropTypes.string
}