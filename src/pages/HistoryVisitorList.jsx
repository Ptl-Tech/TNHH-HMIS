import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  Col,
  Input,
  Row,
  Table,
  Tag,
  Typography,
  Modal,
  Descriptions,
} from "antd";
import { TeamOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { getVisitorsList } from "../actions/visitorsActions";
import moment from "moment";

const HistoryVisitorList = () => {
  const dispatch = useDispatch();

  const {  visitors } = useSelector((state) => state.visitorsList);

  const [searchParams, setSearchParams] = useState({
    VisitorNumber: "",
    VisitorName: "",
    PhoneNumber: "",
    PurposeofVisit: "",
    
  });

  const [showList, setShowList] = useState(false);
  const [filteredvisitors, setFilteredvisitors] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState(null);

  useEffect(() => {
    dispatch(getVisitorsList());
  }, [dispatch]);

  useEffect(() => {
    if (visitors.length) {
      handleFilterVisitors();
    }
  }, [visitors, searchParams]);

  const handleSearchChange = (e, field) => {
    const value = e.target.value;
    setSearchParams((prevState) => ({
      ...prevState,
      [field]: value,
    }));
    setShowList(true);
  };

  const handleFilterVisitors = () => {
    const filtered = visitors.filter((visitor) => {
      return (
        visitor.VisitorName.toLowerCase().includes(
          searchParams.VisitorName.toLowerCase()
        ) &&
        visitor.PhoneNumber.toLowerCase().includes(
          searchParams.PhoneNumber.toLowerCase()
        )
      );
    });
    setFilteredvisitors(filtered);
  };

  const handleAdmitVisitor = (record) => {
    setSelectedVisitor(record);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedVisitor(null);
  };

  const columns = [
    {
        title: "No",
        dataIndex: "No",
        key: "No",
      },
      {
        title: "Visitor Number",
        dataIndex: "VisitorNumber",
        key: "visitorNumber",
      },
      {
        title: "Visitor Name",
        dataIndex: "VisitorName",
        key: "visitorName",
      },
      {
        title: "Purpose of Visit",
        dataIndex: "PurposeofVisit",
        key: "PurposeofVisit",
      },
      {
        title: "Phone Number",
        dataIndex: "PhoneNumber",
        key: "phoneNumber",
      },
      {
        title: "Date of Visit",
        dataIndex: "CreatedDate",
        key: "CreatedDate",
        render: (CreatedDate) => dayjs(CreatedDate).format("DD/MM/YYYY"),
      },
      {
        title: "Time In",
        dataIndex: "CreatedTime",
        key: "CreatedTime",
        render: (CreatedTime) => dayjs(CreatedTime).format("HH:mm"),
      },
      {
        title: "Time Out",
        dataIndex: "timeOut",
        key: "timeOut",
        render: (timeOut) => dayjs(timeOut).format("HH:mm"),
      },
      {
        title: "Status",
        dataIndex: "Status",
        key: "status",
        render: (status) => {
          const statusColors = {
            Arrived: "orange",
            Entered: "red",
            Received: "blue",
            Cleared: "green",
          };
          return <Tag color={statusColors[status] || "default"}>{status}</Tag>;
        },
      },
      {
        title: "Person to See",
        dataIndex: "PersonToSee",
        key: "personToSee",
      },
      {
        title: "Visitor Category",
        dataIndex: "VisitorCategory",
        key: "visitorCategory",
      },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button type="primary" onClick={() => handleAdmitVisitor(record)}>
          Admit Visitor
        </Button>
      ),
    },
  ];

  return (
    <div>
      <h4 className="text-center p-3 text-dark">
        <TeamOutlined style={{ marginRight: "8px", fontSize: "24px" }} />
        History Visitor List
      </h4>

      <Card className="card-header mb-4 mt-4 p-4">
        <Typography.Text style={{ color: "#003F6D", fontWeight: "bold" }}>
          Find visitor Details by:
        </Typography.Text>
        <Row gutter={16} className="mt-2">
          <Col span={8}>
            <Input
              placeholder="Visitor Name"
              value={searchParams.VisitorName}
              onChange={(e) => handleSearchChange(e, "VisitorName")}
              allowClear
            />
          </Col>
          <Col span={8}>
            <Input
              placeholder="Phone Number"
              value={searchParams.PhoneNumber}
              onChange={(e) => handleSearchChange(e, "PhoneNumber")}
              allowClear
            />
          </Col>
        </Row>
      </Card>

      {showList && (
        <Table
          columns={columns}
          dataSource={filteredvisitors}
          rowKey="VisitorNumber"
          pagination={{ pageSize: 10 }}
          className="mt-4"
        />
      )}
<Modal
  title="Admit Visitor"
  visible={isModalVisible}
  onCancel={handleModalClose}
  footer={[
    <Button key="cancel" onClick={handleModalClose}>
      Cancel
    </Button>,
    <Button
      key="save"
      type="primary"
      onClick={() => {
        // Handle save changes logic here
        console.log("Updated Visitor Details:", selectedVisitor);
        handleModalClose();
      }}
    >
      Admit Visitor
    </Button>,
  ]}
  width={800}
>
  {selectedVisitor && (
    <Descriptions bordered column={1}>
      <Descriptions.Item label="Visitor Number">
        <Input
          value={selectedVisitor.VisitorNumber}
          disabled // Assume this field is not editable
        />
      </Descriptions.Item>
      <Descriptions.Item label="Visitor Name">
        <Input
          value={selectedVisitor.VisitorName}
          onChange={(e) =>
            setSelectedVisitor({
              ...selectedVisitor,
              VisitorName: e.target.value,
            })
          }
        />
      </Descriptions.Item>
      <Descriptions.Item label="Phone Number">
        <Input
          value={selectedVisitor.PhoneNumber}
          onChange={(e) =>
            setSelectedVisitor({
              ...selectedVisitor,
              PhoneNumber: e.target.value,
            })
          }
        />
      </Descriptions.Item>
      <Descriptions.Item label="Purpose of Visit">
        <Input
          value={selectedVisitor.PurposeofVisit}
          onChange={(e) =>
            setSelectedVisitor({
              ...selectedVisitor,
              PurposeofVisit: e.target.value,
            })
          }
        />
      </Descriptions.Item>
      <Descriptions.Item label="Date of Visit">
        {dayjs(selectedVisitor.CreatedDate).format("DD/MM/YYYY")}
      </Descriptions.Item>
      <Descriptions.Item label="Time In">
      {dayjs(selectedVisitor.timeOut).format("HH:mm")}
      </Descriptions.Item>
      <Descriptions.Item label="Time Out">
        {moment(selectedVisitor.timeOut).format("HH:mm")}
      </Descriptions.Item>
      <Descriptions.Item label="Status">
        <Input
          value={selectedVisitor.Status}
          onChange={(e) =>
            setSelectedVisitor({
              ...selectedVisitor,
              Status: e.target.value,
            })
          }
        />
      </Descriptions.Item>
      <Descriptions.Item label="Person to See">
        <Input
          value={selectedVisitor.PersonToSee}
          onChange={(e) =>
            setSelectedVisitor({
              ...selectedVisitor,
              PersonToSee: e.target.value,
            })
          }
        />
      </Descriptions.Item>
      <Descriptions.Item label="Visitor Category">
        <Input
          value={selectedVisitor.VisitorCategory}
          onChange={(e) =>
            setSelectedVisitor({
              ...selectedVisitor,
              VisitorCategory: e.target.value,
            })
          }
        />
      </Descriptions.Item>
    </Descriptions>
  )}
</Modal>


    </div>
  );
};

export default HistoryVisitorList;
