import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPgBedsSlice } from "../actions/nurse-actions/getPgBedsSlice";
import { getPgWardsListSlice } from "../actions/nurse-actions/getPgWardsListSlice";
import { getPgWardRoomsSetupSlice } from "../actions/nurse-actions/getPgWardRoomsSetupSlice";

    export function useGetWardManagementHook () {
      const dispatch = useDispatch();
    
      // Selectors for Redux state
      const { loadingWards, getWards } = useSelector(state => state.getPgWardsList);
      const { wardRooms } = useSelector(state => state.getPgWardRoomsSetup);
      const { getBeds } = useSelector(state => state.getPgBeds);
    
      // Dispatch Redux actions based on the state
      useEffect(() => {
        if (!getBeds?.length) {
          dispatch(getPgBedsSlice());
        }
      }, [dispatch, getBeds?.length]);
    
      useEffect(() => {
        if (!getWards?.length) {
          dispatch(getPgWardsListSlice());
        }
      }, [dispatch, getWards]);
    
      useEffect(() => {
        if (!wardRooms?.length) {
          dispatch(getPgWardRoomsSetupSlice());
        }
      }, [dispatch, wardRooms]);
    
      return {
        loadingWards,
        getWards,
        wardRooms,
        getBeds,
      };
    }
    