import React from "react";
import {
  Box,
  Divider,
  IconButton,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { DownloadSimple, Image } from "phosphor-react";

const Timeline = ({ data }) => {
  const theme = useTheme();
  return (
    <Stack
      direction={"row"}
      alignItems={"center"}
      justifyContent={"space-between"}
    >
      <Divider width="46%" />
      <Typography
        variant="caption"
        sx={{
          color: theme.palette.text,
        }}
      >
        {data.text}
      </Typography>
      <Divider width="46%" />
    </Stack>
  );
};

const TextMsg = ({ data }) => {
  const theme = useTheme();
  return (
    <Stack direction={"row"} justifyContent={data.incoming ? "start" : "end"}>
      <Box
        p={1.5}
        sx={{
          backgroundColor: data.incoming
            ? theme.palette.background.default
            : theme.palette.primary.main,
          borderRadius: 1.5,
          width: "max-content",
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: data.incoming ? theme.palette.text : "#fff",
          }}
        >
          {data.message}
        </Typography>
      </Box>
    </Stack>
  );
};

const MediaMsg = ({ data }) => {
  const theme = useTheme();
  return (
    <Stack direction={"row"} justifyContent={data.incoming ? "start" : "end"}>
      <Box
        p={1.5}
        sx={{
          backgroundColor: data.incoming
            ? theme.palette.background.default
            : theme.palette.primary.main,
          borderRadius: 1.5,
          width: "max-content",
        }}
      >
        <Stack spacing={1}>
          <img
            src={data.img}
            alt={data.message}
            style={{
              maxHeight: 210,
              borderRadius: "10px",
            }}
          />
          <Typography
            variant="body2"
            color={data.incoming ? theme.palette.text : "#fff"}
          >
            {data.message}
          </Typography>
        </Stack>
      </Box>
    </Stack>
  );
};

const ReplyMsg = ({ data }) => {
  const theme = useTheme();
  return (
    <Stack direction={"row"} justifyContent={data.incoming ? "start" : "end"}>
      <Box
        p={1.5}
        sx={{
          backgroundColor: data.incoming
            ? theme.palette.background.paper
            : theme.palette.primary.main,
          borderRadius: 1.5,
          width: "max-content",
        }}
      >
        <Stack spacing={2}>
          <Stack
            p={2}
            direction={"column"}
            spacing={3}
            alignItems={"center"}
            sx={{
              backgroundColor: theme.palette.background.paper,
              borderRadius: 1,
            }}
          >
            <Typography variant="body2" color={theme.palette.text}>
              {data.message}
            </Typography>
          </Stack>
          <Typography
            variant="body2"
            color={data.incoming ? theme.palette.text : "#fff"}
          >
            {data.reply}
          </Typography>
        </Stack>
      </Box>
    </Stack>
  );
};

const LinkMsg = ({ data }) => {
  const theme = useTheme();
  return (
    <Stack direction={"row"} justifyContent={data.incoming ? "start" : "end"}>
      <Box
        p={1.5}
        sx={{
          backgroundColor: data.incoming
            ? theme.palette.background.default
            : theme.palette.primary.main,
          borderRadius: 1.5,
          width: "max-content",
        }}
      >
        <Stack spacing={2}>
          <Stack
            p={2}
            spacing={3}
            alignItems={"start"}
            sx={{
              backgroundColor: theme.palette.background.default,
              borderRadius: 1,
            }}
          >
            <img
              src={data.preview}
              alt={data.message}
              style={{
                maxHeight: 210,
                borderRadius: "10px",
              }}
            />
            <Stack spacing={2}>
              <Typography variant="subtitle2">Chat-App</Typography>
              <Typography
                variant="subtitle2"
                component={Link}
                to="//https://www.youtube.com/"
                sx={{
                  color: theme.palette.primary.main,
                }}
              >
                www.youtube.com
              </Typography>
            </Stack>
            <Typography
              variant="body2"
              color={data.incoming ? theme.palette.text : "#fff"}
            >
              {data.message}
            </Typography>
          </Stack>
        </Stack>
      </Box>
    </Stack>
  );
};

const DocMsg = ({ data }) => {
  const theme = useTheme();
  return (
    <Stack direction={"row"} justifyContent={data.incoming ? "start" : "end"}>
      <Box
        p={1.5}
        sx={{
          backgroundColor: data.incoming
            ? theme.palette.background.default
            : theme.palette.primary.main,
          borderRadius: 1.5,
          width: "max-content",
        }}
      >
        <Stack spacing={2}>
          <Stack
            p={2}
            direction={"row"}
            spacing={3}
            alignItems={"center"}
            sx={{
              backgroundColor: theme.palette.background.paper,
              borderRadius: 1,
            }}
          >
            <Image size={48} />
            <Typography variant="caption">Abstract.png</Typography>
            <IconButton>
              <DownloadSimple size={24} />
            </IconButton>
          </Stack>
          <Typography
            variant="body2"
            sx={{
              color: data.incoming ? theme.palette.text : "#fff",
            }}
          >
            {data.message}
          </Typography>
        </Stack>
      </Box>
    </Stack>
  );
};

export { Timeline, TextMsg, MediaMsg, ReplyMsg, LinkMsg, DocMsg };
