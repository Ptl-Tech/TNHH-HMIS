import React, { useState, useEffect } from "react";
import { Spin } from "antd";

const PDFViewer = ({ base64String }) => {
  const [loading, setLoading] = useState(true);

  if (!base64String) return null;

  const pdfSrc = `data:application/pdf;base64,${base64String}`;

  useEffect(() => {
    setLoading(true);
  }, [base64String]);

  return (
    <div style={{ position: "relative", width: "100%", height: "500px" }}>
      {/* Show Spinner while PDF is loading */}
      {loading && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1,
          }}
        >
          <Spin size="large" />
        </div>
      )}

      {/* PDF Viewer */}
      <iframe
        src={pdfSrc}
        width="100%"
        height="500px"
        title="PDF Viewer"
        onLoad={() => setLoading(false)} // Hide spinner when PDF loads
        style={{ display: loading ? "none" : "block" }}
      />
    </div>
  );
};

export default PDFViewer;
