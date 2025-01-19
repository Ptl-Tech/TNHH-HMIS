import { Button, Table } from "antd";
import PropTypes from "prop-types";
import { useState } from "react";
import Loading from "../../../../partials/nurse-partials/Loading";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const InpatientTable = ({ loadingPatientList, handleNavigate, filterInPatients, loading, searchName, searchPatientNumber, searchAdmissionNumber }) => {

    const columns = [
        {
          title: "Adm No",
          dataIndex: "Admission_No",
          key: "Admission_No",
          filteredValue: searchAdmissionNumber ? [searchAdmissionNumber] : null,
          onFilter: (value, record) =>
            record?.Admission_No ?
            record.Admission_No.toLowerCase().includes(value.toLowerCase()) : false,
        },
        {
          title: "Patient No",
          dataIndex: "Patient_No",
          key: "Patient_No",
          filteredValue: searchPatientNumber ? [searchPatientNumber] : null,
          onFilter: (value, record) =>
            record?.Patient_No ?
            record.Patient_No.toLowerCase().includes(value.toLowerCase()) : false,
            },
        {
          title: "Names",
          dataIndex: "PatientName",
          key: "PatientName",
          filteredValue: searchName ? [searchName] : null,
          onFilter: (value, record) =>
            record?.PatientName ?
            record.PatientName.toLowerCase().includes(value.toLowerCase()) : false,
          render: (_, record) => (
            <a
              onClick={() => handleNavigate(record)}
              style={{ color: "#0f5689" }}
            >
              {record.PatientName}
            </a>
          ),
        },
        {
          title: "Adm Date",
          dataIndex: "Admission_Date",
          key: "Admission_Date",
          sorter: (a, b) => new Date(b.Admission_Date) - new Date(a.Admission_Date),
          defaultSortOrder: "ascend", // Ensure default sorting is newest to oldest
        },
        
        {
          title: "Ward",
          dataIndex: "Ward",
          key: "Ward",
          render: (ward, record) =>
            ward ? (
              ward
            ) : (
              <Button variant="link" style={{ color: "red", textDecoration: "none" }} onClick={handleClick(record)}>
                <ExclamationCircleOutlined style={{ color: "red", marginRight: 8 }} />
                <span>Assign Ward</span>
              </Button>
            ),
        },
        {
          title: "Bed",
          dataIndex: "Bed",
          key: "Bed",
          render: (bed, record) =>
            bed ? (
              bed
            ) : (
              <Button variant="link" style={{ color: "red", textDecoration: "none" }} onClick={handleClick(record)}>
                <ExclamationCircleOutlined style={{ color: "red", marginRight: 8 }} />
                <span>Assign Bed</span>
              </Button>
            ),
        },
        {
          title: "Doctor",
          dataIndex: "DoctorsName",
          key: "DoctorsName",
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

      const navigate = useNavigate();
      const handleClick = (record) => {
        record?.PatientNo && navigate(`/Nurse/Admit-patient/Patient?PatientNo=${record?.PatientNo}`, {
          state: { patientDetails: record }
        });
      }
      
  return (
    <>
        {
            loadingPatientList || loading ? (
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
    loading: PropTypes.bool.isRequired,
    searchName: PropTypes.string.isRequired,
    searchPatientNumber: PropTypes.string.isRequired,
    searchAdmissionNumber: PropTypes.string.isRequired
};