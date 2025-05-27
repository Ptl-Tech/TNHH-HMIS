import { Card, Col, Form, Input, Row, Select, Typography,DatePicker } from "antd";
import PropTypes from "prop-types";

const FilterWardManagement = ({
  getWards,
  handleWardChange,
  loadingWards,
  psychiatricCodingOptions,
  setPsychiatricCoding,
  setCodingReason,
  setAdmissionDate,
  setDoctorId,  
  form,
  handleOnFinish,
  patientNo,
}) => {

  return (
    <>
      <Card
        style={{
          padding: "24px 10px 10px 10px",
          marginTop: "10px",
          borderTop: "3px solid #0f5689",
        }}
      >
        <Form form={form} onFinish={handleOnFinish}>
          <Row gutter={[16, 16]}>
            {!patientNo && (
              <Col xs={24} md={24} lg={16}>
                <Typography.Title level={5}>
                  Search to select ward, room and bed
                </Typography.Title>
              </Col>
            )}
            <Col xs={24} md={24} lg={8}>
              <Form.Item
                name={"ward"}
                rules={[
                  {
                    required: true,
                    message: "Please select a ward",
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
                  placeholder="Search to Select ward"
                  optionFilterProp="label"
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "")
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? "").toLowerCase())
                  }
                  // defaultValue={getWards?.length > 0 ? getWards[0].Ward_Code : undefined} // Set first option as default
                />
              </Form.Item>
            </Col>

            {patientNo && (
              <>
                <Col xs={24} md={24} lg={8}>
                <Form.Item
  name="doctorId"
  rules={[
    {
      required: true,
      message: "Please select a Doctor",
    },
  ]}
>
  <Select
    size="large"
    onChange={(value) => setDoctorId(value)}
    placeholder="Search to select doctor"
    showSearch
    optionFilterProp="label"
    options={psychiatricCodingOptions?.map((option) => ({
      value: option.DoctorID,
      label: option.DoctorsName,
    }))}
    filterSort={(optionA, optionB) =>
      (optionA?.label ?? "")
        .toLowerCase()
        .localeCompare((optionB?.label ?? "").toLowerCase())
    }
  />
</Form.Item>

                </Col>

                <Col xs={24} md={24} lg={8}>
                  <Form.Item
                    name="admissionDate"
                    rules={[
                      {
                        required: true,
                        message: "Please enter a admission date",
                      },
                    ]}
                  >
                    <DatePicker
  size="large"
  style={{ width: "100%" }}
  onChange={(date, dateString) => setAdmissionDate(dateString)}
/>


                    {/* <Input
                      placeholder="Coding reason"
                      size="large"
                      onChange={(e) => setCodingReason(e.target.value)}
                    /> */}
                  </Form.Item>
                </Col>
              </>
            )}
          </Row>
        </Form>
      </Card>
    </>
  );
};

export default FilterWardManagement;
// props validation
FilterWardManagement.propTypes = {
  getWards: PropTypes.array.isRequired,
  handleWardChange: PropTypes.func.isRequired,
  loadingWards: PropTypes.bool.isRequired,
  psychiatricCodingOptions: PropTypes.array.isRequired,
  setPsychiatricCoding: PropTypes.string.isRequired,
  setCodingReason: PropTypes.string.isRequired,
  setAdmissionDate: PropTypes.string.isRequired,
  setDoctorId: PropTypes.string.isRequired,
  form: PropTypes.object,
  handleOnFinish: PropTypes.func,
  patientNo: PropTypes.string,
};
