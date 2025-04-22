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

const CreateVisitDrawer = ({
  visible,
  onClose,
  visitData: initialVisitData,
  onUpdateVisit,
}) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const branchCode = localStorage.getItem("branchCode");
  const location = useLocation();
  const patientNo = new URLSearchParams(location.search).get("PatientNo");


  const [paymentMethod, setPaymentMethod] = useState(0);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [visitData, setVisitData] = useState(initialVisitData || null);
  const { clinics } = useSelector((state) => state.clinics);
  const { data: doctors } = useSelector((state) => state.getDoctorsList);
  const { loading: insuranceLoading, data: insurancePayload } = useSelector(
    (state) => state.getInsurance
  );
  const {
    loading: visitLoading,
    error: visitError,
    success: visitSuccess,
    data: visitPayload,
  } = useSelector((state) => state.createVisit);
  const { loadingPatientVisitDetails, patientVisitDetails } =
    useFetchPatientVisitDetailsHook(visitPayload?.AppointmentNo || "");
  useEffect(() => {
    if (!patientNo) {
     setVisitData(null);
    } else {
      setVisitData(initialVisitData);
    }
  }, [initialVisitData, setVisitData]);

  useEffect(() => {
    if (initialVisitData) {
      setVisitData((prev) => ({
        ...prev,
        ...initialVisitData,
      }));

      form.setFieldsValue({
        clinic: initialVisitData.SpecialClinics,
        doctor: initialVisitData.DoctorsName,
        paymentMethod: initialVisitData.SettlementType === "Cash" ? 2 : 1,
        insuranceNo: initialVisitData.InsuranceNo || "",
        membershipNo: initialVisitData.InsuranceMemberNo || "",
        schemeName: initialVisitData.SchemeName || "",
        insuranceName: initialVisitData.InsuranceName || "",
        insurancePrinicpalMemberName:
          initialVisitData.PrinicipalMemberName || "",
      });

      setPaymentMethod(initialVisitData.SettlementType === "Cash" ? 2 : 1); // Ensure payment method is updated

      // Ensure title details are correctly set
      setVisitData((prev) => ({
        ...prev,
        appointmentNo: initialVisitData.AppointmentNo || "",
        visitType: initialVisitData.VisitType || "",
        specialClinics: initialVisitData.SpecialClinics || "",
        status: initialVisitData.Status || "",
      }));
    }
  }, [initialVisitData, form, setVisitData, setPaymentMethod]);

  useEffect(() => {
    dispatch(listClinics());
    dispatch(listDoctors());
  }, [dispatch]);

  useEffect(() => {
    if (paymentMethod === 1) {
      dispatch(listInsuranceOptions());
    }
  }, [paymentMethod, dispatch]);

//   const handleClose = () => {
//     form.resetFields();
//     onClose();
//     setVisitData(null);
//     setPaymentMethod(0);
//     setFilteredDoctors([]);
//   };

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

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
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

        dispatch(createPatientVisitRequest(payload));
        if (visitSuccess) {
            showNotification(
              "success",
              "Visit Created",
              `Visit ID: ${visitPayload.appointmentNo}`
            );
            console.log(visitPayload.AppointmentNo);
            setVisitData((prev) => ({
              ...prev,
              ...visitPayload,
            }));
      
            form.setFieldsValue({
              clinic: visitPayload.SpecialClinics || "",
              doctor: visitPayload.DoctorsName || "",
              paymentMethod: visitPayload.PatientType === "Cash" ? 2 : 1,
              insuranceNo: visitPayload.InsuranceNo || "",
              membershipNo: visitPayload.InsuranceMemberNo || "",
              appointmentNo: visitPayload.appointmentNo || "",
              VisitType: visitPayload.appointment?.visitType || "",
              SpecialClinics: visitPayload.appointment?.specialClinics || "",
              Status: visitPayload.appointment?.status || "",
            });
      console.log(visitPayload);
            onUpdateVisit(visitPayload.appointmentNo);
      useFetchPatientVisitDetailsHook(visitPayload.AppointmentNo || "");
            onClose();
            
          }
      
          if (visitError) {
            showNotification("error", "Visit Creation Failed", visitError);
            setVisitData(null);
          }
      
          console.log(visitSuccess, visitError, visitPayload);
      })
      .catch((errorInfo) => {
        console.log("Validation Failed:", errorInfo);
      });
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
                {visitData?.appointment?.appointmentNo ||
                  visitData?.appointmentNo ||
                  ""}
              </Typography.Text>
            </Col>
            <Col span={12}>
              <Typography.Text strong>Visit Type: </Typography.Text>
              <Typography.Text>
                {visitData?.appointment?.visitType ||
                  visitData?.VisitType ||
                  ""}
              </Typography.Text>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Typography.Text strong>Clinic: </Typography.Text>
              <Typography.Text>
                {visitData?.appointment?.specialClinics ||
                  visitData?.SpecialClinics ||
                  ""}
              </Typography.Text>
            </Col>
            <Col span={12}>
              <Typography.Text strong>Status: </Typography.Text>
              <Typography.Text style={{ fontWeight: "bold", color: "green" }}>
                {visitData?.appointment?.status || visitData?.Status || ""}
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
          <Select>
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
 <div style={{ display: "flex", justifyContent: "space-between", marginBottom:"26px" }}>
          <Button onClick={onClose}  size="large" block>
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
    </Drawer>
  );
};

export default CreateVisitDrawer;