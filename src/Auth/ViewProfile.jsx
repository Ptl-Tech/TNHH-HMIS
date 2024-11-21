import React, { useState } from "react";
import { Card, Tabs, Button, Input, List, Avatar } from "antd";
import {
  UserOutlined,
  LockOutlined,
  FileOutlined,
  ProfileOutlined,
} from "@ant-design/icons";

const { TabPane } = Tabs;

const ViewProfile = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
    } else {
      alert("Password changed successfully!");
    }
  };

  const commonRequisitions = [
    { id: 1, title: "Stationery Request" },
    { id: 2, title: "Travel Reimbursement" },
    { id: 3, title: "Equipment Repair" },
  ];

  return (
    <div
     
      
    >
      <Card
        className="profile-card"
        style={{
          width: "100%",
          maxWidth: "1200px",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          backgroundColor: "#fff",
        }}
      >
        <div className="d-flex flex-row">
          {/* Main Profile Section */}
          <div
            className="profile-content"
            style={{ flex: "1", padding: "20px" }}
          >
            {/* Profile Picture and Header */}
            <div className="text-center mb-4">
              <Avatar
                size={120}
                icon={<UserOutlined />}
                style={{
                  backgroundColor: "#87d068",
                  marginBottom: "10px",
                }}
              />
              <h4 className="mb-1" style={{ fontWeight: 600 }}>
                John Doe
              </h4>
              <p className="text-muted" style={{ fontSize: "14px" }}>
                Software Engineer
              </p>
            </div>

            {/* Tabs Section */}
            <Tabs defaultActiveKey="1" centered>
              {/* General Details */}
              <TabPane
                tab={
                  <span>
                    <ProfileOutlined />
                    General Details
                  </span>
                }
                key="1"
              >
                <div style={{ lineHeight: "1.8", fontSize: "14px" }}>
                  <p>
                    <strong>Full Name:</strong> John Doe
                  </p>
                  <p>
                    <strong>Email:</strong> john.doe@example.com
                  </p>
                  <p>
                    <strong>Phone:</strong> +123 456 7890
                  </p>
                  <p>
                    <strong>Address:</strong> 123, Main Street, Cityville
                  </p>
                </div>
              </TabPane>

              {/* Leave Details */}
              <TabPane
                tab={
                  <span>
                    <FileOutlined />
                    Leave Details
                  </span>
                }
                key="2"
              >
                <div style={{ lineHeight: "1.8", fontSize: "14px" }}>
                  <p>
                    <strong>Total Leaves:</strong> 24
                  </p>
                  <p>
                    <strong>Used Leaves:</strong> 10
                  </p>
                  <p>
                    <strong>Remaining Leaves:</strong> 14
                  </p>
                </div>
              </TabPane>

              {/* Common Requisitions */}
              <TabPane
                tab={
                  <span>
                    <FileOutlined />
                    Common Requisitions
                  </span>
                }
                key="3"
              >
                <List
                  itemLayout="horizontal"
                  dataSource={commonRequisitions}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          <FileOutlined style={{ fontSize: "20px", color: "#1890ff" }} />
                        }
                        title={<span style={{ fontWeight: 500 }}>{item.title}</span>}
                      />
                    </List.Item>
                  )}
                />
              </TabPane>

              {/* Change Password */}
              <TabPane
                tab={
                  <span>
                    <LockOutlined />
                    Change Password
                  </span>
                }
                key="4"
              >
                <div>
                  <div className="mb-3">
                    <label style={{ fontWeight: 500 }}>New Password:</label>
                    <Input.Password
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter new password"
                      style={{ marginTop: "5px" }}
                      size="large"
                    />
                  </div>
                  <div className="mb-3">
                    <label style={{ fontWeight: 500 }}>Confirm Password:</label>
                    <Input.Password
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      style={{ marginTop: "5px" }}
                      size="large"
                    />
                  </div>
                  <Button
                    type="primary"
                    onClick={handleChangePassword}
                    block
                    style={{ marginTop: "10px" }}
                    size="large"
                  >
                    Change Password
                  </Button>
                </div>
              </TabPane>
            </Tabs>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ViewProfile;
