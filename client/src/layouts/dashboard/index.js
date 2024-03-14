import React, { useEffect } from "react";
import { Stack } from "@mui/material";
import { Navigate, Outlet } from "react-router-dom";
import SideBar from "./SideBar";
import { useSelector } from "react-redux";
import { connectSocket, socket } from "../../socket";
import toast from "react-hot-toast";

const DashboardLayout = () => {
  const { isLoggedIn } = useSelector((state) => state.auth);
  const user_id = window.localStorage.getItem("user_id");

  useEffect(() => {
    if (isLoggedIn) {
      window.onload = () => {
        if (!window.location.hash) {
          window.location = window.location + "#loaded";
          window.location.reload();
        }
      };
      //   window.reload;

      if (!socket) {
        connectSocket(user_id);
      }

      socket.on("new_friend_request", (data) => {
        toast.success(data.message, {
          duration: 4000,
        });
      });

      socket.on("request_accepted", (data) => {
        toast.success(data.message, {
          duration: 4000,
        });
      });

      socket.on("request_sent", (data) => {
        toast.success(data.message, {
          duration: 4000,
        });
      });
    }

    return () => {
      socket.off("new_friend_request");
      socket.off("request_accepted");
      socket.off("request_sent");
    };
  }, [isLoggedIn, user_id]);
  if (!isLoggedIn) {
    return <Navigate to="/auth/login" />;
  }

  return (
    <Stack direction={"row"}>
      {/* Sidebar */}
      <SideBar />
      <Outlet />
    </Stack>
  );
};

export default DashboardLayout;
