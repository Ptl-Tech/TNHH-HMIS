import { Button, message, Table } from "antd";
import PropTypes from "prop-types";
import Loading from "../../../../partials/nurse-partials/Loading";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { DeleteOutlined } from "@ant-design/icons";
import { POST_VISITOR_LIST_FAILURE, POST_VISITOR_LIST_SUCCESS, postVisitorListSlice } from "../../../../actions/nurse-actions/postVisitorListSlice";
import { getVisitorsListSlice } from "../../../../actions/nurse-actions/getVisitorsListSlice";
import { useLocation } from "react-router-dom";

const VisitorFormTable = ({
  loadingIpVisitors,
  filterVisitorList,
  rowSelection,
}) => {
  const location = useLocation();
  const patientNo = new URLSearchParams(location.search).get("PatientNo");
  const dispatch = useDispatch();
  const columns = [
    {
      title: "Admission Number",
      dataIndex: "AdmissionNo",
      key: "AdmissionNo",
      render: (text) => (
        <span
          style={{ fontSize: "14px", fontWeight: "bold", color: "#0f5689" }}
        >
          {text}
        </span>
      ),
    },
    {
      title: "Name",
      dataIndex: "VisitorName",
      key: "VisitorName",
      render: (text) => (
        <span
          style={{ fontSize: "14px", fontWeight: "bold", color: "#0f5689" }}
        >
          {text}
        </span>
      ),
    },
    {
      title: "Contact Number",
      dataIndex: "PhoneNumber",
      key: "PhoneNumber",
    },
    {
      title: "Id Number",
      dataIndex: "IdNumber",
      key: "IdNumber",
    },
    {
      title: 'Action',
      dataIndex: 'Action',
      key: 'Action',
      render: (text, record) => <Button style={{ color: '#0f5689'}} onClick={() => handleDelete(record)} icon={<DeleteOutlined />}>Delete</Button>
    }
  ];

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: filterVisitorList?.length,
  });

  const handleTableChange = (newPagination) => {
    setPagination(newPagination); // Update pagination settings
  };

  const handleDelete = async (record) => {
    const formData = {
      ...record,
      myAction: 'delete'
    }
     const result = await dispatch(postVisitorListSlice('/InpatientForms/VisitorsListForm', formData))
     if( result.type === POST_VISITOR_LIST_SUCCESS){
       dispatch(getVisitorsListSlice(patientNo));
       message.success(`Records updated successfully!`);
     }else if(result.type === POST_VISITOR_LIST_FAILURE){
       message.error(result.payload.message || "Internal server error, please try again later.");
     }
  }

  return (
    <>
      {loadingIpVisitors ? (
        <Loading />
      ) : (
        <div style={{ paddingTop: "30px" }}>
          <Table
            rowKey={(record, index) => record.PhoneNumber + index}
            columns={columns}
            dataSource={filterVisitorList}
            bordered
            size="middle"
            rowSelection={rowSelection}
            pagination={{
              ...pagination,
              total: filterVisitorList?.length,
              showSizeChanger: true,
              showQuickJumper: true,
              position: ["bottom", "right"],
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} items`,
              onChange: (page, pageSize) =>
                handleTableChange({
                  current: page,
                  pageSize,
                  total: pagination.total,
                }),
              onShowSizeChange: (current, size) =>
                handleTableChange({
                  current,
                  pageSize: size,
                  total: pagination.total,
                }),
              style: {
                marginTop: "30px",
              },
            }}
          />
        </div>
      )}
    </>
  );
};

export default VisitorFormTable;

//props validation
VisitorFormTable.propTypes = {
  showModal: PropTypes.func.isRequired,
  loadingIpVisitors: PropTypes.bool.isRequired,
  filterVisitorList: PropTypes.array.isRequired,
  rowSelection: PropTypes.array.isRequired,
};
