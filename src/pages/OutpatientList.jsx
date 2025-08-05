import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  Col,
  Row,
  Card,
  Table,
  Input,
  Button,
  Tooltip,
  Dropdown,
  Typography,
} from "antd";
import {
  EyeOutlined,
  TeamOutlined,
  DownOutlined,
  PlusOutlined,
  DisconnectOutlined,
} from "@ant-design/icons";

import { listPatients } from "../actions/patientActions";
import { useAbility } from "../hooks/casl";

const OutpatientList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const ability = useAbility();

  const { loading: loadingPatients, patients } = useSelector(
    (state) => state.patientList
  );

  // get patient whose ActiveVisitNo ="" and CurrentAdmNo = ""
  const patientsToFilter = useMemo(() => {
    if (!patients || (Array.isArray(patients) && patients.length === 0)) {
      return []; // Ensure it's always an array
    }

    const patientsArray = Array.isArray(patients)
      ? patients
      : Object.values(patients);

    return ability.can("read", "nurseNavigation")
      ? patientsArray.filter(
          (patient) =>
            patient?.ActiveVisitNo === "" && patient?.CurrentAdmNo === ""
        )
      : patientsArray;
  }, [ability, patients]);

  const [searchParams, setSearchParams] = useState({
    SearchName: "",
    patientId: "",
    patientNo: "",
  });
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    dispatch(listPatients());
  }, [dispatch]);

  useEffect(() => {
    // Don't filter by patient type, show all patients

    setFilteredPatients();
  }, [patientsToFilter]);

  const handleSearchChange = (e, field) => {
    const value = e.target.value;

    setSearchParams((prevState) => {
      const updatedParams = { ...prevState, [field]: value };
      // If all search fields are empty, hide the list
      if (
        !updatedParams.SearchName &&
        !updatedParams.patientId &&
        !updatedParams.patientNo
      ) {
        setShowList(false);
      } else {
        // Otherwise, show the list and filter
        setShowList(true);
        filterPatients(updatedParams);
      }
      return updatedParams;
    });
  };

  const filterPatients = (params) => {
    const { SearchName, patientId, patientNo } = params;

    if (!Array.isArray(patientsToFilter)) return; // Ensure no filter on undefined data

    const filtered = patientsToFilter.filter((patient) => {
      return (
        (!SearchName ||
          (patient?.SearchName &&
            patient.SearchName.toLowerCase().includes(
              SearchName.toLowerCase()
            ))) &&
        (!patientId ||
          (patient?.IDNumber && patient.IDNumber.includes(patientId))) &&
        (!patientNo ||
          (patient?.PatientNo &&
            patient.PatientNo.toLowerCase().includes(patientNo.toLowerCase())))
      );
    });

    setFilteredPatients(filtered);
  };

  const columns = [
    {
      title: "Patient No",
      dataIndex: "PatientNo",
      key: "PatientNo",
      sorter: (a, b) => a.PatientNo - b.PatientNo,
      render: (text) => (
        <Typography.Text style={{ color: "#0f5689", fontWeight: "bold" }}>
          {text}
        </Typography.Text>
      ),
    },
    {
      title: "Patient Name",
      dataIndex: "SearchName",
      key: "SearchName",
      sorter: (a, b) => a.SearchName.localeCompare(b.SearchName),
      render: (text) => (
        <Tooltip title={text}>
          <Typography.Text
            ellipsis
            style={{ maxWidth: "200px", color: "#0f5689", fontWeight: "bold" }}
          >
            {text}
          </Typography.Text>
        </Tooltip>
      ),
    },
    { title: "Gender", dataIndex: "Gender", key: "Gender" },
    { title: "Patient Type", dataIndex: "PatientType", key: "PatientType" },
    { title: "ID Number", dataIndex: "IDNumber", key: "IDNumber" },
    {
      title: "Branch Code",
      dataIndex: "GlobalDimension1Code",
      key: "GlobalDimension1Code",
    },
    {
      title: "Date Registered",
      dataIndex: "DateRegistered",
      key: "DateRegistered",
      render: (text) => new Date(text).toLocaleDateString(),
      sorter: (a, b) => new Date(a.DateRegistered) - new Date(b.DateRegistered),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => {
        const menuItems = [];

        if (ability.can("read", "receptionNavigation")) {
          menuItems.push(
            {
              key: "view",
              label: (
                <div
                  onClick={() =>
                    navigate(
                      `/Dashboard/Patient-Registration/Patient?PatientNo=${record.PatientNo}`,
                      { state: { patientDet: record } }
                    )
                  }
                >
                  <EyeOutlined /> View Details
                </div>
              ),
            },
            {
              key: "visit",
              label: (
                <div
                  onClick={() =>
                    navigate(
                      `/Dashboard/Add-Appointment/Patient?PatientNo=${record.PatientNo}`,
                      {
                        state: {
                          patientNo: record.PatientNo,
                          previousPath: location.pathname,
                        },
                      }
                    )
                  }
                >
                  <PlusOutlined /> Visit Card
                </div>
              ),
            }
          );
        } else if (ability.can("read", "nurseNavigation")) {
          menuItems.push({
            key: "admit",
            label: (
              <div
                onClick={() =>
                  navigate(
                    `/Dashboard/patient-list/Direct-Admission?PatientNo=${record.PatientNo}`,
                    { state: { patientDetails: record } }
                  )
                }
              >
                <DisconnectOutlined /> Admit Patient
              </div>
            ),
          });
        }

        return (
          <Dropdown
            menu={{ items: menuItems }}
            placement="bottomLeft"
            trigger={["click"]}
          >
            <Button type="primary" size="small">
              Actions
              <DownOutlined />
            </Button>
          </Dropdown>
        );
      },
    },
  ];

  return (
    <div>
      <h4 className="text-center p-3 text-dark">
        <TeamOutlined style={{ marginRight: "8px", fontSize: "24px" }} />
        Patient List
      </h4>
      <div className="d-flex justify-content-between">
        <Button
          type="primary"
          onClick={() => {
            navigate("/Dashboard/Patient-Registration");
          }}
          style={{ marginBottom: "20px" }}
        >
          Register New Patient
        </Button>
      </div>
      <Card className="card-header mb-4 mt-4 p-4">
        <Typography.Text
          style={{
            color: "#003F6D",
            fontWeight: "bold",
            marginBottom: "16px",
          }}
        >
          Find Patient Details by:
        </Typography.Text>
        <Row gutter={[16, 16]} className="mt-2">
          <Col xl={8} md={12} xs={24}>
            <Input
              size="large"
              placeholder="Patient Name"
              value={searchParams.SearchName}
              onChange={(e) => handleSearchChange(e, "SearchName")}
              allowClear
            />
          </Col>
          <Col xl={8} md={12} xs={24}>
            <Input
              size="large"
              placeholder="Patient ID"
              value={searchParams.patientId}
              onChange={(e) => handleSearchChange(e, "patientId")}
              allowClear
              onSearch={() => filterPatients(searchParams)}
            />
          </Col>
          <Col xl={8} md={12} xs={24}>
            <Input
              size="large"
              placeholder="Patient No"
              value={searchParams.patientNo}
              onChange={(e) => handleSearchChange(e, "patientNo")}
              allowClear
            />
          </Col>
        </Row>
      </Card>
      {showList && (
        <div className="mt-4">
          <Table
            rowKey="SystemCreatedAt"
            bordered
            size="small"
            loading={loadingPatients}
            columns={columns}
            dataSource={filteredPatients}
            pagination={{ pageSize: 10 }}
          />
        </div>
      )}
    </div>
  );
};

export default OutpatientList;
