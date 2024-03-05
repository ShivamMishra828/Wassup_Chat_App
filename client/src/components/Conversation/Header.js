import { faker } from "@faker-js/faker";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { CaretDown, MagnifyingGlass, Phone, VideoCamera } from "phosphor-react";
import React from "react";
import { useTheme } from "@mui/material/styles";
import StyledBadge from "../StyledBadge";
import { ToggleSidebar } from "../../redux/slices/app";
import { useDispatch } from "react-redux";

const Header = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
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
      <Stack
        alignItems={"center"}
        justifyContent={"space-between"}
        direction={"row"}
        sx={{
          width: "100%",
          height: "100%",
        }}
      >
        <Stack
          direction={"row"}
          spacing={2}
          onClick={() => {
            dispatch(ToggleSidebar());
          }}
        >
          <Box>
            <StyledBadge
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              overlap="circular"
              variant="dot"
            >
              <Avatar src={faker.image.avatar()} alt={"DP"} />
            </StyledBadge>
          </Box>
          <Stack spacing={0.2}>
            <Typography variant="subtitle2">{faker.name.fullName()}</Typography>
            <Typography variant="caption">Online</Typography>
          </Stack>
        </Stack>
        <Stack direction={"row"} alignItems={"center"} spacing={3}>
          <IconButton>
            <VideoCamera />
          </IconButton>
          <IconButton>
            <Phone />
          </IconButton>
          <IconButton>
            <MagnifyingGlass />
          </IconButton>
          <Divider orientation={"vertical"} flexItem />
          <IconButton>
            <CaretDown />
          </IconButton>
        </Stack>
      </Stack>
    </Box>
  );
};

export default Header;
