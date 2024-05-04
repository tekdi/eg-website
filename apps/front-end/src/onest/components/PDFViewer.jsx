import React from "react";
import { useTranslation } from "react-i18next";

const PDFViewer = ({ src }) => {
  const { t } = useTranslation();

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
