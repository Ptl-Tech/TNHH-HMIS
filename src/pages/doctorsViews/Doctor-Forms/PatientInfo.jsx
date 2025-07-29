import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  Card,
  Form,
  Modal,
  Avatar,
  Button,
  Drawer,
  Select,
  message,
  Popover,
  Typography,
  Row,
  Col,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { UserOutlined } from "@ant-design/icons";
import { IoCloseOutline, IoEllipsisVertical } from "react-icons/io5";

import useAuth from "../../../hooks/useAuth";

import {
  smartMerge,
  fullPatientInfo,
  summaryPatientInfo,
} from "./doctor-utils";
import { listClinics, listDoctors } from "../../../actions/DropdownListActions";
import { postMarkasCompleted } from "../../../actions/Doc-actions/postMarkasCompleted";
import { postPsychologyRequestReviewSlice } from "../../../actions/Doc-actions/psychologyReducers";
import PatientCharges from "../../billing/CashPatients/PatientCharges";

const PatientInfo = ({ patientNo, treatmentNo, patientDetails, role }) => {
  const dispatch = useDispatch();
  const location = useLocation();

  const patient = smartMerge(
    location.state?.patientDetails || {},
    patientDetails || {}
  );

  const [moreDetailsOpen, setMoreDetailOpen] = useState(false);
  const [patientReviewOpen, setPatientReviewOpen] = useState(false);

  const { loadinCheckInPatient: markasCompleteLoading } = useSelector(
    (state) => state.markAsCompleted
  );

  const handleMarkAsCompleted = () => {
    dispatch(postMarkasCompleted(treatmentNo))
      .then((data) => {
        if (data?.status === "success") {
          message.success("Patient has been Marked as completed");
        } else {
          message.error("Failed to finalize. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error marking as completed:", error);
        message.error("An error occurred. Please try again.");
      });
  };

  return (
    <div
      style={{
        gap: "20px",
        display: "flex",
        paddingBottom: "20px",
        alignContent: "center",
      }}
    >
      <PatientReviewModal
        patientNo={patientNo}
        open={patientReviewOpen}
        treatmentNo={treatmentNo}
        setOpen={setPatientReviewOpen}
      />
      <MoreDeailsDrawer
        open={moreDetailsOpen}
        setOpen={setMoreDetailOpen}
        values={fullPatientInfo(patient)}
        treatmentNo={treatmentNo}
      />
      <Card
        size="small"
        styles={{ body: { boxShadow: "none" } }}
        style={{ width: "100%", boxShadow: "none", borderColor: "#d9d9d9" }}
      >
        <div style={{ display: "flex" }}>
          <div className="d-grid gap-2 p-3" style={{ width: "100%" }}>
            {summaryPatientInfo(patient).map((patientInfo) => (
              <RenderPatientDetails component={patientInfo} />
            ))}
          </div>
          <div className="d-flex gap-2 p-3">
            <Button
              onClick={() => {
                setMoreDetailOpen(true);
              }}
            >
              More Details
            </Button>
            {(role === "Doctor" || role === "Psychology") &&
              patient?.Status !== "Completed" && (
                <PopoverMenu
                  content={
                    <CardMenu
                      items={[
                        {
                          key: "0",
                          children: "Finalize",
                          onClick: handleMarkAsCompleted,
                          loading: markasCompleteLoading,
                          disabled: markasCompleteLoading,
                        },
                        {
                          key: "1",
                          onClick: () => setPatientReviewOpen(true),
                          children: "Request Patient Review",
                        },
                      ]}
                    />
                  }
                >
                  <Button
                    type="text"
                    shape="circle"
                    icon={<IoEllipsisVertical />}
                  ></Button>
                </PopoverMenu>
              )}
          </div>
        </div>
      </Card>
    </div>
  );
};

const PatientReviewModal = ({ open, setOpen, patientNo, treatmentNo }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const staffNo = useAuth()?.userData.no;

  const [selectedClinic, setSelectedClinic] = useState(null);
  const [filteredDoctors, setFilteredDoctors] = useState([]);

  const { loading: loadingPostPsychologyRequest } = useSelector(
    (state) => state.postPsychologyRequest
  );
  const { loading: doctorsLoading, data: doctorsPayload } = useSelector(
    (state) => state.getDoctorsList
  );
  const { loading: clinicsLoading, clinics: clinicsPayload } = useSelector(
    (state) => state.clinics
  );

  useEffect(() => {
    dispatch(listClinics());
    dispatch(listDoctors());
  }, []);

  const handleOk = () => {
    form.submit();
    setOpen(false);
  };

  const handleOnFinish = async (values) => {
    const data = {
      ...values,
      staffNo,
      patientNo,
      treatmentNo,
    };

    await dispatch(postPsychologyRequestReviewSlice(data)).then((data) => {
      if (data?.status === "success") {
        message.success("Request Sent Successfully");
      } else {
        message.error("Failed to send request. Please try again.");
      }
    });
  };

  const handleSelectChange = (value) => {
    setSelectedClinic(value);
    const matchingDoctors = doctorsPayload.filter(
      (doctor) => doctor.Specialization.toUpperCase() === value.toUpperCase()
    );
    setFilteredDoctors(matchingDoctors);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Modal
      onOk={handleOk}
      open={open}
      okText="Send Request"
      onCancel={handleCancel}
      title="Request Patient Review"
      confirmLoading={loadingPostPsychologyRequest}
    >
      <Form
        layout="vertical"
        style={{ paddingTop: "10px" }}
        form={form}
        onFinish={handleOnFinish}
        initialValues={{
          date: "",
          time: "",
          remarks: "",
          takingOver: "",
          handingOver: "",
        }}
      >
        <Form.Item
          label="Select Clinic"
          name="clinic"
          rules={[{ required: true, message: "Please select clinic" }]}
        >
          <Select
            showSearch
            placeholder="Select Clinic"
            style={{ width: "100%" }}
            onChange={handleSelectChange}
            loading={clinicsLoading}
            options={
              clinicsPayload?.map((clinic) => ({
                value: clinic?.No,
                label: clinic?.Description,
              })) || []
            }
            filterOption={(value, option) =>
              option?.label.toLowerCase().includes(value.toLowerCase())
            }
          />
        </Form.Item>
        {(selectedClinic?.toLowerCase() === "psychiatrist" ||
          selectedClinic?.toLowerCase() === "psychologist") && (
          <Form.Item
            label={
              selectedClinic?.toLowerCase() === "psychiatrist"
                ? "Select Psychiatrist"
                : "Select Psychologist"
            }
            name="doctor"
          >
            <Select
              showSearch
              placeholder={
                selectedClinic?.toLowerCase() === "psychiatrist"
                  ? "Select Psychiatrist"
                  : "Select Psychologist"
              }
              style={{ width: "100%" }}
              loading={doctorsLoading}
              options={filteredDoctors.map((doctor) => ({
                value: doctor?.DoctorID,
                label: doctor?.DoctorsName,
              }))}
              filterOption={(value, option) =>
                option?.label.toLowerCase().includes(value.toLowerCase())
              }
            />
          </Form.Item>
        )}

        <Form.Item label="Request Reason" name="remarks">
          <TextArea
            placeholder="Enter Request Reason"
            style={{ width: "100%" }}
            rows={3}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

const MoreDeailsDrawer = ({ open, setOpen, values , treatmentNo}) => {
  return (
    <Drawer
      closable
      open={open}
      footer={null}
      onClose={() => setOpen(false)}
      onCancel={() => setOpen(false)}
      closeIcon={<IoCloseOutline size={21} color="black" />}
      width={850}
    >
      <>
      <div
  style={{
    padding: "8px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "10px",
    backgroundColor: "#f9f9f9", // light background for contrast
  }}
>
  {values.map((patientInfo, index) => (
    <RenderPatientDetails key={index} component={patientInfo} />
  ))}
</div>

<PatientCharges activeVisitNo={treatmentNo} />

      </>
    </Drawer>
  );
};

const CardMenu = ({ items }) => {
  return (
    <div style={{ maxWidth: "280px" }}>
      {items.map(({ key, onClick, loading, disabled, children }, idx) => (
        <Button
          block
          key={key}
          type="text"
          size="medium"
          loading={loading}
          onClick={onClick}
          disabled={disabled}
          style={{
            color: "#333",
            justifyContent: "start",
            borderTop: idx === 0 ? "none" : ".5px solid #efefef",
          }}
        >
          {children}
        </Button>
      ))}
    </div>
  );
};

const PopoverMenu = ({ content, children }) => {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };

  return (
    <Popover
      open={open}
      trigger="click"
      content={content}
      placement="bottomRight"
      styles={{
        body: {
          padding: 0,
          background: "rgba(255, 255, 255, .7)",
          backdropFilter: "blur(10px)",
        },
      }}
      onOpenChange={handleOpenChange}
    >
      {children}
    </Popover>
  );
};

const RenderPatientDetails = ({ component }) => {
  const { type, value, label } = component;
  var componentToRender;

  switch (type) {
    case "avatar":
      componentToRender = <AvatarComponent values={value} />;
      break;
    case "rowData":
      componentToRender = <InfoRow label={label} value={value} />;
    default:
      break;
  }
  return componentToRender;
};

const AvatarComponent = ({ values }) => {
  const { Title, Text } = Typography;
  const [{ value: name }, { label: ageLabel, value: age }] = values;

  return (
    <div
      style={{
        gap: "8px",
        display: "flex",
        padding: "8px 0px",
        alignItems: "center",
      }}
    >
      <Avatar icon={<UserOutlined />} size={48} />
      <div className="d-grid" style={{ gap: "2px" }}>
        <Title
          level={5}
          style={{ margin: 0, fontSize: "16px", color: "#0F5689" }}
        >
          {name.toUpperCase()}
        </Title>
        <Text style={{ fontSize: "13px", color: "gray", fontWeight: "bold" }}>
          {ageLabel}: {age}
        </Text>
      </div>
    </div>
  );
};

const InfoRow = ({ label, value }) => (
 // <div style={{ display: "flex", justifyContent: "space-between" }}>
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "8px",
    }}
  >
    <Typography.Title level={5} style={{ fontSize: "14px", margin: 0 }}>
      {label}
    </Typography.Title>
    <Typography.Text style={{ fontSize: "14px", color: "gray" }}>
      {value || "N/A"}
    </Typography.Text>
  </div>
);


const InfoCard = ({ InfoRow }) => (
  <Row gutter={16} style={{ marginTop: '20px' }}>
    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
      <Card
        style={{
          padding: '16px 24px',
          borderTop: '3px solid #0f5689',
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          minHeight: '260px',
        }}
      >
        {patientPrimaryInfo.map(({ label, value }, index) => (
          <PrimaryInfoCard key={index} label={label} value={value} />
        ))}
      </Card>
    </Col>
  </Row>
);
export default PatientInfo;
