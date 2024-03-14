import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import {
  ArchiveBox,
  CircleDashed,
  MagnifyingGlass,
  Users,
} from "phosphor-react";
import { useTheme } from "@mui/material/styles";
import { SimpleBarStyle } from "../../components/Scrollbar";
import ChatElement from "../../components/ChatElement";
import {
  Search,
  SearchIconWrapper,
  SearchInputBase,
} from "../../components/Search";
import Friends from "../../sections/main/Friends";
import { socket } from "../../socket";
import { useDispatch, useSelector } from "react-redux";
import { FetchDirectConversations } from "../../redux/slices/conversation";

const user_id = window.localStorage.getItem("user_id");

const Chats = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const conversationsData = useSelector(
    (state) => state.conversation.direct_chat
  );
  const { conversations } = conversationsData || {};
  const [openDialog, setOpenDialog] = useState(false);
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  useEffect(() => {
    socket.emit("get_direct_conversations", { user_id }, (data) => {
      dispatch(FetchDirectConversations({ conversations: data }));
    });
  }, []);
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
            <Stack direction={"row"} alignItems={"center"} spacing={1}>
              <IconButton
                onClick={() => {
                  handleOpenDialog();
                }}
                sx={{
                  width: "max-content",
                }}
              >
                <Users />
              </IconButton>
              <IconButton
                sx={{
                  width: "max-content",
                }}
              >
                <CircleDashed />
              </IconButton>
            </Stack>
          </Stack>
          <Stack sx={{ width: "100%" }}>
            <Search>
              <SearchIconWrapper>
                <MagnifyingGlass color="#709ce6" />
              </SearchIconWrapper>
              <SearchInputBase
                placeholder="Search"
                inputProps={{
                  "aria-label": "search",
                }}
              />
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
              {/* <Stack spacing={2.4}>
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
              </Stack> */}
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
                {conversations
                  .filter((item) => !item.pinned)
                  .map((item) => (
                    <ChatElement key={item.id} {...item} />
                  ))}
              </Stack>
            </SimpleBarStyle>
          </Stack>
        </Stack>
      </Box>
      {openDialog && (
        <Friends open={openDialog} handleClose={handleCloseDialog} />
      )}
    </>
  );
};

export default Chats;
