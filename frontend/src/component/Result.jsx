import React, { useState } from "react";
import {
  Grid,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Radio,
  FormControlLabel,
  RadioGroup,
} from "@mui/material";

const Result = ({ result }) => {
  const [filter, setFilter] = useState("failure");
  const [clickedLineIndex, setClickedLineIndex] = useState(null);
  const Failure_lines = result["Failure_line"];
  const non_failure_lines = result["non_failure_line"];
  const htmlContent = result["html_content"];

  const handleOpenFile = () => {
    const blob = new Blob([JSON.stringify(htmlContent, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    setClickedLineIndex(null);
  };

  const handleLineClick = (index) => {
    setClickedLineIndex(index);
  };

  const getAdjacentLines = (index) => {
    const currentLine = htmlContent[index];
    let linesToShow = [currentLine];
    let previousLine = null;
    let nextLine = null;

    for (let i = index - 1; i >= 0; i--) {
      if (htmlContent[i].color !== currentLine.color) {
        previousLine = htmlContent[i];
        break;
      }
    }

    for (let i = index + 1; i < htmlContent.length; i++) {
      if (htmlContent[i].color !== currentLine.color) {
        nextLine = htmlContent[i];
        break;
      }
    }

    if (previousLine) linesToShow.unshift(previousLine);
    if (nextLine) linesToShow.push(nextLine);

    return linesToShow;
  };

  const filteredContent = htmlContent.filter((lineItem, index) => {
    if (clickedLineIndex !== null) {
      const linesToShow = getAdjacentLines(clickedLineIndex);
      return linesToShow.includes(lineItem);
    }
    if (filter === "all") return true;
    if (filter === "failure" && lineItem.color === "red") return true;
    if (filter === "nonFailure" && lineItem.color === "green") return true;
    return false;
  });

  return (
    <div
      style={{
        overflow: "auto",
        height: "75vh",
        width: "62vw",
        border: "1px solid #ccc",
        backgroundColor: "#e6e3e3",
      }}
    >
      <Paper elevation={10} sx={{ margin: "10px" }}>
        <div
          style={{
            border: "1px solid #ccc",
            backgroundColor: "#e6e3e3",
            padding: "15px 5px",
            display: "flex",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
        >
          <RadioGroup
            row
            aria-label="line-filter"
            name="line-filter"
            value={filter}
            onChange={handleFilterChange}
          >
            <FormControlLabel
              value="failure"
              control={<Radio />}
              label={
                <span style={{ fontSize: "22px", color: "red" }}>
                  Potential Failure Lines: {Failure_lines}
                </span>
              }
            />
            <FormControlLabel
              value="nonFailure"
              control={<Radio />}
              label={
                <span style={{ fontSize: "22px", color: "green" }}>
                  Non-Failure Lines: {non_failure_lines}
                </span>
              }
            />
            <FormControlLabel
              value="all"
              control={<Radio />}
              label={
                <span style={{ fontSize: "22px", color: "blue" }}>
                  Total Lines: {Failure_lines + non_failure_lines}
                </span>
              }
            />
          </RadioGroup>
        </div>
      </Paper>
      <Grid container spacing={2} className="result-container" style={{ marginTop: "10px" }}>
        <Grid item xs={12}>
          <TableContainer component={Paper} style={{ backgroundColor: "#f4eeee" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    style={{
                      fontWeight: "bold",
                      fontSize: "20px",
                      textAlign: "center",
                      border: "2px solid #ccc",
                    }}
                  >
                    S.No.
                  </TableCell>
                  <TableCell
                    style={{
                      fontWeight: "bold",
                      fontSize: "20px",
                      textAlign: "center",
                      border: "2px solid #ccc",
                    }}
                  >
                    Log
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredContent.map((lineItem, index) => (
                  <TableRow key={index} onClick={() => handleLineClick(index)}>
                    <TableCell style={{ textAlign: "center", border: "2px solid #ccc" }}>
                      {htmlContent.indexOf(lineItem) + 1}
                    </TableCell>
                    <TableCell
                      style={{ color: lineItem.color, border: "2px solid #ccc", cursor: "pointer" }}
                    >
                      {lineItem.line}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={12} style={{ marginBottom: "10px", marginLeft: "10px" }}>
          <Button variant="contained" onClick={handleOpenFile}>
            Open JSON File
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default Result;
