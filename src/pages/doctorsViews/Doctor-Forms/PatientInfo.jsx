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
  Space,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { UserOutlined } from "@ant-design/icons";
import { IoCloseOutline, IoEllipsisVertical } from "react-icons/io5";

import {
  smartMerge,
  fullPatientInfo,
  summaryPatientInfo,
} from "./doctor-utils";
import { useAuth } from "../../../hooks/auth";
import { useAbility } from "../../../hooks/casl";

import PatientCharges from "../../billing/CashPatients/PatientCharges";
import { listClinics, listDoctors } from "../../../actions/DropdownListActions";
import useFetchPatientDetailsHook from "../../../hooks/useFetchPatientDetailsHook";
import { postMarkasCompleted } from "../../../actions/Doc-actions/postMarkasCompleted";
import { postPsychologyRequestReviewSlice } from "../../../actions/Doc-actions/psychologyReducers";

const PatientInfo = ({ patientNo, treatmentNo, patientDetails }) => {
  const ability = useAbility();
  const dispatch = useDispatch();
  const location = useLocation();

  const patient = smartMerge(
    location.state?.patientDetails || {},
    patientDetails || {}
  );
  const canSeePatientReview = ability.can("read", "patientReview");

  const [moreDetailsOpen, setMoreDetailOpen] = useState(false);
  const [patientReviewOpen, setPatientReviewOpen] = useState(false);

  const { loadinCheckInPatient: markasCompleteLoading } = useSelector(
    (state) => state.markAsCompleted
  );
  const { patientDetails: patientdeets } =
    useFetchPatientDetailsHook(patientNo);

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

  const Extra = () => {
    return (
      <div className="d-flex gap-2 py-2">
        <Button
          onClick={() => {
            setMoreDetailOpen(true);
          }}
        >
          More Details
        </Button>
        {canSeePatientReview && patient?.Status !== "Completed" && (
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
    );
  };

  console.log(fullPatientInfo(patient), summaryPatientInfo(patient));

  return (
    <div>
      <Card
        size="small"
        extra={<Extra />}
        title="Patient Information"
        style={{
          borderTop: "2px solid rgb(15, 86, 137)",
          borderBottom: "2px solid rgb(15, 86, 137)",
        }}
        styles={{
          header: {
            fontSize: "16px",
            color: "rgb(15, 86, 137)",
            background: "rgba(0, 0, 0, 0.02)",
          },
        }}
      >
        {summaryPatientInfo(patient).map((patientInfo) => (
          <RenderPatientDetails component={patientInfo} />
        ))}
      </Card>
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
        activeVisitNo={patientdeets.ActiveVisitNo}
      />
    </div>
  );
};

const PatientReviewModal = ({ open, setOpen, patientNo, treatmentNo }) => {
  const { user } = useAuth();
  const dispatch = useDispatch();

  const [form] = Form.useForm();
  const staffNo = user?.staffNo;

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
      (doctor) => doctor?.Specialization.toUpperCase() === value.toUpperCase()
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

const MoreDeailsDrawer = ({ open, setOpen, values, activeVisitNo }) => {
  return (
    <Drawer
      closable
      open={open}
      width={850}
      footer={null}
      onClose={() => setOpen(false)}
      onCancel={() => setOpen(false)}
      closeIcon={<IoCloseOutline size={21} color="black" />}
    >
      <Space className="d-grid gap-4" direction="vertical">
        <Card
          size="small"
          title="Patient Information"
          style={{
            borderTop: "2px solid rgb(15, 86, 137)",
            borderBottom: "2px solid rgb(15, 86, 137)",
          }}
          styles={{
            header: {
              fontSize: "16px",
              color: "rgb(15, 86, 137)",
              background: "rgba(0, 0, 0, 0.02)",
            },
          }}
        >
          {values.map((patientInfo, index) => (
            <RenderPatientDetails key={index} component={patientInfo} />
          ))}
        </Card>
        <PatientCharges activeVisitNo={activeVisitNo} />
      </Space>
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
          backdropFilter: "blur(10px)",
          background: "rgba(255, 255, 255, .7)",
        },
      }}
      onOpenChange={handleOpenChange}
    >
      {children}
    </Popover>
  );
};

const RenderPatientDetails = ({ component }) => {
  const { type, value } = component;
  var componentToRender;

  switch (type) {
    case "avatar":
      componentToRender = <AvatarComponent values={value} />;
      break;
    case "rows":
      componentToRender = <InfoRows value={value} />;
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
        padding: "8px",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Avatar icon={<UserOutlined />} size={48} />
      <div className="d-grid" style={{ gap: "2px" }}>
        <Title level={5} style={{ margin: 0, fontSize: "16px", color: "#333" }}>
          {name?.toUpperCase()}
        </Title>
        <Text style={{ fontSize: "13px", color: "gray", fontWeight: "bold" }}>
          {ageLabel}: {age}
        </Text>
      </div>
    </div>
  );
};

const InfoRows = ({ value }) => {
  const itemsPerRow = 4;

  return (
    <table
      style={{
        width: "100%",
        fontSize: "16px",
        borderTop: "1px solid #f0f0f0",
      }}
    >
      {Array.from(
        { length: Math.ceil(value.length / itemsPerRow) },
        (item, index) => index * itemsPerRow
      ).map((idx) => {
        return (
          <tr style={{ borderTop: idx === 0 ? "0px" : "1px dashed #d3d3d3" }}>
            {Array.from(
              { length: itemsPerRow },
              (item, index) =>
                value[idx + index] && (
                  <td style={{ width: "25%" }}>
                    <InfoRow
                      label={value[idx + index].label}
                      value={value[idx + index].value}
                    />
                  </td>
                )
            )}
          </tr>
        );
      })}
    </table>
  );
};

const InfoRow = ({ label, value }) => (
  <div
    style={{
      padding: "8px",
      display: "flex",
      flexDirection: "column",
    }}
  >
    <Typography.Title
      level={5}
      style={{ color: "rgb(15, 86, 137)", fontSize: "14px", margin: 0 }}
    >
      {label}
    </Typography.Title>
    <Typography.Text style={{ fontSize: "14px", color: "gray" }}>
      {value || "N/A"}
    </Typography.Text>
  </div>
);

export default PatientInfo;
