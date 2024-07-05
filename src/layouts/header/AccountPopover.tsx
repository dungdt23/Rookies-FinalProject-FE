import { Box, Divider, MenuItem, Popover, Stack, Typography } from '@mui/material';
import { MouseEvent, useState } from 'react';
import ChangePasswordDialog from '../../components/dialog/ChangePasswordDialog';
import ChangePasswordFirstTimeDialog from '../../components/dialog/ChangePasswordFirstTimeDialog';
import LogOutDialog from '../../components/dialog/LogOutDialog';
import { useAuth } from '../../contexts/AuthContext';

// Mock account data

const AccountPopover = () => {
  const { user, login, logout } = useAuth();
  const [open, setOpen] = useState<HTMLElement | null>(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState<boolean>(false);
  const [changePasswordDialogOpen, setChangePasswordDialogOpen] = useState<boolean>(false);
  const [changePasswordFirstTimeOpen, setChangePasswordFirstTimeOpen] = useState<boolean>(user?.isPasswordChangedFirstTime === "1" ? true : false);

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
            Welcome {user?.username}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {user?.role}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          <MenuItem key={"Change Password"} onClick={() => handleChangePasswordOpen()}>
            Change Password
          </MenuItem>
          <MenuItem onClick={() => handleOpenLogOutDialog()}>
          Logout
        </MenuItem>
        </Stack>
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
