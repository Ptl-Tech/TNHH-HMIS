import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  PlusOutlined,
  EyeOutlined,
  TeamOutlined,
  DisconnectOutlined,
} from "@ant-design/icons";

import {
  Button,
  Card,
  Col,
  Input,
  Row,
  Table,
  Tooltip,
  Typography,

} from "antd";
import { listPatients } from "../actions/patientActions";
import useAuth from "../hooks/useAuth";
const { Search } = Input;

const OutpatientList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading: loadingPatients, patients } = useSelector((state) => state.patientList);
  const role = useAuth().userData.departmentName;

  


  // get patient whose ActiveVisitNo ="" and CurrentAdmNo = ""
  const patientsToFilter = useMemo(() => {
    const patientsArray = Array.isArray(patients) ? patients : Object.values(patients);
  
    return role === "Nurse"
      ? patientsArray.filter((patient) => patient?.ActiveVisitNo === "" && patient?.CurrentAdmNo === "")
      : patientsArray;
  }, [role, patients]);


  const [searchParams, setSearchParams] = useState({
    SearchName: '',
    patientId: '',
    patientNo: '',
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
  const filtered = patientsToFilter.filter((patient) => {
    return (
      (!SearchName || patient?.SearchName.toLowerCase().includes(SearchName.toLowerCase())) &&
      (!patientId || patient?.IDNumber.includes(patientId)) &&
      (!patientNo || patient?.PatientNo.toLowerCase().includes(patientNo.toLowerCase()))
    );
  });
  setFilteredPatients(filtered);
};

  const columns = [
    {
      title: 'Patient No',
      dataIndex: 'PatientNo',
      key: 'PatientNo',
      sorter: (a, b) => a.PatientNo - b.PatientNo,
      render: (text) => (
        <Typography.Text style={{ color: "#0f5689", fontWeight: "bold" }}>
          {text}
        </Typography.Text>
      )
    },
    {
      title: 'Patient Name',
      dataIndex: 'SearchName',
      key: 'SearchName',
      sorter: (a, b) => a.SearchName.localeCompare(b.SearchName),
      render: (text) => (
        <Tooltip title={text}>
          <Typography.Text ellipsis style={{ maxWidth: "200px", color: "#0f5689", fontWeight: "bold" }}>
            {text}
          </Typography.Text>
        </Tooltip>
      )
    },
    { title: 'Gender', dataIndex: 'Gender', key: 'Gender' },
    { title: 'Patient Type', dataIndex: 'PatientType', key: 'PatientType' },
    { title: 'ID Number', dataIndex: 'IDNumber', key: 'IDNumber' },
    {
      title: 'Date Registered',
      dataIndex: 'DateRegistered',
      key: 'DateRegistered',
      render: (text) => new Date(text).toLocaleDateString(),
      sorter: (a, b) => new Date(a.DateRegistered) - new Date(b.DateRegistered),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div style={{ display: "flex", gap: "8px" }}>
          {role === "Reception" ? (
           <>
           <Tooltip title="View Details">
                <Button
                  type="link"
                  icon={<EyeOutlined />}
                  onClick={() =>
                    navigate(`/reception/Patient-Registration/Patient?PatientNo=${record.PatientNo}`, {
                      state: { patientDet: record },
                    })
                  }
                >
                  View Details
                </Button>
              <Button
                  icon={<PlusOutlined />}
                  type="link"
                  onClick={() =>
                    navigate(`/reception/Add-Appointment/Patient?PatientNo=${record.PatientNo}`, {
                      state: { existingPatient: record, previousPath: location.pathname },
                    })
                  }
                >
                  Create Visit
                </Button>   </Tooltip>
           </>
          ) : role === "Nurse" ? (
            <Tooltip title="Admit Patient">
              <Button
                icon={<DisconnectOutlined />}
                type="primary"
                onClick={() =>
                  navigate(`/Nurse/patient-list/Direct-Admission?PatientNo=${record.PatientNo}`, {
                    state: { patientDetails: record },
                  })
                }
              >
                Admit Patient
              </Button>
            </Tooltip>
          ) : null}
        </div>
      ),
    }
  ];

  return (
    <div>
      <h4 className="text-center p-3 text-dark">
        <TeamOutlined style={{ marginRight: '8px', fontSize: '24px' }} />
        Patient List
      </h4>
      <div className="d-flex justify-content-between">
        <Button
          type="primary"
          onClick={() => {
            if (role === "Reception") {
              navigate("/reception/Patient-Registration");
            } else if (role === "Nurse") {
              navigate("/Nurse/Patient-Registration");
            }
          }}
          style={{ marginBottom: "20px" }}

        >
          Register New Patient
        </Button>
      </div>
      <Card className="card-header mb-4 mt-4 p-4">
        <Typography.Text
          style={{
            color: '#003F6D',
            fontWeight: 'bold',
            marginBottom: '16px',
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
              onChange={(e) => handleSearchChange(e, 'SearchName')}
              allowClear
            />
          </Col>
          <Col xl={8} md={12} xs={24}>
            <Input
              size="large"
              placeholder="Patient ID"
              value={searchParams.patientId}
              onChange={(e) => handleSearchChange(e, 'patientId')}
              allowClear
              onSearch={() => filterPatients(searchParams)}
            />
          </Col>
          <Col xl={8} md={12} xs={24}>
            <Input
              size="large"
              placeholder="Patient No"
              value={searchParams.patientNo}
              onChange={(e) => handleSearchChange(e, 'patientNo')}
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
