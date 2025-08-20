import { Spin } from "antd";

const Loading = () => {
  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: 50 }}>
      <Spin size="large" /> 
    </div>
  );
};

export default Loading;
