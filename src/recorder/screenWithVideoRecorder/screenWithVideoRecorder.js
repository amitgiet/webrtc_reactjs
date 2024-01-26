import React, { useEffect, useState } from "react";
import "../screenRecorder/screenRecorder.scss";
import Countdown from "../Countdown";
import { RecordRTCPromisesHandler } from "recordrtc";
import { Button } from "antd";
let recorder;

const ScreenWithVideoRecorder = React.forwardRef(
  (
    {
      setScreenStream,
      activeTab,
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
      if (activeTab !== "screen-video-record") {
        setDisplayStartButton(true);
      }
    }, [activeTab]);
    const [stream, setStream] = useState();
    const [cameraStream, setCameraStream] = useState();
    const [displayStartButton, setDisplayStartButton] = useState(true);

    const [recordAgainBtn, setRecordAgainBtn] = useState(false);
    const [countDown, setCountDown] = useState(false);

    const startScreenRecording = async () => {
      setRecordAgainBtn(false);
      if (navigator.mediaDevices.getDisplayMedia) {
        navigator.mediaDevices
          .getDisplayMedia({
            video: true,
          })
          .then(async (screenStream) => {
            setStream(screenStream);
            let camera;
            try {
              camera = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: true,
                echoCancellation: true,
              });
            } catch (e) {
              alert("please give access to camera and microphone");
            }
            setCameraStream(camera);
            screenStream.width = window.screen.width;
            screenStream.height = window.screen.height;
            screenStream.fullcanvas = true;
            if (camera) {
              camera.width = 320;
              camera.height = 240;
              camera.top = screenStream.height - camera.height;
              camera.left = screenStream.width - camera.width;
              setScreenStream(
                new MediaStream([
                  ...screenStream.getTracks(),
                  ...camera.getTracks(),
                ])
              );
            } else {
              setScreenStream(new MediaStream([...screenStream.getTracks()]));
            }

            if (camera) {
              recorder = new RecordRTCPromisesHandler([screenStream, camera], {
                type: "video",
                previewStream: function (stream) {
                  videoRef.current.muted = true;
                  videoRef.current.srcObject = stream; // attaching ongoing recording to video player
                },
              });
            } else {
              recorder = new RecordRTCPromisesHandler(screenStream, {
                type: "video",
              });
            }
            setRecorder(recorder);

            recorder.startRecording();

            if (!camera) {
              videoRef.current.srcObject = screenStream; // attaching ongoing recording to video player
            }
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
      videoRef.current.muted = false;

      videoRef.current.src = URL.createObjectURL(blob);
      let combinedMediaStream;
      if (cameraStream) {
        combinedMediaStream = new MediaStream([
          ...stream.getTracks(),
          ...cameraStream.getTracks(),
        ]);
      } else {
        combinedMediaStream = new MediaStream([...stream.getTracks()]);
      }

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

export default ScreenWithVideoRecorder;
