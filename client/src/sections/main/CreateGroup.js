import { forwardRef } from "react";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  Stack,
  Slide,
  Button,
} from "@mui/material";
import FormProvider from "../../components/hook-form/FormProvider";
import RHFTextField from "../../components/hook-form/RHFTextField";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import RHFAutocomplete from "../../components/hook-form/RHFAutocomplete";

const MEMBERS = ["Name 1", "Name 2", "Name 3"];

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CreateGroupForm = ({ handleClose }) => {
  const NewGroupSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    members: Yup.array().min(2, "Must have at least 2 members"),
  });

  const defaultValues = {
    title: "",
    members: [],
  };

  const methods = useForm({
    resolver: yupResolver(NewGroupSchema),
    defaultValues,
  });

  const {
    reset,
    setError,
    handleSubmit,
    // formState: { errors, isSubmitting, isSubmitSuccessful, isValid },
  } = methods;

  const onSubmit = async (data) => {
    try {
      // submit data to backend
      console.log("DATA", data);
    } catch (error) {
      console.log("error", error);
      reset();
      setError("afterSubmit", {
        ...error,
        message: error.messasge,
      });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack direction="column" spacing={3} alignItems={"center"} p={3}>
        <RHFTextField name="title" label="Title" />
        <RHFAutocomplete
          name="members"
          label="Members"
          multiple
          freeSolo
          options={MEMBERS.map((option) => option)}
          ChipProps={{ size: "medium" }}
        />
      </Stack>
      <Stack
        direction={"row"}
        spacing={3}
        p={3}
        alignItems={"center"}
        justifyContent={"end"}
      >
        <Button onClick={handleClose}>Cancel</Button>
        <Button type="submit" variant="contained">
          Create
        </Button>
      </Stack>
    </FormProvider>
  );
};

const CreateNewGroup = ({ open, handleClose }) => {
  return (
    <>
      <Dialog
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
        <Box width={600}>
          <DialogTitle>
            <Stack
              direction={"row"}
              alignItems={"center"}
              justifyContent={"space-between"}
            >
              <Typography p={3} variant="h4">
                Create New Group
              </Typography>
            </Stack>
          </DialogTitle>
          <DialogContent>
            <CreateGroupForm handleClose={handleClose} />
          </DialogContent>
        </Box>
      </Dialog>
    </>
  );
};

export default CreateNewGroup;
