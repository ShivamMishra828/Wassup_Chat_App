import { forwardRef } from "react";
import {
  Dialog,
  Slide,
  DialogTitle,
  DialogContent,
  Grid,
  Stack,
  Typography,
  Button,
  DialogActions,
} from "@mui/material";
import { ShortcutsList } from "../../data/shortcutslist";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Shortcuts = ({ open, handleClose }) => {
  return (
    <>
      <Dialog
        fullWidth
        maxWidth="md"
        open={open}
        onClose={handleClose}
        keepMounted
        TransitionComponent={Transition}
        tran
        sx={{
          p: 4,
        }}
      >
        <DialogTitle>Keyboard Shortcuts</DialogTitle>
        <DialogContent sx={{ mt: 4 }}>
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            {ShortcutsList.map(({ key, title, combination }) => (
              <Grid item xs={6} key={key}>
                <Stack
                  direction={"row"}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                  spacing={3}
                  sx={{
                    width: "100%",
                  }}
                >
                  <Typography variant="caption" sx={{ fontSize: 14 }}>
                    {title}
                  </Typography>
                  <Stack direction={"row"} spacing={2}>
                    {combination.map((el) => {
                      return (
                        <Button
                          disabled
                          variant="contained"
                          sx={{ color: "#212121" }}
                        >
                          {el}
                        </Button>
                      );
                    })}
                  </Stack>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleClose}>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Shortcuts;
