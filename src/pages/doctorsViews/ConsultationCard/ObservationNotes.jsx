import PropTypes from 'prop-types'
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTriageList } from '../../../actions/triage-actions/getTriageListSlice';
import NurseNotesTable from '../../nurse-view/tables/nurse-tables/NurseNotesTable';
import { Divider, Typography } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
// import { TextArea } from 'antd';

const ObservationNotes = ({ treatmentNo, patientNo }) => {
    const [observationNotes, setObservationNotes] = useState([]);
    const dispatch = useDispatch();

    const { loadingTriageList, triageList } = useSelector((state) => state.getTriageList) || {};

    useEffect(() => {
        dispatch(getTriageList());
    }, [dispatch]);
    useEffect(() => {
        // Filter with observation no and patient no
        const filteredNotes = triageList.filter(
            (item) => item.TreatmentNo === treatmentNo
        );
        setObservationNotes(filteredNotes);
    }, [triageList, treatmentNo, patientNo]);

    // filter with observation no and patient no
    // const observationNotes = triageList.filter((item) => item.ObservationNo === observationNo && item.PatientNo === patientNo);

    // console.log(observationNotes[0]?.ObservationRemarks);

    return (
        <> 
            <Divider />
            <Typography.Title level={5} style={{ marginBottom: "12px", color: "#0F5689" }}>
                <FileTextOutlined style={{ marginRight: "8px" }} />
                Observation Notes
              </Typography.Title>
            <NurseNotesTable loadingTriageList={loadingTriageList} observationNotes={observationNotes}/>     
        </>
    )
}

ObservationNotes.propTypes = {
    treatmentNo: PropTypes.string,
    patientNo: PropTypes.string
}

export default ObservationNotes