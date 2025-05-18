"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LogOut, UserIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import useAxios from "@/hooks/useAxios.hook";
import useSnackbar from "@/hooks/useSnackbar.hook";
import { LOGOUT_URL } from "@/lib/constants/api.constant";
import { authClear } from "@/store/slices/authSlice";
import ModeToggle from "./mode-toggle";

function Menu() {
  const { isLoggedIn } = useSelector((state: RootState) => state.authUser)
  const dispatch = useDispatch();
  const [logoutInitiated, setLogoutInitiated] = useState(false);
  const [logoutRes, , logoutRequest] = useAxios(LOGOUT_URL, "POST");
  useSnackbar(logoutRes?.message, logoutRes?.success ? "success" : "error");

  useEffect(() => {
    if (logoutInitiated && logoutRes?.success) {
      dispatch(authClear());
      setLogoutInitiated(false);
      window.location.href = "/signin";
    }
  }, [logoutRes?.success, logoutInitiated]);

  const handleLogout = () => {
    logoutRequest();
    setLogoutInitiated(true);
  };

  return (
    <div className="flex justify-end gap-3">
      <nav className="flex w-full max-w-xs gap-1">
        <ModeToggle />
        {isLoggedIn && (
          <>
            <Button asChild variant="ghost">
              <Link href="/profile">
                <UserIcon /> Profile
              </Link>
            </Button>
            <Button variant="ghost" onClick={handleLogout}>
              Log Out <LogOut />
            </Button>
          </>
        )}
      </nav>
    </div>
  );
}

export default Menu;
