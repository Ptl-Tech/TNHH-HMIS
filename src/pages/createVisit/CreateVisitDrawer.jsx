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
import { createPatientVisitRequest } from "../../actions/reception-actions/patient-visit-actions/createPatientVisit";
import { showNotification } from "../../components/Notification";
import useFetchPatientVisitDetailsHook from "../../hooks/useFetchPatientVisitDetailsHook";
import useFetchPatientDetailsHook from "../../hooks/useFetchPatientDetailsHook";

const CreateVisitDrawer = ({
  visible,
  onClose,
  // visitData: initialVisitData,
  // onUpdateVisit,
}) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const branchCode = localStorage.getItem("branchCode");
  const location = useLocation();
  const patientNo = new URLSearchParams(location.search).get("PatientNo");

  const[dispatchVisit, setDispatchVisit] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(0);
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
    } else if(patientDetails?.PatientType === "Cash") {
      setPaymentMethod(2);
    }
  }, [patientDetails]);
  useEffect(() => {
    if (patientDetails?.PatientType === "Corporate" && initialVisitData) {
      form.setFieldsValue({
        paymentMode: paymentMethod,
        insuranceNo: patientDetails.InsuranceNo,
        insuranceName: patientDetails.InsuranceName,
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
  }, [patientDetails, initialVisitData, form]);

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

  const handleClinicChange = (value) => {
    form.setFieldsValue({ clinic: value.toUpperCase() });

    if (!doctors || doctors.length === 0) return;

    const filtered = doctors.filter(
      (doc) =>
        doc.Specialization?.toUpperCase() === value.toUpperCase() &&
        (value === "PSYCHOLOGIST" || doc.GlobalDimension1Code === branchCode)
    );
    setFilteredDoctors(filtered);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const payload = {
        patientNo,
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

      await dispatch(createPatientVisitRequest(payload));
      setDispatchVisit(true);
      refetchDetails(); 
      onClose(); 
    } catch (error) {
      console.log("Validation Failed or Dispatch Error:", error);
    }
  };

  return (
    <Drawer
      title={
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Row>
            <Typography.Title level={5} style={{ marginBottom: "8px" }}>
              Create Visit
            </Typography.Title>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Typography.Text strong>Visit No: </Typography.Text>
              <Typography.Text style={{ fontWeight: "bold", color: "blue" }}>
                {visitData?.AppointmentNo || ""}
              </Typography.Text>
            </Col>
            <Col span={12}>
              <Typography.Text strong>Visit Type: </Typography.Text>
              <Typography.Text>{visitData?.VisitType || ""}</Typography.Text>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Typography.Text strong>Clinic: </Typography.Text>
              <Typography.Text>
                {visitData?.SpecialClinics || ""}
              </Typography.Text>
            </Col>
            <Col span={12}>
              <Typography.Text strong>Status: </Typography.Text>
              <Typography.Text style={{ fontWeight: "bold", color: "green" }}>
                {visitData?.Status || ""}
              </Typography.Text>
            </Col>
          </Row>
        </div>
      }
      placement="right"
      width={500}
      onClose={onClose}
      open={visible}
      maskClosable={false}
      footer={null}
    >
      <Spin size="large" tip="Creating Visit..." spinning={visitLoading}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={visitData}
        >
          <Form.Item name="clinic" label="Clinic" rules={[{ required: true }]}>
            <Select onChange={handleClinicChange}>
              {clinics?.map((item) => (
                <Select.Option key={item.No} value={item.No}>
                  {item.Description.charAt(0).toUpperCase() +
                    item.Description.slice(1).toLowerCase()}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="doctor" label="Doctor" rules={[{ required: true }]}>
            <Select onChange={(value) => form.setFieldsValue({ doctor: value })} showSearch allowClear filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }> 
              {filteredDoctors?.map((doc) => (
                <Select.Option key={doc.DoctorID} value={doc.DoctorID}>
                  {doc.DoctorsName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="paymentMode"
            label="Payment Method"
            rules={[{ required: true }]}
          >
            <Select onChange={setPaymentMethod}>
              <Select.Option value={2}>Cash</Select.Option>
              <Select.Option value={1}>Insurance</Select.Option>
            </Select>
          </Form.Item>
          {paymentMethod === 1 && (
            <>
              <Form.Item name="insuranceName" label="Insurance Name">
                <Select
                  disabled={insuranceLoading}
                  placeholder="Select Insurance"
                  showSearch
                  loading={insuranceLoading ? <Spin size="small" /> : null}
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                  notFoundContent={
                    insuranceLoading ? <Spin size="small" /> : null
                  }
                  allowClear
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
              <Form.Item
                name="insuranceNo"
                label="Insurance No"
                style={{ display: "none" }}
              >
                <Input disabled />
              </Form.Item>
              <Form.Item
                name="insurancePrinicipalMemberName"
                label="Principal Member Name"
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Is Patient Principal Member"
                name="isPrincipleMember"
                valuePropName="checked"
              >
                <Switch checkedChildren="Yes" unCheckedChildren="No" />
              </Form.Item>
              <Form.Item name="membershipNo" label="Membership No">
                <Input />
              </Form.Item>
              <Form.Item name="schemeName" label="Scheme Name">
                <Input />
              </Form.Item>
            </>
          )}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "26px",
            }}
          >
            <Button onClick={onClose} size="large" block>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              type="primary"
              size="large"
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
