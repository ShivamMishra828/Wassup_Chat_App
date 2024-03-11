import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import FormProvider from "../../components/hook-form/FormProvider";
import { Button, Stack } from "@mui/material";
import RHFCodes from "../../components/hook-form/RHFCodes";
import { useDispatch, useSelector } from "react-redux";
import { VerifyUser } from "../../redux/slices/auth";

const VerifyForm = () => {
  const dispatch = useDispatch();
  const { email } = useSelector((state) => state.auth);
  const verifyCodeSchema = Yup.object().shape({
    code1: Yup.string().required("Required"),
    code2: Yup.string().required("Required"),
    code3: Yup.string().required("Required"),
    code4: Yup.string().required("Required"),
    code5: Yup.string().required("Required"),
    code6: Yup.string().required("Required"),
  });

  const defaultValues = {
    code1: "",
    code2: "",
    code3: "",
    code4: "",
    code5: "",
    code6: "",
  };

  const methods = useForm({
    mode: "onChange",
    resolver: yupResolver(verifyCodeSchema),
    defaultValues,
  });

  const { handleSubmit } = methods;

  const onSubmit = async (data) => {
    try {
      dispatch(
        VerifyUser({
          email,
          otp: `${data.code1}${data.code2}${data.code3}${data.code4}${data.code5}${data.code6}`,
        })
      );
    } catch (error) {
      console.error("Failed to verify the code", error);
    }
  };

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <RHFCodes
            keyName="code"
            inputs={["code1", "code2", "code3", "code4", "code5", "code6"]}
          />
          <Button
            fullWidth
            color="inherit"
            size="large"
            type="submit"
            variant="contained"
            sx={{
              bgcolor: "text.primary",
              color: (theme) =>
                theme.palette.mode === "light" ? "common.white" : "grey.800",
              "&:hover": {
                bgcolor: "text.primary",
                color: (theme) =>
                  theme.palette.mode === "light" ? "common.white" : "grey.800",
              },
            }}
          >
            Verify
          </Button>
        </Stack>
      </FormProvider>
    </>
  );
};

export default VerifyForm;
