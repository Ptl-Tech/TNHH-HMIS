import { Button, Checkbox, Col, Form, Input, Row, Space } from "antd"
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getQyIpLookupValuesSlice } from "../../../actions/nurse-actions/getQyIPLookupValuesSlice";
import PropTypes from "prop-types";
import { CloseOutlined, SaveOutlined } from "@ant-design/icons";

const BriefMentalStateExamFormData = ({ setIsFormVisible }) => {
    const [form] = Form.useForm()
    const dispatch = useDispatch()
    const [otherInputs, setOtherInputs] = useState({});
    const {loadingIpLookupValues, ipLookupValues} = useSelector((state) => state.getQyIpLookupValues);
    const filterIpLookupValues = ipLookupValues.filter((item) => item.Type === 'MSE Form');

    const groupedData = filterIpLookupValues.reduce((acc, item) => {
        acc[item.Category] = acc[item.Category] || [];
        acc[item.Category].push(item.SubCategory || item.Description || "N/A");
        return acc;
      }, {});

      const handleCheckboxChange = (category, value) => {
        if (value === 'Other') {
          setOtherInputs((prev) => ({ ...prev, [category]: true }));
        } else {
          setOtherInputs((prev) => ({ ...prev, [category]: false }));
        }
      };

      const handleOnFinish = (values) => {
        console.log('values', values);
      };
      

    useEffect(() => {
        if(!ipLookupValues?.length) {
            dispatch(getQyIpLookupValuesSlice())
        }
    }, [dispatch, ipLookupValues?.length])
  return (
    <>
        <Form 
         form={form}
         style={{ paddingTop: '10px' }}
         onFinish={handleOnFinish}
        >
        <Row style={{ backgroundColor: '#0f5689', padding: '10px 0', color: '#fff', fontWeight: 'bold' }} justify="center">
            <Col span={12} style={{ borderRight: '1px solid #ddd', paddingLeft: '10px' }}>
                Category
            </Col>
            <Col span={12} style={{ borderRight: '1px solid #ddd', paddingLeft: '10px' }}>
                Descriptor
            </Col>
        </Row>
        {
        Object.entries(groupedData).map(([category, descriptors]) => (
            <div key={category}>
                <Row style={{ padding: '10px 0', borderBottom: '1px solid #ddd', color: 'black', fontWeight: 'normal' }} justify="center">
                <Col span={12} style={{ borderRight: '1px solid #ddd', paddingLeft: '10px' }}>
                {category}
                </Col>
                <Col span={12} style={{ borderRight: '1px solid #ddd', paddingLeft: '10px', paddingRight: '10px' }}>
                    <Checkbox.Group>
                        {descriptors.map((descriptor, index) => (
                        <Checkbox
                        key={index}
                        value={descriptor}
                        onChange={(e) => handleCheckboxChange(category, e.target.value)}
                        >
                        {descriptor}
                        </Checkbox>
                        ))}
                    </Checkbox.Group>
                        {otherInputs[category] && (
                        <Input
                        style={{ marginTop: '10px'}}
                        placeholder={`Type ${category.toLocaleLowerCase()} details`}
                        />
                        )}
                </Col>
                </Row>
            </div>
        )
        )}

            <Form.Item style={{ marginTop: '20px' }}>
                <Space>
                    <Button type="primary" 
                    htmlType="submit" 
                    icon={<SaveOutlined />
                    }
                        
                    >
                        Save Form
                    </Button>
                    <Button color="danger" variant="outlined" icon={<CloseOutlined />} onClick={() => setIsFormVisible(false)}
                    >
                        Cancel
                    </Button>
                </Space>
                
            </Form.Item>
        
        </Form>
    </>
  )
}

export default BriefMentalStateExamFormData
//props validation
BriefMentalStateExamFormData.propTypes = {
    setIsFormVisible: PropTypes.func.isRequired,
}