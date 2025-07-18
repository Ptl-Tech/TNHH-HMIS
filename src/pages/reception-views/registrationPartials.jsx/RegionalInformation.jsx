import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Col,
  Form,
  Row,
  Skeleton,
  Typography,
  Select,
  Input,
  Button,
  Alert,
} from "antd";
import {
  listCounties,
  listCountries,
  listSubCounties,
  listSubCountyWards,
} from "../../../actions/DropdownListActions";
import { saveAddressInformation } from "../../../actions/reception-actions/save-patient-actions/saveAddressInformation";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { getPatientByNo } from "../../../actions/patientActions";
const { Option } = Select;

const RegionalInformation = ({ patientDetails, onUpdate }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading: loadingPatientDetails, patients: data } =
    useSelector((state) => state.patientList) || {};

  // State to hold the selected country, county, and subcounty
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCounty, setSelectedCounty] = useState("");
  const [selectedSubCounty, setSelectedSubCounty] = useState("");
  const [selectedWard, setSelectedWard] = useState("");

  const [filteredSubCounties, setFilteredSubCounties] = useState([]);
  const [filteredWards, setFilteredWards] = useState([]);
  const [formSubmitted, setFormSubmitted] = useState(false);
const[dispatchingInfo,setDispatchingInfo]=useState(false)

  const { loading, success, error } = useSelector(
    (state) => state.saveAddressInfo
  );

  const { loading: loadingCountries, countries } = useSelector(
    (state) => state.countriesList
  );
  const { loading: loadingCounties, counties } = useSelector(
    (state) => state.countiesList
  );
  const { loading: subCountiesLoading, subCounties: subCountiesPayload } =
    useSelector((state) => state.subCounties);
  const {
    loading: subCountyWardsLoading,
    subCountyWards: subCountyWardsPayload,
  } = useSelector((state) => state.subCountyWards);

  useEffect(() => {
    dispatch(listCountries());
    dispatch(listCounties());
    dispatch(listSubCountyWards());
    dispatch(listSubCounties());
  }, [dispatch]);

  useEffect(() => {
    if (patientDetails) {
      form.resetFields();
console.log("daotient", patientDetails);
      const genderValue =
        patientDetails?.Gender === "Female"
          ? 2
          : patientDetails?.Gender === "Male"
          ? 1
          : 0;
      const initialCountry =
        patientDetails?.Nationality === "Kenya"
          ? "KE"
          : patientDetails.Nationality;
      setSelectedCountry(initialCountry);
      form.setFieldsValue({
        firstName: patientDetails?.Surname?.split(" ")[0] || "",
        middleName: patientDetails?.MiddleName || "",
        lastName: patientDetails?.LastName || "",
        gender: genderValue,
        dob: patientDetails?.DateOfBirth,
        idNumber: patientDetails?.IDNumber || "",
        phoneNumber: patientDetails?.TelephoneNo1 || "",
        nationality: patientDetails?.Nationality || "",
        county: patientDetails?.PlaceofBirthDistrict || "",
        nextOfKinRelationship: patientDetails?.NextofkinRelationship || "",
        nextOfKinFullName: patientDetails?.NextOfkinFullName || "",
        nextOfKinPhoneNo: patientDetails?.NextOfkinAddress1 || "",
        paymentMode: patientDetails?.PatientType || 0,
        insuranceNo: patientDetails?.InsuranceNo || "",
        insuranceName: patientDetails?.InsuranceName || "",
        insurancePrinicipalMemberName:
          patientDetails?.PrincipalMemberName || "",
        isPrincipleMember: patientDetails?.isPrincipleMember || false,
        membershipNo: patientDetails?.MembershipNo || "",
        schemeName: patientDetails?.SchemeName || "",
        howYouKnewABoutUs: patientDetails?.HowyouKnewAboutUs || "",
        subcounty: patientDetails?.SubCountyName || "",
        email: patientDetails?.Email || "",
        residence: patientDetails?.PlaceofBirthVillage || "",
        countyWard: patientDetails?.CountyWardName || "",
        patientStatus: patientDetails?.patientStatus || 0,
                dependant: patientDetails?.Dependant || 0,

      });
    }
  }, [patientDetails, form]);

  useEffect(() => {
    if (subCountiesPayload) {
      setFilteredSubCounties(subCountiesPayload);
    }
  }, [subCountiesPayload]);

  useEffect(() => {
    if (subCountyWardsPayload) {
      setFilteredWards(subCountyWardsPayload);
    }
  }, [subCountyWardsPayload]);

  const handleNationalityChange = (value) => {
    setSelectedCountry(value);
    setSelectedCounty(null);
    setSelectedSubCounty(null);
    setSelectedWard(null);
  };

  const handleCountyChange = (value) => {
    setSelectedCounty(value);
    setSelectedSubCounty(null);
    setSelectedWard(null);
    filterSubCounties(value);
  };

  const handleSubCountyChange = (value) => {
    setSelectedSubCounty(value);
    setSelectedWard(null);
    filterSubCountyWards(value);
  };

  const filterSubCounties = (countyCode) => {
    if (!countyCode) {
      setFilteredSubCounties(subCountiesPayload);
      return;
    }
    const filtered = subCountiesPayload.filter(
      (subCounty) => subCounty.CountyCode === countyCode
    );
    setFilteredSubCounties(filtered);
  };

  const filterSubCountyWards = (subCountyCode) => {
    if (!subCountyCode) {
      setFilteredWards(subCountyWardsPayload);
      return;
    }

    console.log(subCountyCode);
    const filtered = subCountyWardsPayload.filter(
      (ward) => ward.SubCounty === subCountyCode
    );
    setFilteredWards(filtered);
  };

  useEffect(() => {
    if (selectedCounty) {
      filterSubCounties(selectedCounty);
    }
  }, [selectedCounty]);

  useEffect(() => {
    if (selectedSubCounty) {
      filterSubCountyWards(selectedSubCounty);
    }
  }, [selectedSubCounty]);

  useEffect(() => {
    if (dispatchingInfo && success || patientDetails?.PatientNo) {
      dispatch(getPatientByNo(patientDetails?.PatientNo));
    }
  }, [success,dispatchingInfo, dispatch, patientDetails?.PatientNo]);

  const handleSubmission = (values) => {
    setFormSubmitted(true);

    const formattedData = {
      myAction: patientDetails && patientDetails.PatientNo ? "edit" : "create",
      patientNo: patientDetails?.PatientNo || "",
     
      nationality: selectedCountry || patientDetails?.Nationality || "",
      county: selectedCounty || patientDetails?.placeofBirthDistrict || "",
      subcounty: selectedSubCounty || patientDetails?.SubCountyName || "",
      countyWard:
        selectedCountry === "KE"
          ? selectedWard || patientDetails?.CountyWardName || ""
          : "",  
   
      residence: values.residence || patientDetails?.PlaceofBirthVillage || "",
     
    };

    // Dispatch to save or update patient data, including regional info
    dispatch(saveAddressInformation(formattedData));
    onUpdate(data);
  };

  return (
    <div>
      <Typography.Text level={5} underline>
        Regional Information
      </Typography.Text>
      {error && formSubmitted && (
        <Alert
          message={error}
          type="error"
          showIcon
          closeText="Close"
          onClose={() => {
            setFormSubmitted(false);
            dispatch({ type: "CLEAR_ERROR" });
          }}
        />
      )}
      {success && formSubmitted && (
        <Alert
          message="Information saved successfully!"
          type="success"
          showIcon
          closeText="Close"
          onClose={() => {
            setFormSubmitted(false);
            dispatch({ type: "CLEAR_SUCCESS" });
          }}
        />
      )}

      <Form form={form} layout="vertical" onFinish={handleSubmission}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Select Nationality"
              name="nationality"
              rules={[
                { required: true, message: "Please select a nationality" },
              ]}
            >
              {loadingCountries ? (
                <Skeleton.Input active size="small" style={{ width: "100%" }} />
              ) : (
                <Select
                  placeholder="Select Nationality"
                  onChange={handleNationalityChange}
                  value={selectedCountry}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toUpperCase().includes(input.toUpperCase())
                  }
                  allowClear
                >
                  {countries?.map((country) => (
                    <Option key={country.Code} value={country.Code}>
                      {country.Name}
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>

          {selectedCountry === "KE" && (
            <>
              <Col span={12}>
                <Form.Item label="Select County" name="county">
                  {loadingCounties ? (
                    <Skeleton.Input
                      active
                      size="small"
                      style={{ width: "100%" }}
                    />
                  ) : (
                    <Select
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      allowClear
                      placeholder="Select County"
                      value={selectedCounty}
                      onChange={handleCountyChange}
                    >
                      {counties?.map((county) => (
                        <Option key={county.Code} value={county.Code}>
                          {county.Description}
                        </Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="Select SubCounty" name="subcounty">
                  {subCountiesLoading ? (
                    <Skeleton.Input
                      active
                      size="small"
                      style={{ width: "100%" }}
                    />
                  ) : (
                    <Select
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      allowClear
                      placeholder="Select SubCounty"
                      value={selectedSubCounty}
                      onChange={handleSubCountyChange}
                    >
                      {filteredSubCounties?.map((subCounty) => (
                        <Option
                          key={subCounty.SubCountyCode}
                          value={subCounty.SubCountyCode}
                        >
                          {subCounty.Name}
                        </Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="Select Ward" name="countyWard">
                  {subCountyWardsLoading ? (
                    <Skeleton.Input
                      active
                      size="small"
                      style={{ width: "100%" }}
                    />
                  ) : (
                    <Select
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      allowClear
                      placeholder="Select Ward"
                      value={selectedWard}
                      onChange={setSelectedWard}
                    >
                      {filteredWards?.map((ward) => (
                        <Option key={ward.Code} value={ward.Code}>
                          {ward.Name}
                        </Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </>
          )}
        </Row>

        {/* Residence field (visible regardless of nationality) */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Residence"
              name="residence"
              rules={[{ required: true, message: "Residence is required!" }]}
            >
              <Input placeholder="Residence" />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item style={{ textAlign: "right" }}>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RegionalInformation;
