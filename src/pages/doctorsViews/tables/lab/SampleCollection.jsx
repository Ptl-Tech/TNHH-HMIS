import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import {
  Typography,
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Select,
} from "antd";
import { FileTextOutlined } from "@ant-design/icons";

import { labLinesColumns as defaultColumns } from "./utils";
import Loading from "../../../../partials/nurse-partials/Loading";
import { postLabSample } from "../../../../actions/lab-actions/postLabSample";
import SkeletonLoading from "../../../../partials/nurse-partials/Skeleton";

const SampleCollection = ({ data, loading }) => {
  const [open, setOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);

  const showModal = (record) => {
    setCurrentRecord(record);
    setOpen(true);
  };

  const handleOk = () => {
    setCurrentRecord(null);
    setOpen(false);
  };

  const handleCancel = () => {
    setCurrentRecord(null);
    setOpen(false);
  };

  const columns = [
    ...defaultColumns,
    {
      title: "Create Sample",
      render: (_, record) => {
        return (
          <Button
            type="primary"
            onClick={() => showModal(record)}
            disabled={record.Sample_Collected}
          >
            {record.Sample_Collected ? "Sample Collected" : "Add Sample"}
          </Button>
        );
      },
    },
  ];

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <>
          <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            rowClassName={(record) =>
              record.Sample_Collected ? "disabled-row" : ""
            }
          />
          <SampleModal
            open={open}
            handleOk={handleOk}
            test={currentRecord}
            handleCancel={handleCancel}
          />
        </>
      )}
    </div>
  );
};

const SampleModal = ({ open, test, handleOk, handleCancel }) => {
  const { LaboratoryTestName } = test || {};

  return (
    <Modal
      open={open}
      title={`Collect ${LaboratoryTestName} Sample`}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Cancel
        </Button>,
      ]}
    >
      <SampleForm closeModal={handleCancel} test={test} />
    </Modal>
  );
};

const SampleForm = ({ closeModal, test }) => {
  const { Laboratory_No, LaboratoryTestCode } = test;

  const samples = [
    { value: "pus", label: "Pus" },
    { value: "EDTA", label: "EDTA" },
    { value: "serum", label: "Serum" },
    { value: "blood", label: "Blood" },
    { value: "stool", label: "Stool" },
    { value: "urine", label: "Urine" },
    { value: "semen", label: "Semen" },
    { value: "sputum", label: "Sputum" },
    { value: "saliva", label: "Saliva" },
    { value: "citrate", label: "Citrate" },
    { value: "heparin", label: "Heparin" },
    { value: "fluoride", label: "Fluoride" },
    { value: "tissue", label: "Tissue Biopsy" },
    { value: "nasal_swab", label: "Nasal Swab" },
    { value: "wound_swab", label: "Wound Swab" },
    { value: "throat_swab", label: "Throat Swab" },
    { value: "bone_marrow", label: "Bone Marrow" },
    { value: "vaginal_swab", label: "Vaginal Swab" },
    { value: "hair_samples", label: "Hair Samples" },
    { value: "urethral_swab", label: "Urethral Swab" },
    { value: "pleural_fluid", label: "Pleural Fluid" },
    { value: "csf", label: "Cerebrospinal Fluid (CSF)" },
    { value: "nail_ckippings", label: "Nail Clippings" },
    { value: "skin_scrapings", label: "Skin Scrapings" },
    { value: "amniotic_fluid", label: "Amniotic Fluid" },
    { value: "synovial_fluid", label: "Synovial Fluid" },
    { value: "peritoneal_fluid", label: "Peritoneal Fluid" },
    { value: "pericardial_fluid", label: "Pericardial Fluid" },
  ];

  // destructor
  const { Item, useForm } = Form;

  // hooks
  const [form] = useForm();
  const dispatch = useDispatch();
  const { data, error, loading } = useSelector((state) => state.postLabSample);

  useEffect(() => {
    if (data) {
      console.log({ data });

      const { status } = data;
      status === "success"
        ? message.success("Sample submitted successfully")
        : message.error("Could not submit the sample");
    }

    if (error) {
      message.error("Something went wrong");
    }
  }, [data, error]);

  // handling pushing code
  const onFinish = async (sample) => {
    const { remarks } = sample;

    // publishing the data to the backend
    await dispatch(
      postLabSample({
        remarks,
        myAction: "create",
        laboratoryNo: Laboratory_No,
        labTestCode: LaboratoryTestCode,
      })
    );
    form.resetFields();
    closeModal();
  };

  return (
    <>
      {loading ? (
        <SkeletonLoading />
      ) : (
        <Form
          form={form}
          name="sampleForm"
          layout="vertical"
          autoComplete="off"
          onFinish={onFinish}
        >
          <Item
            name="remarks"
            label="Sample Description"
            rules={[
              {
                required: true,
                message: "Please add a description for your sample",
              },
            ]}
          >
            <Select showSearch options={samples} />
          </Item>
          <Item label={null}>
            <Button type="primary" htmlType="submit" disabled={loading}>
              {loading ? "Loading..." : "Submit Sample"}
            </Button>
          </Item>
        </Form>
      )}
    </>
  );
};

export default SampleCollection;
