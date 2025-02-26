import { Button, Space, Typography } from "antd";
import { useEffect, useState } from "react";
import { PlusOutlined, ProfileOutlined, FolderViewOutlined } from "@ant-design/icons";
import DiagnosisTable from "../tables/nurse-tables/DiagnosisTable";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { getInpatientInjectionSlice } from "../../../actions/nurse-actions/getInpatientInjectionSlice";
import InjectionsFormData from "../forms/nurse-forms/InjectionsFormData";

const Injections = () => {
      const dispatch = useDispatch();
       const { patientDetails } = useLocation().state;
        const [isInjectionFormVisible, setIsInjectionFormVisible] = useState(false);

       const { loadingGetInpatientInjection, injections } = useSelector((state) => state.getInpatientInjection);

       const filterInjections = injections?.filter((item) => item.AdmissionNo === patientDetails?.CurrentAdmNo);

       const handleVitalsButtonVisibility = () => {
        setIsInjectionFormVisible(!isInjectionFormVisible);
      }

      useEffect(() => {
        if(!injections?.length){
          dispatch(getInpatientInjectionSlice('/data/odatafilter?webservice=QyInpatientInjections&isList=true'));
        }
      }, [dispatch, injections?.length]);

  return (
    <div>

        <Space style={{ color: '#0f5689', display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '30px', position: 'relative'}}>
          <ProfileOutlined />
          <Typography.Text style={{ fontWeight: 'bold', color: '#0f5689', fontSize: '14px'}}>
              Injections
          </Typography.Text>
        </Space>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', paddingBottom: '20px',  marginTop: '20px'}}>
          <Button type="primary" style={{ width: '100%' }}
            onClick={handleVitalsButtonVisibility}
            icon={<PlusOutlined />}
          > 
            Add Injection
          </Button>
          <Button color="default" variant="outlined" style={{ width: '100%' }}><FolderViewOutlined /> Preview Injection</Button>
        </div>

        {
          isInjectionFormVisible && (
            <InjectionsFormData setIsInjectionFormVisible={setIsInjectionFormVisible} />
          )
        }

        {
          !isInjectionFormVisible && (
            <DiagnosisTable loadingGetInpatientInjection={loadingGetInpatientInjection} injections={filterInjections} />
          )
        }

    </div>
  )
}

export default Injections