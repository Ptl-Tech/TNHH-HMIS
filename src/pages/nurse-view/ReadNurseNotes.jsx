import { Button, Card, Col, Row, Typography } from "antd";
import { useLocation } from "react-router-dom";
import NurseInnerHeader from "../../partials/nurse-partials/NurseInnerHeader";
import Loading from "../../partials/nurse-partials/Loading";
import { convertTime } from "../../utils/helpers";
import DOMPurify from 'dompurify';
import moment from "moment";
import { FileAddOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { getNurseAdmissionNotesSlice } from "../../actions/nurse-actions/getNurseAdmissionNotesSlice";
import { useEffect } from "react";
// import useAuth from "../../hooks/useAuth";

const ReadNurseNotes = () => {
    const { patientDetails } = useLocation().state;
    const invalidDate = "0001-01-01";
    const dispatch = useDispatch();
    const role = null.userData.departmentName
    
    const { loadingGetNurseAdmissionNotes, getNurseNotes } = useSelector((state) => state.getNurseAdmissionNotes);

    const filterNurseNotes = getNurseNotes?.filter((note) => note?.AdmissionNo === patientDetails?.Admission_No);

    console.log('patient details', patientDetails)

    const formatDate = (date) => {
        if (
          moment(date).isValid() &&
          patientDetails?.Expected_Date_of_Discharge !== invalidDate
        ) {
          return moment(date).format('dddd, MMMM Do, YYYY');
        } else {
          return 'N/A';
        }
      };
    

    const patientInfo = [
        { title: 'Patient Name', value: patientDetails?.PatientName },
        { title: 'Admitting Doctor', value: patientDetails?.DoctorsName },
        { title: 'Admission Date', value: formatDate(patientDetails?.Admission_Date) },
        { title: 'Expected Discharge Date', value: formatDate(patientDetails?.Expected_Date_of_Discharge) },
      ];

      const renderNotes = (notes) => {
        if (!notes) return null;
        // Sanitize and render HTML safely
        const sanitizedHtml = DOMPurify.sanitize(notes);
        return <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
        };

        useEffect(() => {
            if(!getNurseNotes?.length){
              dispatch(getNurseAdmissionNotesSlice());
            }
          }, [dispatch, patientDetails?.CurrentAdmNo, getNurseNotes?.length]);
    
  return (
    <>
    
      <NurseInnerHeader title="Read Nurse Notes" />

        { 
            role === 'Nurse' && (
                <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
                {patientInfo.map((info, index) => (
                <Col key={index} xs={24} sm={24} md={12} lg={6} xl={6} >
                <Card style={{ padding: '10px 16px', borderTop: '3px solid #0f5689' }}>
                <Typography.Title level={5}>
                {info.title}
                </Typography.Title>
                <Typography.Text>
                {info.value}
                </Typography.Text>
                </Card>
                </Col>
                ))}
                </Row>
            )
        }

        {
            loadingGetNurseAdmissionNotes ? (
                <Loading />
            ): (
                <div style={{ border: '1px solid #ddd', borderRadius: '4px', overflow: 'hidden', fontWeight: 'bold', marginTop: '20px' }}>
            <Row style={{ backgroundColor: '#0f5689', padding: '10px 0' }} justify="center">
                <Col span={4} style={{ borderRight: '1px solid #ddd', textAlign: 'center'}}>
                    Date
                </Col>
                <Col span={4} style={{ borderRight: '1px solid #ddd', textAlign: 'center' }}>
                    Time
                </Col>
                <Col span={12} style={{ borderRight: '1px solid #ddd', textAlign: 'center'}}>
                    Notes
                </Col>
                <Col span={4} style={{ textAlign: 'center'}}>
                    Created By
                </Col>
            </Row>

        {
        (filterNurseNotes && filterNurseNotes.length > 0) ? (
        filterNurseNotes.map((note, index) => (
        <Row key={index} style={{ padding: '10px 0', borderBottom: '1px solid #ddd', color: 'black', fontWeight: 'normal' }} justify="center">
        <Col span={4} style={{ borderRight: '1px solid #ddd', textAlign: 'center' }}>
        {note?.NotesDate}
        </Col>
        <Col span={4} style={{ borderRight: '1px solid #ddd', textAlign: 'center' }}>
        {convertTime(note?.NotesTime)}
        </Col>
        <Col span={12} style={{ borderRight: '1px solid #ddd', textAlign: 'center' }}>
        {renderNotes(note?.Notes)}
        </Col>
        <Col span={4} style={{ textAlign: 'center' }}>
        {note.NurseID}
        </Col>
        </Row>
        ))
        ) : (
        <Row justify="center" style={{ padding: '20px', textAlign: 'center', fontStyle: 'italic', color: 'black' }}>
        <Col>
            {
                role !== 'Nurse' ? (
                    <Typography.Text>Nothing to show</Typography.Text>
                ) : (
                    <Button variant="outlined" 
                        onClick={() => window.history.back()}
                        icon={<FileAddOutlined />}
                    >
                    Please Add Nurse Notes
            </Button>
                )
            }
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

export default ReadNurseNotes