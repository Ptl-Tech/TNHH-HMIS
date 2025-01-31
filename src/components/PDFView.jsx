import React from "react";

const PDFViewer = ({ base64String }) => {
  if (!base64String) return null;

  const pdfSrc = `data:application/pdf;base64,${base64String}`;

  return (
    <iframe
      src={pdfSrc}
      width="100%"
      height="500px"
      title="PDF Viewer"
    />
  );
};

export default PDFViewer;
