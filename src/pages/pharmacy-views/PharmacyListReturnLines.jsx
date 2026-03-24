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
import { getPharmacyLineReturnList } from "../../actions/pharmacy-actions/getPharmacyLineReturns";
  
  const { Option } = Select;
  
  const PharmacyListReturnLines = () => {
  const navigate=useNavigate();
    const dispatch = useDispatch();
    const [showForm, setShowForm] = useState(true); // Toggle between table and form
  
    const {loading:PharmacyReturnLinesListLoading, data: PharmacyReturnLinesList } = useSelector(
      (state) => state.getPharmacyReturnLinesList
    );
   
  
  useEffect(() => {
      dispatch(getPharmacyLineReturnList());
      }, [dispatch]);
  
      const columns = [
        { title: "No", dataIndex: "no", key: "no" },
        { title: "Date", dataIndex: "date", key: "date" },
        {title:"Patient Name", dataIndex:"patientName", key:"patientName"},
        { title: "Drug Name", dataIndex: "drugName", key: "drugName" },
        { title: "Unit Price", dataIndex: "unitPrice", key: "unitPrice" },
        { title: "Total Price", dataIndex: "totalPrice", key: "totalPrice" },
        { title: "Actual Qty", dataIndex: "actualQty", key: "actualQty" },
        { title: "Dosage", dataIndex: "dosage", key: "dosage" },
        { title: "Frequency", dataIndex: "frequency", key: "frequency" },
        { title: "Take", dataIndex: "take", key: "take" },
        { title: "Route", dataIndex: "route", key: "route" },
        { title: "Days", dataIndex: "days", key: "days" },
        { title: "Remarks", dataIndex: "remarks", key: "remarks" },
      ];
    
        
  
    return (
      <div>
        <Typography.Title
          level={5}
          style={{
            color: "#b96000",
            fontSize: "16px",
            marginBottom: "12px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <MedicineBoxTwoTone style={{ marginRight: "8px" }} />
     Pharmacy List Returns
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
        {PharmacyReturnLinesListLoading ? (
        
        <SkeletonLoading />
  
  
        ) : (
          <Table style={{ marginTop: "30px" }} dataSource={PharmacyReturnLinesList} columns={columns} rowKey="id" />
      )}
      </div>
    );
  };
  
  export default PharmacyListReturnLines;
  