import { Box, Stack } from "@mui/material";
import React from "react";
import { Chat_History } from "../../data";
import {
  DocMsg,
  LinkMsg,
  MediaMsg,
  ReplyMsg,
  TextMsg,
  Timeline,
} from "./MsgTypes";

const Message = ({ menu }) => {
  return (
    <Box p={3}>
      <Stack spacing={3}>
        {Chat_History.map((message, index) => {
          switch (message.type) {
            case "divider":
              return <Timeline data={message} />;

            case "msg":
              switch (message.subtype) {
                case "img":
                  return <MediaMsg data={message} menu={menu} />;

                case "reply":
                  return <ReplyMsg data={message} menu={menu} />;

                case "link":
                  return <LinkMsg data={message} menu={menu} />;

                case "doc":
                  return <DocMsg data={message} menu={menu} />;

                default:
                  return <TextMsg data={message} menu={menu} />;
              }

            default:
              return null;
          }
        })}
      </Stack>
    </Box>
  );
};

export default Message;
