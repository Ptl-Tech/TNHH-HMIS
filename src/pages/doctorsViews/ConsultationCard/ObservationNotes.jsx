import PropTypes from 'prop-types'
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTriageList } from '../../../actions/triage-actions/getTriageListSlice';
import { Button } from 'antd';
import NurseNotesTable from '../../nurse-view/tables/nurse-tables/NurseNotesTable';
// import { TextArea } from 'antd';

const ObservationNotes = ({ observationNo, patientNo }) => {
    const [observationNotes, setObservationNotes] = useState([]);
    const dispatch = useDispatch();

    const { loadingTriageList, triageList } = useSelector((state) => state.getTriageList) || {};
    console.log('observation notes', observationNotes);

    useEffect(() => {
        dispatch(getTriageList());
    }, [dispatch]);
    useEffect(() => {
        // Filter with observation no and patient no
        const filteredNotes = triageList.filter((item) => item.ObservationNo === observationNo && item.PatientNo === patientNo);
        setObservationNotes(filteredNotes);
    }, [triageList, observationNo, patientNo]);

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
    observationNo: PropTypes.string,
    patientNo: PropTypes.string
}

export default ObservationNotes