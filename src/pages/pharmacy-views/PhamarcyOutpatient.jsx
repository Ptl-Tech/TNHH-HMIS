import {
  Form,
  Input,
  DatePicker,
  Row,
  Col,
  Button,
  Typography,
  Select,
  Modal,
  Table,
  Card
} from "antd";
import moment from "moment"; // Import moment to handle date formatting
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  SendOutlined,
  FileSearchOutlined,
  CalendarOutlined,
  FileTextOutlined,
  SaveOutlined,
  EyeOutlined,
  MedicineBoxTwoTone,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { postRadiologyRequest } from "../../actions/Doc-actions/postRadiolgyRequest";
import {
  getPatientRadiologyTest,
  requestRadiologyTest,
} from "../../actions/Doc-actions/requestRadiologyTest";
import { getRadiologySetup } from "../../actions/Doc-actions/qyRadiologyTestSetups";
import PharmacyCard from "./PharmacyCard";
import { getNewPharmacyRequests } from "../../actions/pharmacy-actions/getNewPharmacyRequest";
import SkeletonLoading from "../../partials/nurse-partials/Skeleton";
import Search from "antd/es/input/Search";

const { Option } = Select;

const PhamarcyOutpatient = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [filters, setFilters] = useState({
    names: "",
    pharmacyNo: "",
    systemId: "",
  });
  const [filtered, setFiltered] = useState([]);
  const {
    loading: newPharmacyRequestsLoading,
    data: newPharmacyRequests = [], 
  } = useSelector((state) => state.getNewPharmacyList);

  useEffect(() => {
    dispatch(getNewPharmacyRequests());
  }, [dispatch]);

  const handleOnChange = (e, field) => {
    const value = e.target.value;
    const updatedFilters = { ...filters, [field]: value };
    setFilters(updatedFilters);
    const filteredData = handleFilterPatients(updatedFilters);
    setFiltered(filteredData);
  };


  const handleFilterPatients = (updatedFilters) => {
    return newPharmacyRequests.filter((patient) => {
      const name = patient.Names?.toLowerCase() || "";  
      const pharmacyNo = patient.PharmacyNo?.toLowerCase() || "";
      const id = patient.SystemId?.toLowerCase() || "";

      const filterName = updatedFilters.names?.toLowerCase() || null;
      const filterPharmacyNo = updatedFilters.pharmacyNo?.toLowerCase() || null;
      const filterSystemId = updatedFilters.systemId?.toLowerCase() || null;

      return (
        (filterName ? name.includes(filterName) : true) &&
        (filterPharmacyNo ? pharmacyNo.includes(filterPharmacyNo) : true) &&
        (filterSystemId ? id.includes(filterSystemId) : true)
      );
    });
  }; 
  
 const handleNavigate = (PharmacyNo) => {
  navigate({
    pathname: '/Doctor/Pharmacy-Card',
    search: `?PharmacyNo=${PharmacyNo}`, // Corrected query string
  });
 };
  
  const columns = [
        {
              title: "Pharmacy No",
              dataIndex: "PharmacyNo",
              key: "PharmacyNo",
            },
            {
              title: "Patient Name",
              dataIndex: "Names",
              key: "Names",
              render: (text, record) => (
                <span
                  style={{ color: "#0F5689", cursor: "pointer" }}
                  onClick={() => handleNavigate(record.PharmacyNo)} // Pass PharmacyNo to the handler
                >
                  {text}
                </span>
              ),
            },
            {
              title: "Request Date",
              dataIndex: "PharmacyDate",
              key: "PharmacyDate",
              render: (date) => moment(date).format("YYYY-MM-DD"),
            },
            {
              title: "Status",
              dataIndex: "New",
              key: "New",
              render: (text, record) => (
                <span
                  style={{
                    color: text ? "green" : "red",
                    cursor: "pointer",
                  }}
                onClick={() => handleNavigate(record.PharmacyNo)}
                >
                  {text ? "New" : "Viewed"}
                </span>
              ),
            },
  ]
   

  return (
    <div>
      <Typography.Title
        level={5}
        style={{
          color: "#0F5689",
          fontSize: "16px",
          marginBottom: "12px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <MedicineBoxTwoTone style={{ marginRight: "8px" }} />
        New Pharmacy Requests
      </Typography.Title>

      <Card style={{ padding: "10px" }}>
        <div className="admit-patient-filter-container">
          <Search
            placeholder="Search by pharmacy no"
            allowClear
            value={filters.pharmacyNo}
            onChange={(e) => handleOnChange(e, "pharmacyNo")}
          />
          <span style={{ color: "gray", fontSize: "14px", fontWeight: "bold" }}>or</span>
           <Search
            placeholder="Search by name"
            allowClear
            value={filters.names}
            onChange={(e) => handleOnChange(e, "names")}
          />
         
          <span style={{ color: "gray", fontSize: "14px", fontWeight: "bold" }}>or</span>
          <Search
            placeholder="Search by ID number"
            allowClear
            value={filters.systemId}
            onChange={(e) => handleOnChange(e, "systemId")}
          />
        </div>
      </Card>

      {newPharmacyRequestsLoading ? (
        <SkeletonLoading />
      ) : (
        <Table
          style={{ marginTop: "30px" }}
          dataSource={filtered.length > 0 ? filtered : newPharmacyRequests} // Use filtered data if available
          columns={columns}
          rowKey={(record) => record.SystemId || record.PharmacyNo} // Ensure unique keys
        />
      )}
    </div>
  );
};


export default PhamarcyOutpatient;
