import PropTypes from 'prop-types'
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTriageList } from '../../../actions/triage-actions/getTriageListSlice';
// import { TextArea } from 'antd';

const ObservationNotes = ({ observationNo, patientNo }) => {
    const [observationNotes, setObservationNotes] = useState([]);
    const dispatch = useDispatch();

    const { loadingTriageList, triageList } = useSelector((state) => state.getTriageList) || {};

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
        <div className='container'>
            {observationNotes.length > 0 ? (
                <div>
                    <h6>Observation Notes</h6>
                    <p>{observationNotes[0].ObservationRemarks}</p>
                </div>
            ) : (
                <p>No observation remarks available.</p>
            )}
        </div>
    )
}

ObservationNotes.propTypes = {
    observationNo: PropTypes.string,
    patientNo: PropTypes.string
}

export default ObservationNotes