import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTriageWaitingList } from "../actions/triage-actions/getTriageWaitingListSlice";

const useFetchAllPatientsHook = () => {
  const dispatch = useDispatch();

  const { loadingTriageWaitingList, triageWaitingList } = useSelector((state) => state.getTriageWaitingList) || {};

  useEffect(() => {
    dispatch(getTriageWaitingList())
  }, [dispatch]);

  return { loadingTriageWaitingList, triageWaitingList };
}

export default useFetchAllPatientsHook