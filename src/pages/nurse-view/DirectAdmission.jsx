import { DisconnectOutlined } from "@ant-design/icons";
import NurseInnerHeader from "../../partials/nurse-partials/NurseInnerHeader";
import PatientInfo from "./nurse-patient-file/PatientInfo";
import { Button, Card, Col, Form, Input, message, Row, Select } from "antd";
import { useEffect, useState } from "react";
import { useGetWardManagementHook } from "../../hooks/useGetWardManagementHook";
import { useLocation, useNavigate } from "react-router-dom";
import { POST_ADMISSION_FORM_DETAILS_FAILURE, POST_ADMISSION_FORM_DETAILS_SUCCESS, postAdmissionFormDetailsSlice } from "../../actions/nurse-actions/postAdmissionFormDetailsSlice";
import { useDispatch } from "react-redux";
const DirectAdmission = () => {
  const [selectedWard, setSelectedWard] = useState(null);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [filteredBeds, setFilteredBeds] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [loadingBeds, setLoadingBeds] = useState(false);
  const [form] = Form.useForm();
  const location = useLocation();
  const patientNo = new URLSearchParams(location.search).get("PatientNo");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const psychiatricCodingOptions = [
    { label: "Red", value: 0 },
    { label: "Amber", value: 1 },
    { label: "Yellow", value: 2 },
    { label: "Green", value: 3 },
  ];

  function handleWardChange(value) {
    setLoadingRooms(true);
    setSelectedWard(value);
  }

  function handleRoomChange(value) {
    setLoadingBeds(true);
    setSelectedRoom(value);
  }

  function handleBedChange() {
    setLoadingBeds(false);
  }

  const { getBeds, loadingWards, getWards, wardRooms } =
    useGetWardManagementHook();

  useEffect(() => {
    if (selectedWard) {
      setLoadingRooms(true);
      setFilteredBeds([]);
      const timeout = setTimeout(() => {
        setFilteredRooms(
          wardRooms.filter((room) => room.Ward_No === selectedWard)
        );
        setLoadingRooms(false);
      }, 200);
      return () => clearTimeout(timeout); // Cleanup timeout on ward change
    } else {
      setFilteredRooms([]); // Clear rooms if no ward selected
    }
  }, [selectedWard, wardRooms]);

  useEffect(() => {
    if (selectedRoom) {
      setLoadingBeds(true);
      const timeout = setTimeout(() => {
        setFilteredBeds(
          getBeds.filter(
            (bed) => bed.Room_No === selectedRoom && bed.Occupied === true
          )
        );
        setLoadingBeds(false);
      }, 200);
      return () => clearTimeout(timeout); // Cleanup timeout on ward change
    } else {
      setFilteredBeds([]); // Clear rooms if no ward selected
    }
  }, [selectedRoom, getBeds]);
  const handleOnFinish = async (values) => {
    form
      .validateFields()
      .then(() => {
        const formFields = values;
        console.log(formFields);
        const formData ={
          myAction: "create",
          recId: "",
          patientNo: patientNo,
          admissionNo: "string",
          ward: values?.ward,
          wardRoom: values?.wardRoom,
          bed: values?.bed,
          psychiatricCoding: values?.psychiatricCoding,
          codingReason: values?.codingReason,
        }

        try {
              const result = dispatch(postAdmissionFormDetailsSlice(formData));
              if (result.type === POST_ADMISSION_FORM_DETAILS_SUCCESS) {
                message.success(
                  result.payload.message ||
                    "Ward, Room and Bed assigned successfully to patient"
                );
                navigate(`/Nurse/Inpatient`);
              } else if (result.type === POST_ADMISSION_FORM_DETAILS_FAILURE) {
                message.error(
                  result.payload.message ||
                    "Failed to assign ward, bed and room to patient"
                );
              }
            } catch (error) {
              message.error(
                error.message || "An internal error occurred, please try again"
              );
            }
      })
      .catch(() => {
        message.error("Please fill in all required fields");
      });
  };


  return (
    <div>
      <PatientInfo />

      <div style={{ marginTop: "20px" }}>
        <NurseInnerHeader
          icon={<DisconnectOutlined />}
          title="Direct Admissions Form"
        />
        <div style={{ marginTop: "20px" }}>
          <Card style={{ padding: "20px" }}>
            <Form
              layout="vertical"
              style={{ paddingTop: "10px" }}
              onFinish={handleOnFinish}
              form={form}
            >
              <Row gutter={[16, 16]}>
                <Col md={12} sm={24}>
                  <Form.Item
                    label="Admission Reason"
                    name="admissionReason"
                    rules={[
                      {
                        required: true,
                        message: "Please input admission reason",
                      },
                    ]}
                  >
                    <Input
                      type="text"
                      placeholder="Enter admission reason"
                      size="large"
                    />
                  </Form.Item>
                </Col>
                <Col md={12} sm={24}>
                  <Form.Item
                    label="Psychiatric coding"
                    name="psychiatricCoding"
                    rules={[
                      {
                        required: true,
                        message: "Please select psychiatric coding",
                      },
                    ]}
                  >
                    <Select
                      size="large"
                      placeholder="Select Psychiatric Coding"
                      showSearch
                      options={psychiatricCodingOptions?.map((option) => ({
                        value: option.value,
                        label: option.label,
                      }))}
                      filterSort={(optionA, optionB) =>
                        (optionA?.label ?? "")
                          .toLowerCase()
                          .localeCompare((optionB?.label ?? "").toLowerCase())
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col md={12} sm={24}>
                  <Form.Item
                    label="Code Reason"
                    name="codeReason"
                    rules={[
                      {
                        required: true,
                        message: "Please enter code reason",
                      },
                    ]}
                  >
                    <Input
                      type="text"
                      placeholder="Enter code reason"
                      size="large"
                    />
                  </Form.Item>
                </Col>
                <Col md={12} sm={24}>
                  <Form.Item
                    label="Select Ward"
                    name="ward"
                    rules={[
                      {
                        required: true,
                        message: "Please select ward",
                      },
                    ]}
                  >
                    <Select
                      size="large"
                      options={getWards?.map((ward) => ({
                        value: ward.Ward_Code,
                        label: ward.Ward_Name,
                      }))}
                      showSearch
                      loading={loadingWards}
                      onChange={handleWardChange}
                      placeholder="Search to Ward Room"
                      optionFilterProp="label"
                      filterSort={(optionA, optionB) =>
                        (optionA?.label ?? "")
                          .toLowerCase()
                          .localeCompare((optionB?.label ?? "").toLowerCase())
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col md={12} sm={24}>
                  <Form.Item
                    label="Select Ward Room"
                    name="wardRoom"
                    rules={[
                      {
                        required: true,
                        message: "Please select ward room",
                      },
                    ]}
                  >
                    <Select
                      size="large"
                      options={filteredRooms?.map((room) => ({
                        value: room.Room_No,
                        label: room.Room_Name,
                      }))}
                      showSearch
                      loading={loadingRooms}
                      onChange={handleRoomChange}
                      placeholder="Search to Select ward"
                      optionFilterProp="label"
                      filterSort={(optionA, optionB) =>
                        (optionA?.label ?? "")
                          .toLowerCase()
                          .localeCompare((optionB?.label ?? "").toLowerCase())
                      }
                    />
                  </Form.Item>
                </Col>
                <Col md={12} sm={24}>
                  <Form.Item
                    label="Select Bed"
                    name="bed"
                    rules={[
                      {
                        required: true,
                        message: "Please select bed",
                      },
                    ]}
                  >
                    <Select
                      size="large"
                      options={filteredBeds?.map((room) => ({
                        value: room.BedNo,
                        label: room.BedName,
                      }))}
                      showSearch
                      loading={loadingBeds}
                      onChange={handleBedChange}
                      placeholder="Search to Select bed"
                      optionFilterProp="label"
                      filterSort={(optionA, optionB) =>
                        (optionA?.label ?? "")
                          .toLowerCase()
                          .localeCompare((optionB?.label ?? "").toLowerCase())
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                style={{ width: "50%", marginTop: "15px" }}
                icon={<DisconnectOutlined />}
              >
                Admit Patient
              </Button>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DirectAdmission;
