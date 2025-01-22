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
  
  const { Option } = Select;
  
  const PharmacyInpatient = () => {
  const navigate=useNavigate();
    const dispatch = useDispatch();
    const [showForm, setShowForm] = useState(true); // Toggle between table and form
  
    const {loading:newPharmacyRequestsLoading, data: newPharmacyRequests } = useSelector(
      (state) => state.getNewPharmacyList
    );
   
  
  useEffect(() => {
      dispatch(getNewPharmacyRequests());
      }, [dispatch]);
  
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
                onClick={() => navigate(`/Pharmacy/Pharmacy-Card/${record.PharmacyNo}`)}
              >
                {text}
              </span>
            ),
          },
          {
            title: "Request Date",
            dataIndex: "PharmacyDate",
            key: "PharmacyDate",
            render: (date) => moment(date).format("YYYY-MM-DD"), // Format date using moment.js
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
                onClick={() => navigate(`/Pharmacy/Pharmacy-Card?PharmacyNo=${record.PharmacyNo}`)}
              >
                {text ? "New" : "Viewed"}
              </span>
            ),
          },
        ];
        
  
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
        Inpatient Pharmacy Request
        </Typography.Title>
  
        <Card style={{ padding: '10px 10px 10px 10px'}}>
              
              <div className='admit-patient-filter-container'>
                  <Input placeholder="search by name" 
                      allowClear
                      showCount
                      showSearch
                  />
                  <span style={{ color: 'gray', fontSize: '14px', fontWeight: 'bold'}}>or</span>
                  <Input placeholder="search by patient no" 
                      allowClear
                      showCount
                      showSearch
                  />
                  <span style={{ color: 'gray', fontSize: '14px', fontWeight: 'bold'}}>or</span>
                  <Input placeholder="search by id number" 
                      allowClear
                      showCount
                      showSearch
                  />
              </div>
          </Card>
        {newPharmacyRequestsLoading ? (
        
        <SkeletonLoading />
  
  
        ) : (
          <Table style={{ marginTop: "30px" }} dataSource={newPharmacyRequests} columns={columns} rowKey="id" />
      )}
      </div>
    );
  };
  
  export default PharmacyInpatient;
  