// src/routes/index.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

import { MainLayouts } from "../layouts/MainLayouts"; 

import { HomePage } from "../features/home/pages/HomePage";;

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes wrapped with Header and Footer */}
      <Route element={<MainLayouts />}>
        <Route path="/" element={<HomePage />} />
      </Route>

      {/* Admin dashboard route (No public Header/Footer) -> Later */}
      {/* <Route path="/admin" element={<DashboardPage />} /> */}
    </Routes>
  );
};

export default AppRoutes;