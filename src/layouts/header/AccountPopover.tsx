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
import { ChangePasswordFirstTimeRequest, ChangePasswordRequest, LoginRequest, changePassword, changePasswordFirstTime, loginPost } from '../../services/user.service';
import ChangePasswordDialog from '../../components/dialog/ChangePasswordDialog';
import { ExpandMore } from '@mui/icons-material';
import ChangePasswordFirstTimeDialog from '../../components/dialog/ChangePasswordFirstTimeDialog';
import LogOutDialog from '../../components/dialog/LogOutDialog';

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

const AccountPopover = () => {
  const { user, login, logout } = useAuth();
  const [open, setOpen] = useState<HTMLElement | null>(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState<boolean>(false);
  const [changePasswordDialogOpen, setChangePasswordDialogOpen] = useState<boolean>(false);
  const [changePasswordFirstTimeOpen, setChangePasswordFirstTimeOpen] = useState<boolean>(user?.isPasswordChangedFirstTime === "1" ? true : false);

  const navigate = useNavigate();

  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleChangePasswordOpen = () => {
    setOpen(null);
    setChangePasswordDialogOpen(true);
  }

  const handleOpenLogOutDialog = () => {
    setOpen(null);
    setLogoutDialogOpen(true)
  }

  const handleClick = (option: { path: string }) => {
    navigate(option.path);
    handleClose();
  };

  return (
    <>

      <div onClick={handleOpen} style={{ marginRight: '1rem', color: 'white', cursor: 'pointer' }}>
        <Typography>
          {`${user?.username}`} ⯆
        </Typography>
      </div>

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

      <LogOutDialog
        open={logoutDialogOpen}
        setOpen={setLogoutDialogOpen}
        logout={logout}
      />
      <ChangePasswordDialog
        open={changePasswordDialogOpen}
        setOpen={setChangePasswordDialogOpen}
        user={user}
        login={login}
      />
      <ChangePasswordFirstTimeDialog
        open={changePasswordFirstTimeOpen}
        setOpen={setChangePasswordFirstTimeOpen}
        user={user}
        login={login}
      />
    </>
  );
};

export default AccountPopover;
