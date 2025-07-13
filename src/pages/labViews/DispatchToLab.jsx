import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Button, Space, Input, message } from "antd";

import { ActivePatients } from "../ActivePatients";
import {
  dispatchToLab,
  POST_DISPATCH_TO_LAB_RESET,
} from "../../actions/lab-actions/dispatchToLab";
import { getBillingList } from "../../actions/Charges-Actions/getBillingList";

export const DispatchToLab = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchKey, setSearchKey] = useState("");
  const [currentPatientNo, setCurrentPatientNo] = useState(null);
  const [currentPatients, setCurrentPatients] = useState([]);

  const { loading, patients } = useSelector((state) => state.getBillingList);
  const {
    data: dispatchToLabData,
    error: dispatchToLabError,
    loading: dispatchToLabLoading,
  } = useSelector((state) => state.dispatchToLab);

  const filterPatients = (searchKey, patients) => {
    return patients.filter(
      ({ PatientNo, Names }) =>
        PatientNo.toLowerCase().includes(searchKey.toLowerCase()) ||
        Names.toLowerCase().includes(searchKey.toLowerCase())
    );
  };

  useEffect(() => {
    // After getting the patients
    if (patients?.length) {
      setCurrentPatients(() => {
        return filterPatients(searchKey, patients);
      });
    }
  }, [patients, loading, searchKey]);

  const getType = (type) => ["Outpatient", "Inpatient", "Walk-In"][type];

  useEffect(() => {
    if (dispatchToLabData) {
      const { LABORATORYNO, REQUESTTYPE } = dispatchToLabData;
      message.success("The lab header has been created successfully");
      navigate(
        `/Lab/${getType(REQUESTTYPE)}/Lab-Request?LaboratoryNo=${LABORATORYNO}`,
        {
          state: {
            patientNo: currentPatientNo,
            labObservationNo: LABORATORYNO,
          },
        }
      );
    }
    if (dispatchToLabError) message.error(dispatchToLabError);

    if (dispatchToLabData || dispatchToLabData)
      dispatch({ type: POST_DISPATCH_TO_LAB_RESET });
  });

  useEffect(() => {
    dispatch(getBillingList(true));
  }, []);

  const handleDispatchToLab = ({ PatientNo }) => {
    setCurrentPatientNo(PatientNo);
    dispatch(dispatchToLab({ patientNo: PatientNo }));
  };

  const columns = [
    {
      title: "Patient Number",
      dataIndex: "PatientNo",
      key: "PatientNo",
    },
    {
      title: "Visit Number",
      dataIndex: "ActiveVisitNo",
      key: "ActiveVisitNo",
    },
    {
      title: "Name",
      dataIndex: "Names",
      key: "Names",
    },
    {
      title: "Branch",
      dataIndex: "Global_Dimension_1_Code",
      key: "Global_Dimension_1_Code",
    },
    {
      title: "Patient Type",
      dataIndex: "PatientType",
      key: "PatientType",
    },
    {
      title: "Insurance Name",
      dataIndex: "Insurance_Name",
      key: "Insurance_Name",
    },
    {
      title: "Action",
      dataIndex: "PatientNo",
      key: "PatientNo",
      render: (_, record) => {
        return (
          <Button
            size="small"
            type="primary"
            onClick={() => handleDispatchToLab(record)}
            style={{ padding: "12px 8px", fontSize: "12px", fontWeight: "500" }}
          >
            Dispatch To Lab
          </Button>
        );
      },
    },
  ];

  const { Compact: SpaceCompact } = Space;

  return (
    <div className="d-grid" style={{ color: "#333" }}>
      <h2 style={{ fontSize: "24px", fontWeight: "400" }}>Dispatch to Lab</h2>
      <p
        className="text-secondary"
        style={{ fontSize: "16px", fontWeight: "400" }}
      >
        Search a patient to dispatch to the lab
      </p>
      <div className="d-grid gap-3">
        <SpaceCompact style={{ maxWidth: "420px" }}>
          <Input
            allowClear
            value={searchKey}
            addonBefore="Patient No | Name"
            placeholder="PT_0001 | John Doe"
            onChange={(e) => setSearchKey(e.target.value)}
          />
        </SpaceCompact>
        <ActivePatients
          loading={loading}
          columns={columns}
          dataSource={currentPatients}
        />
      </div>
    </div>
  );
};
