import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export const PrivatePath = ({ children }) => {
    const userId = localStorage.getItem("userId");
    const userPass = localStorage.getItem("password");
    const token = localStorage.getItem("token");
    const isAuthenticated = userId && userPass && token;

    if (!isAuthenticated) {
        return <Navigate to='/' />;
    }

    return children ? children : <Outlet />;
}
