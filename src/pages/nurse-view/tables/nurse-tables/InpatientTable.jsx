import { Table } from "antd";
import PropTypes from "prop-types";
import { useState } from "react";
import Loading from "../../../../partials/nurse-partials/Loading";

const InpatientTable = ({ loadingPatientList, handleNavigate, filterInPatients, searchName, searchPatientNumber, searchAdmissionNumber }) => {

    const columns = [
        {
          title: "Adm No",
          dataIndex: "CurrentAdmNo",
          key: "CurrentAdmNo",
          filteredValue: searchAdmissionNumber ? [searchAdmissionNumber] : null,
          onFilter: (value, record) =>
            record?.CurrentAdmNo ?
            record.CurrentAdmNo.toLowerCase().includes(value.toLowerCase()) : false,
        },
        {
          title: "Patient No",
          dataIndex: "PatientNo",
          key: "PatientNo",
          filteredValue: searchPatientNumber ? [searchPatientNumber] : null,
          onFilter: (value, record) =>
          record?.PatientNo ?
          record.PatientNo.toLowerCase().includes(value.toLowerCase()) : false,
        },
        {
          title: "Names",
          dataIndex: "SearchName",
          key: "SearchName",
          filteredValue: searchName ? [searchName] : null,
          onFilter: (value, record) =>
            record?.SearchName ?
            record.SearchName.toLowerCase().includes(value.toLowerCase()) : false,
          render: (_, record) => (
            <a
              onClick={() => handleNavigate(record)}
              style={{ color: "#0f5689" }}
            >
              {record.SearchName}
            </a>
          ),
        },
        {
          title: "Adm Date",
          dataIndex: "AdmissionsDate",
          key: "AdmissionsDate",
        },
        {
          title: "Ward",
          dataIndex: "Ward",
          key: "Ward",
          render: (ward) => ward || "Not assigned",
        },
        {
          title: "Bed",
          dataIndex: "Bed",
          key: "Bed",
          render: (bed) => bed || "Not assigned",
        },
        {
          title: "Doctor",
          dataIndex: "Doctor",
          key: "Doctor",
          render: (doctor) => doctor || "Not assigned",
        },
      ];
      const [pagination, setPagination] = useState({
            current: 1,
            pageSize: 10,
            total: filterInPatients?.length,
        });
      
      const handleTableChange = (newPagination) => {
            setPagination(newPagination); // Update pagination settings
      };
      
  return (
    <>
        {
            loadingPatientList ? (
                <Loading />
            ):(
            <Table
                columns={columns}
                dataSource={filterInPatients}
                className="admit-patient-table"
                bordered size='middle' 
                rowKey={(record) => record.PatientNo}
                pagination={{
                    ...pagination,
                    total: filterInPatients?.length,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    position: ['bottom', 'right'],
                    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                    onChange: (page, pageSize) => handleTableChange({ current: page, pageSize, total: pagination.total }),
                    onShowSizeChange: (current, size) => handleTableChange({ current, pageSize: size, total: pagination.total }),
                    style: {
                        marginTop: '30px',
                    }
                }}
            />
            )
        }
        
    </>
  )
}

export default InpatientTable

// props validation
InpatientTable.propTypes = {
    loadingPatientList: PropTypes.bool.isRequired,
    handleNavigate: PropTypes.func.isRequired,
    filterInPatients: PropTypes.array.isRequired,
    searchName: PropTypes.bool.isRequired,
    searchPatientNumber: PropTypes.bool.isRequired,
    searchAdmissionNumber: PropTypes.bool.isRequired
};