import { Button, message } from "antd";
import { PlusOutlined, FilterOutlined, SendOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import InpatientConsumablesTable from "../tables/nurse-tables/InpatientConsumablesTable";
import { getPgOpenPatientConsumablesSlice } from "../../../actions/nurse-actions/getPgOpenPatientConsumablesSlice";
import ConsumablesFormData from "../forms/nurse-forms/ConsumablesFormData";
import NurseInnerHeader from "../../../partials/nurse-partials/NurseInnerHeader";
// import useAuth from "../../../hooks/useAuth";
import {
  POST_NURSE_ORDER_SHEET_FAILURE,
  POST_NURSE_ORDER_SHEET_SUCCESS,
  postNurseOrderSheetSlice,
} from "../../../actions/nurse-actions/postNurseOrderSheet";

const Consumables = () => {
  const { patientDetails } = useLocation().state;

  const { user } = useAuth();
  const dispatch = useDispatch();
  const [loadingPostConsumables, setLoadingPostConsumables] = useState(false);
  const [isConsumableFormVisible, setIsConsumableFormVisible] = useState(false);

  const { loadingGetPgOpenPatientConsumables, getPgOpenPatientConsumables } =
    useSelector((state) => state.getPgOpenPatientConsumables);

  const consumables = getPgOpenPatientConsumables?.filter(
    (item) => item.Admission_No === patientDetails?.Admission_No
  );

  const handleVitalsButtonVisibility = () => {
    setIsConsumableFormVisible(!isConsumableFormVisible);
  };

  useEffect(() => {
    dispatch(getPgOpenPatientConsumablesSlice());
  }, [dispatch, getPgOpenPatientConsumables?.length]);

  const handlePostOrderSheet = async () => {
    // Logic to handle posting the order sheet
    const orderSheetResult = await dispatch(
      postNurseOrderSheetSlice("/Nurse/SendOrderToPharmacy", {
        admissionNo: patientDetails?.Admission_No,
        branchCode: user?.branchCode,
        staffNo: user?.staffNo,
      })
    );
    setLoadingPostConsumables(true);
    if (orderSheetResult.type === POST_NURSE_ORDER_SHEET_SUCCESS) {
      setLoadingPostConsumables(false);
      message.success("Order sheet sent to pharmacy successfully!");
      dispatch(getPgOpenPatientConsumablesSlice());
      form.resetFields();
    } else if (orderSheetResult.type === POST_NURSE_ORDER_SHEET_FAILURE) {
      setLoadingPostConsumables(false);
      message.error(
        orderSheetResult?.payload?.message ||
          "Failed to send order sheet to pharmacy."
      );
    }
  };
  return (
    <div>
      <NurseInnerHeader icon={<FilterOutlined />} title="Order sheets" />
      <div
        style={{
          marginTop: "10px",
          display: "flex",
          gap: "10px",
          justifyContent: "space-between",
        }}
      >
        {!isConsumableFormVisible && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              paddingBottom: "10px",
              marginTop: "20px",
            }}
          >
            <Button type="primary" onClick={handleVitalsButtonVisibility}>
              <PlusOutlined />
              New Order Sheet
            </Button>
          </div>
        )}
        {consumables?.length > 0 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              paddingBottom: "10px",
              marginTop: "20px",
            }}
          >
            {!isConsumableFormVisible && (
              <Button
                type="primary"
                onClick={handlePostOrderSheet}
                loading={loadingPostConsumables}
              >
                <SendOutlined />
                Send Order to Pharmacy
              </Button>
            )}
          </div>
        )}
      </div>

      {isConsumableFormVisible && (
        <ConsumablesFormData
          id="tableId"
          setIsConsumableFormVisible={setIsConsumableFormVisible}
        />
      )}

      {!isConsumableFormVisible && (
        <InpatientConsumablesTable
          loadingGetPgOpenPatientConsumables={
            loadingGetPgOpenPatientConsumables
          }
          consumables={consumables}
        />
      )}
    </div>
  );
};

export default Consumables;
