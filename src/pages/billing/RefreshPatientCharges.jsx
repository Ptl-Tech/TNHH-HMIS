import React, { useEffect } from 'react';
import { Button, notification } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import useAuth from '../../hooks/useAuth';
import {
  postRefreshPatientCharges,
  POST_REFRESH_PATIENT_CHARGES_RESET,
} from '../../actions/Charges-Actions/postRefreshCharges';

const RefreshPatientCharges = ({ patientNo, activeVisitNo }) => {
  const dispatch = useDispatch();
  const userDetails = useAuth();

  const { loading, success, error } = useSelector((state) => state.postRefreshCharges);

  const handleRefreshCharges = () => {
    const payload = {
      patientNo,
      visitNo: activeVisitNo,
      staffNo: userDetails?.userData?.no,
      branchCode:
        userDetails?.userData?.shortcut_Dimension_1_Code ||
        localStorage.getItem('branchCode')?.toLowerCase(),
    };

    dispatch(postRefreshPatientCharges(payload));
  };

  useEffect(() => {
    if (success) {
      notification.success({
        message: 'Charges Updated',
        description: 'Patient charges were refreshed successfully.',
        placement: 'topRight',
        duration: 5,
      });
      dispatch({ type: POST_REFRESH_PATIENT_CHARGES_RESET });
    }

    if (error) {
      notification.error({
        message: 'Charge Refresh Failed',
        description: error?.message || 'Something went wrong during the refresh process.',
        placement: 'topRight',
        duration: 6,
      });
      dispatch({ type: POST_REFRESH_PATIENT_CHARGES_RESET });
    }
  }, [success, error, dispatch]);

  return (
    <Button type="primary" loading={loading} onClick={handleRefreshCharges}>
      {loading ? 'Refreshing Charges...' : 'Refresh Charges'}
    </Button>
  );
};

export default RefreshPatientCharges;
