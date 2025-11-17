import { Button } from "antd";  
import { SyncOutlined } from "@ant-design/icons";
const ResetButton = ({reset}) => {
  return (
    <Button type="primary" block icon={<SyncOutlined />} onClick={reset}>
      重置
    </Button>
  );
};

export default ResetButton;
