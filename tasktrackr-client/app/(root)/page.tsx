"use client";
import React from "react";
import SignInPage from "./signin/page";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import TaskView from "./task/page";

const HomePage = async () => {
  const { isLoggedIn, role } = useSelector((state: RootState) => state.authUser)
  return (
    <div>
      {isLoggedIn ? <TaskView /> : <SignInPage />}
    </div>
  );
};

export default HomePage;
