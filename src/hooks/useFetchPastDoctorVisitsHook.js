import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useMemo } from 'react';
import { listDoctors } from '../actions/DropdownListActions';
import { getTriageWaitingList } from '../actions/triage-actions/getTriageWaitingListSlice';
import { getConsultationRoomListSlice } from '../actions/nurse-actions/getConsultationRoomSlice';

const useFetchPastDoctorVisitsHook = () => {
    const { loadingConsultationRoomList, consultationRoomList } = useSelector(state => state.getConsultationRoom);
    const { triageWaitingList } = useSelector(state => state.getTriageWaitingList);
    const { data } = useSelector(state => state.getDoctorsList);

    const dispatch = useDispatch();

    useEffect(() => {
        if (!data?.length) {
            dispatch(listDoctors());
        }
    }, [dispatch, data?.length]);

    useEffect(() => {
        dispatch(getTriageWaitingList());
    }, [dispatch]);

    useEffect(() => {
        dispatch(getConsultationRoomListSlice());

    }, [dispatch]);


    const filteredConsultationRooms = useMemo(
        () => consultationRoomList.filter(room => room?.Status === 'Completed'),
        [consultationRoomList]
    );

    const formattedTriageWaitingList = useMemo(() => {
        return triageWaitingList?.map(patient => ({
            PatientNo: patient?.PatientNo,
            SearchName: patient?.SearchName,
        }));
    }, [triageWaitingList]);

    const formattedDoctorDetails = useMemo(() => {
        return data?.map(doctor => ({
            DoctorID: doctor?.DoctorID,
            DoctorsName: doctor?.DoctorsName,
        }));
    }, [data]);

    const combinedList = useMemo(() => {
        return filteredConsultationRooms?.map(room => {
            const matchingPatient = formattedTriageWaitingList?.find(patient => patient?.PatientNo === room?.PatientNo);
            return {
                ...room,
                PatientNo: room?.PatientNo,
                SearchName: matchingPatient ? matchingPatient?.SearchName : null,
            };
        });
    }, [filteredConsultationRooms, formattedTriageWaitingList]);

    const combinedListWithDoctors = useMemo(() => {
        return combinedList?.map(item => {
            const matchingDoctor = formattedDoctorDetails?.find(doctor => doctor?.DoctorID === item?.DoctorID);
            return {
                ...item,
                DoctorsName: matchingDoctor ? matchingDoctor?.DoctorsName : null,
            };
        });
    }, [combinedList, formattedDoctorDetails]);

    return {
        loadingConsultationRoomList,
        filteredConsultationRooms,
        formattedTriageWaitingList,
        formattedDoctorDetails,
        combinedList,
        combinedListWithDoctors,
    };
};

export default useFetchPastDoctorVisitsHook;
