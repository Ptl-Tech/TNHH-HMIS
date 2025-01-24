import { Card, Col, Form, Input, Row, Select } from "antd";
import PropTypes from "prop-types";


const FilterWardManagement = ({
  getWards,
  handleWardChange,
  loadingWards,
  psychiatricCodingOptions,
  setPsychiatricCoding,
  setCodingReason,
  form,
  handleOnFinish
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
        
            <Form
              form={form}
              onFinish={handleOnFinish}
            >
              <Row gutter={[16, 16]}>

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
                />
                </Form.Item>
                </Col>
                <Col xs={24} md={24} lg={8}>
                  
              <Form.Item 
              name="psychiatricCoding"
                rules={[
                  {
                    required: true,
                    message: "Please select a Psychiatrist Coding",
                  },
                ]}
              >
                <Select
                  size="large"
                  onChange={(value) => setPsychiatricCoding(value)}
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

                <Col xs={24} md={24} lg={8}>
                <Form.Item 
                name="codingReason"
                rules={[
                    {
                      required: true,
                      message: "Please enter a coding reason",
                    },
                  ]}
                >
                <Input
                  placeholder="Coding reason"
                  size="large"
                  onChange={(e) => setCodingReason(e.target.value)}
                />
              </Form.Item>
                </Col>

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
  form: PropTypes.object,
  handleOnFinish: PropTypes.func,
};
