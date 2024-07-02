import { MouseEvent, ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, Stack, MenuItem, Avatar, IconButton, Popover, Button, InputAdornment, TextField } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import * as yup from 'yup';
import { routeNames } from '../../constants/routeName';
import { LoadingButton } from '@mui/lab';
import CustomDialog from '../../components/dialog/CustomDialog';
import { useFormik } from 'formik';
import { ChangePasswordRequest } from '../../services/user.service';
import Iconify from '../../components/iconify';

// Mock account data
const account = {
  displayName: 'Jaydon Frankie',
  email: 'demo@minimals.cc',
  photoURL: '/assets/images/avatars/avatar_default.jpg',
};

const lengthMessage = 'Password length should be from 8 - 20 characters'

const validationSchema = yup.object({
  oldPassword: yup.string().min(8, lengthMessage).max(20, lengthMessage),
  newPassword: yup.string().min(8, lengthMessage).max(20, lengthMessage)
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
  const [open, setOpen] = useState<HTMLElement | null>(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState<boolean>(false);
  const [changePasswordDialogOpen, setChangePasswordDialogOpen] = useState<boolean>(false);
  const [showOldPassword, setShowOldPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [completeChangePassword, setCompleteChangePassword] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { user, logout } = useAuth();
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

  const handleCloseChangePassword = () => {
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

        // const response = await loginPost(payload);
        // login(response.data.token);
      } catch (error) {
        setError("Login failed. Please check your credentials");
        console.error(error);
      } finally {
        setIsFetching(false);
        setCompleteChangePassword(true);
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
                  minWidth: '25rem'
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
              <Button variant="outlined" onClick={() => handleCloseChangePassword()}>
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
            <Button variant="outlined" onClick={() => handleCloseChangePassword()}>
              Close
            </Button>
          </Box>
        </Box >
      )
    }
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
    </>
  );
};

export default AccountPopover;
