import { Image, Space } from "antd";
import TNHHLogo from "../assets/images/TNHHLogo.png";

export const LoadingPage = () => {
  return (
    <div
      direction="vertical"
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="d-flex loading-logo" style={{ flexDirection: "column", gap: "4px" }}>
        <Image
          width={200}
          height={"auto"}
          preview={false}
          src={TNHHLogo}
          alt="TNHH Hospital Logo"
        />
      </div>
    </div>
  );
};
