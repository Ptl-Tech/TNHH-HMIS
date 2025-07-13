import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getReceipts,
  getReceiptsByPatientNo,
} from "../../../actions/Charges-Actions/getReceipts";
import { Table, Input, Button, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import PrintReceipt from "./PrintReceipt";

const AdvancedReceiptList = () => {
  const patientNo = new URLSearchParams(location.search).get("PatientNo");
  const dispatch = useDispatch();
  const { data: receiptHeaders, loading } = useSelector(
    (state) => state.getReceipts
  );
  const { data: patientReceiptHeaders, loading: patientReceiptHeadersLoading } =
    useSelector((state) => state.getReceiptsByPatientNo);

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const [isSearchPerformed, setIsSearchPerformed] = useState(false);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    dispatch(getReceiptsByPatientNo(patientNo));
  }, [dispatch, patientNo]);

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
    const filtered = receiptHeaders.filter((item) =>
      item[dataIndex]
        ?.toString()
        .toLowerCase()
        .includes(selectedKeys[0].toLowerCase())
    );
    setFilteredData(filtered);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
    setSearchedColumn("");
    setIsSearchPerformed(false);
    setFilteredData([]);
  };

  const columns = [
    {
      title: "Patient No",
      dataIndex: "Patient_No",
      key: "Patient_No",
      ...getColumnSearchProps("Patient_No"),
      sorter: (a, b) => a.Patient_No.localeCompare(b.Patient_No),
    },
    {
      title: "Encounter No",
      dataIndex: "Patient_Appointment_No",
      key: "Patient_Appointment_No",
      ...getColumnSearchProps("Patient_Appointment_No"),
      sorter: (a, b) =>
        a.Patient_Appointment_No.localeCompare(b.Patient_Appointment_No),
    },
    {
      title: "Patient Name",
      dataIndex: "Received_From",
      key: "Received_From",
      ...getColumnSearchProps("Received_From"),
      sorter: (a, b) => a.Received_From.localeCompare(b.Received_From),
    },
    {
      title: "Bill No",
      dataIndex: "No",
      key: "No",
      ...getColumnSearchProps("No"),
      sorter: (a, b) => a.No.localeCompare(b.No),
    },
    {
      title: "Amount Received",
      dataIndex: "Amount_Recieved",
      key: "Amount_Recieved",
      sorter: (a, b) => a.Amount_Recieved - b.Amount_Recieved,
      render: (Amount_Recieved) => {
        const formattedAmount = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "KES",
        }).format(Amount_Recieved);
        return formattedAmount;
      },
    },
    {
      title: "Document Date",
      dataIndex: "Document_Date",
      key: "Document_Date",
      render: (Document_Date) => {
        const formattedDate = new Date(Document_Date).toLocaleDateString(
          "en-GB",
          {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }
        );
        return formattedDate;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => <PrintReceipt receiptNo={record.No} />,
    },
  ];
  console.log(receiptHeaders);
  return (
 
      <>
        {/* <div
          style={{
            marginTop: "20px",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Input
            placeholder="Search by Patient No, Encounter No, or Patient Name..."
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              if (e.target.value === "") {
                setIsSearchPerformed(false);
                setFilteredData([]);
              }
            }}
            style={{ width: "100%", marginBottom: 16 }}
          />
          <div className="d-flex gap-2 my-3">
            <Button
              type="primary"
              onClick={() => {
                const filtered = receiptHeaders.filter(
                  (item) =>
                    item.Patient_No?.toString()
                      .toLowerCase()
                      .includes(searchText.toLowerCase()) ||
                    item.Patient_Appointment_No?.toString()
                      .toLowerCase()
                      .includes(searchText.toLowerCase()) ||
                    item.Received_From?.toString()
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
              {" "}
              Reset
            </Button>
          </div>
        </div> */}
        <Table
          columns={columns}
          size="small"
          dataSource={isSearchPerformed ? filteredData : []}
          loading={loading}
          rowKey="No"
          pagination={{
            pageSize: 50,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "100"],
          }}
        />
      </>
  );
};

export default AdvancedReceiptList;
