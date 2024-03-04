import React from "react";
import Chats from "./Chats";
import { Box, Stack } from "@mui/material";
import Conversation from "../../components/Conversation/index";
import { useTheme } from "@mui/material/styles";

const GeneralApp = () => {
  const theme = useTheme();
  return (
    <Stack
      direction={"row"}
      sx={{
        width: "100%",
      }}
    >
      <Chats />
      <Box
        sx={{
          height: "100%",
          width: "calc(100vw - 420px)",
          backgroundColor:
            theme.palette.mode === "light"
              ? "#f0f4fa"
              : theme.palette.background.paper,
        }}
      >
        <Conversation />
      </Box>
    </Stack>
  );
};

export default GeneralApp;
