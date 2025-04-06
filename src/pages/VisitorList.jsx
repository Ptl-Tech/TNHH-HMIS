import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getVisitorsList } from "../actions/visitorsActions";
import { listPatients, convertPatient } from "../actions/patientActions";
import { Table, Skeleton, message, Button, Input, Space } from "antd";
import dayjs from "dayjs";
import { ConvertPatientModal } from "./reception-views/visitorsListPartialViews/ConvertPatientModal";
import { useNavigate } from "react-router-dom";
import { ReloadOutlined, SearchOutlined } from "@ant-design/icons";

const VisitorList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { visitors: data } = useSelector((state) => state.visitorsList);
  const { loading: loadingPatients, patients } = useSelector((state) => state.patientList);

  const [filteredVisitors, setFilteredVisitors] = useState([]);
  const [displayedVisitors, setDisplayedVisitors] = useState([]);
  const [loadingFiltered, setLoadingFiltered] = useState(true);
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [convertPatientModal, setConvertPatientModal] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [errormsg, setErrormsg] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(getVisitorsList());
    dispatch(listPatients());
  }, [dispatch]);

  useEffect(() => {
    filterVisitors();
  }, [data, patients]);

  useEffect(() => {
    applySearchFilter();
  }, [searchTerm, filteredVisitors]);

  const filterVisitors = () => {
    if (!data || data.length === 0 || !patients) {
      setLoadingFiltered(false);
      return;
    }

    setLoadingFiltered(true);

    try {
      const patientSet = new Set(patients.map((p) => p.IDNumber));
      const filteredList = data
        .filter((visitor) => {
          const isToday = dayjs(visitor.InitiatedDate).isSame(dayjs(), "day");
          const isEntered = visitor.Status === "Entered";
          const isPatient = patientSet.has(visitor.IDNumber);
          return isToday && isEntered && !isPatient;
        });

      setFilteredVisitors(filteredList);
    } catch (error) {
      console.error("Error filtering visitors:", error);
    } finally {
      setLoadingFiltered(false);
    }
  };

  const applySearchFilter = () => {
    if (!searchTerm) {
      setDisplayedVisitors(filteredVisitors.slice(0, 20)); // Initial load
    } else {
      const filtered = filteredVisitors.filter((visitor) =>
        `${visitor.VisitorName ?? ""} ${visitor.IDNumber ?? ""}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
      setDisplayedVisitors(filtered);
    }
  };

  const handleConvertToPatient = async () => {
    if (!selectedVisitor) return;
    setLoadingStatus(true);
    setErrormsg(null);

    try {
      const response = await dispatch(convertPatient(selectedVisitor.No));

      if (response) {
        message.success(`Patient Number: ${response}`, 5);
        navigate(`/reception/Patient-Registration/Patient?PatientNo=${response}`);
      } else {
        message.error("Failed to retrieve patient number");
      }

      dispatch(getVisitorsList());
      setConvertPatientModal(false);
      setSelectedVisitor(null);
    } catch (error) {
      setErrormsg(error.message);
    } finally {
      setLoadingStatus(false);
    }
  };

  const handleRefresh = () => {
    setSearchTerm("");
    dispatch(getVisitorsList());
  };

  const columns = [
    { title: "Index", dataIndex: "index", render: (_, __, index) => index + 1 },
    {
      title: "Visitor No",
      dataIndex: "No",
      render: (no) => <a href={`/visitor/${no}`}>{no}</a>,
    },
    {
      title: "Visitor Name",
      dataIndex: "VisitorName",
      render: (name) => (name ? name.toUpperCase() : "N/A"),
    },
    { title: "ID Number", dataIndex: "IDNumber" },
    { title: "Phone Number", dataIndex: "PhoneNumber" },
    {
      title: "Date of Visit",
      dataIndex: "InitiatedDate",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_, record) => (
        <>
          <Button
            type="link"
            onClick={() => {
              setSelectedVisitor(record);
              setConvertPatientModal(true);
            }}
          >
            Convert to Patient
          </Button>{" "}
          |{" "}
          <Button
            type="link"
            onClick={() =>
              navigate(`/reception/Register-walkin`, { state: { visitorData: record } })
            }
          >
            Register Walk In
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Search by name or ID number"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          prefix={<SearchOutlined />}
          allowClear
          style={{ width: 300 }}
        />
        <Button icon={<ReloadOutlined />} onClick={handleRefresh} loading={loadingFiltered}>
          Refresh
        </Button>
      </Space>

      {loadingFiltered ? (
        <Skeleton active paragraph={{ rows: 10 }} />
      ) : (
        <Table
          dataSource={displayedVisitors}
          rowKey="No"
          columns={columns}
          size="small"
          pagination={{ pageSize: 10 }}
        />
      )}

      {selectedVisitor && (
        <ConvertPatientModal
          modalVisible={convertPatientModal}
          setModalVisible={setConvertPatientModal}
          confirmClearVisitor={handleConvertToPatient}
          clearVisitorLoading={loadingStatus}
          visitor={selectedVisitor}
          errorMessage={errormsg}
        />
      )}
    </div>
  );
};

export default VisitorList;
