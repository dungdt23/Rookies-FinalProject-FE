import { FC, ReactNode, useEffect, useState } from "react"
import CustomDialog from "./CustomDialog";
import * as yup from 'yup'
import { useFormik } from "formik";
import { ChangePasswordRequest, LoginRequest, changePassword, loginPost } from "../../services/user.service";
import { JWTPayload } from "../../types/user";
import { Box, Button, DialogProps, IconButton, InputAdornment, Stack, TextField, Typography } from "@mui/material";
import Iconify from "../iconify";
import { LoadingButton } from "@mui/lab";

interface ChangePasswordDialogProps {
    open: boolean;
    user: JWTPayload | null;
    login: (value: string) => void;
    setOpen: (value: React.SetStateAction<boolean>) => void;
}

const lengthMessage = 'Password length should be from 8 - 20 characters'
const samePasswordMessage = 'New password should not be the same as old password'

const validationSchema = yup.object({
    oldPassword: yup.string().required("Please enter your old password").min(8, lengthMessage).max(20, lengthMessage),
    newPassword: yup.string().required("Please enter your new password").min(8, lengthMessage).max(20, lengthMessage).notOneOf([yup.ref('oldPassword')], samePasswordMessage)
});

const ChangePasswordDialog: FC<ChangePasswordDialogProps> = ({open, user, login, setOpen }) => {
    const [showOldPassword, setShowOldPassword] = useState<boolean>(false);
    const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [completeChangePassword, setCompleteChangePassword] = useState<boolean>(false);

    const formik = useFormik({
        initialValues: {
            oldPassword: '',
            newPassword: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            setIsFetching(true);
            try {
                const payload: ChangePasswordRequest = {
                    oldPassword: values.oldPassword,
                    newPassword: values.newPassword
                };
                await changePassword(payload);

                const loginPayload: LoginRequest = {
                    userName: user ? user.username : "No token found",
                    password: values.newPassword,
                };
                const response = await loginPost(loginPayload);
                login(response.data.token);

                setCompleteChangePassword(true);

            } catch (error: any) {
                formik.errors.oldPassword = error.response.data.message

            } finally {
                setIsFetching(false);
            }
        },
    });

    const renderChangePasswordDialog = (): ReactNode => {
        useEffect(() => {
            formik.values.newPassword = ''
            formik.values.oldPassword = ''
        }, [open])
        if (!completeChangePassword) {
            return (
                <form onSubmit={formik.handleSubmit}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Stack spacing={1} mb={3}>
                            <TextField
                                name="oldPassword"
                                label="Old Password"
                                value={formik.values.oldPassword}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.oldPassword && Boolean(formik.errors.oldPassword)}
                                helperText={formik.touched.oldPassword && formik.errors.oldPassword}
                                required
                                type={showOldPassword ? 'text' : 'password'}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowOldPassword(!showOldPassword)} edge="end">
                                                <Iconify icon={showOldPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
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
                            <TextField
                                name="newPassword"
                                label="New Password"
                                value={formik.values.newPassword}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
                                helperText={formik.touched.newPassword && formik.errors.newPassword}
                                required
                                type={showNewPassword ? 'text' : 'password'}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowNewPassword(!showNewPassword)} edge="end">
                                                <Iconify icon={showNewPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
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
                        <Box sx={{ display: 'flex', justifyContent: 'end', gap: '1rem', ml: '5rem' }}>
                            <LoadingButton
                                disabled={!(formik.isValid && formik.dirty && !isFetching)}
                                loading={isFetching}
                                type="submit"
                                variant="contained"
                            >
                                Save
                            </LoadingButton>
                            <Button
                                disabled={isFetching}
                                variant="outlined"
                                onClick={() => setOpen(false)}>
                                Cancel
                            </Button>
                        </Box>
                    </Box >
                </form>
            )
        }
        else {
            return (
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="body1" gutterBottom>
                        Your password have been changed successfully!
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'end', mt: '1rem' }}>
                        <Button
                            variant="outlined"
                            onClick={() => {
                                setOpen(false)
                                window.location.reload()
                            }}>
                            Close
                        </Button>
                    </Box>
                </Box >
            )
        }
    }


    const handleCloseChangePassword: DialogProps["onClose"] = (_, reason) => {
        if (reason && reason === "backdropClick")
            return;
        setOpen(false);
    }

    return (
        <CustomDialog
            open={open}
            handleClose={handleCloseChangePassword}
            renderTitle={() => <span>Change password</span>}
            renderBody={renderChangePasswordDialog}
            boxProps={{ sx: { maxWidth: '30rem' } }}
        />
    )

}

export default ChangePasswordDialog;