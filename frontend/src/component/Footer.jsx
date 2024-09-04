import React from "react";
import {
  Container,
  Box,
  CssBaseline,
  Typography,
  Paper,
  AppBar,
  Toolbar,
  Link,
} from "@mui/material";

const Footer = () => {
  return (
    <>
      <p
        style={{
          textAlign: "center",
          margin: "0",
          position: "absolute",
          bottom: "0",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        © 2024 SpanIdea. All rights reserved.
      </p>
      
      {/* <AppBar position="absolute" style={{ backgroundColor: "#001931", top: "auto" }}>
      <Toolbar>
        <div
          style={{
            width: "100vw",
            display: "flex",
            justifyContent: "space-between",
            padding: "0 50px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <Typography variant="body2" className="footer">
              © 2024 SpanIdea. All rights reserved.
            </Typography>
            <div
              style={{
                height: "24px",
                width: "1px",
                backgroundColor: "rgba(138, 159, 197, 0.50)",
              }}
            ></div>
            <Typography variant="body2" className="footer">
              MeLoDi Version - V1
            </Typography>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <Typography variant="body2" className="footer">
              Privacy Policy
            </Typography>
            <div
              style={{
                height: "24px",
                width: "1px",
                backgroundColor: "rgba(138, 159, 197, 0.50)",
              }}
            ></div>
            <Typography variant="body2" className="footer">
              Terms and Conditions
            </Typography>
          </div>
        </div>
      </Toolbar>
    </AppBar> */}
    </>
  );
};

export default Footer;
