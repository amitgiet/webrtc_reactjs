import React, { useState, useEffect, useRef } from "react";

import AddNameAndSkillModal from "./AddNameAndSkillModal";
import ScreenRecorder from "./screenRecorder/screenRecorder";
import ScreenWithVideoRecorder from "./screenWithVideoRecorder/screenWithVideoRecorder";
import VideoRecorder from "./videoRecorder/videoRecorder";
import { message, Modal, Tabs, Progress } from "antd";
const Recorder = ({
  visible,
  setModalVisible,
  setRecordedBlob,
  addAssetsCallback,
  assetLength,
  cb,
}) => {
  const [activeTab, setActiveTab] = useState("record-video");
  const [recorder, setRecorder] = useState();
  const [screenStream, setScreenStream] = useState();
  const [blob, setBlob] = useState();
  const [uploadBlob, setUploadBlob] = useState();

  const [progress, setProgress] = useState(0);
  // const dispatch = useDispatch();
  // const user = useSelector(state => state.auth.user.localUserId);

  const [skillModalVisisble, setSkillModalVisisble] = useState(false);
  const videoRef = useRef();

  useEffect(() => {
    setRecordedBlob && setRecordedBlob(blob); //Info: for quizplayer
  }, [blob, setRecordedBlob]);

  useEffect(() => {
    if (visible) {
      setActiveTab("record-video");
    }
  }, [visible]);

  const onModalCancel = () => {
    setModalVisible(false);
    setActiveTab("");
    screenStream && screenStream.getTracks().forEach((track) => track.stop());
    if (videoRef.current?.src) {
      videoRef.current.src = null;
      videoRef.current.srcObject = null;
      videoRef.current.muted = false;
    }
    recorder && recorder.stopRecording();
  };

  const onTabChange = (e) => {
    setActiveTab(e);
    screenStream && screenStream.getTracks().forEach((track) => track.stop());
    if (videoRef.current?.src) {
      videoRef.current.src = null;
      videoRef.current.srcObject = null;
      videoRef.current.muted = true;
    }
    recorder && recorder.stopRecording();
  };

  const onSaveCallBack = async (assetName, successCallback) => {
    const name = "adsds";
    const fileObject = new File([uploadBlob], name, {
      type: "video/webm",
      lastModified: Date.now(),
    });
  };

  return (
    <>
      <AddNameAndSkillModal
        setModalVisible={setSkillModalVisisble}
        visible={skillModalVisisble}
        onSaveCallBack={onSaveCallBack}
        progress={progress}
        setProgress={setProgress}
        uploadBlob={uploadBlob}
      />
      <Modal
        title="Record Video"
        centered
        width={700}
        visible={visible}
        footer={false}
        className="asset-modal"
        maskClosable={false}
        onCancel={onModalCancel}
      >
        <Tabs
          defaultActiveKey="record-video"
          activeKey={activeTab}
          onChange={onTabChange}
          style={{ width: "100%" }}
        >
          <Tabs.TabPane key="record-video" tab="Record Video">
            <VideoRecorder
              setScreenStream={setScreenStream}
              activeTab={activeTab}
              setBlob={setBlob}
              setModalVisible={setModalVisible}
              setSkillModalVisisble={setSkillModalVisisble}
              ref={videoRef}
              setUploadBlob={setUploadBlob}
              setRecorder={setRecorder}
              setActiveTab={setActiveTab}
              cb={cb}
              onSaveCallBack={onSaveCallBack}
            />
          </Tabs.TabPane>
          <Tabs.TabPane key="screen-record" tab="Screen Record">
            <ScreenRecorder
              setScreenStream={setScreenStream}
              activeTab={activeTab}
              setBlob={setBlob}
              setModalVisible={setModalVisible}
              setSkillModalVisisble={setSkillModalVisisble}
              ref={videoRef}
              setActiveTab={setActiveTab}
              setUploadBlob={setUploadBlob}
              setRecorder={setRecorder}
              cb={cb}
              onSaveCallBack={onSaveCallBack}
            />
          </Tabs.TabPane>
          <Tabs.TabPane key="screen-video-record" tab="Screen + Video Record">
            <ScreenWithVideoRecorder
              setScreenStream={setScreenStream}
              activeTab={activeTab}
              setBlob={setBlob}
              setModalVisible={setModalVisible}
              setSkillModalVisisble={setSkillModalVisisble}
              ref={videoRef}
              setActiveTab={setActiveTab}
              setRecorder={setRecorder}
              setUploadBlob={setUploadBlob}
              cb={cb}
              onSaveCallBack={onSaveCallBack}
            />
          </Tabs.TabPane>
        </Tabs>
      </Modal>
    </>
  );
};

export default Recorder;
