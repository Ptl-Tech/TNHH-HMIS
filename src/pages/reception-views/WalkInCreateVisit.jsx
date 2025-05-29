import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import {
  Form,
  Divider,
  Input,
  Select,
  Radio,
  Checkbox,
  Button,
  message,
} from "antd";

import {
  listClinics,
  //   listDoctors,
  listInsuranceOptions,
} from "../../actions/DropdownListActions";
import LoadingSkeleton from "../../components/LoadingSkeleton";
import { createTriageVisit } from "../../actions/patientActions";
import { TRIAGE_VISIT_RESET } from "../../constants/patientConstants";
import { getSinglePatient } from "../../actions/reception-actions/getSinglePatient";

export default function WalkInCreateVisit() {
  const { Group: RadioGroup } = Radio;
  const { useForm, useWatch, Item } = Form;

  const [form] = useForm();
  const paymentMode = useWatch("paymentMode", form);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { search: searchParams } = useLocation();

  const newSearchParams = new URLSearchParams(searchParams);
  const patientNo = newSearchParams.get("PatientNo");

  const { clinics } = useSelector((state) => state.clinics);
  //   const { data: doctors } = useSelector((state) => state.getDoctorsList);
  const { data: insurances } = useSelector((state) => state.getInsurance);
  const { data: patient } = useSelector((state) => state.getSinglePatient);
  const {
    error: visitError,
    data: createVisitData,
    loading: visitLoading,
    success: visitSuccess,
  } = useSelector((state) => state.createVisit);

  useEffect(() => {
    if (patientNo) {
      dispatch(getSinglePatient("PatientNo", patientNo)); // gets the patient

      dispatch(listClinics()); //gets the clinics
      //   dispatch(listDoctors()); //gets the doctors
      dispatch(listInsuranceOptions()); //gets the insurance options
    }
  }, [patientNo]);

  //Runs to check if the visit was created successfully and redirects to the dispatch area
  useEffect(() => {
    if (visitLoading) message.info("Creating a visit and creating a request.");

    if (visitSuccess) {
      const { appointmentNo } = createVisitData || {};

      message.success("Visit created successfully, await redirection.");
      navigate(`/Reception/Walkin-Patient-List/${appointmentNo}`);
    }

    if (visitSuccess || visitError) {
      dispatch({ type: TRIAGE_VISIT_RESET });
    }
  }, [visitSuccess, visitError, visitLoading]);

  const onFinish = (values) => {
    const {
      clinic,
      patientNo,
      schemeName,
      paymentMode,
      doctor = "",
      insurance = "",
      membershipNo = "",
      isPrincipleMember,
      insurancePrincipalMemberName,
    } = values;

    const [insuranceNo = "", insuranceName = ""] = insurance.split("_");

    const visitData = {
      patientNo,
      clinic,
      doctor,
      paymentMode,
      insuranceNo,
      insuranceName,
      insurancePrincipalMemberName,
      isPrincipleMember,
      membershipNo,
      schemeName,
    };

    dispatch(createPatientVisitRequest(visitData));
  };

  const initialValues = {
    patientNo,
    schemeName: '',
    paymentMode: 0,
    membershipNo: '',
    clinic: undefined,
    doctor: undefined,
    insuranceNo: undefined,
    isPrincipleMember: false,
    insurancePrincipalMemberName: patient?.SearchName,
    schemeName: '',
  };

  return (
    <div
      className="d-grid align-content-start p-2"
      style={{ color: "#0f5689", maxWidth: "768px" }}
    >
      <div className="d-grid">
        <h4>Create Visit</h4>
        <p style={{ color: "#6d6d6d", margin: 0, fontSize: 15 }}>
          Create a visit to dispatch a patient
        </p>
      </div>
      <Divider />
      <LoadingSkeleton rows={10} loading={Boolean(!patient)}>
        <Form
          form={form}
          layout="vetical"
          className="py-2"
          onFinish={onFinish}
          autoComplete="off"
          initialValues={initialValues}
        >
          <div>
            <div
              className="d-flex gap-2 align-items-center"
              style={{ color: "#0f5689" }}
            >
              <h5
                className="d-flex align-items-center justify-content-center"
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  border: "1px solid #0f5689",
                }}
              >
                1
              </h5>
              <h5>Patient Details</h5>
            </div>
            <Item name="patientNo" className="m-0">
              <div className="d-flex gap-4">
                <p style={{ color: "#6d6d6d", margin: 0 }}>
                  <strong>Patient Number:</strong>{" "}
                  <span style={{ color: "#333" }}>{patientNo}</span>
                </p>
                <p style={{ color: "#6d6d6d", margin: 0 }}>
                  <strong>Patient Name:</strong>{" "}
                  <span style={{ color: "#333" }}>{patient?.SearchName}</span>
                </p>
                <Input type="hidden" style={{ margin: 0 }} />
              </div>
            </Item>
          </div>
          <div>
            <Divider variant={"dashed"} />
            <div className="d-grid gap-2">
              <div
                className="d-flex gap-2 align-items-center"
                style={{ color: "#0f5689" }}
              >
                <h5
                  className="d-flex align-items-center justify-content-center"
                  style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    border: "1px solid #0f5689",
                  }}
                >
                  2
                </h5>
                <h5>Choose Clinic</h5>
              </div>
              <div className="d-flex gap-4">
                <Item
                  required
                  rules={[
                    { required: true, message: "The clinic value is required" },
                  ]}
                  name="clinic"
                  className="m-0"
                  layout="vertical"
                  label={
                    <span style={{ color: "#6d6d6d", fontWeight: "bolder" }}>
                      Select Clinic
                    </span>
                  }
                >
                  <Select
                    showSearch
                    style={{ width: "200px" }}
                    placeholder="Clinic"
                    options={clinics.map((clinic) => ({
                      value: clinic.No,
                      label: clinic.Description,
                      disabled:
                        clinic.No === "PSYCHIATRIST" ||
                        clinic.No === "PSYCHOLOGIST",
                    }))}
                  />
                </Item>
                {/* <Item
                  name="doctor"
                  className="m-0"
                  layout="vertical"
                  label={
                    <span style={{ color: '#6d6d6d', fontWeight: 'bolder' }}>
                      Select Doctor
                    </span>
                  }
                >
                  <Select
                    showSearch
                    style={{ width: '300px' }}
                    placeholder="Doctor"
                    options={doctors.map((doctor) => ({
                      value: doctor.DoctorID,
                      label: doctor.DoctorsName,
                    }))}
                  />
                </Item> */}
              </div>
            </div>
          </div>
          <div>
            <Divider variant={"dashed"} />
            <div className="d-grid gap-2">
              <div
                className="d-flex gap-2 align-items-center"
                style={{ color: "#0f5689" }}
              >
                <h5
                  className="d-flex align-items-center justify-content-center"
                  style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    border: "1px solid #0f5689",
                  }}
                >
                  3
                </h5>
                <h5>Payment Method</h5>
              </div>
              <div className="d-grid gap-4">
                <Item className="m-0" layout="vertical" name="paymentMode">
                  <RadioGroup
                    options={[
                      { value: 0, label: "Cash" },
                      { value: 1, label: "Insurance" },
                    ]}
                  />
                </Item>
                <div
                  className="d-grid gap-2"
                  style={{
                    opacity: paymentMode ? 1 : 0, // Use 0 to 1 range
                    transform: `scaleY(${paymentMode})`, // Animate only the Y scale
                    transformOrigin: "center",
                    transition: "opacity 0.5s ease-in-out",
                    height: paymentMode ? "auto" : 0,
                    overflow: "hidden",
                  }}
                >
                  <div className="d-flex gap-4">
                    <Item
                      required
                      name="insurance"
                      className="m-0"
                      layout="vertical"
                      rules={[
                        {
                          required: Boolean(paymentMode),
                          message: "The insurance is required",
                        },
                      ]}
                      label={
                        <span
                          style={{ color: "#6d6d6d", fontWeight: "bolder" }}
                        >
                          Select Insurance
                        </span>
                      }
                    >
                      <Select
                        showSearch
                        style={{ width: "300px" }}
                        placeholder="Insurance"
                        options={insurances.map((insurance) => ({
                          value: `${insurance.No}_${insurance.Name}`,
                          label: insurance.Name,
                        }))}
                      />
                    </Item>
                    <Item
                      required
                      name="schemeName"
                      className="m-0"
                      layout="vertical"
                      rules={[
                        {
                          required: Boolean(paymentMode),
                          message: "The scheme name is required",
                        },
                      ]}
                      label={
                        <span
                          style={{ color: "#6d6d6d", fontWeight: "bolder" }}
                        >
                          Select Scheme Name
                        </span>
                      }
                    >
                      <Input style={{ width: "300px" }} placeholder="Scheme" />
                    </Item>
                  </div>
                  <div className="d-flex gap-4">
                    <Item
                      required
                      className="m-0"
                      name="membershipNo"
                      layout="vertical"
                      rules={[
                        {
                          required: Boolean(paymentMode),
                          message: "The membership number is required",
                        },
                      ]}
                      label={
                        <span
                          style={{ color: "#6d6d6d", fontWeight: "bolder" }}
                        >
                          Membership Number
                        </span>
                      }
                    >
                      <Input
                        style={{ width: "300px" }}
                        placeholder="1234 5678 9101 1121"
                      />
                    </Item>
                    <Item
                      required
                      name="insurancePrincipalMemberName"
                      className="m-0"
                      layout="vertical"
                      rules={[
                        {
                          required: Boolean(paymentMode),
                          message: "The principal name is required",
                        },
                      ]}
                      label={
                        <span
                          style={{ color: "#6d6d6d", fontWeight: "bolder" }}
                        >
                          Principal Name
                        </span>
                      }
                    >
                      <Input style={{ width: "300px" }} placeholder="Scheme" />
                    </Item>
                  </div>

                  <Item
                    className="m-0"
                    name="isPrincipleMember"
                    valuePropName="checked"
                  >
                    <Checkbox
                      children={
                        <span
                          style={{ color: "#6d6d6d", fontWeight: "bolder" }}
                        >
                          Principal Member?
                        </span>
                      }
                    />
                  </Item>
                </div>
              </div>
            </div>
          </div>
          <div>
            <Divider variant="dashed" />
            <Button type="primary" htmlType="submit">
              Create Visit
            </Button>
          </div>
        </Form>
      </LoadingSkeleton>
    </div>
  );
}
