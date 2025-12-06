import React from "react";
import { Navigate } from "react-router-dom"

export default function ProtectedAdmin({children}) {
    try {
        const row = localStorage.getItem("user");
        if(!row) return <Navigate to="/login" replace />;
        const user = JSON.parse(row);
        if(!user || user.role !== 'admin') {
            return <Navigate to="/login" replace />;
        }
        return children;
    } catch(e){
        return <Navigate to="/login" replace />;
    }
}