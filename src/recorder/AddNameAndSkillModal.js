import { useState } from "react";
import { Button, Form, Input, message, Modal, Progress } from "antd";
// import { ReactComponent as CheckIcon } from "../../../../images/CheckIcon.svg";
import { saveAs } from "file-saver";
const AddNameAndSkillModal = ({
  visible,
  setModalVisible,
  onSaveCallBack,
  progress,
  setProgress,
  uploadBlob,
}) => {
  const [btnLoading, setBtnLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (value) => {
    console.log("enside");
    const successCallback = () => {
      setBtnLoading(false);
      setModalVisible(false);
      message.success({
        content: `${value.assetname} Video Published`,
        className: "success-msg",
        // icon: <CheckIcon />,
      });
      form.resetFields();
      setProgress(0);
    };
    setBtnLoading(true);
    await onSaveCallBack(value.assetname, successCallback);
  };
  const onFinishFailed = (errorInfo) => {
    setProgress(0);
    console.log("Failed:", errorInfo);
  };
  const handleSaveInDevice = () => {
    saveAs(uploadBlob, "file name");
    setProgress(0);
    setModalVisible(false);
    form.resetFields();
  };
  return (
    <Modal
      title="Recording"
      centered
      visible={visible}
      footer={false}
      closable={false}
      className="asset-modal"
      width={650}
    >
      <Form
        form={form}
        name="recording-form"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        className="validate-form"
        requiredMark={false}
      >
        <Form.Item
          label="Enter Name"
          name="assetname"
          rules={[{ required: true, message: "Please add name!" }]}
        >
          <Input size="large" className="mb-10" />
        </Form.Item>

        <Form.Item className="w-100" wrapperCol={{ span: 24 }}>
          <div className="form-footer">
            <Button
              type="primary"
              className="default-btn mr-10"
              ghost
              onClick={() => {
                setProgress(0);
                setModalVisible(false);
                form.resetFields();
                setBtnLoading(false);
              }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              className="default-btn mr-10"
              onClick={() => {
                handleSaveInDevice();
              }}
            >
              Save in device
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddNameAndSkillModal;
