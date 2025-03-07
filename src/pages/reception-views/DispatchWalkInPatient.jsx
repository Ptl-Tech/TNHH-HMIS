import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import InfoRow from './Tables/InfoRow';
import DispatchesTable from './Tables/DispatchTable';
import { Button, Col, Divider, message, Row, Typography } from 'antd';
import LaboratoryDispatchDrawer from './Drawers/LaboratoryDispatchDrawer';

import {
  POST_LAB_TEST_LINES_RESET,
  postLabTestLines,
} from '../../actions/lab-actions/postLabTestLines';
import {
  POST_LAB_TEST_LINES_UPDATE_RESET,
  updateLabTestLines,
} from '../../actions/lab-actions/updateLabTestLines';
import Loading from '../../partials/nurse-partials/Loading';
import { createTriageVisit } from '../../actions/patientActions';
import { TRIAGE_VISIT_RESET } from '../../constants/patientConstants';
import { getLabRequest } from '../../actions/lab-actions/getLabRequest';
import { getSinglePatient } from '../../actions/reception-actions/getSinglePatient';
import { createLabTestHeader } from '../../actions/lab-actions/createLabTestHeader';
import { POST_LAB_HEADER_RESET } from '../../actions/lab-actions/createLabTestHeader';
import { postPharmacyHeader } from '../../actions/pharmacy-actions/postPharmacyHeader';

export const DispatchWalkInPatient = () => {
  const { pathname } = useLocation();

  const patientId = pathname.split('/').splice(-1, 1)[0];
  const [openLabDispatch, setOpenLabDispatch] = useState(false);

  const { data: postLabTesLinesData, error: postLabTesLinesError } =
    useSelector((state) => state.postLabTestLines);

  // These clinics are as they are described in the backend
  const clinics = ['LAB', 'PHARMACY', 'PSYCHIATRIST', 'PSYCHOLOGIST'];

  const dispatch = useDispatch();

  const { data: existingPatient } = useSelector(
    (state) => state.getSinglePatient,
  );
  const [currentLabKeys, setCurrentLabKeys] = useState([]);
  const [currentLabRecord, setCurrentLabRecord] = useState(null);
  const [currentPharmacyRecord, setCurrentPharmacyRecord] = useState(null);

  const {
    loading: visitLoading,
    error: visitError,
    success: visitSuccess,
    data: visitPayload,
  } = useSelector((state) => state.createTriageVisit);
  const {
    data: labTestHeaderData,
    loading: labTestHeaderLoading,
    error: labTestHeaderError,
  } = useSelector((state) => state.createLabTestHeader);
  const {
    data: labHeaderData,
    error: labHeaderError,
    loading: labHeaderLoading,
  } = useSelector((state) => state.getLabRequest);
  const {
    data: updateLabTestLinesData,
    error: updateLabTestLinesError,
    loading: updateLabTestLinesLoading,
  } = useSelector((state) => state.updateLabTestLines);

  // handles getting the lab request that exists
  useEffect(() => {
    if (existingPatient?.ActiveVisitNo || labTestHeaderData) {
      dispatch(getLabRequest('LinkNo', existingPatient?.ActiveVisitNo));
    }
  }, [existingPatient?.ActiveVisitNo, labTestHeaderData]);

  // handles creating the visit
  useEffect(() => {
    if (!existingPatient || patientId !== existingPatient.PatientNo) {
      dispatch(getSinglePatient(patientId));
    }

    if (visitError || visitSuccess) dispatch({ type: TRIAGE_VISIT_RESET });

    if (visitLoading) message.info('Creating a visit and creating a request.');

    if (visitSuccess) {
      createLabHeader();
    }

    if (visitError)
      message.error('Patient visit could not be created. Please try again');
  }, [existingPatient, visitSuccess, visitError]);

  // handles creating the lab header
  useEffect(() => {
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

  // handles creating the lab test lines
  useEffect(() => {
    if (postLabTesLinesData) {
      message.success('The request has been dispatched successfully');
      dispatch({ type: POST_LAB_HEADER_RESET });
      dispatch({ type: POST_LAB_TEST_LINES_RESET });
    }

    if (postLabTesLinesError) {
      message.error('Something went wrong while creating the lab test lines');
      dispatch({ type: POST_LAB_TEST_LINES_RESET });
    }
  }, [postLabTesLinesData, postLabTesLinesError]);

  // handles updating the lab test lines
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

  const createLabHeader = () => {
    // after creatnig the visit if it did not exist, then we need to create the lab header
    const dataToSubmit = {
      myAction: 'create',
      cashSale: false,
      visitNo: existingPatient.ActiveVisitNo,
      patientNo: existingPatient.PatientNo,
      status: 0, //0 means NEW
    };

    dispatch(createLabTestHeader(dataToSubmit));
  };

  const handleOpenLab = (recordNo) => {
    setOpenLabDispatch(true);
    if (recordNo) setCurrentLabRecord(recordNo);
  };

  const handleEdit = async (initialKeys, currentKeys) => {
    console.log({ initialKeys });

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

  const handleLabSubmit = async (keys) => {
    setCurrentLabKeys(keys);

    // first create a visit so that we can have an appointment no AKA a visit no. only if we did not have it
    if (!existingPatient.ActiveVisitNo) {
      const {
        PatientNo,
        PatientType,
        InsuranceNo,
        InsuranceName,
        PrincipalMemberName,
        Principal,
        MembershipNo,
        SchemeName,
      } = existingPatient;

      const dataToCreateVisit = {
        patientNo: PatientNo,
        clinic: clinics[0],
        doctor: '',
        paymentMode: PatientType === 'Cash' ? 0 : 1,
        insuranceNo: InsuranceNo,
        insuranceName: InsuranceName,
        insurancePrincipalMemberName: PrincipalMemberName || '',
        isPrincipleMember: Principal,
        membershipNo: MembershipNo,
        schemeName: SchemeName,
      };

      dispatch(createTriageVisit(dataToCreateVisit));
    } else {
      // we want to call the function that creates a lab header
      createLabHeader();
    }
  };

  const handleDispatchPharmacy = () => {
    // TODO: Create Pharmacy Header by prepping the data
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
              disabled: (value) => false,
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
  ];

  const tableData = [
    getArrayItem(labHeaderData, newLabHeaderDataValues),
  ].reduce((acc, curr) => {
    return curr ? [...acc, curr] : acc;
  }, []);

  const generateCellData = (cellData, index) => {
    return (
      <>
        {cellData.type === 'content' ? (
          <InfoRow
            key={index}
            cellData={cellData}
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
