import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Paper,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

const baseUrl = import.meta.env.VITE_APP_BASE_URL;

const TuneTable = ({ files }) => {
  const [uploadMessage, setUploadMessage] = useState("");
  const [updateMessage, setUpdateMessage] = useState("");
  const [submitCompleted, setSubmitCompleted] = useState(false);
  const [updateCompleted, setUpdateCompleted] = useState(false);
  const [selectedVersion, setSelectedVersion] = React.useState({});
  const [versions, setVersions] = useState([]);

  const getVersions = async () => {
    try {
      const response = await axios.get(`${baseUrl}/get_db_name`, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const fetchedVersions = response.data;
      setVersions(fetchedVersions);
      if (fetchedVersions.length > 0) {
        setSelectedVersion(fetchedVersions[fetchedVersions.length - 1]);
      }
    } catch (error) {
      console.error("Error getting version:", error);
    }
  };

  useEffect(() => {
    getVersions();
  }, []);

  const handleFileSubmit = async () => {
    const formData = new FormData();
    await files.forEach((file, index) => {
      formData.append(`files`, file);
    });

    try {
      const response = await axios.post(
        `${baseUrl}/upload_multiple_files`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data) {
        setSubmitCompleted(true);
        setUploadMessage("Files uploaded successfully.");
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      setUploadMessage("Error uploading files");
    }
  };

  const handleUpdateDictionary = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/update-pass-dictionary?db_ver=${selectedVersion.id}`
      );

      if (response.data) {
        setUpdateCompleted(true);
        setUpdateMessage(
          response.data.update === 1
            ? "Dictionary updated successfully."
            : "Failed to update dictionary."
        );
      }
    } catch (error) {
      console.error("Error updating dictionary:", error);
      setUpdateMessage("Error updating dictionary");
    }
  };

  const handleVersionChange = (event) => {
    const version = versions.find((ver) => ver.version === event.target.value);
    setSelectedVersion(version);
  };

  return (
    <>
      <div className="tune-table-container">
        <Paper
          elevation={10}
          style={{
            borderRadius: "12px",
            backgroundColor: "#FFF",
            boxShadow: "0px 8px 20px 0px rgba(194, 194, 194, 0.25)",
            display: "flex",
            padding: "20px",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "25vw",
          }}
        >
          <span
            style={{
              color: "var(--character-title-85, rgba(0, 0, 0, 0.85))",
              textAlign: "center",
              fontSize: "26px",
              fontStyle: "normal",
              fontWeight: "600",
              lineHeight: "24px",
            }}
          >
            Submit File
          </span>

          <span
            style={{
              color: "#909094",
              textAlign: "center",
              fontSize: "13px",
              fontStyle: "normal",
              fontWeight: "400",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "5px",
              marginBottom: "10px",
              marginTop: "10px",
            }}
          >
            <span>Total selected files {files.length} </span>

            <Tooltip
              title={
                <div className="tooltip-content">
                  {files.map((file, index) => (
                    <li
                      key={index}
                      style={{ marginBottom: "3px", marginTop: "5px" }}
                    >
                      {file.name}
                    </li>
                  ))}
                </div>
              }
              arrow
              sx={{
                "& .MuiTooltip-tooltip": {
                  backgroundColor: "rgb(255, 255, 255)",
                  color: "#1565c0",
                },
              }}
            >
              <InfoIcon style={{ cursor: "pointer", height: "20px" }} />
            </Tooltip>
          </span>

          <Button
            variant="contained"
            onClick={handleFileSubmit}
            style={{ width: "20vw" }}
          >
            Submit Files
          </Button>

          <div
            style={{
              display: "flex",
              gap: "10px",
              width: "20vw",
              marginTop: "20px",
            }}
          >
            <div
              style={{
                color: "#303030",
                textAlign: "center",
                fontSize: "14px",
                fontStyle: "normal",
                fontWeight: "500",
                lineHeight: "24px",
              }}
            >
              Note:
            </div>
            <div
              style={{
                color: "#777",
                textAlign: "center",
                fontSize: "14px",
                fontStyle: "normal",
                fontWeight: "400",
                lineHeight: "24px",
              }}
            >
              If Submitted with wrong data, it may affect the performance
            </div>
          </div>
        </Paper>

        <Paper
          elevation={10}
          style={{
            borderRadius: "12px",
            backgroundColor: "#FFF",
            boxShadow: "0px 8px 20px 0px rgba(194, 194, 194, 0.25)",
            display: "flex",
            padding: "20px",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "25vw",
            ...(uploadMessage === "Files uploaded successfully."
              ? { opacity: 1 }
              : { opacity: 0.5, cursor: "not-allowed" }),
          }}
        >
          <span
            style={{
              color: "var(--character-title-85, rgba(0, 0, 0, 0.85))",
              textAlign: "center",
              fontSize: "26px",
              fontStyle: "normal",
              fontWeight: "600",
              lineHeight: "24px",
            }}
          >
            Start Training Algorithm
          </span>

          <span
            style={{
              color: "#909094",
              textAlign: "center",
              fontSize: "12px",
              fontStyle: "normal",
              fontWeight: "400",
              marginTop: "8px",
            }}
          >
            Click Update Button to update the dictionary
          </span>

          <FormControl
            fullWidth
            style={{ marginTop: "20px", marginBottom: "20px", width: "20vw" }}
          >
            <InputLabel id="version-select-label">Select Version</InputLabel>
            <Select
              labelId="version-select-label"
              id="version-select"
              value={selectedVersion.version || ""}
              label="Select Version"
              onChange={handleVersionChange}
              disabled={
                uploadMessage === "Files uploaded successfully." ? false : true
              }
            >
              {versions.map((ver) => (
                <MenuItem key={ver.id} value={ver.version}>
                  {ver.version} ({ver.date} {ver.time})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            onClick={handleUpdateDictionary}
            style={{
              width: "20vw",
              ...(uploadMessage === "Files uploaded successfully."
                ? { cursor: "pointer" }
                : { cursor: "not-allowed" }),
            }}
          >
            Train Algorithm
          </Button>

          <div
            style={{
              display: "flex",
              gap: "10px",
              width: "20vw",
              marginTop: "20px",
            }}
          >
            <div
              style={{
                color: "#303030",
                textAlign: "center",
                fontSize: "14px",
                fontStyle: "normal",
                fontWeight: "500",
                lineHeight: "24px",
              }}
            >
              Note:
            </div>

            <div
              style={{
                color: "#777",
                textAlign: "center",
                fontSize: "14px",
                fontStyle: "normal",
                fontWeight: "400",
                lineHeight: "24px",
              }}
            >
              If Submitted with wrong data, it may affect the performance
            </div>
          </div>
        </Paper>

        <Paper
          elevation={10}
          style={{
            borderRadius: "12px",
            backgroundColor: "#FFF",
            boxShadow: "0px 8px 20px 0px rgba(194, 194, 194, 0.25)",
            display: "flex",
            padding: "20px",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "25vw",
            ...(updateMessage === "Dictionary updated successfully."
              ? { opacity: 1 }
              : { opacity: 0.5 }),
          }}
        >
          <div>
            <img src="3073625 1.png" alt="" />
          </div>
        </Paper>
      </div>

      <div style={{ position: "relative" }}>
        <div
          style={{
            marginTop: "30px",
            display: "flex",
            gap: "40px",
            justifyContent: "center",
            width: "100vw",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              width: "calc(25vw + 40px)",
            }}
          >
            <div>
              {submitCompleted ? (
                <img
                  style={{ position: "relative", zIndex: "2" }}
                  src="CompletedTask.svg"
                  alt=""
                />
              ) : (
                <img src="round.svg" alt="" />
              )}
            </div>

            {submitCompleted && (
              <p
                style={{
                  width: "15vw",
                  ...(uploadMessage === "Files uploaded successfully."
                    ? { color: "#20A785" }
                    : { color: "red" }),
                  textAlign: "center",
                  fontSize: "14px",
                  fontStyle: "normal",
                  fontWeight: "400",
                  lineHeight: "24px",
                  marginTop: "8px",
                }}
              >
                Your log file has been submitted successfully!
              </p>
            )}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              width: "calc(25vw + 40px)",
            }}
          >
            <div>
              {updateCompleted ? (
                <img
                  style={{ position: "relative", zIndex: "2" }}
                  src="CompletedTask.svg"
                  alt=""
                />
              ) : (
                <img src="round.svg" alt="" />
              )}
            </div>

            {updateCompleted && (
              <p
                style={{
                  width: "15vw",
                  ...(updateMessage === "Dictionary updated successfully."
                    ? { color: "#20A785" }
                    : { color: "red" }),
                  textAlign: "center",
                  fontSize: "14px",
                  fontStyle: "normal",
                  fontWeight: "400",
                  lineHeight: "24px",
                  marginTop: "8px",
                }}
              >
                Dictionary Updated Successfully!
              </p>
            )}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              width: "calc(25vw + 40px)",
            }}
          >
            <div>
              {updateCompleted ? (
                <img
                  style={{ position: "relative", zIndex: "2" }}
                  src="CompletedTask.svg"
                  alt=""
                />
              ) : (
                <img src="round.svg" alt="" />
              )}
            </div>

            {updateCompleted && (
              <p
                style={{
                  width: "15vw",
                  ...(updateMessage === "Dictionary updated successfully."
                    ? { color: "#20A785" }
                    : { color: "red" }),
                  textAlign: "center",
                  fontSize: "14px",
                  fontStyle: "normal",
                  fontWeight: "400",
                  lineHeight: "24px",
                  marginTop: "8px",
                }}
              >
                Congratulations, analysis training process has been completed!
              </p>
            )}
          </div>
        </div>

        <div
          style={{
            width: "clamp(930px, 58vw, 1115px)",
            height: "1px",
            backgroundColor: "#000000",
            position: "absolute",
            top: "60px",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        ></div>
      </div>
    </>
  );
};

export default TuneTable;
