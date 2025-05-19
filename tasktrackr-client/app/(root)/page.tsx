"use client";
import React from "react";
import SignInPage from "./signin/page";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import TaskView from "./task/page";
import Users from "./users/page";

const HomePage = () => {
  const { isLoggedIn, role } = useSelector((state: RootState) => state?.authUser || {});

  if (!isLoggedIn) {
    return <SignInPage />;
  }

  if (role === "admin") {
    return <Users />;
  }

  return <TaskView />;
};

export default HomePage;
