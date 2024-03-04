import React, { useState } from "react";
import {
  Stack,
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Fab,
  Tooltip,
} from "@mui/material";
import {
  Camera,
  File,
  Image,
  LinkSimple,
  PaperPlaneTilt,
  Smiley,
  Sticker,
  User,
} from "phosphor-react";
import { styled, useTheme } from "@mui/material/styles";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

const StyledInput = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-input": {
    paddingTop: "12px",
    paddingBottom: "12px",
  },
  "& .MuiFilledInput-root": {
    borderRadius: "8px",
  },
}));

const Actions = [
  {
    icon: <Image size={24} />,
    y: 102,
    title: "Photo/Video",
  },
  {
    icon: <Sticker size={24} />,
    y: 172,
    title: "Sticker",
  },
  {
    icon: <Camera size={24} />,
    y: 242,
    title: "Image",
  },
  {
    icon: <File size={24} />,
    y: 312,
    title: "Document",
  },
  {
    icon: <User size={24} />,
    y: 382,
    title: "Contact",
  },
];

const ChatIput = ({ setOpenPicker }) => {
  const [openActions, setOpenActions] = useState(false);
  return (
    <StyledInput
      placeholder="Write a message..."
      fullWidth
      variant="filled"
      InputProps={{
        disableUnderline: true,
        startAdornment: (
          <Stack
            sx={{
              width: "max-content",
            }}
          >
            <Stack
              sx={{
                position: "relative",
                display: openActions ? "inline-block" : "none",
              }}
            >
              {Actions.map((action, index) => (
                <Tooltip title={action.title} placement="right">
                  <Fab
                    sx={{
                      position: "absolute",
                      top: -action.y,
                      backgroundColor: "#0159b2",
                    }}
                  >
                    {action.icon}
                  </Fab>
                </Tooltip>
              ))}
            </Stack>
            <InputAdornment>
              <IconButton
                onClick={() => {
                  setOpenActions((prev) => !prev);
                }}
              >
                <LinkSimple />
              </IconButton>
            </InputAdornment>
          </Stack>
        ),
        endAdornment: (
          <InputAdornment>
            <IconButton
              onClick={() => {
                setOpenPicker((prev) => !prev);
              }}
            >
              <Smiley />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

const Footer = () => {
  const theme = useTheme();
  const [openPicker, setOpenPicker] = useState(false);
  return (
    <Box
      p={2}
      sx={{
        width: "100%",
        backgroundColor:
          theme.palette.mode === "light"
            ? "#fff"
            : theme.palette.background.paper,
        boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
      }}
    >
      <Stack direction={"row"} alignItems={"center"} spacing={3}>
        {/* Chat Input */}
        <Stack
          sx={{
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: openPicker ? "inline" : "none",
              zIndex: 10,
              position: "fixed",
              bottom: 81,
              right: 100,
            }}
          >
            <Picker
              data={data}
              onEmojiSelect={console.log}
              theme={theme.palette.mode}
            />
          </Box>
          <ChatIput setOpenPicker={setOpenPicker} />
        </Stack>
        <Box
          sx={{
            height: 48,
            width: 48,
            borderRadius: 1.5,
            backgroundColor: theme.palette.primary.main,
          }}
        >
          <Stack
            sx={{
              height: "100%",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <IconButton>
              <PaperPlaneTilt color="#fff" />
            </IconButton>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default Footer;
