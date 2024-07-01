import { MouseEvent, ReactNode, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, Stack, MenuItem, Avatar, IconButton, Popover, Button } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { routeNames } from '../../constants/routeName';
import { LoadingButton } from '@mui/lab';
import CustomDialog from '../../components/dialog/CustomDialog';

// Mock account data
const account = {
  displayName: 'Jaydon Frankie',
  email: 'demo@minimals.cc',
  photoURL: '/assets/images/avatars/avatar_default.jpg',
};

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
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

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
            loading={isLoggingOut}
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
        boxProps={{ sx: { maxWidth: '25rem' } }}
      />
    </>
  );
};

export default AccountPopover;
