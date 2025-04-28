import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Button, Col, Divider, message, Row, Typography } from 'antd';

import InfoRow from './Tables/InfoRow';
import {
  GET_LAB_REQUEST_RESET,
  getLabRequest,
} from '../../actions/lab-actions/getLabRequest';
import {
  POST_LAB_TEST_LINES_RESET,
  postLabTestLines,
} from '../../actions/lab-actions/postLabTestLines';
import DispatchesTable from './Tables/DispatchTable';
import {
  POST_LAB_TEST_LINES_UPDATE_RESET,
  updateLabTestLines,
} from '../../actions/lab-actions/updateLabTestLines';
import {
  createLabTestHeader,
  POST_LAB_HEADER_RESET,
} from '../../actions/lab-actions/createLabTestHeader';
import {
  POST_PHARMACY_HEADER_RESET,
  postPharmacyHeader,
} from '../../actions/pharmacy-actions/postPharmacyHeader';
import Loading from '../../partials/nurse-partials/Loading';
import LaboratoryDispatchDrawer from './Drawers/LaboratoryDispatchDrawer';
import { getSinglePatient } from '../../actions/reception-actions/getSinglePatient';
import { getSinglePharmacyRecord } from '../../actions/pharmacy-actions/getSinglePharmacyRecord';

export const DispatchWalkInPatient = () => {
  const { pathname } = useLocation();

  const ActiveVisitNo = pathname.split('/').splice(-1, 1)[0];
  const [openLabDispatch, setOpenLabDispatch] = useState(false);

  // These clinics are as they are described in the backend
  const clinics = ['LAB', 'PHARMACY', 'PSYCHIATRIST', 'PSYCHOLOGIST'];

  const dispatch = useDispatch();

  const [currentLabKeys, setCurrentLabKeys] = useState([]);
  const [currentLabRecord, setCurrentLabRecord] = useState(null);

  const { data: existingPatient } = useSelector(
    (state) => state.getSinglePatient,
  );
  const { data: postLabTestLinesData, error: postLabTestLinesError } =
    useSelector((state) => state.postLabTestLines);
  const {
    data: labTestHeaderData,
    loading: labTestHeaderLoading,
    error: labTestHeaderError,
  } = useSelector((state) => state.createLabTestHeader);
  const {
    data: pharamcyHeaderData,
    loading: pharmacyHeaderLoading,
    error: pharamcyHeaderError,
  } = useSelector((state) => state.postPharmacyHeader);
  const {
    data: labHeaderData,
    error: labHeaderError,
    loading: labHeaderLoading,
  } = useSelector((state) => state.getLabRequest);
  const {
    data: pharmacyRecord,
    error: pharmacyRecordError,
    loading: pharmacyRecordLoading,
  } = useSelector((state) => state.getSinglePharmacyRecord);
  const {
    data: updateLabTestLinesData,
    error: updateLabTestLinesError,
    loading: updateLabTestLinesLoading,
  } = useSelector((state) => state.updateLabTestLines);

  console.log({ pharmacyRecord });

  // handles getting the lab request that exists and the pharmacyRequest that exists
  useEffect(() => {
    // We are resetting so that we can get fresh requests
    dispatch({ type: GET_LAB_REQUEST_RESET });

    dispatch(getLabRequest('LinkNo', existingPatient?.ActiveVisitNo));

    dispatch(getSinglePharmacyRecord('Patient_No', existingPatient?.PatientNo));
    if (existingPatient?.ActiveVisitNo !== ActiveVisitNo) {
      dispatch(getSinglePatient('ActiveVisitNo', ActiveVisitNo));
    }
  }, [existingPatient, labTestHeaderData, ActiveVisitNo]);

  // 1. This function creates a lab header
  const handleLabSubmit = async (keys) => {
    setCurrentLabKeys(keys);

    const dataToSubmit = {
      myAction: 'create',
      cashSale: false,
      visitNo: existingPatient.ActiveVisitNo,
      patientNo: existingPatient?.PatientNo,
      status: 0, //0 means NEW
    };

    dispatch(createLabTestHeader(dataToSubmit));
  };

  // 2. handles what happens after creating the lab header data
  useEffect(() => {
    // we add lab test lines
    if (labTestHeaderData) {
      const { status, laboratoryNo } = labTestHeaderData;
      addLabTestLines(laboratoryNo);
    }

    if (existingPatient?.ActiveVisitNo && labTestHeaderLoading) {
      message.info('Creating the lab request');
    }

    if (labTestHeaderError) {
      message.error(
        'Something went wrong when creating a lab header, Please try again later.',
      );
      dispatch({ type: POST_LAB_HEADER_RESET });
    }
  }, [labTestHeaderError, labTestHeaderLoading, labTestHeaderData]);

  // 2. Handles what happens after creating the pharmacy header data
  useEffect(() => {
    // if we were successful
    if (pharamcyHeaderData) {
      dispatch(
        getSinglePharmacyRecord('Patient_No', existingPatient?.PatientNo),
      );
      dispatch({ type: POST_PHARMACY_HEADER_RESET });
      message.success('Pharmacy header posted successfully');
    }

    if (pharmacyHeaderLoading) {
      message.info('Posting the pharmacy header');
    }

    if (pharamcyHeaderError) {
      console.log({ pharamcyHeaderError });
      dispatch({ type: POST_PHARMACY_HEADER_RESET });
      message.error('Pharmacy header could not be posted');
    }
  }, [pharamcyHeaderData, pharamcyHeaderError, pharmacyHeaderLoading]);

  // 3. handles adding the lab test lines
  const addLabTestLines = (laboratoryNo) => {
    dispatch(
      postLabTestLines(
        laboratoryNo,
        currentLabKeys.map(({ Code }) => ({
          labTestCode: Code,
          specimenCode: '',
          unitOfMeasure: '',
        })),
      ),
    );
    setOpenLabDispatch(false);
  };

  // 4. handles what happens after the creation of the lab test lines
  useEffect(() => {
    if (postLabTestLinesData) {
      message.success('The request has been dispatched successfully');
      dispatch({ type: POST_LAB_HEADER_RESET });
      dispatch({ type: POST_LAB_TEST_LINES_RESET });

      getLabRequest('LinkNo', existingPatient.ActiveVisitNo);
    }

    if (postLabTestLinesError) {
      message.error('Something went wrong while creating the lab test lines');
      dispatch({ type: POST_LAB_TEST_LINES_RESET });
    }
  }, [postLabTestLinesData, postLabTestLinesError]);

  // handles confirming the update of the lab test line
  useEffect(() => {
    if (updateLabTestLinesData?.status === 'success') {
      message.success('The test lines have been updated successfully');
      dispatch({ type: POST_LAB_TEST_LINES_UPDATE_RESET });
    }

    if (updateLabTestLinesLoading) {
      message.info('Updating the lab test lines');
    }

    if (updateLabTestLinesError) {
      message.error('We could not update the lab test lines');
      dispatch({ type: POST_LAB_TEST_LINES_UPDATE_RESET });
    }
  }, [
    updateLabTestLinesData,
    updateLabTestLinesError,
    updateLabTestLinesLoading,
  ]);

  const handleOpenLab = (recordNo) => {
    setOpenLabDispatch(true);
    if (recordNo) setCurrentLabRecord(recordNo);
  };

  const handleEdit = async (initialKeys, currentKeys) => {
    const itemsToDelete = initialKeys
      .filter(
        (key) =>
          !currentKeys.find((item) => item.Code === key.LaboratoryTestCode),
      )
      .map((item) => ({
        ...item,
        myAction: 'delete',
        laboratoryNo: item.Laboratory_No,
        recId: item.SystemId,
        labTestCode: item.LaboratoryTestCode,
        specimenCode: '',
        unitOfMeasure: '',
      }));
    const itemsToAdd = currentKeys
      .filter(
        (key) =>
          !initialKeys.find((item) => item.LaboratoryTestCode === key.Code),
      )
      .map((item) => ({
        ...item,
        laboratoryNo: currentLabRecord,
        myAction: 'create',
        labTestCode: item.Code,
        specimenCode: '',
        unitOfMeasure: '',
      }));

    setOpenLabDispatch(false);

    dispatch(updateLabTestLines([...itemsToAdd, ...itemsToDelete]));
  };

  const handleDispatchPharmacy = () => {
    dispatch(
      postPharmacyHeader({
        myAction: 'create',
        cashSale: false,
        patientNo: existingPatient?.PatientNo,
        transactionType: '',
        inPatient: false,
      }),
    );
  };

  const rowData = [
    {
      title: 'Personal Details',
      data: [
        {
          type: 'content',
          highlighted: '#006d75',
          data: { label: 'Patient Number', value: 'PatientNo' },
        },
        {
          type: 'content',
          highlighted: '#fa8c16',
          data: { label: 'Full Name', value: 'SearchName' },
        },
        {
          type: 'content',
          data: { label: 'Gender', value: 'Gender' },
        },
        {
          type: 'content',
          data: { label: 'Residence', value: 'PlaceofBirthVillage' },
        },
        {
          type: 'content',
          data: { label: 'Email', value: 'Email' },
        },
        {
          type: 'content',
          data: { label: 'Phone Number', value: 'TelephoneNo1' },
        },
      ],
    },
    {
      title: 'Patient Status',
      data: [
        {
          type: 'content',
          highlighted: (value) => (value ? '#237804' : '#ad4e00'),
          data: { label: 'Appointment No', value: 'ActiveVisitNo' },
        },
        {
          type: 'content',
          highlighted: (value) => (value ? '#237804' : '#ad4e00'),
          data: { label: 'Activated', value: 'Activated' },
        },
        {
          type: 'content',
          highlighted: '#006d75',
          data: { label: 'Status', value: 'Status' },
        },
      ],
    },
    {
      title: 'Dispatches',
      data: [
        {
          type: 'buttons',
          data: [
            {
              buttonType: 'primary',
              data: {
                disabled: 'Dispatch to Lab',
                active: 'Dispatch to Lab',
              },
              style: {
                display: 'inline',
                width: 'fit-content',
              },
              onClick: () => handleOpenLab(),
              disabled: () => !!labHeaderData,
            },
            {
              buttonType: 'primary',
              data: {
                disabled: 'Dispatch to Pharmacy',
                active: 'Dispatch to Pharmacy',
              },
              style: {
                display: 'inline',
                width: 'fit-content',
              },
              onClick: () => handleDispatchPharmacy(),
              disabled: (value) => !!pharmacyRecord,
            },
          ],
        },
      ],
    },
  ];

  const getArrayItem = (initialItem, itemsToAdd) => {
    if (initialItem) {
      var newItem = { ...initialItem };
      itemsToAdd.map(
        (itemToAdd) => (newItem[itemToAdd['key']] = itemToAdd['value']),
      );
      return newItem;
    } else {
      return initialItem;
    }
  };

  const newLabHeaderDataValues = [
    { key: 'RequestType', value: 'LAB' },
    { key: 'RequestNo', value: labHeaderData?.LaboratoryNo },
    { key: 'CreationDate', value: labHeaderData?.LaboratoryDate },
    { key: 'CreationTime', value: labHeaderData?.LaboratoryTime },
    { key: 'PatientNo', value: labHeaderData?.PatientNo },
  ];

  const newPharmacyHeaderValues = [
    { key: 'RequestType', value: 'PHARMACY' },
    { key: 'RequestNo', value: pharmacyRecord?.Pharmacy_No },
    { key: 'CreationDate', value: pharmacyRecord?.Pharmacy_Date },
    { key: 'CreationTime', value: pharmacyRecord?.Pharmacy_Time },
    { key: 'PatientNo', value: pharmacyRecord?.Patient_No },
  ];

  const tableData = [
    getArrayItem(labHeaderData, newLabHeaderDataValues),
    getArrayItem(pharmacyRecord, newPharmacyHeaderValues),
  ].reduce((acc, curr) => {
    return curr ? [...acc, curr] : acc;
  }, []);

  const generateCellData = (cellData, index) => {
    return (
      <>
        {cellData.type === 'content' ? (
          <InfoRow
            key={index}
            cellData={{ ...cellData }}
            patientData={existingPatient}
          />
        ) : cellData.type === 'buttons' ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {cellData.data.map((button, index) => (
              <Button
                key={`button${index}`}
                style={button.style}
                type={button.buttonType}
                disabled={button.disabled(existingPatient?.Status)}
                onClick={() => button.onClick(existingPatient?.LaboratoryNo)}
              >
                {button.disabled ? button.data.disabled : button.data.active}
              </Button>
            ))}
          </div>
        ) : null}
      </>
    );
  };

  return (
    <div
      style={{
        display: 'grid',
        alignContent: 'flex-start',
        gap: '16px',
        padding: '16px',
      }}
    >
      <div
        style={{
          display: 'grid',
          alignContent: 'flex-start',
          gap: '8px',
        }}
      >
        <h4 style={{ color: '#3f3f3f' }}>Dispatch Patient</h4>
        {existingPatient ? (
          <Row gutter={[16, 16]}>
            {rowData.map((colData, index) => (
              <Col
                key={`${colData.title}${index}`}
                md={{ span: 8 }}
                xs={{ span: 24 }}
                style={{
                  display: 'grid',
                  alignContent: 'flex-start',
                  gap: '8px',
                }}
              >
                <Typography.Title
                  level={5}
                  style={{ color: '#0F5689' }}
                >
                  {colData.title}
                </Typography.Title>
                {colData.data.map((cellData, idx) =>
                  generateCellData(
                    cellData,
                    `$
              {index}${idx}`,
                    !!existingPatient?.ActiveVisitNo,
                  ),
                )}
              </Col>
            ))}
          </Row>
        ) : (
          <Loading />
        )}
      </div>
      <LaboratoryDispatchDrawer
        open={openLabDispatch}
        title={'Laboratory Dispatch'}
        onEdit={handleEdit}
        currentLabRecord={currentLabRecord}
        onClose={() => setOpenLabDispatch(false)}
        onSubmit={(keys) => handleLabSubmit(keys)}
      />
      <Divider orientation="left">
        <span style={{ color: '#0F5689' }}>Dispatches Made</span>
      </Divider>
      {existingPatient ? (
        <DispatchesTable
          data={tableData}
          loading={labHeaderLoading}
          handleOpenLab={handleOpenLab}
        />
      ) : null}
    </div>
  );
};
