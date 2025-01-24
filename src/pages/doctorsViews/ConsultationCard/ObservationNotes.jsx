import PropTypes from 'prop-types'
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTriageList } from '../../../actions/triage-actions/getTriageListSlice';
import NurseNotesTable from '../../nurse-view/tables/nurse-tables/NurseNotesTable';
// import { TextArea } from 'antd';

const ObservationNotes = ({ treatmentNo, patientNo }) => {
    console.log('observation number', treatmentNo, 'patient number', patientNo);
    const [observationNotes, setObservationNotes] = useState([]);
    const dispatch = useDispatch();

    const { loadingTriageList, triageList } = useSelector((state) => state.getTriageList) || {};
    console.log('observation notes', observationNotes);

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
            <NurseNotesTable loadingTriageList={loadingTriageList} observationNotes={observationNotes}/>     
        </>
    )
}

ObservationNotes.propTypes = {
    treatmentNo: PropTypes.string,
    patientNo: PropTypes.string
}

export default ObservationNotes