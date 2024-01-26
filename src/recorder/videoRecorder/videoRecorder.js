import React, { useEffect, useState } from "react";
import "./videoRecorder.scss";
import Countdown from "../Countdown";
import { RecordRTCPromisesHandler } from "recordrtc";
import { Button, Spin } from "antd";
let recorder;

const VideoRecorder = React.forwardRef(
  (
    {
      setScreenStream,
      activeTab,
      setBlob,
      setModalVisible,
      setSkillModalVisisble,
      setUploadBlob,
      setRecorder,
      cb,
      onSaveCallBack,
    },
    videoRef
  ) => {
    useEffect(() => {
      if (activeTab !== "record-video") {
        setDisplayStartButton(true);
      }
    }, [activeTab]);
    const [stream, setStream] = useState();
    const [displayStartButton, setDisplayStartButton] = useState(true);
    const [recordAgainBtn, setRecordAgainBtn] = useState(false);
    const [countDown, setCountDown] = useState(false);

    const startScreenRecording = async () => {
      setRecordAgainBtn(false);

      let camera;
      try {
        camera = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
      } catch (e) {
        alert("please give access to microphone and camera");
      }

      setStream(camera);
      setScreenStream(camera);

      recorder = new RecordRTCPromisesHandler(camera, {
        type: "video",
      });
      setRecorder(recorder);

      recorder.startRecording();

      videoRef.current.muted = true;
      videoRef.current.volume = 1;
      videoRef.current.currentTime = 0;
      videoRef.current.srcObject = camera; // attaching ongoing recording to video player
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
      videoRef.current.muted = false;

      videoRef.current.src = URL.createObjectURL(blob);
      setBlob(URL.createObjectURL(blob));
      stream.getTracks().forEach((track) => track.stop());
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
        {true ? (
          <video
            ref={videoRef}
            controls
            autoPlay
            onPause={pauseScreenRecording}
            onPlay={resumeScreenRecording}
          />
        ) : (
          <div className="spin-container">
            <Spin />
          </div>
        )}
        {!recordAgainBtn ? (
          <div className="screen-reocrd-footer">
            <Button
              className="default-btn"
              ghost
              type="primary"
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

export default VideoRecorder;
