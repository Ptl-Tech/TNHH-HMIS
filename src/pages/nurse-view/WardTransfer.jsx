import { Collapse } from "antd";
import NurseInnerHeader from "../../partials/nurse-partials/NurseInnerHeader";
import { FileOutlined } from "@ant-design/icons";
import { useLocation } from "react-router-dom";
import BedTransferTable from "./tables/nurse-tables/BedTransferTable";
import WardTransferTable from "./tables/nurse-tables/WardTransferTable";

const WardTransfer = () => {
    const location = useLocation();
    const patientDetail = location.state?.patientDetails || {};
    const items = [
    {
      key: "1",
      label: <p style={{ fontWeight: "bold", color: "#0f5689" }}>Transfer to another bed in this ward - {patientDetail?.Ward}</p>,
      children: <BedTransferTable />,
    },
    {
      key: "2",
      label: <p style={{ fontWeight: "bold", color: "#0f5689" }}>Transfer to another ward</p>,
      children: <WardTransferTable />,
    },
  ];
  const onChange = (key) => {
    console.log(key);
  };
  return (
    <div>
      <NurseInnerHeader
        icon={<FileOutlined />}
        title="Where should the patient be transferred to?"
      />
      <div>
        <Collapse defaultActiveKey={["1"]} onChange={onChange} items={items} />
      </div>
    </div>
  );
};

export default WardTransfer;
