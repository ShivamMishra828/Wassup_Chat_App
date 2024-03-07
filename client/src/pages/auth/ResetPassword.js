import React from "react";
import { Link, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { CaretLeft } from "phosphor-react";
import ResetPasswordForm from "../../sections/auth/ResetPasswordForm";

const ResetPassword = () => {
  return (
    <Stack
      spacing={2}
      sx={{
        mb: 5,
        position: "relative",
      }}
    >
      <Typography variant="h3" paragraph>
        Forgot your Password?
      </Typography>
      <Typography variant="subtitle1" sx={{ color: "text.secondary", mb: 5 }}>
        Please enter the email address associated with your account and we'll
        email you a password reset link.
      </Typography>
      <ResetPasswordForm />
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
    </Stack>
  );
};

export default ResetPassword;
