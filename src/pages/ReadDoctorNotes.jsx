import { Col, Row } from "antd"
import NurseInnerHeader from "../partials/nurse-partials/NurseInnerHeader"
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listPatients } from "../actions/patientActions";
import { getPgTreatmentDoctorNotesSlice } from "../actions/nurse-actions/getPgTreatmentDoctorsNotesSlice";
import DOMPurify from 'dompurify';
import { convertTime } from "../utils/helpers";
import Loading from "../partials/nurse-partials/Loading";

const ReadDoctorNotes = () => {
  const [searchParams] = useSearchParams();
  const patientNo = searchParams.get('PatientNo');
  const dispatch = useDispatch();
  const { patients } = useSelector((state) => state.patientList);
  const filterPatient = patients.filter((patient) => patient.PatientNo === patientNo);
  const { loadingGetDoctorNotes, getDoctorNotes } = useSelector((state) => state.getPgTreatmentDoctorNotes);
  const doctorNotes = getDoctorNotes.filter((note) => note.PatientNo === patientNo);

  const renderNotes = (notes) => {
    if (!notes) return null;
    // Sanitize and render HTML safely
    const sanitizedHtml = DOMPurify.sanitize(notes);
    return <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
    };


  useEffect(() => {
      dispatch(getPgTreatmentDoctorNotesSlice())
  }, [dispatch]);

  useEffect(() => {
    dispatch(listPatients())
  }, [dispatch]);

  if(!patientNo){
    return <div>Patient No not found</div>
  };
  
  return (
    <>
    {/* <NurseInnerHeader title="Read Psychology Notes" /> */}

    {
        loadingGetDoctorNotes ? (
            <Loading />
        ) : (
            <div style={{ border: '1px solid #ddd', borderRadius: '4px', overflow: 'hidden', fontWeight: 'bold', marginTop: '20px' }}>
            <Row style={{ backgroundColor: '#0f5689', padding: '10px 0' }} justify="center">
                <Col span={4} style={{ borderRight: '1px solid #ddd', textAlign: 'center'}}>
                    Date
                </Col>
                <Col span={4} style={{ borderRight: '1px solid #ddd', textAlign: 'center' }}>
                    Time
                </Col>
                <Col span={4} style={{ borderRight: '1px solid #ddd', textAlign: 'center'}}>
                    Notes Type
                </Col>
                <Col span={8} style={{ borderRight: '1px solid #ddd', textAlign: 'center'}}>
                    Notes
                </Col>
                <Col span={4} style={{ textAlign: 'center'}}>
                    Created By
                </Col>
            </Row>

            {
                (doctorNotes && doctorNotes.length > 0) ? (
                    doctorNotes.map((note, index) => (
                        <Row key={index} style={{ padding: '10px 0', borderBottom: '1px solid #ddd', color: 'black', fontWeight: 'normal' }} justify="center">
                        <Col span={4} style={{ borderRight: '1px solid #ddd', textAlign: 'center' }}>
                        {note?.Treatment_Date}
                        </Col>
                        <Col span={4} style={{ borderRight: '1px solid #ddd', textAlign: 'center' }}>
                        {convertTime(note?.Treatment_Time)}
                        </Col>
                        <Col span={4} style={{ borderRight: '1px solid #ddd', textAlign: 'center' }}>
                        {note?.Notes_Type}
                        </Col>
                        <Col span={8} style={{ borderRight: '1px solid #ddd', textAlign: 'center' }}>
                        {renderNotes(note?.NotesTxt)}
                        </Col>
                        <Col span={4} style={{ textAlign: 'center' }}>
                        {note.User_ID}
                        </Col>
                        </Row>
                        ))
                ) :(
                    <Row justify="center" style={{ padding: '20px', textAlign: 'center', fontStyle: 'italic', color: 'black' }}>
                    <Col>
                    No records found
                    </Col>
                    </Row>
                )
                
            }
    </div>
        )
    }
    </>

  )
}

export default ReadDoctorNotes