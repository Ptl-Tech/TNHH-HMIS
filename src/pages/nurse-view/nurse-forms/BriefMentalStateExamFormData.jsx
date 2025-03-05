import { Button, Checkbox, Col, Form, Input, Row, Space, message } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getQyIpLookupValuesSlice } from "../../../actions/nurse-actions/getQyIPLookupValuesSlice";
import PropTypes from "prop-types";
import { CloseOutlined, SaveOutlined } from "@ant-design/icons";
import Loading from "../../../partials/nurse-partials/Loading";
import axios from "axios"; // Ensure axios is installed

const BriefMentalStateExamFormData = ({ setIsFormVisible, patientNo }) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const [selectedValues, setSelectedValues] = useState({});
    const [otherInputs, setOtherInputs] = useState({});
    const [errors, setErrors] = useState({});
    const { loadingIpLookupValues, ipLookupValues } = useSelector((state) => state.getQyIpLookupValues);

    // Group data by category
    const groupedData = ipLookupValues.reduce((acc, item) => {
        acc[item.Category] = acc[item.Category] || [];
        acc[item.Category].push(item.Description || item.SubCategory || "N/A");
        return acc;
    }, {});

    // Handle checkbox selection (multiple allowed)
    const handleCheckboxChange = (category, value, checked) => {
        setSelectedValues((prev) => {
            const updatedSelections = prev[category] ? [...prev[category]] : [];

            if (checked) {
                updatedSelections.push(value);
            } else {
                const index = updatedSelections.indexOf(value);
                if (index > -1) updatedSelections.splice(index, 1);
            }

            return { ...prev, [category]: updatedSelections };
        });

        // Show input field if 'Other' is selected
        if (value.toLowerCase() === "other" || value.toLowerCase() === "describe") {
            setOtherInputs((prev) => ({ ...prev, [category]: "" }));
        } else if (!checked) {
            setOtherInputs((prev) => {
                const updatedInputs = { ...prev };
                delete updatedInputs[category]; // Remove input field if 'Other' is unchecked
                return updatedInputs;
            });
        }
    };

    // Handle input change for 'Other' selection
    const handleOtherInputChange = (category, event) => {
        setOtherInputs((prev) => ({
            ...prev,
            [category]: event.target.value,
        }));
    };

    // Validate form before submission
    const validateForm = () => {
        const newErrors = {};
        Object.keys(groupedData).forEach((category) => {
            if (!selectedValues[category] || selectedValues[category].length === 0) {
                newErrors[category] = "Please select at least one option.";
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleOnFinish = async () => {
        if (!validateForm()) {
            return;
        }

        const today = new Date().toISOString().split("T")[0]; // Format date as YYYY-MM-DD

        const formData = [];
        Object.keys(selectedValues).forEach((category) => {
            selectedValues[category].forEach((descriptor) => {
                const dataEntry = {
                    myAction: "create",
                    patientNo: patientNo,
                    date: today,
                    category: category,
                    descriptor: descriptor === "Other" ? otherInputs[category] || "Other" : descriptor,
                    comments: "",
                };
                formData.push(dataEntry);
            });
        });

        console.log("Submitting Data:", formData);

        try {
            const response = await axios.post("https://your-api-endpoint.com", formData);
            if (response.status === 200) {
                message.success("Data saved successfully!");
                form.resetFields();
                setSelectedValues({});
                setOtherInputs({});
            }
        } catch (error) {
            console.error("API Error:", error);
            message.error("Failed to save data.");
        }
    };

    // Fetch data on mount
    useEffect(() => {
        if (!ipLookupValues?.length) {
            dispatch(getQyIpLookupValuesSlice("Brief MSE Form"));
        }
    }, [dispatch, ipLookupValues?.length]);

    if (loadingIpLookupValues) {
        return <Loading />;
    }

    return (
        <>
            <Form form={form} style={{ paddingTop: "10px" }} onFinish={handleOnFinish}>
                <Row style={{ backgroundColor: "#0f5689", padding: "10px 0", color: "#fff", fontWeight: "bold" }} justify="center">
                    <Col span={12} style={{ borderRight: "1px solid #ddd", paddingLeft: "10px" }}>Category</Col>
                    <Col span={12} style={{ borderRight: "1px solid #ddd", paddingLeft: "10px" }}>Descriptor</Col>
                </Row>

                {Object.entries(groupedData).map(([category, descriptors]) => (
                    <div key={category}>
                        <Row style={{ padding: "10px 0", borderBottom: "1px solid #ddd", color: "black", fontWeight: "normal" }} justify="center">
                            <Col span={12} style={{ borderRight: "1px solid #ddd", paddingLeft: "10px" }}>{category}</Col>
                            <Col span={12} style={{ borderRight: "1px solid #ddd", paddingLeft: "10px", paddingRight: "10px" }}>
                                {descriptors.map((descriptor, index) => (
                                    <Checkbox
                                        key={index}
                                        checked={selectedValues[category]?.includes(descriptor)}
                                        onChange={(e) => handleCheckboxChange(category, descriptor, e.target.checked)}
                                    >
                                        {descriptor}
                                    </Checkbox>
                                ))}

                                {otherInputs.hasOwnProperty(category) && (
                                    <Input
                                        style={{ marginTop: "10px" }}
                                        placeholder={`Type ${category.toLowerCase()} details`}
                                        value={otherInputs[category]}
                                        onChange={(e) => handleOtherInputChange(category, e)}
                                    />
                                )}

                                {errors[category] && <p style={{ color: "red", marginTop: "5px" }}>{errors[category]}</p>}
                            </Col>
                        </Row>
                    </div>
                ))}

                <Form.Item style={{ marginTop: "20px" }}>
                    <Space>
                        <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>Save Form</Button>
                        <Button danger variant="outlined" icon={<CloseOutlined />} onClick={() => setIsFormVisible(false)}>Cancel</Button>
                    </Space>
                </Form.Item>
            </Form>
        </>
    );
};

export default BriefMentalStateExamFormData;

// Props validation
BriefMentalStateExamFormData.propTypes = {
    setIsFormVisible: PropTypes.func.isRequired,
    patientNo: PropTypes.string.isRequired,
};
