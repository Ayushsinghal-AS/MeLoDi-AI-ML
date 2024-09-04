import React, { useState } from "react";
import DialogBox from "./DialogBox";

export default function Dashboard() {
  const [open, setOpen] = React.useState(false);
  const [logFile, setLogFile] = useState("Test The Algorithm");

  const handleClick = (val) => {
    setOpen(!open);
    setLogFile(val);
  };

  return (
    <div>
      <DialogBox open={open} setOpen={setOpen} logFile={logFile} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "15vh",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div className="dashboard-heading">Let's Analyse The Log</div>
          <span className="melodi-text">Let’s get started</span>
        </div>

        <div className="dashboard">
          <div className="upload-log">
            <div className="dashboard-h1">Train The Algorithm</div>
            <div
              className="login"
              style={{ width: "20vw" }}
              onClick={() => handleClick("Train The Algorithm")}
            >
              <img src="/Upload.svg" alt="" />
              <span fullWidth variant="contained" className="login-btn">
                Upload File to Train Algorithm
              </span>
            </div>
          </div>

          <div className="upload-log">
            <div className="dashboard-h1">Test The Algorithm</div>
            <div
              className="login"
              style={{ width: "20vw" }}
              onClick={() => handleClick("Test The Algorithm")}
            >
              <img src="/Upload.svg" alt="" />
              <span fullWidth variant="contained" className="login-btn">
                Upload Log File
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
