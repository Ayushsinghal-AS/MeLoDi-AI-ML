import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import axios from "axios";

import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import {
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
  "& .MuiPaper-root": {
    width: "600px",
    height: "auto",
    minHeight: "450px",
    maxWidth: "none",
    maxHeight: "none",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}));

export default function DialogBox({ open, setOpen, logFile }) {
  const [pdfFiles, setPdfFiles] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [selectedVersion, setSelectedVersion] = React.useState({});
  const [versions, setVersions] = React.useState([]);
  const baseUrl = import.meta.env.VITE_APP_BASE_URL;
  const fileInputRef = React.useRef(null);
  const navigate = useNavigate();

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

  const handleClose = () => {
    if (!loading) {
      setOpen(!open);
      setSelectedVersion({});
    }
  };

  const isValidTextFile = async (file) => {
    const text = await file.text();
    return text.length > 0;
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    console.log("files", files);
    const validFilesPromises = files.map(async (file) => {
      const isValidSize = file.size <= 10 * 1024 * 1024;
      const isValidType =
        file.type === "application/json" ||
        file.type === "text/plain" ||
        file.type === "";
      const isValidText = await isValidTextFile(file);
      console.log("92", isValidSize, isValidType , isValidText);
      return isValidSize && isValidType && isValidText ? file : null;
    });

    console.log("95")

    const validFiles = (await Promise.all(validFilesPromises)).filter(
      (file) => file !== null
    );

    console.log("101",validFiles);

    if (validFiles.length !== files.length) {
      alert("Only text files under 10MB are allowed.");
      return;
    }
console.log("108")
    setPdfFiles(validFiles);

    const formData = new FormData();
    validFiles.forEach((file) => {
      formData.append(`file`, file);
    });
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value.name || value}`);
    }
    const token = localStorage.getItem("token");
console.log("117")
    setLoading(true);
    axios
      .post(`${baseUrl}/upload_pdf_file`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("res",res);
        navigate("/chat", {
          state: {
            pdfFiles: validFiles,
            logFile: logFile,
            versionId: selectedVersion.id,
          },
        });
      })
      .catch((error) => {
        console.log("error1398",error)
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleImageClick = (e) => {
    fileInputRef.current.click();
  };

  const handleVersionChange = (event) => {
    const version = versions.find((ver) => ver.version === event.target.value);
    setSelectedVersion(version);
  };

  return (
    <React.Fragment>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        style={{
          fontFamily: "sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        {!loading && (
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        )}

        <div
          style={{
            borderRadius: "10px",
            boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
            width: "550px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              color: "#0F0F0F",
              fontSize: "18px",
              fontStyle: "normal",
              fontWeight: "700",
              lineHeight: "28px",
              display: "flex",
              justifyContent: "center",
              marginTop: "10px",
            }}
          >
            <span>{loading ? "" : "Upload Log File"}</span>
          </div>

          {loading ? (
            ""
          ) : (
            <span
              style={{
                color: "var(--Neutral-Foreground-3-Rest, #616161)",
                display: "flex",
                justifyContent: "center",
                fonSize: "12px",
                fontStyle: "normal",
                fontWeight: "400",
                lineHeight: "20px",
              }}
            >
              Please select relevant log file to complete process
            </span>
          )}

          {!loading && logFile === "Test The Algorithm" && (
            <FormControl fullWidth style={{ marginTop: "20px", width: "30vw" }}>
              <InputLabel id="version-select-label">Select Version</InputLabel>
              <Select
                labelId="version-select-label"
                id="version-select"
                value={selectedVersion.version || ""}
                label="Select Version"
                onChange={handleVersionChange}
              >
                {versions.map((ver) => (
                  <MenuItem key={ver.id} value={ver.version}>
                    {ver.version} ({ver.date} {ver.time})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <DialogContent>
            {loading ? (
              <div className="loader-parent">
                {" "}
                <div className="loader"></div>{" "}
              </div>
            ) : (
              <Typography
                className="upload-document"
                onClick={handleImageClick}
                style={{
                  cursor: "pointer",
                  padding: "55px",
                  backgroundImage:
                    "repeating-linear-gradient(0deg, #000000, #000000 10px, transparent 10px, transparent 23px, #000000 23px), repeating-linear-gradient(90deg, #000000, #000000 10px, transparent 10px, transparent 23px, #000000 23px), repeating-linear-gradient(180deg, #000000, #000000 10px, transparent 10px, transparent 23px, #000000 23px), repeating-linear-gradient(270deg, #000000, #000000 10px, transparent 10px, transparent 23px, #000000 23px)",
                  backgroundSize: "1px 100%, 100% 1px, 1px 100% , 100% 1px",
                  backgroundPosition: "0 0, 0 0, 100% 0, 0 100%",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <img src="upload2.svg" alt="" />
                <span
                  style={{
                    color: "#0F0F0F",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: "400",
                    lineHeight: "28px",
                  }}
                >
                  Select a file or drag and drop here
                </span>
                <span
                  style={{
                    color: "var(--Neutral-Foreground-3-Rest, #616161)",
                    fontSize: "12px",
                    fontStyle: "normal",
                    fontWeight: "400",
                    lineHeight: "12px",
                  }}
                >
                  file size no more than 10MB
                </span>

                <div className="file-select">
                  {logFile === "Test The Algorithm" ? (
                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                    />
                  ) : (
                    <input
                      type="file"
                      multiple
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                    />
                  )}
                  Select Log File
                </div>
              </Typography>
            )}
          </DialogContent>
        </div>
      </BootstrapDialog>
    </React.Fragment>
  );
}
