import { useState } from "react";
import Recorder from "./recorder";
import { Button } from "antd";
const App = () => {
  const [recordModalVisible, setRecordModalVisible] = useState(false);
  return (
    <div>
      {/* <img src={logo} className="App-logo" alt="logo" /> */}
      <Button onClick={() => setRecordModalVisible(true)}>open recorder</Button>
      <Recorder
        visible={recordModalVisible}
        setModalVisible={setRecordModalVisible}
      />
    </div>
  );
};

export default App;
