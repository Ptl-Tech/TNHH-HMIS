import React, { useEffect, useState, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Input, Button, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { getInvoiceList } from "../../../actions/Charges-Actions/getInvoiceList";
import { getBillingList } from "../../../actions/Charges-Actions/getBillingList";
import { PrintFinalInvoice } from "../InsurancePatients/InvoicePrinting";
import { render } from "react-dom";
import { useNavigate } from "react-router-dom";

const AdvancedInvoiceList = () => {
    const patientNo = new URLSearchParams(location.search).get("PatientNo");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: invoiceHeaders, loading } = useSelector(
    (state) => state.getInvoiceList
  );
  const { patients } = useSelector((state) => state.getBillingList);

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
const [isSearchPerformed, setIsSearchPerformed] = useState(false);
const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    dispatch(getInvoiceList(patientNo));
    dispatch(getBillingList());
  }, [dispatch]);

  // Map Patient_No to full name
  const patientMap = useMemo(() => {
    return patients
      ?.map((patient) => ({
        Patient_No: patient.PatientNo,
        PatientName: patient.Names,
        PatientType: patient.Inpatient,
        SettlementType: patient.PatientType,
      }))
      .reduce((acc, curr) => {
        acc[curr.Patient_No] = {
          PatientName: curr.PatientName,
          PatientType: curr.PatientType,
          SettlementType: curr.SettlementType,
        };
        return acc;
      }, {});
  }, [patients]);

  //  Format invoice list with patient names
  const formattedInvoiceList = useMemo(() => {
    if (!invoiceHeaders) return [];

    const seen = new Set();

    return invoiceHeaders
      .filter((invoice) => {
        const isPosted = invoice.Posted === true; // Ensure it's truly a boolean
        const hasInvoiceNumber = !!invoice.InvoiceNumber;
        const hasPatient = !!patientMap[invoice.Patient_No];
        const isDuplicate = seen.has(invoice.InvoiceNumber);

        if (isPosted && hasInvoiceNumber && hasPatient && !isDuplicate) {
          seen.add(invoice.InvoiceNumber);
          return true;
        }
        return false;
      })
      .map((invoice) => {
        const patientInfo = patientMap[invoice.Patient_No] || {};
        return {
          ...invoice,
          PatientName: patientInfo.PatientName,
          PatientType: patientInfo.PatientType === true ? "IP" : "OP",
          SettlementType: patientInfo.SettlementType,
        };
      });
  }, [invoiceHeaders, patientMap]);

  // 🔍 Table Search Helper
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) => text,
  });
const handleSearch = (selectedKeys, confirm, dataIndex) => {
  confirm();
  setSearchText(selectedKeys[0]);
  setSearchedColumn(dataIndex);
  setIsSearchPerformed(true);

  const filtered = formattedInvoiceList.filter((item) =>
    item[dataIndex]?.toString().toLowerCase().includes(selectedKeys[0].toLowerCase())
  );
  setFilteredData(filtered);
};
const handleReset = (clearFilters) => {
  clearFilters();
  setSearchText("");
  setIsSearchPerformed(false);
  setFilteredData([]);
};


  const columns = [
    {
      title: "Invoice Number",
      dataIndex: "InvoiceNumber",
      key: "InvoiceNumber",
      ...getColumnSearchProps("InvoiceNumber"),
    },
    {
      title: "Patient Number",
      dataIndex: "Patient_No",
      key: "Patient_No",
      ...getColumnSearchProps("Patient_No"),
    },
    {
      title: "Encounter No",
      dataIndex: "VisitNo",
      dataIndex: "VisitNo",
    },
    {
      title: "Patient Name",
      dataIndex: "PatientName",
      key: "PatientName",
      ...getColumnSearchProps("PatientName"),
    },

    {
      title: "Amount",
      dataIndex: "Amount",
      key: "Amount",
      render: (Amount) => {
        const formattedAmount = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "KES",
        }).format(Amount);
        return formattedAmount;
      },
    },
    {
      title: "Date",
      dataIndex: "Date",
      key: "Date",
      //format to dd//MM//yyyy
      render: (date) => {
        const formattedDate = new Date(date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
        return formattedDate;
      },
    },
    {
      title: "Settlement Type",
      dataIndex: "SettlementType",
      key: "SettlementType",
      ...getColumnSearchProps("SettlementType"),
    },
    {
      title: "Patient Type",
      dataIndex: "PatientType",
      key: "PatientType",
      ...getColumnSearchProps("PatientType"),
    },

    {
      title: "Print Invoice",
      key: "Print Invoice",
      render: (_, record) => (
        <PrintFinalInvoice patientNo={record.Patient_No} activeVisitNo={record.VisitNo} />
      ),
    },
    // {
    //   title: "Actions",
    //   key: "actions",
    //   render: (_, record) => (
    //     <Button
    //       type="primary"
    //       onClick={() => {
    //         if (record.PatientType === "IP") {
    //           navigate(
    //             `/Dashboard/Corporate-Inpatient-Charges?PatientNo=${record.Patient_No}`
    //           );
    //         } else {
    //           navigate(
    //             `/Dashboard/CorporatePatient-Charges?PatientNo=${record.Patient_No}`
    //           );
    //         }
    //       }}
    //     >
    //       View Invoice
    //     </Button>
    //   ),
    // },
  ];

  return (
    <>
      <h4 style={{ color: "#0f5689" }}>Previous Bill - Insurance</h4>
      <div style={{ marginTop: "20px" , flexDirection: "row", alignItems: "center"}}>
            <Input
            placeholder="Search by Patient Name or No..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: "100%", marginBottom: 16 }}
            />
            <div className="d-flex gap-2 my-3">
<Button
            type="primary"
            onClick={() => {
              const filtered = formattedInvoiceList.filter((item) =>
                item.PatientName
                  ?.toString()
                  .toLowerCase()
                  .includes(searchText.toLowerCase())
              );
              setFilteredData(filtered);
              setIsSearchPerformed(true);
            }}
            icon={<SearchOutlined />}
            style={{ marginBottom: 16 }}

            >
            Search
            </Button>
            <Button
            onClick={() => {
              setSearchText("");
              setIsSearchPerformed(false);
              setFilteredData([]);
            }}
            style={{ marginBottom: 16 }}
            >
            Reset
            </Button>
                </div>
        </div>
     <Table
  columns={columns}
  size="small"
  dataSource={isSearchPerformed ? filteredData : []}
  loading={loading}
  rowKey="InvoiceID"
  pagination={{
    pageSize: 50,
    showSizeChanger: true,
    pageSizeOptions: ["10", "20", "50", "100"],
  }}
/>
        
    </>
  );
};

export default AdvancedInvoiceList;
