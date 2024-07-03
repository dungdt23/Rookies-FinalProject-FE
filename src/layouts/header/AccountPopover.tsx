import { LoadingButton } from '@mui/lab';
import { Avatar, Box, Button, DialogProps, Divider, IconButton, InputAdornment, MenuItem, Popover, Stack, TextField, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useFormik } from 'formik';
import { MouseEvent, ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import CustomDialog from '../../components/dialog/CustomDialog';
import Iconify from '../../components/iconify';
import { routeNames } from '../../constants/routeName';
import { useAuth } from '../../contexts/AuthContext';
import { ChangePasswordFirstTimeRequest, ChangePasswordRequest, changePassword, changePasswordFirstTime } from '../../services/user.service';
import { LocalStorageConstants } from './../../constants/localStorage';

// Mock account data
const account = {
  displayName: 'Jaydon Frankie',
  email: 'demo@minimals.cc',
  photoURL: '/assets/images/avatars/avatar_default.jpg',
};

const lengthMessage = 'Password length should be from 8 - 20 characters'
const samePasswordMessage = 'New password should not be the same as old password'

const validationSchema = yup.object({
  oldPassword: yup.string().min(8, lengthMessage).max(20, lengthMessage),
  newPassword: yup.string().min(8, lengthMessage).max(20, lengthMessage).notOneOf([yup.ref('oldPassword')], samePasswordMessage)
});

const requiredValidationSchema = yup.object({
  password: yup.string().min(8, lengthMessage).max(20, lengthMessage),
});

const MENU_OPTIONS = [
  {
    label: 'Home',
    icon: 'eva:home-fill',
    path: '/'
  },
  {
    label: 'Profile',
    icon: 'eva:person-fill',
    path: '/profile'
  },
  {
    label: 'Settings',
    icon: 'eva:settings-2-fill',
    path: '/settings'
  },
];

// Define the backend logout URL
const BACKEND_URL = {
  LOGOUT_ENDPOINT: '/api/logout',
};

const AccountPopover = () => {
  const { user, login, logout, checkChangedPassword } = useAuth();
  const [open, setOpen] = useState<HTMLElement | null>(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState<boolean>(false);
  const [changePasswordDialogOpen, setChangePasswordDialogOpen] = useState<boolean>(false);
  const [changePasswordFirstTimeOpen, setChangePasswordFirstTimeOpen] = useState<boolean>(localStorage.getItem(LocalStorageConstants.PASSWORD_CHANGED) === "1" ? false : true);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showOldPassword, setShowOldPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [completeChangePassword, setCompleteChangePassword] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleChangePasswordOpen = () => {
    setOpen(null);
    setCompleteChangePassword(false);
    setChangePasswordDialogOpen(true);
  }

  const handleCloseChangePassword: DialogProps["onClose"] = (event, reason) => {
    if (reason && reason === "backdropClick")
      return;
    setChangePasswordDialogOpen(false);
  }

  const handleCloseChangePasswordFirstTime: DialogProps["onClose"] = (event, reason) => {
    if (reason && reason === "backdropClick")
      return;
    setChangePasswordDialogOpen(false);
  }

  const handleCloseLogOutDialog = () => {
    setLogoutDialogOpen(false);
  }

  const handleOpenLogOutDialog = () => {
    setOpen(null);
    setLogoutDialogOpen(true)
  }

  const handleClick = (option: { path: string }) => {
    navigate(option.path);
    handleClose();
  };

  const handleLogout = async () => {
    setOpen(null);
    try {
      logout();
      navigate(routeNames.login);
    } catch (error) {
      console.error('Logout failed', error);
    }
  };


  const renderLogoutDialogBody = (): ReactNode => {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography variant="body1" gutterBottom>
          Do you want to log out?
        </Typography>
        <Box sx={{ display: 'flex', gap: '1rem', mt: '1rem' }}>
          <LoadingButton
            loading={false}
            type="submit"
            variant="contained"
            onClick={handleLogout}
          >
            Log out
          </LoadingButton>
          <Button variant="outlined" onClick={() => handleCloseLogOutDialog()}>
            Cancel
          </Button>
        </Box>
      </Box >
    )
  }

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
        checkChangedPassword(response.data.isPasswordChanged);

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
    }, [changePasswordDialogOpen])
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
                loading={isFetching}
                type="submit"
                variant="contained"
              >
                Save
              </LoadingButton>
              <Button disabled={isFetching} variant="outlined" onClick={() => setChangePasswordDialogOpen(false)}>
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
            <Button variant="outlined" onClick={() => setChangePasswordDialogOpen(false)}>
              Close
            </Button>
          </Box>
        </Box >
      )
    }
  }

  const formikRequired = useFormik({
    initialValues: {
      password: ''
    },
    validationSchema: requiredValidationSchema,
    onSubmit: async (values) => {
      setIsFetching(true);
      const payload = {
        newPassword: values.password,
      } as ChangePasswordFirstTimeRequest
      try {
        await changePasswordFirstTime(payload);
        checkChangedPassword(true)
        setChangePasswordFirstTimeOpen(false)
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
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <Avatar src={account.photoURL} alt="photoURL" />
      </IconButton>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1.5,
            ml: 0.75,
            width: 180,
            '& .MuiMenuItem-root': {
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {user?.username}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {user?.username}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map((option) => (
            <MenuItem key={option.label} onClick={() => handleClick(option)}>
              {option.label}
            </MenuItem>
          ))}
          <MenuItem key={"Change Password"} onClick={() => handleChangePasswordOpen()}>
            Change Password
          </MenuItem>
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={() => handleOpenLogOutDialog()} sx={{ m: 1 }}>
          Logout
        </MenuItem>
      </Popover>

      <CustomDialog
        open={logoutDialogOpen}
        handleClose={handleCloseLogOutDialog}
        renderTitle={() => <span>Are you sure?</span>}
        renderBody={renderLogoutDialogBody}
        boxProps={{ sx: { maxWidth: '30rem' } }}
      />
      <CustomDialog
        open={changePasswordDialogOpen}
        handleClose={handleCloseChangePassword}
        renderTitle={() => <span>Change password</span>}
        renderBody={renderChangePasswordDialog}
        boxProps={{ sx: { maxWidth: '30rem' } }}
      />
      <CustomDialog
        open={changePasswordFirstTimeOpen}
        handleClose={handleCloseChangePasswordFirstTime}
        renderTitle={() => <span>Change password</span>}
        renderBody={renderChangePasswordFirstTime}
        boxProps={{ sx: { maxWidth: '30rem' } }}
      />
    </>
  );
};

export default AccountPopover;
