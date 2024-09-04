import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import TuneTable from "./TuneTable";
import {
  Button,
  Paper,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { useLocation } from "react-router-dom";

const baseUrl = import.meta.env.VITE_APP_BASE_URL;

const Chat = () => {
  const [result, setResult] = useState(null);
  const location = useLocation();
  const binaryFiles = location.state?.pdfFiles;
  const fileName = location.state?.logFile;
  const version = location.state?.versionId;
  const [filter, setFilter] = useState("failure");
  const [clickedLineIndex, setClickedLineIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);

  const htmlContent = result?.html_content || [];
  const Failure_lines = htmlContent.filter(
    (line) => line.color === "red"
  ).length;
  const non_failure_lines = htmlContent.filter(
    (line) => line.color === "green"
  ).length;
  const scrollRefs = useRef([]);

  const handleAnalyze = async () => {
    if (!binaryFiles) return;

    const formData = new FormData();
    binaryFiles.forEach((file, index) => {
      formData.append(`file`, file);
    });

    try {
      const response = await axios.post(
        `${baseUrl}/analyze_file?db_ver=${version}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data) {
        setLoading(false);
        setResult(response.data);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error analyzing file:", error);
    }
  };

  useEffect(() => {
    handleAnalyze();
  }, [binaryFiles]);

  const handleLineClick = (index) => {
    setClickedLineIndex(index);
    scrollToLeftTableRow(index);
  };

  const scrollToLeftTableRow = (index) => {
    if (scrollRefs.current[index]) {
      const paddingElement = document.createElement("div");
      paddingElement.style.height = "60px";
      scrollRefs.current[index].parentNode.insertBefore(
        paddingElement,
        scrollRefs.current[index]
      );
      paddingElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const filteredContent = htmlContent.filter((lineItem, index) => {
    if (filter === "failure" && lineItem.color === "red") return true;
    if (filter === "nonFailure" && lineItem.color === "green") return true;
    return false;
  });

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  return (
    <>
      {false ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100vw",
            height: "100vh",
          }}
        >
          <CircularProgress />
        </div>
      ) : (
        <div
          style={{
            padding: "10px",
            display: "flex",
            backgroundColor: "#f5f5f5",
            height: "calc(100vh - (60px))",
            fontFamily: "sans-serif",
            boxSizing: "border-box",
          }}
        >
          <div style={{ width: "100%", height: "100%" }}>
            {fileName === "Test The Algorithm" && (
              <div
                style={{
                  border: "1px solid #ccc",
                  padding: "15px",
                  backgroundColor: "var(--Brand-Color---White, #FFF)",
                  display: "flex",
                  justifyContent: "space-between",
                  height: "98%",
                  boxSizing: "border-box",
                }}
              >
                <div
                  style={{
                    marginRight: "15px",
                    border: "1px solid #ccc",
                    backgroundColor: "var(--Brand-Color---White, #FFF)",
                    width: "35vw",
                    borderRadius: "10px",
                    height: "100%",
                  }}
                >
                  <h2
                    style={{
                      textAlign: "center",
                      color: "#1A1A1A",
                      fontSize: "18px",
                      fontStyle: "normal",
                      fontWeight: "600",
                      lineHeight: "normal",
                      marginTop: "26px",
                    }}
                  >
                    Raw log file
                  </h2>
                  <div
                    style={{
                      maxWidth: "35vw",
                      margin: "0 auto",
                      height: "calc(100% - 61px)",
                    }}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TableContainer
                          component={Paper}
                          aria-label="simple table"
                          className="result-container"
                          style={{
                            backgroundColor: "var(--Brand-Color---White, #FFF)",
                          }}
                        >
                          {result && (
                            <Table stickyHeader aria-label="sticky table" sx={{maxWidth: 500}}>
                              <TableHead>
                                <TableRow>
                                  <TableCell
                                    style={{
                                      fontWeight: "500",
                                      fontSize: "16px",
                                      textAlign: "center",
                                      border: "2px solid #ccc",
                                      backgroundColor:
                                        "var(--Brand-Color---Midnight, #242437)",
                                      color: "var(--Brand-Color---White, #FFF)",
                                      position: "sticky",
                                      top: "0",
                                      zIndex: "1",
                                      width: "50px",
                                    }}
                                  >
                                    S.No.
                                  </TableCell>
                                  <TableCell
                                    style={{
                                      fontWeight: "500",
                                      fontSize: "16px",
                                      textAlign: "center",
                                      border: "2px solid #ccc",
                                      backgroundColor:
                                        "var(--Brand-Color---Midnight, #242437)",
                                      color: "var(--Brand-Color---White, #FFF)",
                                      position: "sticky",
                                      top: "0",
                                      zIndex: "1",
                                      width: "35vw", 
                                    }}
                                  >
                                    Log
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {htmlContent.map((lineItem, index) => (
                                  <TableRow
                                    key={index}
                                    ref={(el) =>
                                      (scrollRefs.current[index] = el)
                                    }
                                    style={{
                                      backgroundColor:
                                        index % 2 === 0 ? "#EFEFEF" : "#FFFFFF",
                                    }}
                                  >
                                    <TableCell
                                      style={{
                                        textAlign: "center",
                                        border: "2px solid #FFFFFF",
                                        color:
                                          "var(--Brand-Color---Midnight, #242437)",
                                        fontSize: "14px",
                                        fontStyle: "normal",
                                        fontWeight: "400",
                                        lineHeight: "18px",
                                      }}
                                    >
                                      {lineItem.line_number}
                                    </TableCell>
                                    <TableCell
                                      style={{
                                        color: lineItem.color,
                                        border: "2px solid #FFFFFF",
                                        fontSize: "14px",
                                        fontStyle: "normal",
                                        fontWeight: "400",
                                        lineHeight: "18px",
                                      }}
                                    >
                                      {lineItem.line}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          )}
                        </TableContainer>
                      </Grid>
                    </Grid>
                  </div>
                </div>
                {result ? (
                  <div
                    style={{
                      height: "100%",
                      width: "60vw",
                      border: "1px solid #ccc",
                      backgroundColor: "var(--Brand-Color---White, #FFFFFF)",
                      borderRadius: "10px",
                    }}
                  >
                    <div
                      style={{
                        border: "1px solid #ccc",
                        backgroundColor: "var(--Brand-Color---White, #FFFFFF)",
                        display: "flex",
                        justifyContent: "space-evenly",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          color: "#C6553C",
                          fontSize: "18px",
                          fontStyle: "normal",
                          fontWeight: "600",
                          lineHeight: "normal",
                        }}
                      >
                        Failure Log Event ({Failure_lines})
                      </span>

                      <span
                        style={{
                          width: "1px",
                          height: "60px",
                          backgroundColor: "#C6BEBE",
                        }}
                      ></span>
                      <span
                        style={{
                          color: "rgb(26, 26, 26)",
                          fontSize: "18px",
                          fontStyle: "normal",
                          fontWeight: "600",
                          lineHeight: "normal",
                        }}
                      >
                        Total Log Events ({Failure_lines + non_failure_lines})
                      </span>
                    </div>
                    <TableContainer
                      component={Paper}
                      elevation={10}
                      className="result-container2"
                    >
                      <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                          <TableRow>
                            <TableCell
                              style={{
                                fontWeight: "500",
                                fontSize: "16px",
                                textAlign: "center",
                                border: "2px solid #ccc",
                                backgroundColor:
                                  "var(--Brand-Color---Midnight, #242437)",
                                color: "var(--Brand-Color---White, #FFF)",
                                position: "sticky",
                                top: "0",
                                zIndex: "1",
                                width: "50px",
                              }}
                            >
                              S.No.
                            </TableCell>
                            <TableCell
                              style={{
                                fontWeight: "500",
                                fontSize: "16px",
                                textAlign: "center",
                                border: "2px solid #ccc",
                                backgroundColor:
                                  "var(--Brand-Color---Midnight, #242437)",
                                color: "var(--Brand-Color---White, #FFF)",
                                position: "sticky",
                                top: "0",
                                zIndex: "1",
                              }}
                            >
                              Log
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {filteredContent.map((lineItem, index) => (
                            <TableRow
                              key={index}
                              onClick={() =>
                                handleLineClick(htmlContent.indexOf(lineItem))
                              }
                              style={{
                                backgroundColor:
                                  clickedLineIndex ===
                                  htmlContent.indexOf(lineItem)
                                    ? "yellow"
                                    : index % 2 === 0
                                    ? "#EFEFEF"
                                    : "#FFFFFF",
                                cursor: "pointer",
                              }}
                            >
                              <TableCell
                                style={{
                                  textAlign: "center",
                                  border: "2px solid #FFFFFF",
                                  color:
                                    "var(--Brand-Color---Midnight, #242437)",
                                  fontSize: "14px",
                                  fontStyle: "normal",
                                  fontWeight: "400",
                                  lineHeight: "18px",
                                }}
                              >
                                {lineItem.line_number}
                              </TableCell>
                              <TableCell
                                style={{
                                  color: lineItem.color,
                                  border: "2px solid #FFFFFF",
                                  fontSize: "14px",
                                  fontStyle: "normal",
                                  fontWeight: "400",
                                  lineHeight: "18px",
                                }}
                              >
                                {lineItem.line}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                ) : (
                  <div
                    style={{
                      color: "black",
                      width: "60vw",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      border: "1px solid #ccc",
                      height: "100%",
                      backgroundColor: "var(--Brand-Color---White, #FFF)",
                    }}
                  >
                    <Typography variant="h6">
                      Please upload a valid log file.
                    </Typography>
                  </div>
                )}
              </div>
            )}

            {fileName === "Train The Algorithm" && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                  height: "88vh",
                  width: "100vw",
                  paddingTop: "5vh",
                }}
              >
                <div>
                  <h1
                    style={{
                      color: "#1A1A1A",
                      fontSize: "32px",
                      fontStyle: "normal",
                      fontWeight: "600",
                      lineHeight: "normal",
                      marginTop: "30px",
                      marginBottom: "30px",
                    }}
                  >
                    MeLoDi Log Analysis Tool
                  </h1>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                    alignItems: "center",
                    paddingRight: "20px",
                  }}
                >
                  <TuneTable files={binaryFiles} />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Version Information</DialogTitle>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Version</TableCell>
                  <TableCell>Date/Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>1</TableCell>
                  <TableCell>John Doe</TableCell>
                  <TableCell>v1.0</TableCell>
                  <TableCell>2024-07-02 12:00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>2</TableCell>
                  <TableCell>Jane Smith</TableCell>
                  <TableCell>v1.1</TableCell>
                  <TableCell>2024-07-03 15:30</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Chat;
