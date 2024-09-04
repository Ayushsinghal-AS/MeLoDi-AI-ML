import React from "react";
import { Container, Box, CssBaseline, Typography } from "@mui/material";

const Help = () => {
  return (
    <>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Container
          component="main"
          style={{
            maxWidth: "1300px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              overflowY: "auto",
              height: "100vh",
              width: "76vw",
              marginTop: "25px",
            }}
          >
            <Typography
              variant="h4"
              component="h4"
              gutterBottom
              style={{ marginBottom: "0px" }}
            >
              Welcome to MeLoDi
            </Typography>
            <Box sx={{ mt: 0 }}>
              <Typography variant="h5" component="h4" gutterBottom>
                Help Section
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Overview</strong>
                <br />
                MeLoDi (Machine Learning for Log Analysis) is a state-of-the-art
                tool developed by SpanIdea Systems to automate and enhance the
                process of log file analysis. By leveraging advanced AI and NLP
                technologies, MeLoDi provides detailed root cause analysis for
                logs, helping to debug and resolve issues efficiently.
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Features</strong>
                <ul style={{ margin: "5px" }}>
                  <li>
                    Automated Log Analysis: Reduces the need for manual
                    intervention and domain expertise.
                  </li>
                  <li>
                    Domain Specific Insights: Tailored to understand and analyze
                    logs from specific domains like modems, routers, and IoT
                    devices.
                  </li>
                  <li>
                    AI-Powered: Utilizes advanced AI models for accurate and
                    efficient analysis.
                  </li>
                </ul>
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>How to Use MeLoDi</strong>
                <br />
                <strong>For Testing</strong>
                <ol style={{ margin: "5px" }}>
                  <li>Navigate to the home page of the MeLoDi tool.</li>
                  <li>Click on the "Upload Log" button.</li>
                  <li>
                    The tool will automatically highlight all the problematic
                    lines in the uploaded log file.
                  </li>
                </ol>
                <strong>For Training</strong>
                <ol style={{ margin: "5px" }}>
                  <li>Go to the training section of the tool.</li>
                  <li>
                    Upload all the logs that are considered successful (pass
                    logs).
                  </li>
                  <li>
                    Click on the "Submit" button to start the training process.
                  </li>
                  <li>
                    After successfully uploading the logs, click on the "Update
                    Dictionary" button.
                  </li>
                </ol>
                Now, you can test the log files with the updated information for
                more accurate analysis.
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                SpanIdea Systems Proprietary and Confidential
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Help;
