import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

import { RiEdit2Fill } from "react-icons/ri";
import {
  Tabs,
  Space,
  Badge,
  Input,
  Select,
  Button,
  Tooltip,
  message,
  Table,
  Drawer,
} from "antd";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa6";

import { NoData } from "../../../components/NoData";

import {
  POST_DOCTOR_NOTES_RESET,
  postDoctorNotes,
} from "../../../actions/Doc-actions/postDoctorNotes";
import { getDoctorsNotesSections } from "../../../actions/Doc-actions/getDoctorNotesSections";
import { getQyInpatientProcessProceduresSlice } from "../../../actions/nurse-actions/getQyInpatientProcessProceduresSlice";
import { IoClose, IoCloseOutline } from "react-icons/io5";
import dayjs from "dayjs";

export const ConsultationNotes = () => {
  const dispatch = useDispatch();

  const searchParams = new URLSearchParams(useLocation().search);

  const treatmentNo =
    searchParams.get("TreatmentNo") || searchParams.get("AdmNo");

  const { loadingGetIpProcedure, ipGetProcedure } = useSelector(
    (state) => state.getQyInpatientProcessProcedure
  );
  const { data: doctorNotesSections } = useSelector(
    (state) => state.getDoctorNotesSections
  );

  const { data: postDoctorNotesData } = useSelector(
    (state) => state.postDoctorNotes
  );

  // Getting the section types and the doctor notes
  useEffect(() => {
    dispatch(getQyInpatientProcessProceduresSlice(treatmentNo));
    dispatch(getDoctorsNotesSections({ treatmentNo }));
  }, [postDoctorNotesData]);

  const items = [
    {
      key: 0,
      label: "Add Notes",
      children: (
        <AddConsultationNotes doctorNotesSections={doctorNotesSections} />
      ),
    },
    {
      key: 1,
      label: (
        <Space>
          <span>Check Notes</span>
          <Badge
            count={ipGetProcedure?.length}
            style={{ backgroundColor: "#b08444" }}
          />
        </Space>
      ),
      children: (
        <ViewConsultationNotes
          notes={ipGetProcedure}
          loading={loadingGetIpProcedure}
        />
      ),
    },
  ];

  return <Tabs type="card" items={items} />;
};

export const AddConsultationNotes = ({ doctorNotesSections }) => {
  const [editing, setEditing] = useState(false);
  const [SectionId, setSectionId] = useState(null);
  const [fullTranscript, setFullTranscript] = useState("");

  const dispatch = useDispatch();

  const {
    data: postDoctorNotesData,
    error: postDoctorNotesError,
    loading: postDoctorNotesLoading,
  } = useSelector((state) => state.postDoctorNotes);

  // Posting the doctor notes
  useEffect(() => {
    if (postDoctorNotesError) message.error(postDoctorNotesError);
    if (postDoctorNotesData)
      message.success("You have successfully posted the notes");

    if (postDoctorNotesData || postDoctorNotesError) {
      dispatch({ type: POST_DOCTOR_NOTES_RESET });
    }
  }, [postDoctorNotesData, postDoctorNotesError]);

  const searchParams = new URLSearchParams(useLocation().search);

  const patientNo = searchParams.get("PatientNo");
  const treatmentNo =
    searchParams.get("TreatmentNo") || searchParams.get("AdmNo");

  const {
    listening,
    transcript,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const replacePunctuation = (text) => {
    const withPunctuation = text
      .replace(/\bperiod\b/gi, ".")
      .replace(/\bcomma\b/gi, ",")
      .replace(/\bquestion mark\b/gi, "?")
      .replace(/\bexclamation mark\b/gi, "!")
      .replace(/\bnew line\b/gi, "\n")
      .replace(/\bcolon\b/gi, ":")
      .replace(/\bsemicolon\b/gi, ";");

    const noSpaceBeforePunctuation = withPunctuation
      // Remove spaces before punctuation
      .replace(/\s+([.,!?;:])/g, "$1");

    const capitalized = noSpaceBeforePunctuation
      // Capitalize the first letter and any letter after punctuation or new lines
      .replace(/(^\s*\w|(?<=[\.\?\!\n]\s*)\w)/g, (match) =>
        match.toUpperCase()
      );

    return capitalized;
  };

  const startListening = async () => {
    setEditing(false);
    await SpeechRecognition.startListening({ continuous: true });
  };

  const stopListening = async () => {
    await SpeechRecognition.stopListening();

    const processed = replacePunctuation(transcript);

    setFullTranscript((prevValue) => {
      return `${prevValue} ${processed}`.trim();
    });

    resetTranscript();
  };

  const toggleListening = async () => {
    listening ? await stopListening() : await startListening();
  };

  const handleEditTranscript = () => {
    setEditing(async (prevValue) => {
      if (!prevValue) await stopListening();
      return !prevValue;
    });
  };

  const finishEditing = () => {
    setEditing(false);
  };

  const handleSubmit = () => {
    const data = {
      myAction: "create",
      recId: "",
      patientNo,
      SectionId,
      treatmentNo,
      notesType: "1",
      notes: fullTranscript,
    };

    dispatch(postDoctorNotes(data));
  };

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Space>
        <Select
          placeholder="Choose Category"
          style={{ width: 320 }}
          onChange={setSectionId}
          options={doctorNotesSections.map(({ Section_ID, Section_Name }) => ({
            value: Section_ID,
            label: Section_Name,
          }))}
        />
        <Tooltip
          placement="top"
          title={
            listening
              ? "Stop Recording"
              : browserSupportsSpeechRecognition
              ? "Record"
              : "Please use the Chrome browser"
          }
        >
          <Button
            style={{
              position: "relative",
            }}
            onClick={toggleListening}
            disabled={!browserSupportsSpeechRecognition}
          >
            <div className="ping-container">
              {listening && (
                <>
                  <span className="heartbeat"></span>
                  <span className="dot"></span>
                </>
              )}
            </div>
            {listening ? (
              <FaMicrophoneSlash color="#DB0000" />
            ) : (
              <FaMicrophone color="#DB0000" />
            )}
          </Button>
        </Tooltip>
        <Tooltip placement="top" title={"Edit Transcript"}>
          <Button onClick={handleEditTranscript}>
            <RiEdit2Fill />
          </Button>
        </Tooltip>
        <Button
          type="primary"
          loading={postDoctorNotesLoading}
          disabled={
            listening || editing || !SectionId || !fullTranscript?.trim()
          }
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </Space>
      {editing ? (
        <Space direction="vertical" style={{ width: "100%" }}>
          <Input.TextArea
            autoSize
            value={fullTranscript}
            onChange={(e) => setFullTranscript(e.target.value)}
          />
          <Button type="primary" onClick={finishEditing}>
            Finish Editing
          </Button>
        </Space>
      ) : fullTranscript || transcript ? (
        <span>{replacePunctuation(`${fullTranscript} ${transcript}`)}</span>
      ) : (
        <NoData content="Press record | edit to start taking notes" />
      )}
    </Space>
  );
};

export const columns = [
  {
    title: "Notes Type",
    dataIndex: "Notes_Type",
    key: "Notes_Type",
  },
  {
    title: "User ID",
    dataIndex: "User_ID",
    key: "User_ID",
  },
  {
    title: "Created Date",
    dataIndex: "Created_Date",
    key: "Created_Date",
  },
  {
    key: "SystemId",
    title: "Actions",
    dataIndex: "SystemId",
    render: (_, record) => <NotesViewDrawer data={record} />,
  },
];

export const NotesViewDrawer = ({ data }) => {
  const [open, setOpen] = useState(false);

  return (
    <Space direction="vertical">
      <Button type="primary" onClick={() => setOpen(true)}>
        View Notes
      </Button>
      <Drawer
        title={`${data.Notes_Type} taken on ${dayjs(data.Created_Date).format(
          "dddd, DD MM YYYY"
        )}`}
        open={open}
        size="large"
        onClose={() => setOpen(false)}
        extra={
          <Button icon={<IoCloseOutline />} onClick={() => setOpen(false)} />
        }
        closeIcon={null}
      >
        <Space direction="vertical">
          <span className="fw-bolder">Content:</span>
          {data.Notes}
        </Space>
      </Drawer>
    </Space>
  );
};

export const ViewConsultationNotes = ({ loading, notes }) => {
  return (
    <Table
      loading={loading}
      columns={columns}
      style={{ width: "100%" }}
      dataSource={notes.sort((a, b) => a.LineNo - b.LineNo)}
    />
  );
};
