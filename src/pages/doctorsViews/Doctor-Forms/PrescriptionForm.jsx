import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Button, Form, message, Space } from "antd";

import {
  sendtoPharmacy,
  POST_PRESCRIPTION_RESET,
  postPrescriptionDetails,
  POST_PRESCRIPTION_TO_PHARMACY_RESET,
} from "../../../actions/Doc-actions/postPrescription";
import { getItemsSlice } from "../../../actions/triage-actions/getItemsSlice";

import {
  pharmacyCardSearchDrugsColumns,
  doctorPrescriptionCurrentSelectionColumns,
} from "../../pharmacy-views/pharmacy-utils";
import { SearchDrugTable } from "../../pharmacy-views/SearchDrugTable";
import { PharmacyCurrentSelection } from "../../pharmacy-views/PharmacyCurrentSelection";

const PrescriptionForm = () => {
  const { useForm } = Form;
  const [form] = useForm();

  const dispatch = useDispatch();
  const location = useLocation();
  const treatmentNo = new URLSearchParams(location.search).get("TreatmentNo");

  const [editingKey, setEditingKey] = useState("");
  const [selectedDrugs, setSelectedDrugs] = useState([]);

  const {
    data: postPrescriptionData,
    error: postPrescriptionError,
    loading: postPrescriptionLoading,
  } = useSelector((state) => state.postPrescription);
  const {
    data: sendtoPharmacyData,
    error: sendtoPharmacyError,
    loading: sendtoPharmacyLoading,
  } = useSelector((state) => state.sendtoPharmacy);
  const { items, loadingItems } = useSelector((state) => state.getItems);

  useEffect(() => {
    dispatch(getItemsSlice());
  }, []);

  // We first create the prescription
  useEffect(() => {
    if (postPrescriptionLoading) message.info("Posting the prescription");

    if (postPrescriptionData) {
      dispatch(sendtoPharmacy(treatmentNo));
    }

    if (postPrescriptionError) message.error(postPrescriptionError);

    if (postPrescriptionData || postPrescriptionError)
      dispatch({ type: POST_PRESCRIPTION_RESET });
  }, [postPrescriptionData, postPrescriptionError, postPrescriptionLoading]);

  // We send the prescription to the pharmacy
  useEffect(() => {
    if (sendtoPharmacyData) {
      form.resetFields();
      setSelectedDrugs([]);
      message.success("Prescription sent to pharmacy");
    }
    if (sendtoPharmacyError) message.error(sendtoPharmacyError);

    dispatch({ type: POST_PRESCRIPTION_TO_PHARMACY_RESET });
  }, [sendtoPharmacyData, sendtoPharmacyError]);

  // *********************************************Table functions and variables *****************************************************/
  const edit = (record) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.No);
  };

  const save = async (record) => {
    try {
      const row = await form.validateFields();
      console.log({ row, record });
      const { prescriptionDose, duration, remarks } = row;

      const newRecord = { ...record, prescriptionDose, duration, remarks };
      const indexToReplace = selectedDrugs.findIndex(
        (item) => item.No === record.No
      );
      var newSelected = [...selectedDrugs];
      newSelected.splice(indexToReplace, 1, newRecord);

      setSelectedDrugs(newSelected);
      setEditingKey("");
    } catch (error) {
      console.log({ error });
    }
  };

  const cancel = () => setEditingKey("");

  const isEditing = (record) => record.No === editingKey;

  const handleAddDrug = (drugNo) => {
    const drug = items.find((item) => item.No === drugNo);
    setSelectedDrugs(Array.from([...selectedDrugs, drug]));
  };

  const deleteItem = ({ No }) => {
    setSelectedDrugs(
      selectedDrugs.filter((selectedDrug) => selectedDrug.No !== No)
    );
  };

  const columns = doctorPrescriptionCurrentSelectionColumns(
    edit,
    save,
    cancel,
    isEditing,
    deleteItem
  );

  const data = selectedDrugs.map((selectedDrug, index) => ({
    ...selectedDrug,
    quantity: 0,
    treatmentNo,
    myAction: "create",
    drugNo: selectedDrug.No,
    Index: selectedDrug.Index || index + 1,
  }));

  const searchDrugsColumns = pharmacyCardSearchDrugsColumns(handleAddDrug);

  // *********************************************End of table functions and variables *****************************************************/

  const handleDispatchPrescription = () => {
    const emptyDrug = selectedDrugs.find(
      ({ drugNo, prescriptionDose }) => !(drugNo && prescriptionDose)
    );

    if (emptyDrug)
      return message.warning(
        `Kindly ensure you have added the frequency to ${emptyDrug.Description}`
      );

    dispatch(postPrescriptionDetails(selectedDrugs));
  };

  return (
    <Space direction="vertical" className="d-flex gap-4">
      <div className="d-flex justify-content-end">
        <Button
          type="primary"
          disabled={!selectedDrugs.length}
          loading={postPrescriptionLoading || sendtoPharmacyLoading}
          onClick={handleDispatchPrescription}
        >
          Send to Pharmacy
        </Button>
      </div>
      <Form
        form={form}
        component={false}
        disabled={postPrescriptionLoading || sendtoPharmacyLoading}
      >
        <PharmacyCurrentSelection
          data={data}
          columns={columns}
          style={{ width: "100%" }}
        />
      </Form>
      <SearchDrugTable
        items={items}
        loading={loadingItems}
        columns={searchDrugsColumns}
      />
    </Space>
  );
};

export default PrescriptionForm;
