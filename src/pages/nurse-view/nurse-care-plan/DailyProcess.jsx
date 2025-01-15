import { Button, Space, Typography } from "antd";
import { useEffect, useState } from "react";
import { PlusOutlined, ProfileOutlined, FolderViewOutlined } from "@ant-design/icons";
import GeneralObservationsTable from "../tables/nurse-tables/GeneralObservationsTable";
import { useDispatch, useSelector } from "react-redux";
import { getQyInpatientProcessProceduresSlice } from "../../../actions/nurse-actions/getQyInpatientProcessProceduresSlice";
import { useLocation } from "react-router-dom";
import DailyProcessFormData from "../nurse-forms/DailyProcessFormData";
import NurseInnerHeader from "../../../partials/nurse-partials/NurseInnerHeader";

const DailyProcess = () => {
      const { patientDetails } = useLocation().state;

      const [isDailyProcessFormVisible, setIsDailyProcessFormVisible] = useState(false);

      const {loadingGetIpProcedure, ipGetProcedure} = useSelector((state) => state.getQyInpatientProcessProcedure);
      
      const filterProcedures = ipGetProcedure?.filter(procedure => procedure.AdmissionNo === patientDetails?.CurrentAdmNo);

      const handleVitalsButtonVisibility = () => {
        setIsDailyProcessFormVisible(!isDailyProcessFormVisible);
      }

      const dispatch = useDispatch();
  
    useEffect(() => {
          if(!ipGetProcedure?.length){
            dispatch(getQyInpatientProcessProceduresSlice());
          }
        }, [dispatch, ipGetProcedure?.length]);
  
      
  return (
    <div>
        
        <NurseInnerHeader title='Nursing Rounds' />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', paddingBottom: '20px'}}>
          <Button type="primary" style={{ width: '100%' }} onClick={handleVitalsButtonVisibility}><PlusOutlined /> Add Daily Process</Button>
          <Button color="default" variant="outlined" style={{ width: '100%' }}><FolderViewOutlined /> Preview Daily Process</Button>
        </div>

        {
          !isDailyProcessFormVisible && (
            <GeneralObservationsTable ipGetProcedure={filterProcedures} loadingGetIpProcedure={loadingGetIpProcedure}/>
          )
        }

        {
          isDailyProcessFormVisible && (
            <DailyProcessFormData setIsDailyProcessFormVisible={setIsDailyProcessFormVisible}/>
          )
        }  
      
    </div>
  )
}

export default DailyProcess