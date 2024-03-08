import {
  Dialog,
  DialogContent,
  DialogTitle,
  Slide,
  Stack,
} from "@mui/material";
import React, { forwardRef } from "react";
import {
  Search,
  SearchIconWrapper,
  SearchInputBase,
} from "../../components/Search";
import { MagnifyingGlass } from "phosphor-react";
import { CallElement } from "../../components/CallLogElement";
import { MembersList } from "../../data";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const StartCall = ({ open, handleClose }) => {
  return (
    <Dialog
      fullWidth
      maxWidth={"xs"}
      open={open}
      TransitionComponent={Transition}
      keepMounted
      sx={{ p: 4 }}
      onClose={handleClose}
    >
      <DialogTitle sx={{ mb: 3 }}>Start Call</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <Stack
            sx={{
              width: "100%",
            }}
          >
            <Search>
              <SearchIconWrapper>
                <MagnifyingGlass color="#709ce6" />
              </SearchIconWrapper>
              <SearchInputBase
                placeholder="Search..."
                inputProps={{
                  "aria-label": "search",
                }}
              />
            </Search>
          </Stack>
          {MembersList.map((member) => (
            <CallElement key={member.id} {...member} />
          ))}
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default StartCall;
