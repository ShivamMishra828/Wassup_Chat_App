import React from "react";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { ArchiveBox, CircleDashed, MagnifyingGlass } from "phosphor-react";
import { useTheme } from "@mui/material/styles";
import { ChatList } from "../../data";
import { SimpleBarStyle } from "../../components/Scrollbar";
import ChatElement from "../../components/ChatElement";
import {
  Search,
  SearchIconWrapper,
  SearchInputBase,
} from "../../components/Search";

const Chats = () => {
  const theme = useTheme();
  return (
    <>
      <Box
        sx={{
          position: "relative",
          width: 320,
          backgroundColor:
            theme.palette.mode === "light"
              ? "#f8faff"
              : theme.palette.background.default,
          boxShadow: "0 0 2px rgba(0, 0, 0, 0.25)",
        }}
      >
        <Stack
          p={3}
          spacing={2}
          sx={{
            height: "100vh",
          }}
        >
          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Typography variant="h5">Chats</Typography>
            <IconButton>
              <CircleDashed />
            </IconButton>
          </Stack>
          <Stack sx={{ width: "100%" }}>
            <Search>
              <SearchIconWrapper>
                <MagnifyingGlass color="#709ce6" />
              </SearchIconWrapper>
              <SearchInputBase placeholder="Search" />
            </Search>
          </Stack>
          <Stack spacing={1}>
            <Stack direction={"row"} alignItems={"center"} spacing={1.5}>
              <ArchiveBox size={24} />
              <Button>Archive</Button>
            </Stack>
            <Divider />
          </Stack>
          <Stack
            direction={"column"}
            spacing={2}
            sx={{
              flexGrow: 1,
              overflow: "auto",
              height: "100%",
            }}
          >
            <SimpleBarStyle timeout={500} clickOnTrack="false">
              <Stack spacing={2.4}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: theme.palette.mode === "light" ? "#676767" : "#fff",
                  }}
                >
                  Pinned
                </Typography>
                {ChatList.filter((item) => item.pinned).map((item) => (
                  <ChatElement key={item.id} {...item} />
                ))}
              </Stack>
              <Stack spacing={2.4}>
                <Typography
                  variant="subtitle2"
                  paddingTop={2}
                  sx={{
                    color: theme.palette.mode === "light" ? "#676767" : "#fff",
                  }}
                >
                  All Chats
                </Typography>
                {ChatList.filter((item) => !item.pinned).map((item) => (
                  <ChatElement key={item.id} {...item} />
                ))}
              </Stack>
            </SimpleBarStyle>
          </Stack>
        </Stack>
      </Box>
    </>
  );
};

export default Chats;
