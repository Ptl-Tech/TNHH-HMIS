import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getVisitorsList } from "../actions/visitorsActions";
import { listPatients, convertPatient } from "../actions/patientActions"; 
import { Table, Skeleton, message, Button } from "antd";
import dayjs from "dayjs";
import { ConvertPatientModal } from "./reception-views/visitorsListPartialViews/ConvertPatientModal";
import { useNavigate } from "react-router-dom";

const VisitorList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { visitors: data } = useSelector((state) => state.visitorsList);
  const { loading: loadingPatients, patients } = useSelector((state) => state.patientList);

  const [filteredVisitors, setFilteredVisitors] = useState([]);
  const [loadingFiltered, setLoadingFiltered] = useState(true);
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [convertPatientModal, setConvertPatientModal] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [errormsg, setErrormsg] = useState(null);

  useEffect(() => {
    dispatch(getVisitorsList());
    dispatch(listPatients()); // Fetch all patients once
  }, [dispatch]);

  useEffect(() => {
    if (!data || data.length === 0 || !patients) {
      setLoadingFiltered(false);
      return;
    }

    setLoadingFiltered(true);

    try {
      const patientSet = new Set(patients.map((p) => p.IDNumber)); // Store patient IDs in a Set

      const filteredList = data
        .filter((visitor) => {
          const isToday = dayjs(visitor.InitiatedDate).isSame(dayjs(), "day");
          const isEntered = visitor.Status === "Entered";
          const isPatient = patientSet.has(visitor.IDNumber);
          return isToday && isEntered && !isPatient;
        })
        .slice(0, 20); // Load only 20 visitors at a time

      setFilteredVisitors(filteredList);
    } catch (error) {
      console.error("Error filtering visitors:", error);
    } finally {
      setLoadingFiltered(false);
    }
  }, [data, patients]);

  const handleConvertToPatient = async () => {
    if (!selectedVisitor) return;
    setLoadingStatus(true);
    setErrormsg(null);

    try {
      const response = await dispatch(convertPatient(selectedVisitor.No));

      if (response) {
        message.success(`Patient Number: ${response}`, 5);
        navigate(`/Reception/Patient-Registration/Patient?PatientNo=${response}`);
      } else {
        message.error("Failed to retrieve patient number");
      }

      dispatch(getVisitorsList()); // Refresh visitor list
      setConvertPatientModal(false);
      setSelectedVisitor(null);
    } catch (error) {
      setErrormsg(error.message);
    } finally {
      setLoadingStatus(false);
    }
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
              navigate(`/Reception/Register-walkin`, { state: { visitorData: record } })
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
      {loadingFiltered ? (
        <Skeleton active paragraph={{ rows: 10 }} />
      ) : (
        <Table
          dataSource={filteredVisitors}
          loading={loadingFiltered}
          rowKey="No"
          columns={columns}
          size="small"
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
