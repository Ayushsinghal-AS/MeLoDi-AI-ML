import React, { useEffect, useState } from "react";
import spanideaLogo from "./../assets/SpanideaLogo.png";
import InfoIcon from "@mui/icons-material/Info";
import { useLocation } from "react-router-dom";

const Navbar = () => {
  const [time, setTime] = useState(0);
  const location = useLocation();
  const isLoginPage = location.pathname === "/";
  const homeButtonDisabled = location.pathname === "/chat";

  const handleHome = () => {
    window.location.href = "/dashboard";
  };

  const handleHelp = () => {
    window.location.href = "/help";
  };

  return (
    <div className="navbar">
      <div style={{ height: "35px", display: "flex", alignItems: "center" }}>
        <img
          style={{ height: "20px", width: "120px" }}
          src={spanideaLogo}
          alt="Spanidea Systems"
        />
        <span style={{ margin: "0 40px", fontSize: "x-large" }}>|</span>
        <span
          style={{
            color: "var(--White, #FFF)",
            fontSize: "22px",
            fontStyle: "normal",
            fontWeight: "400",
            lineHeight: "35.2px",
          }}
        >
          MeLoDi
        </span>
      </div>
      <div style={{ display: "flex", gap: "40px", alignItems: "center" }}>
        {!isLoginPage ? (
          <>
            <span
              style={{
                cursor: "pointer",
                ...(!homeButtonDisabled
                  ? { opacity: "0.5", cursor: "not-allowed" }
                  : { opacity: "1", cursor: "pointer" }),
              }}
              onClick={handleHome}
            >
              Home
            </span>
          </>
        ) : (
          ""
        )}
        {!isLoginPage ? (
          <>
            <span
              style={{
                display: "flex",
                gap: "4px",
                cursor: "pointer",
                alignItems: "center",
              }}
              onClick={handleHelp}
            >
              <InfoIcon />
              Help
            </span>
            <span
              style={{
                display: "flex",
                gap: "4px",
                cursor: "pointer",
                alignItems: "center",
              }}
              onClick={handleHelp}
            >
              {/* Expire: {time === 0 ? "Today" : (time === 1 ? "Tomorrow" :`${time} Days`)} */}
            </span>
          </>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Navbar;
