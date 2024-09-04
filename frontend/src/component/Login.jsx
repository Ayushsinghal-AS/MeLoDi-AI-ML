import React, { useState } from "react";
import { Container, TextField, Button, Typography } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { Box } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/system";

const HiddenLabelTextField = styled(TextField)({
  "& .MuiInputLabel-root.Mui-focused": {
    display: "none",
  },
});

const baseUrl = import.meta.env.VITE_APP_BASE_URL;

const Login = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleUserNameChange = (e) => {
    const { value } = e.target;
    setUserName(value);
  };

  const handlePasswordChange = (e) => {
    const { value } = e.target;
    setPassword(value);
  };

  const handleSubmit = async () => {
    try {
      if (!userName || !password) {
        return alert("Please fill all the fields");
      } else {
        const response = await axios.post(`${baseUrl}/login`, {
          UserId: userName,
          password: password,
        });

        if (response.data) {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("userId", userName);
          localStorage.setItem("password", password);
          navigate("/dashboard");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "calc(100vh - (60px + 64px))",
        }}
      >
        <div
          style={{
            width: "700px",
            borderRadius: "10px",
            boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
          }}
        >
          <Container className="shadow-lg" component="main" maxWidth="sm">
            <CssBaseline />
            <Box
              sx={{
                marginTop: 7,
                marginBottom: 7,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <span className="melodi">Welcome to MeLoDi</span>
              <span className="melodi-text">Let’s get started</span>
              <Box sx={{ mt: 5 }}>
                <span className="username">User Name</span>
                <HiddenLabelTextField
                  style={{ marginTop: "8px", marginBottom: "30px" }}
                  fullWidth
                  id="userName"
                  label="User Name"
                  name="userName"
                  value={userName}
                  onChange={(e) => handleUserNameChange(e)}
                  placeholder="Enter your UserName"
                />
                <span className="username">Password</span>
                <HiddenLabelTextField
                  fullWidth
                  style={{ marginTop: "8px" }}
                  id="password"
                  type="password"
                  label="Password"
                  name="password"
                  autoComplete="password"
                  value={password}
                  onChange={(e) => handlePasswordChange(e)}
                  placeholder="Enter your Password"
                />
                <div className="login" onClick={handleSubmit}>
                  <span fullWidth variant="contained" className="login-btn">
                    Login
                  </span>
                </div>
              </Box>
            </Box>
          </Container>
        </div>
      </div>
    </>
  );
};

export default Login;
