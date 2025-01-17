import { Table } from "antd";
import PropTypes from "prop-types";
import { useState } from "react";
import Loading from "../../../../partials/nurse-partials/Loading";
import { Link } from "react-router-dom";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const InpatientTable = ({ loadingPatientList, handleNavigate, filterInPatients, loading }) => {

    const columns = [
        {
          title: "Adm No",
          dataIndex: "Admission_No",
          key: "Admission_No",
        },
        {
          title: "Patient No",
          dataIndex: "Patient_No",
          key: "Patient_No",
        },
        {
          title: "Names",
          dataIndex: "PatientName",
          key: "PatientName",
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
              <Link to={`/assign-ward/${record.Patient_No}`} style={{ color: "red", textDecoration: "none" }}>
                <ExclamationCircleOutlined style={{ color: "red", marginRight: 8 }} />
                <span>Assign Ward</span>
              </Link>
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
              <Link to={`/assign-ward/${record.Patient_No}`} style={{ color: "red", textDecoration: "none" }}>
                <ExclamationCircleOutlined style={{ color: "red", marginRight: 8 }} />
                <span>Assign Bed</span>
              </Link>
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
};