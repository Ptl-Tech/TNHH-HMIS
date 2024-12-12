import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Card,
  Col,
  Input,
  Row,
  Table,
  Typography,
  Pagination,
} from "antd";
import { TeamOutlined } from "@ant-design/icons";
import { getOutPatientTreatmentList } from "../../actions/Doc-actions/OutPatientAction";

const DocOutPatient = () => {
  const { loading, patients } = useSelector((state) => state.docTreatmentList);

  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchParams, setSearchParams] = useState({
    SearchNames: "",
    AppointmentNo: "",
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
  });

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getOutPatientTreatmentList());
    console.log(patients);
  }, [dispatch]);

//   useEffect(() => {
//     setFilteredPatients(patients);
//   }, [patients]);

  const handleSearchChange = (e, key) => {
    const value = e.target.value;
    setSearchParams((prev) => ({ ...prev, [key]: value }));

    const filtered = patients.filter((patient) => {
      const matchesName = patient.SearchNames?.toLowerCase().includes(
        searchParams.SearchNames.toLowerCase()
      );
      const matchesAppointmentNo = patient.AppointmentNo?.toLowerCase().includes(
        searchParams.AppointmentNo.toLowerCase()
      );

      return matchesName && matchesAppointmentNo;
    });

    setFilteredPatients(filtered);
  };

  const handlePaginationChange = (page, pageSize) => {
    setPagination({ current: page, pageSize });
  };

  const columns = [
    {
      title: "Treatment No",
      dataIndex: "TreatmentNo",
      key: "TreatmentNo",
    },
    {
      title: "Patient Name",
      dataIndex: "SearchNames",
      key: "SearchNames",
    },
    {
      title: "Patient No",
      dataIndex: "PatientNo",
      key: "PatientNo",
    },
    {
      title: "Appointment Date",
      dataIndex: "AppointmentDate",
      key: "AppointmentDate",
      render: (text) => {
        const date = new Date(text);
        return date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      },
    },
    {
      title: "Appointment Time",
      dataIndex: "AppointmentTime",
      key: "AppointmentTime",
      render: (text, record) => {
        const dateTimeString = `${record.AppointmentDate}T${record.AppointmentTime}`;
        const dateTime = new Date(dateTimeString);
        return dateTime.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
      },
    },
    {
      title: "Gender",
      dataIndex: "Gender",
      key: "Gender",
    },
    {
      title: "Patient Type",
      dataIndex: "PatientType",
      key: "PatientType",
    },
    {
      title: "Visit Type",
      dataIndex: "VisitType",
      key: "VisitType",
    },
    {
      title: "Status",
      dataIndex: "Status",
      key: "Status",
    },
  ];

  const startIdx = (pagination.current - 1) * pagination.pageSize;
  const endIdx = startIdx + pagination.pageSize;
  const paginatedData = filteredPatients?.slice(startIdx, endIdx);
  const dataSource = paginatedData?.map((patient, index) => ({
    ...patient,
    key: patient.TreatmentNo || index, // Use TreatmentNo or index as a key
  }));
  
  return (
    <div>
      <h4 className="text-center p-3 text-dark">
        <TeamOutlined style={{ marginRight: "8px", fontSize: "24px" }} />
        Waiting List
      </h4>

      <Card className="card-header mb-4 mt-4 p-4">
        <Typography.Text
          style={{
            color: "#003F6D",
            fontWeight: "bold",
            marginBottom: "16px",
          }}
        >
          Find Patient Details by:
        </Typography.Text>
        <Row gutter={16} className="mt-2">
          <Col span={12}>
            <Input
              placeholder="Patient Names"
              value={searchParams.SearchNames}
              onChange={(e) => handleSearchChange(e, "SearchNames")}
            />
          </Col>
          <Col span={12}>
            <Input
              placeholder="Appointment Number"
              value={searchParams.AppointmentNo}
              onChange={(e) => handleSearchChange(e, "AppointmentNo")}
            />
          </Col>
        </Row>
      </Card>

      <div className="mt-4">
        <Table
          columns={columns}
          loading={loading}
          dataSource={dataSource}
          pagination={false}
          bordered
          size="small"
        />
        <Pagination
          total={filteredPatients?.length}
          showTotal={(total, range) =>
            `${range[0]}-${range[1]} of ${total} items`
          }
          defaultPageSize={20}
          current={pagination.current}
          onChange={handlePaginationChange}
          style={{ float: "right", margin: "16px" }}
        />
      </div>
    </div>
  );
};

export default DocOutPatient;
