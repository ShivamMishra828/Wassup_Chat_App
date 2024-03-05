import React, { useState } from "react";
import {
  Box,
  Divider,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { DotsThreeVertical, DownloadSimple, Image } from "phosphor-react";
import { Message_options } from "../../data";

const MessageOptions = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <DotsThreeVertical
        size={20}
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      />
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <Stack spacing={1} px={1}>
          {Message_options.map((option) => (
            <MenuItem onClick={handleClick}>{option.title}</MenuItem>
          ))}
        </Stack>
      </Menu>
    </>
  );
};

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

const TextMsg = ({ data, menu }) => {
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
      {menu && <MessageOptions />}
    </Stack>
  );
};

const MediaMsg = ({ data, menu }) => {
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
      {menu && <MessageOptions />}
    </Stack>
  );
};

const ReplyMsg = ({ data, menu }) => {
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
      {menu && <MessageOptions />}
    </Stack>
  );
};

const LinkMsg = ({ data, menu }) => {
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
      {menu && <MessageOptions />}
    </Stack>
  );
};

const DocMsg = ({ data, menu }) => {
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
      {menu && <MessageOptions />}
    </Stack>
  );
};

export { Timeline, TextMsg, MediaMsg, ReplyMsg, LinkMsg, DocMsg };
