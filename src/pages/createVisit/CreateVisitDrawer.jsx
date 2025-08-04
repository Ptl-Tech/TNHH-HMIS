import {
  Drawer,
  Form,
  Input,
  Select,
  Switch,
  Button,
  Spin,
  Typography,
  Row,
  Col,
} from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  listClinics,
  listDoctors,
  listInsuranceOptions,
} from "../../actions/DropdownListActions";
import { useLocation } from "react-router-dom";
import {
  CREATE_PATIENT_VISIT_FAIL,
  CREATE_PATIENT_VISIT_SUCCESS,
  createPatientVisitRequest,
} from "../../actions/reception-actions/patient-visit-actions/createPatientVisit";
import { showNotification } from "../../components/Notification";
import useFetchPatientVisitDetailsHook from "../../hooks/useFetchPatientVisitDetailsHook";
import useFetchPatientDetailsHook from "../../hooks/useFetchPatientDetailsHook";
import PatientHeader from "../reception-views/PatientHeader";
import { DispatchAreasConstants } from "./constants/DispatchAreasConstants";
import {
  DispatchToLab,
  DispatchToPharmacy,
  DispatchToTriage,
} from "./helper/DispatchActions";
import { useAuth } from "../../hooks/auth";

const CreateVisitDrawer = ({
  visible,
  onClose,
  // visitData: initialVisitData,
  // onUpdateVisit,
}) => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const location = useLocation();

  const branchCode = user?.branchCode;
  const patientNo = new URLSearchParams(location.search).get("PatientNo");

  const [dispatchVisit, setDispatchVisit] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(0);
  const [dispatchArea, setDispatchArea] = useState(0);

  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [visitData, setVisitData] = useState(null);
  const { clinics } = useSelector((state) => state.clinics);
  const { data: doctors } = useSelector((state) => state.getDoctorsList);
  const { loading: insuranceLoading, data: insurancePayload } = useSelector(
    (state) => state.getInsurance
  );
  const {
    error: visitError,
    data: visitPayload,
    loading: visitLoading,
    success: visitSuccess,
  } = useSelector((state) => state.createVisit);
  const { loadingPatientDetails, patientDetails, refetchDetails } =
    useFetchPatientDetailsHook(patientNo);

  const [activeVisitNo, setActiveVisitNo] = useState(null);
  useEffect(() => {
    if (
      patientDetails &&
      patientDetails.Activated &&
      patientDetails.ActiveVisitNo
    ) {
      setActiveVisitNo(patientDetails.ActiveVisitNo);
      setVisitData(null);
    } else if (patientDetails && !patientDetails.Activated) {
      setActiveVisitNo(null);
      form.resetFields();
      setVisitData(null);
    }
  }, [patientDetails, form]);

  const {
    loading,
    error,
    patientVisitDetails: initialVisitData,
  } = useFetchPatientVisitDetailsHook(activeVisitNo);

  useEffect(() => {
    if (patientDetails && patientDetails.ActiveVisitNo) {
      if (initialVisitData) {
        setVisitData(initialVisitData);
        setPaymentMethod(patientDetails?.PatientType == "Corporate" ? 1 : 2);

        form.setFieldsValue({
          clinic: initialVisitData?.SpecialClinics,
          doctor: initialVisitData?.DoctorsName,
          paymentMode: patientDetails?.PatientType,
          insuranceNo: patientDetails?.InsuranceNo,
          insuranceName: patientDetails?.InsuranceName,
          insurancePrinicipalMemberName:
            patientDetails?.PrincipalMemberName ||
            patientDetails.DepandantPrincipleMember,
          isPrincipleMember: patientDetails?.Principal,
          membershipNo: patientDetails?.MembershipNo,
          schemeName: patientDetails?.SchemeName,
        });
      } else {
        setVisitData(null);
        form.resetFields();
      }
    } else {
      setVisitData(null);
    }
  }, [initialVisitData, form, patientDetails]);
  useEffect(() => {
    if (patientDetails?.PatientType === "Corporate") {
      setPaymentMethod(1);
    } else if (patientDetails?.PatientType === "Cash") {
      setPaymentMethod(2);
    }
  }, [patientDetails]);
  useEffect(() => {
    if (paymentMethod === 1 && patientDetails) {
      form.setFieldsValue({
        insuranceName: patientDetails?.InsuranceNo,
        insuranceNo: patientDetails?.InsuranceNo,
        paymentMode: paymentMethod,
        insurancePrinicipalMemberName:
          patientDetails.PrincipalMemberName ||
          patientDetails.DepandantPrincipleMember,
        isPrincipleMember: patientDetails.Principal,
        membershipNo: patientDetails.MembershipNo,
        schemeName: patientDetails.SchemeName,
      });
    } else {
      form.setFieldsValue({
        paymentMode: paymentMethod,
        insuranceNo: "",
        insuranceName: "",
        insurancePrinicipalMemberName: "",
        isPrincipleMember: false,
        membershipNo: "",
        schemeName: "",
      });
    }
  }, [patientDetails, paymentMethod, form]);

  useEffect(() => {
    dispatch(listClinics());
    dispatch(listDoctors());
  }, [dispatch]);

  useEffect(() => {
    if (paymentMethod === 1) {
      dispatch(listInsuranceOptions());
    }
  }, [paymentMethod, dispatch]);

  useEffect(() => {
    if (dispatchVisit && visitError) {
      showNotification("error", "Error", visitError);
    }
    if (dispatchVisit && visitSuccess) {
      showNotification("success", "Success", "Visit created successfully");
    }
  }, [visitError, dispatchVisit, visitSuccess]);
  useEffect(() => {
    if (dispatchArea !== 1) {
      form.setFieldsValue({ doctor: undefined });
    }
  }, [dispatchArea]);
  useEffect(() => {
    if (paymentMethod === 1 && patientDetails) {
      form.setFieldsValue({
        insuranceName: patientDetails?.InsuranceNo,
        insuranceNo: patientDetails?.InsuranceNo,
      });
    }
  }, [paymentMethod, patientDetails, form]);

  const handleClinicChange = (value) => {
    form.setFieldsValue({ clinic: value.toUpperCase() });

    if (!doctors || doctors.length === 0) return;

    const filtered = doctors.filter(
      (doc) => doc.Specialization?.toUpperCase() === value.toUpperCase()
    );
    setFilteredDoctors(filtered);
  };
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const payload = {
        myAction: patientDetails.Activated ? "edit" : "create",
        patientNo,
        dispatchArea: values.dispatchArea,
        clinic: values.clinic,
        doctor: values.doctor,
        paymentMode: values.paymentMode,
        insuranceNo: values.insuranceNo || "",
        insuranceName: values.insuranceName || "",
        insurancePrinicipalMemberName:
          values.insurancePrinicipalMemberName || "",
        isPrincipleMember: values.isPrincipleMember || false,
        membershipNo: values.membershipNo || "",
        schemeName: values.schemeName || "",
      };

      const response = await dispatch(createPatientVisitRequest(payload));
      if (response.type === CREATE_PATIENT_VISIT_SUCCESS) {
        showNotification("success", "Success", "Visit created successfully");
        refetchDetails();
        //  setDispatchVisit(true);
        //  onClose();
      } else if (response.type === CREATE_PATIENT_VISIT_FAIL) {
        showNotification(
          "error",
          "Error",
          response.payload.message || "An error occurred while creating visit"
        );
      }
    } catch (error) {
      showNotification("error", "Error", error.message);
    }
  };

  return (
    <Drawer
      title={
        <>
          <div className="d-flex justify-content-between">
            <div className="d-flex flex-column ">
              <span style={{ color: "#0f5689", fontSize: "20px" }}>
                Patient Visit Card -{" "}
                {patientDetails?.SearchName?.toUpperCase() || "Patient"}
              </span>
              <span
                style={{
                  color: "#0f5689",
                  fontSize: "9px",
                  fontStyle: "italic",
                }}
              >
                Branch: {patientDetails?.GlobalDimension1Code || "N/A"}
              </span>
            </div>
            <div className="d-flex justify-content-end mb-3">
              {dispatchArea === 1 ? (
                <DispatchToTriage
                  activeVisitNo={patientDetails?.ActiveVisitNo}
                />
              ) : dispatchArea === 3 ? (
                <DispatchToPharmacy patientNo={patientNo} />
              ) : dispatchArea === 4 ? (
                <DispatchToLab patientNo={patientNo} />
              ) : dispatchArea === 5 ? (
                <Button type="primary">Dispatch to Radiology</Button>
              ) : (
                <DispatchToTriage
                  activeVisitNo={patientDetails?.ActiveVisitNo}
                />
              )}
            </div>
          </div>
          <PatientHeader
            activeVisitNo={activeVisitNo}
            // initialVisitData={visitData}
            patientNo={patientNo}
          />
        </>
      }
      placement="right"
      width={1000}
      onClose={onClose}
      open={visible}
      maskClosable={false}
      footer={null}
      closable={{ "aria-label": "Close Button" }}
    >
      <Spin size="large" tip="Creating Visit..." spinning={visitLoading}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={visitData}
          autoComplete="off"
          className="  mx-auto mb-3"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="dispatchArea"
                label="Dispatch Area"
                rules={[
                  { required: true, message: "Please select a dispatch area!" },
                ]}
              >
                <Select
                  placeholder="Select Dispatch Area"
                  onChange={(value) => setDispatchArea(value)}
                  showSearch
                  allowClear
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {DispatchAreasConstants?.map((item) => (
                    <Select.Option key={item.value} value={item.value}>
                      {item.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="clinic"
                label="Clinic"
                rules={[{ required: true }]}
              >
                <Select onChange={handleClinicChange}>
                  {clinics?.map((item) => (
                    <Select.Option key={item.No} value={item.No}>
                      {item.Description.charAt(0).toUpperCase() +
                        item.Description.slice(1).toLowerCase()}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          {dispatchArea === 1 && (
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="doctor"
                  label="Doctor"
                  rules={[{ required: true }]}
                >
                  <Select
                    onChange={(value) => form.setFieldsValue({ doctor: value })}
                    showSearch
                    allowClear
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                  >
                    {filteredDoctors?.map((doc) => (
                      <Select.Option key={doc.DoctorID} value={doc.DoctorID}>
                        {doc.DoctorsName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          )}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="paymentMode"
                label="Payment Method"
                rules={[{ required: true }]}
              >
                <Select
                  value={patientDetails?.PatientType}
                  onChange={(value) => setPaymentMethod(value)}
                >
                  <Select.Option value={2}>CASH</Select.Option>
                  <Select.Option value={1}>INSURANCE</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              {paymentMethod === 1 && (
                <Form.Item name="insuranceName" label="Insurance Name">
                  <Select
                    loading={insuranceLoading}
                    showSearch
                    allowClear
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    value={patientDetails?.InsuranceNo}
                    onChange={(value, option) => {
                      form.setFieldsValue({
                        insuranceNo: value,
                        insuranceName: option.children,
                      });
                    }}
                  >
                    {insurancePayload?.map((item) => (
                      <Select.Option key={item.No} value={item.No}>
                        {item.Name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              )}
            </Col>
          </Row>
          {paymentMethod === 1 && (
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="insuranceNo"
                  label="Insurance No"
                  style={{ display: "none" }}
                >
                  <Input disabled />
                </Form.Item>
              </Col>
            </Row>
          )}

          {paymentMethod === 1 && (
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="schemeName"
                  label="Scheme Name"
                  rules={
                    paymentMethod === 1
                      ? [
                          {
                            required: true,
                            message: "Please enter Scheme name!",
                          },
                        ]
                      : [{ required: false }]
                  }
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="membershipNo"
                  label="Membership No"
                  rules={
                    paymentMethod === 1
                      ? [
                          {
                            required: true,
                            message: "Please enter Membership No!",
                          },
                        ]
                      : [{ required: false }]
                  }
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          )}
          {paymentMethod === 1 && (
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="insurancePrinicipalMemberName"
                  label="Principal Member Name"
                  rules={
                    paymentMethod === 1
                      ? [{ required: true, message: "Please enter name!" }]
                      : [{ required: false }]
                  }
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Is Patient Principal Member"
                  name="isPrincipleMember"
                  valuePropName="checked"
                >
                  <Switch checkedChildren="Yes" unCheckedChildren="No" />
                </Form.Item>
              </Col>
            </Row>
          )}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "26px",
              marginTop: "26px",
              alignItems: "center",
            }}
          >
            <Button onClick={onClose} size="medium" block danger>
              Close Visit Card
            </Button>
            <Button
              onClick={handleSubmit}
              type="primary"
              size="medium"
              block
              disabled={visitLoading}
              loading={visitLoading}
            >
              Save Visit
            </Button>
          </div>
        </Form>
      </Spin>
    </Drawer>
  );
};

export default CreateVisitDrawer;
