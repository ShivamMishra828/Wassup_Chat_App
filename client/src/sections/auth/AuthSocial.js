import { Box, Divider, IconButton, Stack } from "@mui/material";
import { GithubLogo, GoogleLogo, TwitterLogo } from "phosphor-react";
import React from "react";

const AuthSocial = () => {
  return (
    <Box>
      <Divider
        sx={{
          my: 2.5,
          typography: "overline",
          color: "text.disabled",
          "&::before, &::after": {
            borderTopStyle: "dashed",
          },
        }}
      >
        Or continue with
      </Divider>
      <Stack direction={"row"} justifyContent={"center"} spacing={2}>
        <IconButton>
          <GoogleLogo color="#df3e30" />
        </IconButton>
        <IconButton color="inherit">
          <GithubLogo />
        </IconButton>
        <IconButton>
          <TwitterLogo color="#1c9cea" />
        </IconButton>
      </Stack>
    </Box>
  );
};

export default AuthSocial;
