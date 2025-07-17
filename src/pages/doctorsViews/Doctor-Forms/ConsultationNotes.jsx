import { useState } from "react";

import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

import { RiEdit2Fill } from "react-icons/ri";
import { Button, Input, Space, Tooltip } from "antd";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa6";

import { NoData } from "../../../components/NoData";

export const ConsultationNotes = () => {
  const {
    listening,
    transcript,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  const [editing, setEditing] = useState(false);
  const [fullTranscript, setFullTranscript] = useState("");

  const startListening = async () => {
    setEditing(false);
    await SpeechRecognition.startListening({ continuous: true });
  };

  const stopListening = async () => {
    await SpeechRecognition.stopListening();

    setFullTranscript((prevValue) => {
      return `${prevValue} ${transcript}`.trim();
    });

    resetTranscript();
  };

  const toggleListening = async () => {
    listening ? await stopListening() : await startListening();
  };

  const handleEditTranscript = () => {
    setEditing(async () => {
      await stopListening();
      return true;
    });
  };

  const finishEditing = () => {
    setEditing(false);
  };

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Space>
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
            disabled={browserSupportsSpeechRecognition}
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
      </Space>
      {editing ? (
        <Space direction="vertical" style={{ width: "100%" }}>
          <Input.TextArea
            value={fullTranscript}
            onChange={(e) => setFullTranscript(e.target.value)}
          />
          <Button type="primary" onClick={finishEditing}>
            Finish Editing
          </Button>
        </Space>
      ) : fullTranscript || transcript ? (
        <span>{`${fullTranscript} ${transcript}`.split()}</span>
      ) : (
        <NoData content="Press record | edit to start taking notes" />
      )}
    </Space>
  );
};
