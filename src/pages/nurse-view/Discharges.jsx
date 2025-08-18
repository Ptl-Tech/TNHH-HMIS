import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, Tabs, message } from "antd";
import { TbNotes } from "react-icons/tb";
import { BsBookmarkCheck } from "react-icons/bs";
import { DeliveredProcedureOutlined, UserAddOutlined } from "@ant-design/icons";
import { AiOutlineMedicineBox } from "react-icons/ai";

import SickOff from "./discharges/SickOff";
import AppointmentTCA from "./discharges/AppointmentTCA";
import DischargeSummaryTab from "./discharges/DischargeSummaryTab";
import InpatientMedication from "./nurse-care-plan/InpatientMedication";
import { POST_RELEASE_BED_FAILURE, POST_RELEASE_BED_SUCCESS, postReleaseBedSlice } from "../../actions/nurse-actions/postReleaseBedSlice";

const { confirm } = Modal;

const Discharges = () => {
  const dispatch = useDispatch();
  const { data: currentInpatient } = useSelector(
    (state) => state.currentInpatient
  );
  const handleReleaseBed = () => {
    confirm({
      title: "Confirm Bed Release",
      content: `Are you sure you want to release bed ${currentInpatient?.Bed} of ${currentInpatient?.Ward}?`,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        return new Promise((resolve, reject) => {
          handleReleaseBedAction()
            .then(resolve)
            .catch(reject);
        });
      },
    });
  };

  const handleReleaseBedAction = async () => {
    try {
      const result = await dispatch(
        postReleaseBedSlice({ admissionNo: currentInpatient?.Admission_No })
      );

      if (result.type === POST_RELEASE_BED_SUCCESS) {
        message.success(
          result.payload.message ||
            `Bed ${currentInpatient?.Bed} released successfully!`
        );
        return Promise.resolve();
      } else if (result.type === POST_RELEASE_BED_FAILURE) {
        message.error(
          result?.payload?.response?.data?.errors ||
            result?.payload?.message ||
            "An error occurred while releasing bed, please try again."
        );
        return Promise.reject();
      }
    } catch (error) {
      message.error(error.message || "Unexpected error occurred");
      return Promise.reject();
    }
  };

  const menuItems = [
    {
      key: "dischargeMedication",
      label: "Discharge Medication",
      icon: <AiOutlineMedicineBox />,
      children: <InpatientMedication />,
    },
    {
      icon: <TbNotes size={17} />,
      key: "dischargeSummary",
      label: "Discharge Summary",
      children: <DischargeSummaryTab currentInpatient={currentInpatient} />,
    },
     {
      key: "releaseBed",
      label: "Release Bed",
      icon: <DeliveredProcedureOutlined />,
      children: (
        <div style={{ padding: 16 }}>
          <Button type="primary" danger onClick={handleReleaseBed}>
            Release Bed
          </Button>
        </div>
      ),
    },
    {
      key: "sickOff",
      label: "Sick Off",
      icon: <UserAddOutlined />,
      children: <SickOff currentInpatient={currentInpatient} />,
    },
    {
      key: "appointmentTCA",
      label: "Appointment TCA",
      icon: <BsBookmarkCheck />,
      children: <AppointmentTCA currentInpatient={currentInpatient} />,
    },
   
  ];

  return <Tabs destroyInactiveTabPane type="card" items={menuItems} />;
};

export default Discharges;
