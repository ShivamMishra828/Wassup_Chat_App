import { Link, Stack, Typography } from "@mui/material";
import { CaretLeft } from "phosphor-react";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import NewPasswordForm from "../../sections/auth/NewPasswordForm";

const NewPassword = () => {
  return (
    <>
      <Stack
        spacing={2}
        sx={{
          mb: 3,
          position: "relative",
        }}
      >
        <Typography variant="h3" paragraph>
          Reset Password
        </Typography>
        <Typography variant="subtitle1" sx={{ color: "text.secondary" }}>
          Please Set your new password
        </Typography>
      </Stack>
      <NewPasswordForm />
      <Link
        to="/auth/login"
        variant="subtitle2"
        component={RouterLink}
        color="inherit"
        sx={{
          mt: 3,
          mx: "auto",
          alignItems: "center",
          display: "inline-flex",
        }}
      >
        <CaretLeft />
        Return to login
      </Link>
    </>
  );
};

export default NewPassword;
