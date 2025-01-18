import { Button } from "antd";
import { useEffect, useState } from "react";
import { PlusOutlined, UserAddOutlined, FolderViewOutlined } from "@ant-design/icons";
import GeneralObservationsTable from "../tables/nurse-tables/GeneralObservationsTable";
import { useDispatch, useSelector } from "react-redux";
import { getQyInpatientProcessProceduresSlice } from "../../../actions/nurse-actions/getQyInpatientProcessProceduresSlice";
import { useLocation } from "react-router-dom";
import DailyProcessFormData from "../nurse-forms/DailyProcessFormData";
import NurseInnerHeader from "../../../partials/nurse-partials/NurseInnerHeader";
import useAuth from "../../../hooks/useAuth";


const DailyProcess = () => {
      const { patientDetails } = useLocation().state;
      const role = useAuth().userData.departmentName

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
        
        <NurseInnerHeader icon={<UserAddOutlined />} title={role === 'NURSE' ? 'Nursing Rounds' : 'Daily Ward Rounds'} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', paddingBottom: '20px'}}>
          <Button type="primary" style={{ width: '100%' }} onClick={handleVitalsButtonVisibility}><PlusOutlined /> Add Daily Progress</Button>
          <Button color="default" variant="outlined" style={{ width: '100%' }}><FolderViewOutlined /> Preview Daily Progress</Button>
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