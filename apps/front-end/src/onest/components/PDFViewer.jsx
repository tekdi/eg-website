import React from "react";

const PDFViewer = ({ src }) => {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <iframe
        title="PDF Viewer"
        src={`https://docs.google.com/gview?url=${src}&embedded=true`}
        style={{ width: "718px", height: "700px" }}
        frameBorder="0"
      ></iframe>
    </div>
  );
};

export default PDFViewer;
