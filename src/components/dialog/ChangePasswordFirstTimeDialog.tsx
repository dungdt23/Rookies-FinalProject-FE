import { FC, ReactNode, useState } from "react";
import { JWTPayload } from "../../types/user";
import CustomDialog from "./CustomDialog";
import { Box, DialogProps, IconButton, InputAdornment, Stack, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { ChangePasswordFirstTimeRequest, LoginRequest, changePasswordFirstTime, loginPost } from "../../services/user.service";
import * as yup from 'yup'
import Iconify from "../iconify";
import { LoadingButton } from "@mui/lab";

interface ChangePasswordFirstTimeDialogProps {
    open: boolean;
    user: JWTPayload | null;
    login: (value: string) => void;
    setOpen: (value: React.SetStateAction<boolean>) => void;
}

const lengthMessage = 'Password length should be from 8 - 20 characters'
const noTrailingWhitespaceMessage = 'Password should not have leading or trailing spaces';


const requiredValidationSchema = yup.object({
    password: yup.string()
    .required("Please enter your new password")
    .min(8, lengthMessage)
    .max(20, lengthMessage)
    .test('no-trailing-whitespace', noTrailingWhitespaceMessage, value => {
        return value  === value?.trim();
    }),
});

const ChangePasswordFirstTimeDialog: FC<ChangePasswordFirstTimeDialogProps> = ({ open, user, login, setOpen }) => {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [isFetching, setIsFetching] = useState<boolean>(false);

    const handleClose: DialogProps["onClose"] = (_, reason) => {
        if (reason && reason === "backdropClick")
            return;
        setOpen(false);
    }

    const formikRequired = useFormik({
        initialValues: {
            password: ''
        },
        validationSchema: requiredValidationSchema,
        onSubmit: async (values) => {
            setIsFetching(true);
            const payload = {
                newPassword: values.password.trim(),
            } as ChangePasswordFirstTimeRequest
            try {
                await changePasswordFirstTime(payload);

                const loginPayload: LoginRequest = {
                    userName: user ? user.username : "No token found",
                    password: values.password.trim(),
                };
                const response = await loginPost(loginPayload);
                login(response.data.token);

                setOpen(false)
                window.location.reload()
            } catch (error: any) {
                formikRequired.errors.password = error.response.data.message
            } finally {
                setIsFetching(false);
            }
        },
    });

    const renderChangePasswordFirstTime = (): ReactNode => {
        return (
            <form onSubmit={formikRequired.handleSubmit}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Stack spacing={3} mb={3}>
                        <Typography variant="body1" gutterBottom>
                            This is the first time you logged in.<br />
                            You have to change your password to continue.
                        </Typography>
                        <TextField
                            name="password"
                            label="Password"
                            value={formikRequired.values.password}
                            onChange={formikRequired.handleChange}
                            onBlur={formikRequired.handleBlur}
                            error={formikRequired.touched.password && Boolean(formikRequired.errors.password)}
                            helperText={formikRequired.touched.password && formikRequired.errors.password}
                            required
                            type={showPassword ? 'text' : 'password'}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                            <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            InputLabelProps={{
                                shrink: true
                            }}
                            sx={{
                                minWidth: '25rem',
                                minHeight: '5rem'
                            }}
                        />
                    </Stack>
                    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'end', mt: '1rem' }}>
                        <LoadingButton
                            loading={isFetching}
                            disabled={!(formikRequired.isValid && formikRequired.dirty)}
                            type="submit"
                            variant="contained"
                        >
                            Save
                        </LoadingButton>
                    </Box>
                </Box >
            </form>
        )
    }

    return (
        <CustomDialog
            open={open}
            handleClose={handleClose}
            renderTitle={() => <span>Change password</span>}
            renderBody={renderChangePasswordFirstTime}
            boxProps={{ sx: { maxWidth: '30rem' } }}
        />
    )
}

export default ChangePasswordFirstTimeDialog