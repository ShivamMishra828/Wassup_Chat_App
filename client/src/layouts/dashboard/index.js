import React, { useEffect } from "react";
import { Stack } from "@mui/material";
import { Navigate, Outlet } from "react-router-dom";
import SideBar from "./SideBar";
import { useDispatch, useSelector } from "react-redux";
import { connectSocket, socket } from "../../socket";
import toast from "react-hot-toast";
import {
  AddDirectConversation,
  UpdateDirectConversation,
} from "../../redux/slices/conversation";
import { SelectConversation } from "../../redux/slices/app";

const DashboardLayout = () => {
  const { isLoggedIn } = useSelector((state) => state.auth);
  const user_id = window.localStorage.getItem("user_id");
  const { conversations } = useSelector(
    (state) => state.conversation.direct_chat
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (isLoggedIn) {
      window.onload = () => {
        if (!window.location.hash) {
          window.location = window.location + "#loaded";
          window.location.reload();
        }
      };
      //   window.load();

      if (!socket) {
        connectSocket(user_id);
      }

      socket.on("start_chat", (data) => {
        console.log(data);
        // add / update to conversation list
        const existing_conversation = conversations.find(
          (el) => el.id === data._id
        );
        if (existing_conversation) {
          // update direct conversation
          dispatch(UpdateDirectConversation({ conversation: data }));
        } else {
          // add direct conversation
          dispatch(AddDirectConversation({ conversation: data }));
        }
        dispatch(SelectConversation({ room_id: data._id }));
      });

      socket.on("open_chat", (data) => {
        console.log(data);
        // add / update to conversation list
        const existing_conversation = conversations.find(
          (el) => el.id === data._id
        );
        if (existing_conversation) {
          // update direct conversation
          dispatch(UpdateDirectConversation({ conversation: data }));
        } else {
          // add direct conversation
          dispatch(AddDirectConversation({ conversation: data }));
        }
        dispatch(SelectConversation({ room_id: data._id }));
      });

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
      socket.off("open_chat");
      socket.off("start_chat");
    };
  }, [isLoggedIn, user_id, conversations, dispatch]);
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
