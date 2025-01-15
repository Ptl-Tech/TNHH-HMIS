import { Card, Col, Row, Typography } from "antd";
import useAuth from "../../hooks/useAuth";
import { useLocation } from "react-router-dom";
import NurseInnerHeader from "../../partials/nurse-partials/NurseInnerHeader";
import Loading from "../../partials/nurse-partials/Loading";
import { convertTime } from "../../utils/helpers";
import DOMPurify from 'dompurify';

const ReadNurseNotes = () => {
    const { loadingGetNurseAdmissionNotes, filterNurseNotes, patientDetails } = useLocation().state;
    
    const role = useAuth().userData.departmentName; // Get user role from useAuth hook
    if (role !== "Nurse" && role !== "Doctor") {
      return <div>Access Denied</div>;
    }

    const patientInfo = [
        { title: 'Patient Name', value: patientDetails?.SearchName },
        { title: 'Age in years', value: `${patientDetails?.AgeinYears} Years` },
        { title: 'Gender', value: patientDetails?.Gender },
      ];

      const renderNotes = (notes) => {
        if (!notes) return null;
        // Sanitize and render HTML safely
        const sanitizedHtml = DOMPurify.sanitize(notes);
        return <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
        };
    
  return (
    <>
    
      <NurseInnerHeader title="Read Nurse Notes" />

        <Row gutter={16} style={{ marginTop: '20px' }}>
        {patientInfo.map((info, index) => (
        <Col key={index} xs={24} sm={24} md={12} lg={8} xl={8} >
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

export default ReadNurseNotes