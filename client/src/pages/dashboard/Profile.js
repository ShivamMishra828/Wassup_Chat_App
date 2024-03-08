import React from "react";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import { CaretLeft } from "phosphor-react";
import ProfileForm from "../../sections/settings/ProfileForm";

const Profile = () => {
  return (
    <>
      <Stack
        direction={"row"}
        sx={{
          width: "100%",
        }}
      >
        <Box
          sx={{
            height: "100vh",
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? "#f8faff"
                : theme.palette.background,
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.25)",
            width: 320,
          }}
        >
          <Stack p={4} spacing={5}>
            <Stack direction={"row"} alignItems={"center"} spacing={3}>
              <IconButton>
                <CaretLeft size={24} color="#4b4b4b" />
              </IconButton>
              <Typography variant="h5">Profile</Typography>
            </Stack>
            <ProfileForm />
          </Stack>
        </Box>
      </Stack>
    </>
  );
};

export default Profile;
