import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Col, Form, Row, Skeleton, Typography, Select, Input, Button } from "antd";
import {
  listCounties,
  listCountries,
  listSubCounties,
  listSubCountyWards,
} from "../../../actions/DropdownListActions";
import { saveAddressInformation } from "../../../actions/reception-actions/save-patient-actions/saveAddressInformation";
import moment from "moment";
const { Option } = Select;

const RegionalInformation = ({patientDetails, onUpdate}) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  // State to hold the selected country, county, and subcounty
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCounty, setSelectedCounty] = useState('');
  const [selectedSubCounty, setSelectedSubCounty] = useState('');

    const { loading, success, error } = useSelector((state) => state.saveAddressInfo);
  

  // Destructure state to get loading state and countries
  const { loading: loadingCountries, countries } = useSelector(
    (state) => state.countriesList
  );
  const { loading: loadingCounties, counties } = useSelector(
    (state) => state.countiesList
  );
  const {
    loading: subCountiesLoading,
    subCounties: subCountiesPayload,
  } = useSelector((state) => state.subCounties);
  const {
    loading: subCountyWardsLoading,
    subCountyWards: subCountyWardsPayload,
  } = useSelector((state) => state.subCountyWards);

  // Dispatch action to load countries once on component mount
  useEffect(() => {
    dispatch(listCountries());
    dispatch(listCounties());
    dispatch(listSubCountyWards());
    dispatch(listSubCounties());
  }, [dispatch]);

  // Handle nationality change
  const handleNationalityChange = (value) => {
    setSelectedCountry(value);
    // Reset county, subcounty, and ward when nationality changes
    setSelectedCounty(null);
    setSelectedSubCounty(null);
  };

  // Handle county change
  const handleCountyChange = (value) => {
    setSelectedCounty(value);
    // Reset subcounty and ward when county changes
    setSelectedSubCounty(null);
  };

  // Handle subcounty change
  const handleSubCountyChange = (value) => {
    setSelectedSubCounty(value);
  };

  // Filter SubCounty Wards based on selected County and SubCounty
  const FilterSubCountyWards = () => {
    if (!selectedCounty || !selectedSubCounty) {
      return subCountyWardsPayload; // Return all if no selection
    }

    return subCountyWardsPayload.filter(
      (ward) => ward.County === selectedCounty && ward.SubCounty === selectedSubCounty
    );
  };


    useEffect(() => {
      if (patientDetails) {
        form.resetFields(); // Reset fields to avoid stale state
        form.setFieldsValue({
          firstName: patientDetails?.Surname?.split(" ")[0] || "",
          middleName: patientDetails?.MiddleName || "",
          lastName: patientDetails?.LastName || "",
          gender:
            patientDetails?.Gender === "Male"
              ? 1
              : patientDetails?.Gender === "Female"
              ? 2
              : "",
          dob: patientDetails?.DateOfBirth
            ? moment(patientDetails.DateOfBirth)
            : null,
          idNumber: patientDetails?.IDNumber || "",
          phoneNumber: patientDetails?.TelephoneNo1 || "",
          nationality: patientDetails?.Nationality || "",
          county: patientDetails?.County || "",
          nextOfKinRelationship: patientDetails?.NextofkinRelationship || "",
          nextOfKinFullName: patientDetails?.NextOfkinFullName || "",
          nextOfKinPhoneNo: patientDetails?.nextOfKinPhoneNo || "",
          paymentMode: patientDetails?.PatientType || 0,
          insuranceNo: patientDetails?.InsuranceNonsuranceNo || "",
          insuranceName: patientDetails?.InsuranceName || "",
          insurancePrinicipalMemberName:
            patientDetails?.PrincipalMemberName || "",
          isPrincipleMember: patientDetails?.Principal || false,
          membershipNo: patientDetails?.MembershipNo || "",
          schemeName: patientDetails?.schemeName || "",
          howYouKnewABoutUs: patientDetails?.HowyouKnewAboutUs || "",
          subcounty: patientDetails?.subcounty || "",
          email: patientDetails?.Email || "",
          residence: patientDetails?.residence || "",
          patientStatus: patientDetails?.patientStatus || 0,
        });
      }
    }, [patientDetails, form]);
  
    const handleSubmission = (values) => {
        const formattedData = {
          myAction: patientDetails && patientDetails.PatientNo ? "edit" : "create",
          patientNo: patientDetails?.PatientNo || "",
          firstName: patientDetails?.Surname?.split(" ")[0] || "",
          middleName: patientDetails?.MiddleName || "",
          lastName: patientDetails?.LastName || "",
          gender:
            patientDetails?.Gender === "Male"
              ? 1
              : patientDetails?.Gender === "Female"
              ? 2
              : "",
          dob: patientDetails?.DateOfBirth
            ? moment(patientDetails.DateOfBirth).format("YYYY-MM-DD")
            : "",
          nationality: selectedCountry || patientDetails?.Nationality || "",
          county: selectedCounty || patientDetails?.County || "",
          subcounty: selectedSubCounty || patientDetails?.subcounty || "",
          ward: selectedWard || "", // Ensure you capture the ward selection
          idNumber: patientDetails.IDNumber || "",
          phoneNumber: patientDetails?.TelephoneNo1 || "",
          paymentMode: patientDetails?.PatientType || 0,
          nextOfKinRelationship: patientDetails?.nextOfKinRelationship || "",
          nextOfKinFullName: patientDetails?.nextOfKinFullName || "",
          nextOfKinPhoneNo: patientDetails?.nextOfKinPhoneNo || "",
          insuranceNo: patientDetails?.InsuranceNo || "",
          insuranceName: patientDetails?.InsuranceName || "",
          insurancePrinicipalMemberName:
            patientDetails?.PrincipalMemberName || "",
          isPrincipleMember: patientDetails?.Principal || false,
          membershipNo: patientDetails?.MembershipNo || "",
          schemeName: patientDetails?.SchemeName || "",
          howYouKnewABoutUs: patientDetails?.HowyouKnewAboutUs || "",
          residence: patientDetails?.residence || "",
          patientStatus: patientDetails?.patientStatus || 0,
        };
      
        // Dispatch to save or update patient data, including regional info
        dispatch(saveAddressInformation(formattedData));
        onUpdate(formattedData);
      };
      
  return (
    <div>
      <Typography.Text level={5} underline>
        Regional Information
      </Typography.Text>
      <Form form={form} layout="vertical" onFinish={handleSubmission}   >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Select Nationality" name="nationality">
              {loadingCountries ? (
                <Skeleton.Input active size="small" style={{ width: "100%" }} />
              ) : (
                <Select
                  showSearch
                  placeholder="Select Nationality"
                  onChange={handleNationalityChange}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option?.children?.toLowerCase().includes(input.toLowerCase())
                  }
                  filterSort={(optionA, optionB) =>
                    optionA?.children
                      ?.toLowerCase()
                      .localeCompare(optionB?.children?.toLowerCase())
                  }
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
                    <Skeleton.Input active size="small" style={{ width: "100%" }} />
                  ) : (
                    <Select
                      showSearch
                      placeholder="Select County"
                      value={selectedCounty}
                      onChange={handleCountyChange}
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option?.children?.toLowerCase().includes(input.toLowerCase())
                      }
                      filterSort={(optionA, optionB) =>
                        optionA?.children
                          ?.toLowerCase()
                          .localeCompare(optionB?.children?.toLowerCase())
                      }
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

              {selectedCounty && (
                <Col span={12}>
                  <Form.Item label="Select Sub County" name="subCounty">
                    {subCountiesLoading ? (
                      <Skeleton.Input active size="small" style={{ width: "100%" }} />
                    ) : (
                      <Select
                        showSearch
                        placeholder="Select Sub County"
                        value={selectedSubCounty}
                        onChange={handleSubCountyChange}
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option?.children?.toLowerCase().includes(input.toLowerCase())
                        }
                        filterSort={(optionA, optionB) =>
                          optionA?.children
                            ?.toLowerCase()
                            .localeCompare(optionB?.children?.toLowerCase())
                        }
                      >
                        {subCountiesPayload
                          ?.filter((subCounty) => subCounty.CountyCode === selectedCounty)
                          .map((subCounty) => (
                            <Option key={subCounty.SubCountyCode} value={subCounty.SubCountyCode}>
                              {subCounty.Name}
                            </Option>
                          ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              )}

              {selectedSubCounty && (
                <Col span={12}>
                  <Form.Item label="Select Ward" name="ward">
                    {subCountyWardsLoading ? (
                      <Skeleton.Input active size="small" style={{ width: "100%" }} />
                    ) : (
                      <Select
                        showSearch
                        placeholder="Select Ward"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option?.children?.toLowerCase().includes(input.toLowerCase())
                        }
                        filterSort={(optionA, optionB) =>
                          optionA?.children
                            ?.toLowerCase()
                            .localeCompare(optionB?.children?.toLowerCase())
                        }
                      >
                        {FilterSubCountyWards().map((ward) => (
                          <Option key={ward.Code} value={ward.Code}>
                            {ward.Name}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              )}
            </>
          )}
        </Row>

        {/* Residence field (visible regardless of nationality) */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Residence" name="residence">
              <Input placeholder="Residence" />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
          {loading ? "Submitting..." : "Submit"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RegionalInformation;
