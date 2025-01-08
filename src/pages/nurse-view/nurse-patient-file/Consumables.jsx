import { Button, Space, Typography } from "antd"
import { ProfileOutlined, PlusOutlined, PrinterOutlined } from "@ant-design/icons"
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import InpatientConsumablesTable from "../tables/nurse-tables/InpatientConsumablesTable";
import { getPgOpenPatientConsumablesSlice } from "../../../actions/nurse-actions/getPgOpenPatientConsumablesSlice";
import ConsumablesFormData from "../forms/nurse-forms/ConsumablesFormData";

const Consumables = () => {

    const { patientDetails } = useLocation().state;
   
    const dispatch = useDispatch();

    const [isConsumableFormVisible, setIsConsumableFormVisible] = useState(false);
    
    const {loadingGetPgOpenPatientConsumables, getPgOpenPatientConsumables} = useSelector(state => state.getPgOpenPatientConsumables);

    const consumables = getPgOpenPatientConsumables?.filter(item => item.Admission_No === patientDetails?.CurrentAdmNo);

    const handleVitalsButtonVisibility = () => {
      setIsConsumableFormVisible(!isConsumableFormVisible);
    }

    useEffect(() => {
        
            dispatch(getPgOpenPatientConsumablesSlice());
        
    }, [dispatch, getPgOpenPatientConsumables?.length]);

  return (
    <div>
      <Space style={{ color: '#0f5689', display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '30px', position: 'relative'}}>
          <ProfileOutlined />
          <Typography.Text style={{ fontWeight: 'bold', color: '#0f5689', fontSize: '14px'}}>
              Patient Consumable
          </Typography.Text>
        </Space>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', paddingBottom: '20px'}}>
          <Button type="primary" style={{ width: '100%' }} onClick={handleVitalsButtonVisibility}><PlusOutlined /> Add Consumables</Button>

          <Button color="default" variant="outlined" style={{ width: '100%' }}><PrinterOutlined /> Print Consumables</Button>
        </div>



          {
            isConsumableFormVisible && (
              
              <ConsumablesFormData setIsConsumableFormVisible={setIsConsumableFormVisible} />
              
            )
          }

          {
            !isConsumableFormVisible && (
              <InpatientConsumablesTable loadingGetPgOpenPatientConsumables={loadingGetPgOpenPatientConsumables} consumables={consumables}/>
            )
          }

    </div>
  )
}

export default Consumables