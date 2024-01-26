import { Button } from "antd";
import React, { useEffect, useState } from "react";
import { RecordRTCPromisesHandler } from "recordrtc";
import Countdown from "../Countdown";
import "./screenRecorder.scss";

let recorder;

const ScreenRecorder = React.forwardRef(
  (
    {
      setScreenStream,
      activeTab,
      setBlob,
      setModalVisible,
      setSkillModalVisisble,
      setActiveTab,
      setUploadBlob,
      setRecorder,
      cb,
      onSaveCallBack,
    },
    videoRef
  ) => {
    const [stream, setStream] = useState();
    const [audioStream, setAudioStream] = useState();
    const [displayStartButton, setDisplayStartButton] = useState(true);
    const [recordAgainBtn, setRecordAgainBtn] = useState(false);
    const [countDown, setCountDown] = useState(false);

    useEffect(() => {
      if (activeTab !== "screen-record") {
        setDisplayStartButton(true);
      }
    }, [activeTab]);

    const startScreenRecording = async () => {
      setRecordAgainBtn(false);
      if (navigator.mediaDevices.getDisplayMedia) {
        navigator.mediaDevices
          .getDisplayMedia({
            video: true,
          })
          .then(async (screenStream) => {
            setStream(screenStream);
            let mic;
            try {
              mic = await navigator.mediaDevices.getUserMedia({
                audio: true,
                echoCancellation: true,
              });
            } catch (e) {
              alert("please give access to microphone");
            }
            screenStream.width = window.screen.width;
            screenStream.height = window.screen.height;
            screenStream.fullcanvas = true;
            setAudioStream(mic);

            if (mic) {
              setScreenStream(
                new MediaStream([
                  ...screenStream.getTracks(),
                  ...mic.getTracks(),
                ])
              );
            } else {
              setScreenStream(new MediaStream([...screenStream.getTracks()]));
            }

            if (mic) {
              recorder = new RecordRTCPromisesHandler([screenStream, mic], {
                type: "video",
              });
              setRecorder(recorder);
            } else {
              recorder = new RecordRTCPromisesHandler(screenStream, {
                type: "video",
              });
            }
            recorder.startRecording();

            videoRef.current.srcObject = screenStream; // attaching ongoing recording to video player
          })
          .catch((error) => {
            console.error(error);
          });
      }
    };

    const pauseScreenRecording = () => {
      recorder.pauseRecording();
    };
    const resumeScreenRecording = () => {
      recorder.resumeRecording();
    };

    const stopRecording = async () => {
      await recorder.stopRecording();
      let blob = await recorder.getBlob();
      setUploadBlob(blob);

      videoRef.current.src = null;
      videoRef.current.srcObject = null;
      videoRef.current.muted = true;

      videoRef.current.src = URL.createObjectURL(blob);
      setBlob(URL.createObjectURL(blob));
      let combinedMediaStream;
      if (audioStream) {
        combinedMediaStream = new MediaStream([
          ...stream.getTracks(),
          ...audioStream.getTracks(),
        ]);
      } else {
        combinedMediaStream = new MediaStream([...stream.getTracks()]);
      }

      combinedMediaStream
        .getTracks()
        .forEach((track) => console.log(track, "track"));
      combinedMediaStream.getTracks().forEach((track) => track.stop());
    };

    return displayStartButton ? (
      <div className="start-button-container">
        <Button
          className="start-record-button"
          onClick={() => {
            setDisplayStartButton(false);
            setCountDown(true);
          }}
        >
          Start Recording
        </Button>
      </div>
    ) : countDown ? (
      <div>
        <Countdown
          cb={() => {
            startScreenRecording();
            setCountDown(false);
          }}
        />
      </div>
    ) : (
      <div className="recorder-video-container">
        <video
          ref={videoRef}
          controls
          autoPlay
          onPause={pauseScreenRecording}
          onPlay={resumeScreenRecording}
        />
        {!recordAgainBtn ? (
          <div className="screen-reocrd-footer">
            <Button
              ghost
              type="primary"
              className="default-btn"
              onClick={() => {
                stopRecording();
                setRecordAgainBtn(true);
              }}
            >
              Stop Recording
            </Button>
          </div>
        ) : (
          <div className="screen-reocrd-footer">
            <Button
              ghost
              type="primary"
              className="default-btn"
              onClick={startScreenRecording}
            >
              Record Again
            </Button>
            <Button
              type="primary"
              style={{ marginLeft: "10px" }}
              className="default-btn"
              onClick={() => {
                stopRecording();
                setModalVisible(false);
                setActiveTab("record-video");
                videoRef.current.src = null;
                videoRef.current.srcObject = null;
                if (!cb) {
                  setSkillModalVisisble(true);
                } else {
                  onSaveCallBack();
                }
              }}
            >
              Save Recording
            </Button>
          </div>
        )}
      </div>
    );
  }
);

export default ScreenRecorder;
