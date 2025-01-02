import { Button, Col, Row } from "antd"
import { PrinterOutlined } from "@ant-design/icons"
import NurseInnerHeader from "../../partials/nurse-partials/NurseInnerHeader"
import { useLocation } from "react-router-dom"
import InpatientConsumablesCard from "./InpatientConsumablesCard"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import { getPgOpenPatientConsumablesSlice } from "../../actions/nurse-actions/getPgOpenPatientConsumablesSlice"
import InpatientConsumablesTable from "./tables/nurse-tables/InpatientConsumablesTable"

const DischargeCard = () => {

const { patientDetails } = useLocation().state;
const dispatch = useDispatch();

const {loadingGetPgOpenPatientConsumables, getPgOpenPatientConsumables} = useSelector(state => state.getPgOpenPatientConsumables);

const consumables = getPgOpenPatientConsumables?.filter(item => item.Admission_No === patientDetails?.AdmissionNo);

useEffect(() => {
    if(!getPgOpenPatientConsumables?.length){
        dispatch(getPgOpenPatientConsumablesSlice());
    }
}, [dispatch, getPgOpenPatientConsumables?.length]);

  return (
          
    <div style={{ margin: "20px 10px 10px 10px" }}>
      
      <NurseInnerHeader title="Posted Consumables" />

      <Row gutter={8} className="inpatient-card-container">
        <Col
          xs={24}
          md={24}
          lg={24}
          xl={24}
          className="inpatient-card-left-col"
        >
          <InpatientConsumablesCard patientDetails={patientDetails} />

        <div className="print-button-container">

            <Button type="primary" style={{ width: '100%' }}><PrinterOutlined /> Export to Excel</Button>
            <Button color="default" variant="outlined" style={{ width: '100%' }}><PrinterOutlined /> Print Consumables</Button>

        </div>

        </Col>
        <Col
          xs={24}
          md={24}
          lg={24}
          xl={24}
          className="inpatient-card-left-col"
        >
            <InpatientConsumablesTable loadingGetPgOpenPatientConsumables={loadingGetPgOpenPatientConsumables} consumables={consumables}/>

        </Col>
      </Row>
    </div>
  )
}

export default DischargeCard